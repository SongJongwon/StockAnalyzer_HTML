/* ==========================================================================
 * Phase 9 PR-9C — [📊 담기] 진입점 공유 모듈
 *
 * 5 진입점 (Tab 1·2·3 + 패널 4-bucket — 직접 추가는 PR-9B portfolio.html 모달) 에서
 * 공통 사용. window.NexusPortfolio 글로벌.
 *
 * 의존: auth.js (NexusAuth), modal-utils.js (NexusModal), portfolio.css (--port-* 토큰).
 * 설계: docs/phase9_portfolio_ui_design.md §13 + PR-9C 명세 (2026-05-06 합의).
 *
 * 공개 API:
 *   NexusPortfolio.renderPortfolioAddButton(ticker, status, opts)  → HTML 문자열
 *   NexusPortfolio.attachPortfolioAddHandlers(container)           → 이벤트 위임
 *   NexusPortfolio.fetchPortfolioCheck(tickers)                    → Set<string> (캐시)
 *   NexusPortfolio.postPortfolioAdd(ticker, source, sourceMeta?)   → result 객체
 *   NexusPortfolio.markAdded(ticker)                               → 캐시+DOM 동기화
 *   NexusPortfolio.markRemoved(ticker)                             → 향후 portfolio.html 삭제 연동
 *   NexusPortfolio.refreshButtonsByTicker(ticker)                  → 단일 ticker DOM 재계산
 * ========================================================================== */
(function () {
    'use strict';

    if (window.NexusPortfolio) return;

    // ─── API base ────────────────────────────────────────────
    const API_BASE = (function () {
        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
            return 'http://localhost:8000';
        }
        return 'https://stockanalyzer-backend.onrender.com';
    })();

    // ─── 모듈 스코프 ──────────────────────────────────────────
    const _cache    = new Set();        // 이미 담긴 ticker (대소문자 보존)
    const _inflight = new Map();        // ticker → Promise (동시 호출 dedupe)
    let   _authedCache = null;          // null | bool — 1회 평가 후 캐싱 (페이지 라이프사이클)

    // ─── 인증 ────────────────────────────────────────────────
    function _authHeaders() {
        const h = { 'Content-Type': 'application/json' };
        if (window.NexusAuth) {
            const t = NexusAuth.getAccessToken();
            if (t) h['Authorization'] = 'Bearer ' + t;
        }
        return h;
    }

    async function _isAuthed() {
        if (_authedCache !== null) return _authedCache;
        if (!window.NexusAuth) { _authedCache = false; return false; }
        const token = NexusAuth.getAccessToken();
        if (token) { _authedCache = true; return true; }
        try {
            const dev = await NexusAuth.getDevStatus();
            _authedCache = !!(dev && dev.dev_mode);
        } catch (_) {
            _authedCache = false;
        }
        return _authedCache;
    }

    function _loginRedirect() {
        const next = encodeURIComponent(location.pathname + location.search);
        location.href = `login.html?next=${next}`;
    }

    // ─── 토스트 (.port-toast — portfolio.css 에 정의됨) ───────
    let _toastTimer = null;
    function _toast(msg, kind) {
        const old = document.querySelector('.port-toast');
        if (old) old.remove();
        if (_toastTimer) clearTimeout(_toastTimer);
        const t = document.createElement('div');
        t.className = 'port-toast ' + (kind || '');
        t.textContent = msg;
        document.body.appendChild(t);
        _toastTimer = setTimeout(() => t.remove(), 2400);
    }

    // ─── 슬롯 가득 모달 (어느 페이지에서도 동적 생성) ─────────
    function _openSlotFullModal(detailMsg) {
        // 이전 인스턴스 제거 (중복 방지)
        const old = document.getElementById('nxPortSlotFullModal');
        if (old) { old.remove(); if (window.NexusModal) NexusModal.unlock(); }

        const overlay = document.createElement('div');
        overlay.id = 'nxPortSlotFullModal';
        overlay.className = 'port-modal-overlay';
        overlay.innerHTML = `
            <div class="port-modal-content port-slot-full" style="max-width: 400px;">
                <header class="port-modal-header">
                    <h3>📊 슬롯이 가득 찼어요</h3>
                    <button class="port-modal-close" type="button" aria-label="닫기">✕</button>
                </header>
                <div class="port-modal-body">
                    <p style="margin: 0 0 12px;">${_escapeHtml(detailMsg || '포트폴리오 슬롯이 가득 찼습니다.')}</p>
                    <p style="font-size: 13px; color: var(--port-muted); margin: 0 0 8px;">
                        더 많은 종목을 담으려면:
                    </p>
                    <ul style="font-size: 13px; color: var(--port-text); margin: 0 0 0 18px; padding: 0;">
                        <li>기존 종목 정리 (포트폴리오 페이지에서)</li>
                        <li>또는 요금제 업그레이드</li>
                    </ul>
                </div>
                <footer class="port-modal-footer">
                    <a class="port-btn" href="portfolio.html">포트폴리오 열기</a>
                    <a class="port-btn port-btn-primary" href="pricing.html">요금제 보기</a>
                </footer>
            </div>
        `;
        document.body.appendChild(overlay);
        if (window.NexusModal) NexusModal.lock();

        const close = () => {
            overlay.remove();
            if (window.NexusModal) NexusModal.unlock();
        };
        overlay.querySelector('.port-modal-close').addEventListener('click', close);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });
    }

    // ─── 마크업 헬퍼 ──────────────────────────────────────────
    function _escapeHtml(s) {
        if (s == null) return '';
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    function _escapeAttr(s) { return _escapeHtml(s).replace(/\n/g, ' '); }

    function _renderButtonContent(status, size) {
        // 작은 버튼은 라벨 없이 아이콘만 (size === 'small'), medium 은 아이콘+라벨
        const sm = size === 'small';
        switch (status) {
            case 'idle':     return sm ? '📊' : '📊 담기';
            case 'done':     return sm ? '✓'  : '✓ 담음';
            case 'loading':  return sm ? '⏳' : '⏳ 담는 중...';
            case 'disabled': return sm ? '📊' : '📊 담기';
            default:         return sm ? '📊' : '📊 담기';
        }
    }

    function _titleFor(status, disabledReason) {
        if (status === 'done')     return '포트폴리오에 이미 있습니다';
        if (status === 'loading')  return '담는 중…';
        if (status === 'disabled') {
            if (disabledReason === 'auth_required') return '로그인 후 이용 가능 — 클릭하여 로그인';
            if (disabledReason === 'unverified')    return '검증되지 않은 종목 — 담기 비활성';
            return '비활성';
        }
        return '포트폴리오에 담기';
    }

    /**
     * 4 상태 + 2 크기 → 마크업.
     * @param {string} ticker     — "AAPL" / "005930.KS"
     * @param {string} status     — 'idle' | 'done' | 'disabled' | 'loading'
     * @param {object} opts       — { source, sourceMeta?, size?, disabledReason? }
     */
    function renderPortfolioAddButton(ticker, status, opts) {
        opts = opts || {};
        const source     = opts.source || 'manual';
        const sourceMeta = opts.sourceMeta || {};
        const size       = opts.size || 'medium';
        const disabledReason = opts.disabledReason || '';

        const metaJson = JSON.stringify(sourceMeta);
        const sizeClass = size === 'small' ? 'port-add-btn--small' : 'port-add-btn--medium';
        const stateClass = `port-add-btn--${status}`;

        return (
            `<button class="port-add-btn ${sizeClass} ${stateClass}" type="button"`
            + ` data-ticker="${_escapeAttr(ticker)}"`
            + ` data-source="${_escapeAttr(source)}"`
            + ` data-source-meta="${_escapeAttr(metaJson)}"`
            + ` data-state="${_escapeAttr(status)}"`
            + ` data-size="${_escapeAttr(size)}"`
            + (disabledReason ? ` data-disabled-reason="${_escapeAttr(disabledReason)}"` : '')
            + ` title="${_escapeAttr(_titleFor(status, disabledReason))}">`
            + _renderButtonContent(status, size)
            + `</button>`
        );
    }

    // ─── 단일 버튼 상태 강제 전환 (loading 가드 우회) ─────────
    // 클릭 핸들러가 모든 분기에서 명시적으로 사용 — POST 결과 후 stuck 방지
    function _setButtonState(btn, newState, disabledReason) {
        if (!btn) return;
        const size = btn.dataset.size || 'medium';
        btn.dataset.state = newState;
        if (disabledReason !== undefined) {
            if (disabledReason) btn.dataset.disabledReason = disabledReason;
            else delete btn.dataset.disabledReason;
        }
        btn.className = btn.className.replace(/port-add-btn--(idle|done|disabled|loading)/g, '').trim();
        btn.classList.add('port-add-btn', `port-add-btn--${newState}`,
                          size === 'small' ? 'port-add-btn--small' : 'port-add-btn--medium');
        btn.innerHTML = _renderButtonContent(newState, size);
        btn.title = _titleFor(newState, btn.dataset.disabledReason || '');
    }

    // ─── 단일 버튼 상태 갱신 (캐시 기반, loading 보호 가드) ───
    function updateButtonState(btn) {
        const ticker = btn.dataset.ticker;
        if (!ticker) return;
        const disabledReason = btn.dataset.disabledReason || '';

        let status;
        if (_cache.has(ticker)) {
            status = 'done';
        } else if (disabledReason) {
            status = 'disabled';
        } else {
            status = 'idle';
        }

        // loading 중인 버튼은 자동 갱신 우회 — 클릭 핸들러가 명시적으로
        // _setButtonState 로 직접 전환 (refreshButtonsByTicker 의 자동 호출이
        // loading 상태를 덮어쓰지 못하도록 보호. 핸들러는 _setButtonState 사용).
        if (btn.dataset.state === 'loading') return;

        _setButtonState(btn, status, disabledReason);
    }

    function refreshButtonsByTicker(ticker) {
        if (!ticker) return;
        // CSS.escape 안전 처리 (구형 브라우저 대비)
        const safe = (window.CSS && CSS.escape) ? CSS.escape(ticker) : ticker.replace(/"/g, '\\"');
        document.querySelectorAll(`.port-add-btn[data-ticker="${safe}"]`).forEach(updateButtonState);
    }

    function refreshAllButtons() {
        document.querySelectorAll('.port-add-btn').forEach(updateButtonState);
    }

    function markAdded(ticker) {
        if (!ticker) return;
        _cache.add(ticker);
        refreshButtonsByTicker(ticker);
    }

    function markRemoved(ticker) {
        if (!ticker) return;
        _cache.delete(ticker);
        refreshButtonsByTicker(ticker);
    }

    // ─── 비로그인 ticker 의 모든 .port-add-btn 을 disabled(auth_required) 로 ──
    function _markButtonsDisabledAuth(ticker) {
        const safe = (window.CSS && CSS.escape) ? CSS.escape(ticker) : ticker.replace(/"/g, '\\"');
        document.querySelectorAll(`.port-add-btn[data-ticker="${safe}"]`).forEach(btn => {
            // loading / done 은 건드리지 않음
            if (btn.dataset.state === 'loading' || btn.dataset.state === 'done') return;
            btn.dataset.disabledReason = 'auth_required';
            updateButtonState(btn);
        });
    }

    // ─── /api/portfolio/check 일괄 호출 + 캐시 + dedupe ───────
    async function fetchPortfolioCheck(tickers) {
        if (!tickers || !tickers.length) return _cache;
        // 비로그인 → 빈 Set + 모든 버튼 disabled(auth_required) 자동 마킹
        if (!await _isAuthed()) {
            const seen = new Set();
            for (const t of tickers) {
                if (!t || seen.has(t)) continue;
                seen.add(t);
                _markButtonsDisabledAuth(t);
            }
            return new Set();
        }

        // _cache 또는 _inflight 에 없는 신규만 조회
        const newOnes = [];
        const seen = new Set();
        for (const t of tickers) {
            if (!t || seen.has(t)) continue;
            seen.add(t);
            if (_cache.has(t)) continue;       // 이미 알고 있음
            if (_inflight.has(t)) continue;    // 다른 호출이 처리 중
            newOnes.push(t);
        }

        // inflight 가 있으면 모두 대기 후 캐시 반환 (요청 ticker 가 inflight 에 있는 경우 대기)
        const pendingPromises = [];
        for (const t of tickers) {
            if (_inflight.has(t)) pendingPromises.push(_inflight.get(t));
        }

        if (newOnes.length) {
            const csv = newOnes.map(encodeURIComponent).join(',');
            const promise = fetch(`${API_BASE}/api/portfolio/check?tickers=${csv}`, {
                headers: _authHeaders(),
            }).then(async r => {
                if (!r.ok) {
                    if (r.status === 401) _authedCache = false;
                    return { existing: [] };
                }
                try { return await r.json(); }
                catch (_) { return { existing: [] }; }
            }).then(data => {
                const existing = data.existing || [];
                existing.forEach(t => {
                    _cache.add(t);
                    refreshButtonsByTicker(t);
                });
                newOnes.forEach(t => _inflight.delete(t));
                return existing;
            }).catch(e => {
                console.warn('[NexusPortfolio.fetchPortfolioCheck]', e && e.message);
                newOnes.forEach(t => _inflight.delete(t));
                return [];
            });
            newOnes.forEach(t => _inflight.set(t, promise));
            pendingPromises.push(promise);
        }

        if (pendingPromises.length) {
            await Promise.all(pendingPromises);
        }
        return _cache;
    }

    // ─── POST /api/portfolio/items ────────────────────────────
    async function postPortfolioAdd(ticker, source, sourceMeta) {
        const body = {
            ticker: ticker,
            source: source,
            source_meta: sourceMeta || {},
        };
        let r;
        try {
            r = await fetch(`${API_BASE}/api/portfolio/items`, {
                method: 'POST',
                headers: _authHeaders(),
                body: JSON.stringify(body),
            });
        } catch (e) {
            return { ok: false, status: 0, errorKind: 'network', detail: (e && e.message) || 'Network error' };
        }

        let data = null;
        try { data = await r.json(); } catch (_) { data = null; }
        const detail = (data && data.detail) || '';

        if (r.ok) return { ok: true, status: r.status, item: data };

        // 409 — 이미 담김 (정합성 보정)
        if (r.status === 409) return { ok: false, status: 409, errorKind: 'duplicate', detail };

        // 403 — 슬롯 가득
        if (r.status === 403) return { ok: false, status: 403, errorKind: 'slot_full', detail };

        // 502 — yfinance 실패
        if (r.status === 502) return { ok: false, status: 502, errorKind: 'fetch_failed', detail };

        // 401 — 인증 만료
        if (r.status === 401) {
            _authedCache = false;
            return { ok: false, status: 401, errorKind: 'auth', detail };
        }

        return { ok: false, status: r.status, errorKind: 'unknown', detail };
    }

    // ─── 이벤트 위임 ──────────────────────────────────────────
    let _delegationAttached = false;
    function attachPortfolioAddHandlers(container) {
        const target = container || document.body;
        // document.body 1회만 위임 (동적 추가 마크업 자동 처리)
        if (target === document.body && _delegationAttached) return;
        if (target === document.body) _delegationAttached = true;

        target.addEventListener('click', async (e) => {
            const btn = e.target.closest('.port-add-btn');
            if (!btn) return;

            // 행 onclick (예: Tab 3 toggleThemeRow) 차단 — 모든 .port-add-btn 클릭에 무조건
            e.stopPropagation();

            const state = btn.dataset.state;
            const ticker = btn.dataset.ticker;
            const source = btn.dataset.source;
            let sourceMeta = {};
            try { sourceMeta = JSON.parse(btn.dataset.sourceMeta || '{}'); } catch (_) {}

            console.debug('[NexusPortfolio.click]', { ticker, source, state });

            // 'done' / 'loading' — no-op
            if (state === 'done' || state === 'loading') return;

            // 'disabled' — 비활성 사유 안내
            if (state === 'disabled') {
                const reason = btn.dataset.disabledReason;
                if (reason === 'auth_required') {
                    if (confirm('로그인이 필요한 기능입니다. 로그인 페이지로 이동할까요?')) {
                        _loginRedirect();
                    }
                } else if (reason === 'unverified') {
                    _toast('검증되지 않은 종목 — 담기 불가', 'error');
                } else {
                    _toast('현재 담기 불가', 'error');
                }
                return;
            }

            // 'idle' — 정상 흐름
            _setButtonState(btn, 'loading');

            // POST 자체의 throw 도 안전망 — postPortfolioAdd 가 이미 try/catch
            // 하지만 예상 못 한 throw 대비 한 번 더 보강.
            let result;
            try {
                result = await postPortfolioAdd(ticker, source, sourceMeta);
            } catch (err) {
                console.warn('[NexusPortfolio] postPortfolioAdd threw:', err);
                result = { ok: false, status: 0, errorKind: 'network', detail: (err && err.message) || 'Unknown' };
            }

            console.debug('[NexusPortfolio.result]', { ticker, status: result.status, errorKind: result.errorKind });

            // 응답 처리 — 모든 경로에서 _setButtonState 호출 보장 (stuck 방지).
            // 결과 분기 자체에서 throw 가 나도 마지막 catch 가 idle 롤백.
            try {
                if (result.ok || result.errorKind === 'duplicate') {
                    // 클릭한 버튼은 명시적으로 done 으로 직접 전환 (updateButtonState 의
                    // loading 가드 우회). 같은 ticker 의 다른 화면 버튼은 markAdded 가
                    // _cache 갱신 + refreshButtonsByTicker 로 동기화.
                    _setButtonState(btn, 'done');
                    markAdded(ticker);
                    _toast(result.ok ? '포트폴리오에 담았습니다' : '이미 포트폴리오에 있습니다', 'success');
                    return;
                }

                if (result.errorKind === 'slot_full') {
                    _openSlotFullModal(result.detail);
                    _setButtonState(btn, 'idle');
                    return;
                }

                if (result.errorKind === 'auth') {
                    _toast('로그인이 만료됐습니다. 다시 로그인해주세요.', 'error');
                    _setButtonState(btn, 'disabled', 'auth_required');
                    return;
                }

                if (result.errorKind === 'fetch_failed') {
                    _toast('종목 데이터를 가져올 수 없어요. 잠시 후 다시 시도해주세요.', 'error');
                } else if (result.errorKind === 'network') {
                    _toast('네트워크 오류 — 잠시 후 다시 시도해주세요.', 'error');
                } else {
                    const det = (result.detail && typeof result.detail === 'string')
                        ? result.detail.slice(0, 80) : '알 수 없는 오류';
                    _toast('담기 실패: ' + det, 'error');
                }
                _setButtonState(btn, 'idle');
            } catch (handlerErr) {
                // 마지막 안전망 — 결과 분기 어디에서도 stuck 안 되도록
                console.warn('[NexusPortfolio] post-result handler threw:', handlerErr);
                _setButtonState(btn, 'idle');
            }
        });
    }

    // ─── 글로벌 노출 ──────────────────────────────────────────
    window.NexusPortfolio = {
        renderPortfolioAddButton,
        attachPortfolioAddHandlers,
        fetchPortfolioCheck,
        postPortfolioAdd,
        markAdded,
        markRemoved,
        refreshButtonsByTicker,
        refreshAllButtons,
    };

    // ─── 자동 init ────────────────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => attachPortfolioAddHandlers(document.body));
    } else {
        attachPortfolioAddHandlers(document.body);
    }
})();
