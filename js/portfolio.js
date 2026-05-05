/* ==========================================================================
 * Phase 9 PR-9B — 나의 포트폴리오 페이지 JS
 *
 * 의존: auth.js (NexusAuth), modal-utils.js (NexusModal), theme.js
 * API: /api/portfolio/* (PR-9A backend, v2.10.0)
 * 설계: docs/phase9_portfolio_ui_design.md
 * ========================================================================== */
(function () {
    'use strict';

    // ─── API base ────────────────────────────────────────────
    const API_BASE = (function () {
        // 로컬 개발: localhost backend port 8000
        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
            return 'http://localhost:8000';
        }
        return 'https://stockanalyzer-backend.onrender.com';
    })();

    // ─── 모듈 상태 ───────────────────────────────────────────
    let state = {
        rawItems: [],          // 서버 응답 그대로
        filteredItems: [],     // 필터·정렬 적용 후
        slot: { used: 0, limit: 0 },
        filters: loadFiltersFromStorage(),
        sortBy: localStorage.getItem('sa_portfolio_sort') || 'created_at_desc',
        addState: {
            selectedTicker: null,
            selectedName: null,
            preview: null,
            tags: [],
        },
        editState: {
            id: null,
            tags: [],
        },
    };

    function loadFiltersFromStorage() {
        try {
            const raw = localStorage.getItem('sa_portfolio_filters');
            return raw ? JSON.parse(raw) : { verdict: '', source: '', tag: '', search: '' };
        } catch (_) {
            return { verdict: '', source: '', tag: '', search: '' };
        }
    }

    function saveFiltersToStorage() {
        try {
            localStorage.setItem('sa_portfolio_filters', JSON.stringify(state.filters));
            localStorage.setItem('sa_portfolio_sort', state.sortBy);
        } catch (_) { /* ignore */ }
    }

    // ─── 인증 헤더 ────────────────────────────────────────────
    function authHeaders() {
        const h = { 'Content-Type': 'application/json' };
        if (window.NexusAuth) {
            const token = NexusAuth.getAccessToken();
            if (token) h['Authorization'] = 'Bearer ' + token;
        }
        return h;
    }

    async function api(method, path, body) {
        const url = API_BASE + path;
        const opts = { method, headers: authHeaders() };
        if (body !== undefined) opts.body = JSON.stringify(body);
        const r = await fetch(url, opts);
        let data = null;
        try { data = await r.json(); } catch (_) { data = null; }
        if (!r.ok) {
            const detail = (data && data.detail) || `HTTP ${r.status}`;
            const err = new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
            err.status = r.status;
            err.body = data;
            throw err;
        }
        return data;
    }

    // ─── 포맷팅 ─────────────────────────────────────────────
    const VERDICT_META = {
        strong_buy:  { icon: '⭐', label: '강력 매수' },
        buy:         { icon: '✓',  label: '매수' },
        neutral:     { icon: '⚪', label: '중립' },
        sell:        { icon: '⚠️', label: '매도' },
        strong_sell: { icon: '❌', label: '강력 매도' },
    };

    function fmtPrice(v, ticker) {
        if (v == null || isNaN(v)) return '—';
        const isKR = /^\d{6}(\.[A-Z]{2})?$/.test(ticker || '');
        const sym = isKR ? '₩' : '$';
        if (isKR) return sym + Math.round(v).toLocaleString();
        return sym + (Math.abs(v) >= 100 ? Math.round(v).toLocaleString() : v.toFixed(2));
    }

    function fmtPct(v, digits = 2) {
        if (v == null || isNaN(v)) return '—';
        return (v >= 0 ? '+' : '') + v.toFixed(digits) + '%';
    }

    function fmtScore(v) {
        if (v == null || isNaN(v)) return '—';
        return (v >= 0 ? '+' : '') + v.toFixed(3);
    }

    function fmtPer(v) {
        if (v == null || isNaN(v) || v <= 0) return '—';
        return v.toFixed(1) + 'x';
    }

    function fmtRoe(v) {
        if (v == null || isNaN(v)) return '—';
        return (v * 100).toFixed(0) + '%';
    }

    function fmtPeg(v) {
        if (v == null || isNaN(v) || v <= 0) return '—';
        return v.toFixed(2) + 'x';
    }

    function fmtQuality(v) {
        if (v == null || isNaN(v)) return '—';
        return v.toFixed(2);
    }

    function escapeHtml(s) {
        if (s == null) return '';
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function escapeAttr(s) {
        return escapeHtml(s).replace(/\n/g, ' ');
    }

    // ─── 가치 함정 자체 판단 (§8.1 B) ───────────────────────
    function detectValueTrap(item) {
        const cur = item.current || {};
        const f = cur.fundamentals || {};
        const s = cur.scores || {};
        const reason = (cur.one_line_reason || '').toLowerCase();

        // A. 키워드 매칭
        const KEYWORDS = ['가치 함정', '함정 가능', '부풀린 고평가', 'eps 감소'];
        for (const k of KEYWORDS) {
            if (reason.includes(k)) {
                return { trap: true, source: 'keyword', reason: cur.one_line_reason };
            }
        }

        // B. 점수 기반
        // B-1. ROE 낮음 + PER 저평가
        if (f.roe != null && f.roe < 0.05 && s.valuation != null && s.valuation > 0.3) {
            return {
                trap: true, source: 'pattern',
                reason: `PER ${(f.per || 0).toFixed(0)} 저평가지만 ROE ${(f.roe * 100).toFixed(0)}% 낮음 — 가치 함정 가능`,
            };
        }
        // B-2. 부채 급증
        if (f.debt_to_equity != null && f.debt_to_equity > 200 && s.quality != null && s.quality < 0.3) {
            return {
                trap: true, source: 'pattern',
                reason: `부채비율 ${f.debt_to_equity.toFixed(0)}% 매우 높음 + 품질 약함 — 재무 위험`,
            };
        }
        // B-3. 거품 위험
        if (s.tech != null && s.tech > 0.4 && s.fundamental != null && s.fundamental < -0.3) {
            return {
                trap: true, source: 'pattern',
                reason: '기술 매수 신호 강하지만 펀더멘털 약세 — 거품 위험',
            };
        }
        // B-4. 성장 둔화
        if (f.eps_growth != null && f.eps_growth < -0.10) {
            return {
                trap: true, source: 'pattern',
                reason: `EPS ${(f.eps_growth * 100).toFixed(0)}% 감소 — 성장 둔화`,
            };
        }
        return { trap: false };
    }

    // ─── 데이터 로드 ─────────────────────────────────────────
    async function loadPortfolio() {
        showLoading(true);
        try {
            const data = await api('GET', '/api/portfolio/items');
            state.rawItems = data.items || [];
            state.slot = data.slot || { used: 0, limit: 0 };
            applyFiltersAndSort();
            renderSummary();
            renderItems();
            renderTagFilterOptions();
            updateHeaderCounts();
        } catch (e) {
            showError(e);
        } finally {
            showLoading(false);
        }
    }

    function showLoading(on) {
        const el = document.getElementById('portLoading');
        if (el) el.hidden = !on;
    }

    function showError(e) {
        const banner = document.getElementById('errorBanner');
        if (!banner) return;
        let msg = '포트폴리오 불러오기 실패: ' + (e.message || 'Unknown');
        if (e.status === 401) msg = '로그인이 필요합니다.';
        if (e.status === 403) msg = '현재 등급에서 이용할 수 없습니다.';
        banner.textContent = msg;
        banner.style.display = 'block';
    }

    // ─── 헤더 카운트 ─────────────────────────────────────────
    function updateHeaderCounts() {
        const count = state.rawItems.length;
        const limitText = state.slot.limit === -1 ? '∞' : state.slot.limit;
        const limitDisplay = state.slot.limit === -1
            ? `(VIP)`
            : `· (${(state.slot.limit / Math.max(state.slot.used, 1) * 100).toFixed(0) > 0 ? '' : ''})`;
        document.getElementById('portCount').textContent = count;
        document.getElementById('portSlot').textContent = `${state.slot.used} / ${limitText}`;
        document.getElementById('portPlan').textContent = state.slot.limit === -1 ? '· VIP (무제한)' : '';
    }

    // ─── 요약 카드 ─────────────────────────────────────────
    function renderSummary() {
        const items = state.rawItems;
        const summary = document.getElementById('portSummary');
        if (!items.length) {
            summary.hidden = true;
            return;
        }
        summary.hidden = false;

        // 보유 + 슬롯
        document.getElementById('sumCount').textContent = items.length;
        const limitText = state.slot.limit === -1 ? '∞' : state.slot.limit;
        document.getElementById('sumSlot').textContent = `슬롯 ${state.slot.used}/${limitText}`;

        // 평균 수익률 — 단순 평균 (사용자 결정 #3 옵션 A)
        const returns = items.map(it => (it.delta && it.delta.price_pct) || null).filter(v => v != null);
        const avgReturn = returns.length ? returns.reduce((a, b) => a + b, 0) / returns.length : null;
        const sumReturnEl = document.getElementById('sumReturn');
        if (avgReturn == null) {
            sumReturnEl.textContent = '—';
            sumReturnEl.className = 'port-sum-value';
        } else {
            sumReturnEl.textContent = fmtPct(avgReturn);
            sumReturnEl.className = 'port-sum-value ' + (avgReturn >= 0 ? 'gain' : 'loss');
        }

        // 평균 종합 점수 — None 제외 단순 평균
        const scores = items.map(it => (it.current && it.current.overall_score) || null).filter(v => v != null);
        const avgScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
        document.getElementById('sumScore').textContent = avgScore == null ? '—' : fmtScore(avgScore);

        // Verdict 분포 — 5단계 카운트
        const dist = { strong_buy: 0, buy: 0, neutral: 0, sell: 0, strong_sell: 0 };
        items.forEach(it => {
            const t = it.current && it.current.verdict_tier;
            if (t && dist[t] != null) dist[t]++;
        });
        const distEl = document.getElementById('sumVerdictDist');
        distEl.innerHTML = ['strong_buy', 'buy', 'neutral', 'sell', 'strong_sell']
            .filter(t => dist[t] > 0)
            .map(t => {
                const m = VERDICT_META[t];
                return `<span class="port-vd-item port-verdict ${t}">${m.icon} ${dist[t]}</span>`;
            })
            .join('');
        if (!distEl.innerHTML) distEl.textContent = '—';
    }

    // ─── 종목 행 렌더 ─────────────────────────────────────
    function renderItems() {
        const empty = document.getElementById('portEmpty');
        const table = document.getElementById('portTable');
        const controls = document.getElementById('portControls');
        const tbody = document.getElementById('portTbody');

        if (!state.rawItems.length) {
            empty.hidden = false;
            table.hidden = true;
            controls.hidden = true;
            tbody.innerHTML = '';
            return;
        }
        empty.hidden = true;
        table.hidden = false;
        controls.hidden = false;

        if (!state.filteredItems.length) {
            tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:24px; color: var(--port-muted);">필터 결과 없음</td></tr>`;
            return;
        }

        tbody.innerHTML = state.filteredItems.map(rowHtml).join('');

        // 액션 버튼 이벤트 위임
        tbody.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const a = btn.dataset.action;
                const id = btn.dataset.id;
                if (a === 'edit') openEditModal(id);
                else if (a === 'refresh') refreshItemConfirm(id);
                else if (a === 'delete') deleteItemConfirm(id);
            });
        });
    }

    function rowHtml(it) {
        const cur = it.current || {};
        const snap = it.snapshot || {};
        const delta = it.delta || {};
        const f = cur.fundamentals || {};
        const s = cur.scores || {};
        const interpV2 = cur.interpretations_v2 || {}; // 사용 안 하지만 참조
        const trap = detectValueTrap(it);

        // 종목 컬럼
        const ticker = escapeHtml(it.ticker);
        const company = escapeHtml(it.company_name || '');
        const sectorKr = escapeHtml(it.sector_kr || '');
        const warningHtml = trap.trap
            ? `<span class="port-warning-icon" data-tooltip="${escapeAttr(trap.reason)}">⚠️</span>`
            : '';

        // 수익률
        const ret = delta.price_pct;
        const retClass = ret == null ? 'neutral' : (ret >= 0 ? 'gain' : 'loss');

        // verdict
        const tier = cur.verdict_tier || 'neutral';
        const meta = VERDICT_META[tier] || VERDICT_META.neutral;
        const snapTier = snap.verdict_tier;
        const tierRank = { strong_buy: 4, buy: 3, neutral: 2, sell: 1, strong_sell: 0 };
        const worsened = snapTier && tierRank[tier] < tierRank[snapTier];
        const changeHtml = (snapTier && snapTier !== tier)
            ? `<span class="port-verdict-change ${worsened ? 'worsened' : ''}">
                 ← ${VERDICT_META[snapTier]?.label || snapTier}
               </span>`
            : '';

        // 메모
        const memo = escapeHtml((it.memo || '').slice(0, 50));
        const memoFull = escapeAttr(it.memo || '');

        return `
        <tr class="${trap.trap ? 'port-warning' : ''}" data-id="${escapeAttr(it.id)}">
            <td data-label="종목">
                <div class="port-ticker">${warningHtml}${ticker}</div>
                <div class="port-company">${company}${sectorKr ? ' · ' + sectorKr : ''}</div>
            </td>
            <td data-label="현재가">${fmtPrice(cur.price, it.ticker)}</td>
            <td data-label="수익률" class="port-return ${retClass}">${fmtPct(ret)}</td>
            <td data-label="판단">
                <span class="port-verdict ${tier}">${meta.icon} ${meta.label}</span>
                ${changeHtml}
            </td>
            <td data-label="PER">${fmtPer(f.per)}</td>
            <td data-label="ROE">${fmtRoe(f.roe)}</td>
            <td data-label="PEG">${fmtPeg(f.peg)}</td>
            <td data-label="품질">${fmtQuality(s.quality)}</td>
            <td data-label="메모" class="port-memo" title="${memoFull}">${memo || '—'}</td>
            <td class="port-actions-cell">
                <button class="port-action-btn" data-action="edit" data-id="${escapeAttr(it.id)}" type="button">편집</button>
                <button class="port-action-btn" data-action="refresh" data-id="${escapeAttr(it.id)}" type="button">재설정</button>
                <button class="port-action-btn danger" data-action="delete" data-id="${escapeAttr(it.id)}" type="button">삭제</button>
            </td>
        </tr>
        `;
    }

    // ─── 필터·정렬 ────────────────────────────────────────────
    function applyFiltersAndSort() {
        let items = state.rawItems.slice();

        // 필터
        if (state.filters.verdict) {
            items = items.filter(it => (it.current && it.current.verdict_tier) === state.filters.verdict);
        }
        if (state.filters.source) {
            items = items.filter(it => it.source === state.filters.source);
        }
        if (state.filters.tag) {
            items = items.filter(it => Array.isArray(it.tags) && it.tags.includes(state.filters.tag));
        }
        if (state.filters.search) {
            const q = state.filters.search.toLowerCase();
            items = items.filter(it =>
                (it.ticker || '').toLowerCase().includes(q) ||
                (it.company_name || '').toLowerCase().includes(q)
            );
        }

        // 정렬
        const cmpNum = (a, b) => (a == null ? 1 : b == null ? -1 : a - b);
        const byCurrentScore = it => it.current && it.current.overall_score;
        const bySnapScore = it => it.snapshot && it.snapshot.overall_score;
        const sorts = {
            created_at_desc: (a, b) => (b.created_at || '').localeCompare(a.created_at || ''),
            created_at_asc:  (a, b) => (a.created_at || '').localeCompare(b.created_at || ''),
            return_pct_desc: (a, b) => -cmpNum(a.delta?.price_pct, b.delta?.price_pct),
            return_pct_asc:  (a, b) =>  cmpNum(a.delta?.price_pct, b.delta?.price_pct),
            overall_score_desc: (a, b) => -cmpNum(byCurrentScore(a), byCurrentScore(b)),
            overall_score_asc:  (a, b) =>  cmpNum(byCurrentScore(a), byCurrentScore(b)),
            delta_score_desc: (a, b) => {
                const da = (byCurrentScore(a) ?? 0) - (bySnapScore(a) ?? 0);
                const db = (byCurrentScore(b) ?? 0) - (bySnapScore(b) ?? 0);
                return -(da - db);
            },
            delta_score_asc: (a, b) => {
                const da = (byCurrentScore(a) ?? 0) - (bySnapScore(a) ?? 0);
                const db = (byCurrentScore(b) ?? 0) - (bySnapScore(b) ?? 0);
                return da - db;
            },
            target_proximity: (a, b) => cmpNum(a.target_remaining_pct, b.target_remaining_pct),
            stoploss_proximity: (a, b) => cmpNum(
                a.stoploss_remaining_pct == null ? Infinity : Math.abs(a.stoploss_remaining_pct),
                b.stoploss_remaining_pct == null ? Infinity : Math.abs(b.stoploss_remaining_pct)
            ),
        };
        items.sort(sorts[state.sortBy] || sorts.created_at_desc);

        state.filteredItems = items;
    }

    function renderTagFilterOptions() {
        const sel = document.getElementById('portFilterTag');
        const tagSet = new Set();
        state.rawItems.forEach(it => (it.tags || []).forEach(t => tagSet.add(t)));
        const tags = Array.from(tagSet).sort();
        const cur = state.filters.tag;
        sel.innerHTML = '<option value="">전체 태그</option>' +
            tags.map(t => `<option value="${escapeAttr(t)}" ${t === cur ? 'selected' : ''}>${escapeHtml(t)}</option>`).join('');
    }

    // ─── 모달 ────────────────────────────────────────────────
    function openModal(id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.hidden = false;
        if (window.NexusModal) NexusModal.lock();
    }

    function closeModal(id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.hidden = true;
        if (window.NexusModal) NexusModal.unlock();
    }

    // 모달 close 버튼 + 오버레이 클릭 위임
    document.addEventListener('click', (e) => {
        const close = e.target.closest('[data-close-modal]');
        if (close) {
            closeModal(close.dataset.closeModal);
            return;
        }
        // 오버레이 직접 클릭 시 닫기
        if (e.target.classList.contains('port-modal-overlay')) {
            closeModal(e.target.id);
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            ['portAddModal', 'portEditModal', 'portSlotFullModal'].forEach(id => {
                const el = document.getElementById(id);
                if (el && !el.hidden) closeModal(id);
            });
        }
    });

    // ─── 종목 추가 모달 ─────────────────────────────────────
    let searchDebounceTimer = null;
    let _kbdIdx = -1;             // 자동완성 키보드 선택 인덱스 (-1 = 미선택)

    function getResultItems() {
        return document.querySelectorAll('#portAddResults .port-search-result[data-ticker]');
    }

    function setKbdIdx(idx) {
        const items = getResultItems();
        if (!items.length) { _kbdIdx = -1; return; }
        // 순환 (배열 길이 안에서 wrap)
        const n = items.length;
        const i = ((idx % n) + n) % n;
        items.forEach((el, j) => el.classList.toggle('kbd-active', j === i));
        items[i].scrollIntoView({ block: 'nearest' });
        _kbdIdx = i;
    }

    function clearKbdIdx() {
        getResultItems().forEach(el => el.classList.remove('kbd-active'));
        _kbdIdx = -1;
    }

    function openAddModal() {
        // 슬롯 가득 사전 체크
        if (state.slot.limit !== -1 && state.slot.used >= state.slot.limit) {
            openSlotFullModal();
            return;
        }
        // 상태 초기화
        state.addState = { selectedTicker: null, selectedName: null, preview: null, tags: [] };
        document.getElementById('portAddSearch').value = '';
        document.getElementById('portAddResults').innerHTML = '';
        document.getElementById('portAddPreview').hidden = true;
        document.getElementById('portAddMemo').value = '';
        document.getElementById('portAddTagInput').value = '';
        document.getElementById('portAddTarget').value = '';
        document.getElementById('portAddStoploss').value = '';
        renderAddTagChips();
        document.getElementById('portAddSubmit').disabled = true;
        openModal('portAddModal');
        setTimeout(() => document.getElementById('portAddSearch').focus(), 100);
    }

    function openSlotFullModal() {
        const limitText = state.slot.limit === -1 ? '∞' : state.slot.limit;
        document.getElementById('portSlotFullText').textContent =
            `${state.slot.used}/${limitText}`;
        openModal('portSlotFullModal');
    }

    async function handleAddSearch(q) {
        const resultsEl = document.getElementById('portAddResults');
        if (!q || q.length < 2) {
            resultsEl.innerHTML = '';
            return;
        }
        try {
            const r = await fetch(`${API_BASE}/api/stock/search?q=${encodeURIComponent(q)}`, {
                headers: authHeaders(),
            });

            // backend /api/stock/search 는 단일 객체 {symbol, name} 또는 404 반환.
            // 검색 실패는 정상 흐름 — q 가 ticker 형식이면 직접 담기 활성화,
            // 아니면 안내만 (한글 검색어 "삼성" 같은 것이 ticker 로 잘못 들어가지 않도록).
            if (r.status === 404) {
                const TICKER_RE = /^[A-Za-z0-9.\-]{1,20}$/;
                const trimmed = q.trim();
                if (TICKER_RE.test(trimmed)) {
                    const tk = trimmed.toUpperCase();
                    resultsEl.innerHTML = `<div class="port-search-result" data-ticker="${escapeAttr(tk)}" data-name="">
                        <strong>${escapeHtml(tk)}</strong>
                        <span style="color:var(--port-muted); margin-left:8px;">검색 결과 없음 — 직접 담기</span>
                    </div>`;
                } else {
                    resultsEl.innerHTML = `<div class="port-search-result" style="color:var(--port-muted); cursor:default;">
                        검색 결과 없음 — 정확한 ticker (예: <strong>AAPL</strong>, <strong>005930.KS</strong>) 를 입력하세요
                    </div>`;
                }
                return;
            }
            if (!r.ok) {
                let detail = `HTTP ${r.status}`;
                try { const j = await r.json(); detail = j.detail || detail; } catch (_) {}
                throw new Error(detail);
            }

            const data = await r.json();
            // 호환 파싱 — 향후 backend 가 다중 결과 지원해도 동작:
            //   1) Array            → 그대로
            //   2) {items: [...]}   → items
            //   3) {results: [...]} → results
            //   4) {symbol, name}   → 단일 객체 → [data]  (현재 backend)
            let items = [];
            if (Array.isArray(data)) {
                items = data;
            } else if (Array.isArray(data.items)) {
                items = data.items;
            } else if (Array.isArray(data.results)) {
                items = data.results;
            } else if (data && data.symbol) {
                items = [data];
            }
            items = items.slice(0, 6);

            if (!items.length) {
                resultsEl.innerHTML = `<div class="port-search-result" style="color:var(--port-muted); cursor:default;">검색 결과 없음</div>`;
                return;
            }
            resultsEl.innerHTML = items.map(s => {
                const sym = s.symbol || s.ticker || '';
                const name = s.name || s.longName || s.shortName || '';
                return `<div class="port-search-result" data-ticker="${escapeAttr(sym)}" data-name="${escapeAttr(name)}">
                    <strong>${escapeHtml(sym)}</strong>
                    ${name ? `<span style="color:var(--port-muted); margin-left:8px;">${escapeHtml(name)}</span>` : ''}
                </div>`;
            }).join('');
        } catch (e) {
            resultsEl.innerHTML = `<div class="port-search-result" style="color:var(--port-loss); cursor:default;">검색 실패: ${escapeHtml(e.message)}</div>`;
        }
    }

    async function selectSearchResult(ticker, name) {
        state.addState.selectedTicker = ticker;
        state.addState.selectedName = name;
        document.getElementById('portAddSearch').value = ticker + (name ? ' — ' + name : '');
        document.getElementById('portAddResults').innerHTML = '';
        clearKbdIdx();
        document.getElementById('portAddSubmit').disabled = false;

        // 미리보기 — analyze_ticker (사용자 결정 #7 옵션 A)
        const preview = document.getElementById('portAddPreview');
        document.getElementById('portPreviewName').textContent = ticker + (name ? ` (${name})` : '');
        document.getElementById('portPreviewMeta').textContent = '데이터 로딩 중…';
        document.getElementById('portPreviewVerdict').innerHTML = '';
        document.getElementById('portPreviewReason').textContent = '';
        preview.hidden = false;

        try {
            const a = await api('GET', `/api/stock/analyze/${encodeURIComponent(ticker)}`);
            state.addState.preview = a;
            const tier = a.verdict_tier || 'neutral';
            const meta = VERDICT_META[tier] || VERDICT_META.neutral;
            const sectorKr = a.sector_kr || '';
            const close = a.close;
            const overall = a.overall_score;
            document.getElementById('portPreviewMeta').textContent =
                `${sectorKr}${sectorKr ? ' · ' : ''}${fmtPrice(close, ticker)}` +
                (overall != null ? ` · 종합 ${fmtScore(overall)}` : '');
            document.getElementById('portPreviewVerdict').innerHTML =
                `<span class="port-verdict ${tier}">${meta.icon} ${meta.label}</span>`;
            document.getElementById('portPreviewReason').textContent = a.one_line_reason || '';
        } catch (e) {
            document.getElementById('portPreviewMeta').textContent =
                `미리보기 실패: ${e.message} (담기는 가능)`;
        }
    }

    function renderAddTagChips() { renderTagChips('portAddTagChips', state.addState.tags); }

    function renderTagChips(containerId, tagsArr) {
        const el = document.getElementById(containerId);
        el.innerHTML = tagsArr.map((t, i) => `
            <span class="port-tag-chip">
                ${escapeHtml(t)}
                <button type="button" data-remove-tag-index="${i}" data-container="${containerId}" aria-label="제거">×</button>
            </span>
        `).join('');
    }

    document.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('[data-remove-tag-index]');
        if (removeBtn) {
            const idx = parseInt(removeBtn.dataset.removeTagIndex, 10);
            const container = removeBtn.dataset.container;
            const arr = container === 'portAddTagChips' ? state.addState.tags : state.editState.tags;
            arr.splice(idx, 1);
            if (container === 'portAddTagChips') renderAddTagChips();
            else renderEditTagChips();
        }
        const sugg = e.target.closest('.port-tag-suggestions button[data-tag]');
        if (sugg) {
            const t = sugg.dataset.tag;
            const inAdd = !!sugg.closest('#portAddModal');
            const arr = inAdd ? state.addState.tags : state.editState.tags;
            if (!arr.includes(t) && arr.length < 10) {
                arr.push(t);
                if (inAdd) renderAddTagChips(); else renderEditTagChips();
            }
        }
        const result = e.target.closest('.port-search-result[data-ticker]');
        if (result) selectSearchResult(result.dataset.ticker, result.dataset.name || '');
    });

    function bindTagInputEnter(inputId, getArr, render) {
        const el = document.getElementById(inputId);
        if (!el) return;
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const v = el.value.trim();
                if (!v) return;
                const arr = getArr();
                if (!arr.includes(v) && arr.length < 10) {
                    arr.push(v);
                    render();
                }
                el.value = '';
            }
        });
    }

    async function submitAdd() {
        if (!state.addState.selectedTicker) {
            toast('종목을 먼저 선택해주세요.', 'error');
            return;
        }
        const submitBtn = document.getElementById('portAddSubmit');
        submitBtn.disabled = true;
        submitBtn.textContent = '담는 중…';

        const memo = document.getElementById('portAddMemo').value.trim();
        const target = parseFloat(document.getElementById('portAddTarget').value);
        const stoploss = parseFloat(document.getElementById('portAddStoploss').value);

        const body = {
            ticker: state.addState.selectedTicker,
            source: 'manual',
            source_meta: {},
            memo: memo || null,
            tags: state.addState.tags.slice(),
        };
        if (!isNaN(target) && target > 0) body.target_price = target;
        if (!isNaN(stoploss) && stoploss > 0) body.stoploss_price = stoploss;

        try {
            await api('POST', '/api/portfolio/items', body);
            closeModal('portAddModal');
            toast('포트폴리오에 담았습니다.', 'success');
            await loadPortfolio();
        } catch (e) {
            if (e.status === 403) {
                closeModal('portAddModal');
                openSlotFullModal();
            } else if (e.status === 409) {
                toast('이미 포트폴리오에 담긴 종목입니다.', 'error');
            } else if (e.status === 502) {
                toast('종목 데이터를 가져올 수 없습니다. 잠시 후 다시 시도해주세요.', 'error');
            } else {
                toast('담기 실패: ' + e.message, 'error');
            }
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '담기';
        }
    }

    // ─── 편집 모달 ─────────────────────────────────────────
    function openEditModal(id) {
        const item = state.rawItems.find(it => it.id === id);
        if (!item) return;
        state.editState.id = id;
        state.editState.tags = (item.tags || []).slice();
        document.getElementById('portEditTitle').textContent = `✏️ ${item.ticker} ${item.company_name || ''} 편집`;
        document.getElementById('portEditMemo').value = item.memo || '';
        document.getElementById('portEditTagInput').value = '';
        document.getElementById('portEditTarget').value = item.target_price || '';
        document.getElementById('portEditStoploss').value = item.stoploss_price || '';
        renderEditTagChips();
        openModal('portEditModal');
    }

    function renderEditTagChips() { renderTagChips('portEditTagChips', state.editState.tags); }

    async function submitEdit() {
        const id = state.editState.id;
        if (!id) return;
        const submitBtn = document.getElementById('portEditSubmit');
        submitBtn.disabled = true;
        submitBtn.textContent = '저장 중…';

        const body = {
            memo: document.getElementById('portEditMemo').value.trim(),
            tags: state.editState.tags.slice(),
        };
        const target = parseFloat(document.getElementById('portEditTarget').value);
        const stoploss = parseFloat(document.getElementById('portEditStoploss').value);
        body.target_price = !isNaN(target) && target > 0 ? target : null;
        body.stoploss_price = !isNaN(stoploss) && stoploss > 0 ? stoploss : null;
        // null 인 필드는 PATCH 가 미변경으로 처리 → backend 시그니처 상 None 이면 미변경
        // 빈 메모는 null 로 변환 안 하고 빈 문자열 그대로 — backend portfolio_store 가 None 으로 저장
        // 단 우리 API 는 patch_item_user_fields 가 None 인 인자만 미변경 → 빈 문자열이면 변경됨
        // ✅ 그대로 두면 됨

        try {
            await api('PATCH', `/api/portfolio/items/${encodeURIComponent(id)}`, body);
            closeModal('portEditModal');
            toast('저장되었습니다.', 'success');
            await loadPortfolio();
        } catch (e) {
            toast('저장 실패: ' + e.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '저장';
        }
    }

    async function refreshItemConfirm(id) {
        if (!confirm('담은 시점 가격·점수가 사라지고 현재 값으로 갱신됩니다. 계속하시겠습니까?')) return;
        try {
            await api('POST', `/api/portfolio/items/${encodeURIComponent(id)}/refresh`);
            toast('스냅샷이 재설정되었습니다.', 'success');
            await loadPortfolio();
        } catch (e) {
            toast('재설정 실패: ' + e.message, 'error');
        }
    }

    async function deleteItemConfirm(id) {
        const item = state.rawItems.find(it => it.id === id);
        if (!item) return;
        if (!confirm(`${item.ticker} 을(를) 포트폴리오에서 삭제하시겠습니까?`)) return;
        try {
            await api('DELETE', `/api/portfolio/items/${encodeURIComponent(id)}`);
            toast('삭제되었습니다.', 'success');
            await loadPortfolio();
        } catch (e) {
            toast('삭제 실패: ' + e.message, 'error');
        }
    }

    // ─── 토스트 ─────────────────────────────────────────────
    let toastTimer = null;
    function toast(msg, kind) {
        const old = document.querySelector('.port-toast');
        if (old) old.remove();
        if (toastTimer) clearTimeout(toastTimer);
        const t = document.createElement('div');
        t.className = 'port-toast ' + (kind || '');
        t.textContent = msg;
        document.body.appendChild(t);
        toastTimer = setTimeout(() => t.remove(), 2400);
    }

    // ─── 이벤트 등록 ────────────────────────────────────────
    function bindEvents() {
        document.getElementById('portAddBtn').addEventListener('click', openAddModal);
        document.getElementById('portRefreshBtn').addEventListener('click', () => {
            loadPortfolio();
            toast('새로고침했습니다.', 'success');
        });
        document.getElementById('portAddSubmit').addEventListener('click', submitAdd);
        document.getElementById('portEditSubmit').addEventListener('click', submitEdit);
        document.getElementById('portEditRefresh').addEventListener('click', () => {
            const id = state.editState.id;
            if (!id) return;
            closeModal('portEditModal');
            refreshItemConfirm(id);
        });

        const sortEl = document.getElementById('portSortBy');
        sortEl.value = state.sortBy;
        sortEl.addEventListener('change', () => {
            state.sortBy = sortEl.value;
            applyFiltersAndSort();
            renderItems();
            saveFiltersToStorage();
        });

        ['portFilterVerdict', 'portFilterSource', 'portFilterTag'].forEach(id => {
            const el = document.getElementById(id);
            const key = id.replace('portFilter', '').toLowerCase();
            if (state.filters[key]) el.value = state.filters[key];
            el.addEventListener('change', () => {
                state.filters[key] = el.value;
                applyFiltersAndSort();
                renderItems();
                saveFiltersToStorage();
            });
        });

        const searchEl = document.getElementById('portSearch');
        searchEl.value = state.filters.search || '';
        searchEl.addEventListener('input', () => {
            state.filters.search = searchEl.value.trim();
            applyFiltersAndSort();
            renderItems();
            saveFiltersToStorage();
        });

        // 추가 모달 검색 — 자동완성 드롭다운 + 키보드 ↑↓ + Enter
        // input 이 변경되면 이전 선택 무효화 (한글 검색어 "삼성" 이 ticker 로
        // 잘못 설정되는 것 방지). handleAddSearch 가 응답에 따라 selectedTicker 설정.
        const addSearch = document.getElementById('portAddSearch');
        addSearch.addEventListener('input', () => {
            const q = addSearch.value.trim();
            state.addState.selectedTicker = null;
            state.addState.selectedName = null;
            state.addState.preview = null;
            document.getElementById('portAddSubmit').disabled = true;
            document.getElementById('portAddPreview').hidden = true;
            clearKbdIdx();
            if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
            // 200ms debounce — 종목 분석 화면 (300ms) 보다 약간 빠른 자동완성 감각
            searchDebounceTimer = setTimeout(() => handleAddSearch(q), 200);
        });

        // 키보드 — ↑/↓ 항목 이동, Enter 선택, Esc 결과 닫기
        addSearch.addEventListener('keydown', (e) => {
            const items = getResultItems();
            if (e.key === 'ArrowDown') {
                if (!items.length) return;
                e.preventDefault();
                setKbdIdx(_kbdIdx + 1);
            } else if (e.key === 'ArrowUp') {
                if (!items.length) return;
                e.preventDefault();
                setKbdIdx(_kbdIdx - 1);
            } else if (e.key === 'Enter') {
                // 검색 결과 있으면 선택, 없으면 기본 동작 차단 (form submit 방지)
                if (items.length) {
                    e.preventDefault();
                    const target = items[_kbdIdx >= 0 ? _kbdIdx : 0];
                    if (target && target.dataset.ticker) {
                        selectSearchResult(target.dataset.ticker, target.dataset.name || '');
                    }
                } else {
                    e.preventDefault();
                }
            } else if (e.key === 'Escape') {
                // 결과만 닫기 (모달은 글로벌 ESC 가 처리하지만 결과 있으면 우선 닫기)
                const resultsEl = document.getElementById('portAddResults');
                if (resultsEl && resultsEl.children.length) {
                    e.stopPropagation();
                    resultsEl.innerHTML = '';
                    clearKbdIdx();
                }
            }
        });

        // 태그 input Enter
        bindTagInputEnter('portAddTagInput', () => state.addState.tags, renderAddTagChips);
        bindTagInputEnter('portEditTagInput', () => state.editState.tags, renderEditTagChips);
    }

    // ─── 진입 ───────────────────────────────────────────────
    async function init() {
        // 인증 체크
        if (!window.NexusAuth) {
            showError({ message: 'auth.js 로드 실패' });
            return;
        }
        const token = NexusAuth.getAccessToken();
        const dev = await NexusAuth.getDevStatus();
        if (!token && !(dev && dev.dev_mode)) {
            // 비로그인 → 로그인 페이지
            location.href = 'login.html?next=portfolio.html';
            return;
        }

        bindEvents();
        await loadPortfolio();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
