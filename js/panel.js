// ═══════════════════════════════════════════════════════════════
// Investor Panel — Tab 5 전용 로직 (Phase 2 재설계)
// app.js 의 L(), API, getApiKey(), _authHeaders(), _authErrorMessage() 재사용.
// ═══════════════════════════════════════════════════════════════

// 상태
let _panelPersonas = [];          // 서버에서 로드한 전체 목록 (locked 포함)
let _panelUserPlan = 'free';
let _panelIsMaster = false;
let _panelLoadedOnce = false;


// ──────────────────────────────────────────
// 탭 진입 시 호출 (app.js setupTabs)
// ──────────────────────────────────────────
async function loadPanel() {
    if (_panelLoadedOnce) return;
    _panelLoadedOnce = true;
    await loadPanelPersonas();
    setupPanelStartBtn();
}


// ──────────────────────────────────────────
// 페르소나 로드 실패 시 친절한 안내 + CTA 버튼 HTML
// ──────────────────────────────────────────
function _renderPersonaErrorState(status) {
    // status: HTTP 상태 코드. 0 = 네트워크 실패, -1 = JSON 파싱 실패, 그 외 = 서버 응답 코드
    if (status === 401) {
        return `
            <div class="panel-error">
                <p style="margin:0 0 12px;">🔒 투자자 패널을 이용하려면 <strong>로그인</strong>이 필요합니다.</p>
                <a href="login.html?next=index.html" class="btn-analyze" style="display:inline-block; width:auto; padding:0.4rem 1.2rem; text-decoration:none;">로그인하기</a>
            </div>`;
    }
    if (status === 403) {
        return `
            <div class="panel-error">
                <p style="margin:0 0 12px;">💎 투자자 패널은 <strong>Basic 이상 플랜</strong>에서 이용 가능합니다.</p>
                <a href="pricing.html" class="btn-analyze" style="display:inline-block; width:auto; padding:0.4rem 1.2rem; text-decoration:none;">요금제 보기</a>
            </div>`;
    }
    return `
        <div class="panel-error">
            <p style="margin:0;">페르소나 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</p>
        </div>`;
}


// ──────────────────────────────────────────
// 페르소나 목록 로드 + 잠금/해제 렌더
// ──────────────────────────────────────────
async function loadPanelPersonas() {
    const listEl = document.getElementById('panelPersonaList');
    if (!listEl) return;

    let res;
    try {
        // /api/panel/personas 는 Phase 2 부터 인증 필요 (등급 잠금 정보 포함 응답)
        res = await fetch(`${API}/api/panel/personas`, { headers: _authHeaders() });
    } catch (networkErr) {
        // 네트워크 단절 / DNS 실패 / CORS 등 — 응답 자체를 못 받은 케이스
        listEl.innerHTML = _renderPersonaErrorState(0);
        return;
    }

    if (!res.ok) {
        // 상태 코드별 친절한 안내 + CTA 버튼
        listEl.innerHTML = _renderPersonaErrorState(res.status);
        return;
    }

    try {
        const data = await res.json();
        _panelPersonas = data.personas || [];
        _panelUserPlan = (data.user_plan || 'free').toLowerCase();
        _panelIsMaster = !!data.is_master;
    } catch (parseErr) {
        listEl.innerHTML = _renderPersonaErrorState(-1);
        return;
    }

    if (_panelPersonas.length === 0) {
        listEl.innerHTML = `<div class="caption muted">등록된 페르소나가 없습니다.</div>`;
        return;
    }

    // 카드 그리드 형태 — 세로 레이아웃 (emoji 큰 글씨 위 / 이름 / 영문이름 / 직책 / 우상단 등급 배지)
    listEl.innerHTML = _panelPersonas.map(p => {
        const planUp = (p.min_plan || 'free').toUpperCase();
        const badge = `<span class="persona-card-plan-badge" data-plan="${p.min_plan}">${planUp}</span>`;
        const emoji = `<div class="persona-card-emoji">${p.emoji || '👤'}</div>`;
        const nameKo = `<div class="persona-card-name">${escapeHtml(p.name_ko || p.id)}</div>`;
        const nameEn = p.name_en ? `<div class="persona-card-name-en">${escapeHtml(p.name_en)}</div>` : '';
        const title = p.title ? `<div class="persona-card-title">${escapeHtml(p.title)}</div>` : '';

        if (p.locked) {
            return `
                <button type="button" class="persona-card persona-card-locked"
                        onclick="showPersonaUpgradeModal('${p.id}')"
                        aria-label="${escapeHtml(p.name_ko)} — ${planUp} 등급 이상 필요">
                    ${badge}
                    <div class="persona-card-lock-overlay">
                        <span class="ms persona-card-lock-icon">lock</span>
                        <span class="persona-card-lock-text">${planUp} 이상 필요</span>
                    </div>
                    ${emoji}
                    ${nameKo}
                    ${nameEn}
                    ${title}
                </button>`;
        }
        return `
            <label class="persona-card">
                <input type="checkbox" class="panel-persona-check" value="${p.id}" checked>
                ${badge}
                ${emoji}
                ${nameKo}
                ${nameEn}
                ${title}
            </label>`;
    }).join('');
}


// ──────────────────────────────────────────
// 업그레이드 안내 모달 (잠긴 페르소나 클릭)
// ──────────────────────────────────────────
function showPersonaUpgradeModal(personaId) {
    const p = _panelPersonas.find(x => x.id === personaId);
    if (!p) return;

    const planUp = p.min_plan.toUpperCase();
    const msg =
        `🔒 ${p.emoji || ''} ${p.name_ko} (${p.name_en})\n\n` +
        `이 페르소나는 ${planUp} 등급 이상부터 토론에 초대할 수 있습니다.\n` +
        `현재 등급: ${_panelUserPlan.toUpperCase()}\n\n` +
        `요금제 페이지로 이동하시겠습니까?`;
    if (window.confirm(msg)) {
        location.href = 'pricing.html';
    }
}


// ──────────────────────────────────────────
// 토론 시작 버튼
// ──────────────────────────────────────────
function setupPanelStartBtn() {
    const btn = document.getElementById('panelStartBtn');
    if (!btn) return;
    btn.addEventListener('click', startPanelDiscussion);
}


async function startPanelDiscussion() {
    const queryEl = document.getElementById('panelQuery');
    const resultEl = document.getElementById('panelResult');
    const btn = document.getElementById('panelStartBtn');

    const query = (queryEl.value || '').trim();
    if (!query) {
        alert(L('panel_no_query') || '질문을 입력해주세요.');
        queryEl.focus();
        return;
    }

    // 선택된 페르소나 (잠긴 건 체크박스 자체가 없음)
    const checked = Array.from(document.querySelectorAll('.panel-persona-check:checked'));
    const personas = checked.map(c => c.value);
    if (personas.length === 0) {
        alert(L('panel_no_personas') || '참여 투자자를 1명 이상 선택해주세요.');
        return;
    }

    // API 키 확인
    const keys = {
        anthropic: getApiKey('anthropic') || '',
        openai:    getApiKey('openai')    || '',
        gemini:    getApiKey('gemini')    || '',
        groq:      getApiKey('groq')      || '',
    };
    if (!keys.anthropic && !keys.openai && !keys.gemini && !keys.groq) {
        alert(L('panel_no_keys') || '먼저 AI API 키를 등록해주세요.');
        return;
    }

    const maxRounds = parseInt(document.getElementById('panelMaxRounds').value, 10);
    const threshold = parseFloat(document.getElementById('panelThreshold').value);

    btn.disabled = true;
    btn.textContent = L('panel_running') || '토론 진행 중...';
    resultEl.style.display = 'block';
    resultEl.innerHTML = _renderProgressShell();

    try {
        const res = await fetch(`${API}/api/panel/discuss`, {
            method: 'POST',
            headers: _authHeaders(),
            // ai_provider 는 서버 폴백 체인에 위임. OFF 토글된 제공자는 빈 문자열.
            body: JSON.stringify({
                query,
                personas,
                max_rounds: maxRounds,
                threshold,
                user_anthropic_key: keys.anthropic,
                user_openai_key:    keys.openai,
                user_gemini_key:    keys.gemini,
                user_groq_key:      keys.groq,
            }),
        });

        // 스트림이 아닌 에러 (검증 실패 등) — 일반 JSON body
        if (!res.ok) throw new Error(await _authErrorMessage(res));

        await _consumePanelStream(res, resultEl);
    } catch (e) {
        resultEl.innerHTML = `
            <div class="panel-error">
                <span class="ms red">error</span>
                <strong>${L('panel_error') || '토론 실행 실패'}</strong>
                <p class="caption">${escapeHtml(e.message || String(e))}</p>
            </div>
        `;
    } finally {
        btn.disabled = false;
        btn.textContent = L('panel_start_btn') || '토론 시작';
    }
}


// ──────────────────────────────────────────
// NDJSON 스트림 소비 + 진행 상황 UI
// ──────────────────────────────────────────
function _renderProgressShell() {
    return `
        <div class="panel-progress" id="panelProgress">
            <div class="panel-progress-head">
                <span class="ms spin">progress_activity</span>
                <strong id="panelProgressLabel">토론 준비 중...</strong>
            </div>
            <div class="panel-progress-bar"><div class="panel-progress-fill" id="panelProgressFill" style="width:0%;"></div></div>
            <ul class="panel-progress-log" id="panelProgressLog"></ul>
        </div>
    `;
}

async function _consumePanelStream(res, resultEl) {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let finalData = null;

    // 진행 카운터 (전체 스텝 수 추정: round 수 × (persona 수 + moderator 1) + final)
    // 정확한 비율은 이벤트 흐름상 session_start 에서 결정
    let totalSteps = 1;
    let doneSteps = 0;

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop();  // 마지막 줄은 아직 불완전할 수 있음

        for (const raw of lines) {
            const line = raw.trim();
            if (!line) continue;
            let event;
            try {
                event = JSON.parse(line);
            } catch (err) {
                console.warn('[panel] 잘못된 JSON 라인 스킵:', line.slice(0, 200));
                continue;
            }

            if (event.type === 'result') {
                finalData = event.data;
                _updateProgress({ type: 'result' });
            } else if (event.type === 'error') {
                throw new Error(event.message || '서버 오류 (stream)');
            } else {
                if (event.type === 'session_start') {
                    // total = recommend(persona 수) + debate 루프마다 (persona 수 + moderator 1)
                    // max_rounds 는 '최대' 이므로 수렴 시 덜 돔. 진행바는 근사.
                    const personaCount = (event.personas || []).length;
                    const maxRounds = event.max_rounds || 1;
                    // recommend 1 라운드 + debate/moderator 가 (maxRounds-1) 라운드
                    totalSteps = personaCount + Math.max(0, maxRounds - 1) * (personaCount + 1);
                }
                // 작업 완료 이벤트에서 카운트 증가
                if (event.type === 'agent_done' || event.type === 'moderator_done') {
                    doneSteps += 1;
                }
                _updateProgress(event, doneSteps, totalSteps);
            }
        }
    }

    if (finalData) {
        renderPanelResult(finalData, resultEl);
    } else {
        resultEl.innerHTML = `<div class="panel-error"><span class="ms red">error</span> 결과 이벤트를 받지 못했습니다.</div>`;
    }
}

function _updateProgress(event, doneSteps, totalSteps) {
    const labelEl = document.getElementById('panelProgressLabel');
    const fillEl = document.getElementById('panelProgressFill');
    const logEl = document.getElementById('panelProgressLog');
    if (!labelEl) return;

    const phaseNames = { recommend: '개별 추천', debate: '크로스 토론' };
    let label = '';
    let logItem = null;

    switch (event.type) {
        case 'session_start':
            label = `${(event.personas || []).length}명 토론 시작 · 최대 ${event.max_rounds}라운드`;
            logItem = `🚀 ${label}`;
            break;
        case 'round_start':
            label = `라운드 ${event.round}/${event.total_rounds} · ${phaseNames[event.phase] || event.phase} 시작`;
            logItem = `▶ ${label}`;
            break;
        case 'agent_start':
            label = `라운드 ${event.round}/${event.total_rounds || '-'} · ${event.emoji || ''} ${event.persona_name} ${phaseNames[event.phase] || event.phase} 중... (${(event.index || 0) + 1}/${event.total})`;
            break;
        case 'agent_done': {
            const picksPart = (typeof event.picks_count === 'number') ? ` · picks ${event.picks_count}개` : '';
            logItem = `✓ ${event.persona_id} 완료 (in:${event.tokens_in}/out:${event.tokens_out}${picksPart})`;
            break;
        }
        case 'round_done':
            logItem = `✅ 라운드 ${event.round} 완료`;
            break;
        case 'moderator_start':
            label = `라운드 ${event.round} · 🧭 최종 합의 도출 중...`;
            break;
        case 'moderator_done': {
            const score = Math.round((event.convergence_score || 0) * 100);
            logItem = `🧭 중재자 집계: 수렴 ${score}% (agreed ${event.agreed} · persuaded ${event.persuaded} · disputed ${event.disputed} · solo ${event.solo})`;
            break;
        }
        case 'converged':
            label = `🎯 수렴 달성 ${Math.round((event.score || 0) * 100)}% — 결과 생성 중`;
            logItem = label;
            break;
        case 'result':
            label = `✅ 완료 — 결과 렌더링 중`;
            break;
        default:
            return;
    }

    if (label) labelEl.textContent = label;
    if (logItem && logEl) {
        const li = document.createElement('li');
        li.textContent = logItem;
        logEl.appendChild(li);
        // 가장 최근 항목이 보이도록 스크롤
        logEl.scrollTop = logEl.scrollHeight;
    }

    // 진행바 갱신
    if (fillEl && typeof doneSteps === 'number' && typeof totalSteps === 'number' && totalSteps > 0) {
        const pct = Math.min(99, Math.round((doneSteps / totalSteps) * 100));
        fillEl.style.width = pct + '%';
    }
    if (event.type === 'result' && fillEl) {
        fillEl.style.width = '100%';
    }
}


// ──────────────────────────────────────────
// 결과 렌더링 (4-bucket: agreed / persuaded / disputed / solo)
// ──────────────────────────────────────────
function renderPanelResult(data, el) {
    const termLabel = {
        convergence: L('panel_term_convergence') || '수렴 달성',
        max_rounds:  L('panel_term_max_rounds')  || '최대 라운드 도달',
        error:       L('panel_term_error')       || '오류',
    }[data.terminated_by] || data.terminated_by;

    const s = data.final_synthesis || {};
    const scorePct = Math.round((s.convergence_score || 0) * 100);
    const isParseError = s.termination_reason === 'parse_error';
    const isParseSuspicious = s.termination_reason === 'parse_suspicious';

    const parseWarningHtml = (isParseError || isParseSuspicious) ? `
        <div class="panel-parse-warning">
            <div class="panel-parse-warning-head">
                <span class="ms orange">warning</span>
                <strong>${isParseError ? '중재자 응답 파싱 실패' : '중재자 응답 이상 (빈 배열 + 높은 수렴 점수)'}</strong>
            </div>
            <p class="caption">
                ${isParseError
                    ? 'LLM 이 요청한 JSON 형식으로 응답하지 않았거나 응답이 절단되었습니다.'
                    : 'LLM 이 JSON 형식은 지켰지만 추천 배열이 비어있습니다.'}
                중재자 원본을 아래에서 확인하세요.
            </p>
            ${s.raw_json ? `
                <details class="panel-parse-raw" open>
                    <summary class="caption">중재자 원본 응답 보기</summary>
                    <pre>${escapeHtml((s.raw_json || '').slice(0, 3000))}</pre>
                </details>` : ''}
        </div>
    ` : '';

    const metaHtml = `
        <div class="panel-meta">
            <div class="panel-meta-item">
                <div class="label">${L('panel_convergence') || '수렴도'}</div>
                <div class="value">${scorePct}%</div>
            </div>
            <div class="panel-meta-item">
                <div class="label">${L('panel_meta_rounds') || '라운드'}</div>
                <div class="value">${new Set(data.rounds.map(r => r.round_num)).size}</div>
            </div>
            <div class="panel-meta-item">
                <div class="label">${L('panel_meta_time') || '소요'}</div>
                <div class="value">${data.total_seconds.toFixed(1)}s</div>
            </div>
            <div class="panel-meta-item">
                <div class="label">${L('panel_meta_tokens') || '토큰'}</div>
                <div class="value">${(data.total_tokens_in + data.total_tokens_out).toLocaleString()}</div>
            </div>
            <div class="panel-meta-item">
                <div class="label">${L('panel_meta_termination') || '종료'}</div>
                <div class="value">${termLabel}</div>
            </div>
        </div>
    `;

    const recommendationsHtml = renderPanelRecommendations(s);
    const roundsHtml = renderPanelRounds(data.rounds);
    const finalSummaryHtml = renderPanelFinalSummary(s, data);

    el.innerHTML = `
        ${parseWarningHtml}
        ${metaHtml}
        <hr class="divider">
        ${recommendationsHtml}
        <hr class="divider">
        <details class="panel-rounds-details">
            <summary><span class="ms">forum</span> 토론 과정 전체 보기</summary>
            ${roundsHtml}
            ${finalSummaryHtml}
        </details>
    `;
}


// ──────────────────────────────────────────
// 4-bucket 추천 섹션
// ──────────────────────────────────────────
function renderPanelRecommendations(s) {
    const agreed    = s.agreed    || [];
    const persuaded = s.persuaded || [];
    const disputed  = s.disputed  || [];
    const solo      = s.solo      || [];

    const personaMap = {};
    _panelPersonas.forEach(p => { personaMap[p.id] = p; });
    const personaLabel = id => {
        const p = personaMap[id];
        return p ? `${p.emoji || ''} ${p.name_ko}` : id;
    };

    const joinReasons = (arr) => {
        const joined = (arr || []).filter(Boolean).join(' · ');
        return joined || '(근거 미제공)';
    };
    const safeAttr = (s) => String(s || '').replace(/['"\\]/g, '');

    // Ticker 실존 검증 (야후 파이낸스) 결과를 카드에 반영하는 헬퍼.
    // verified=false → 카드 modifier class + 헤더에 ⚠️ 배지 + 카드 풋에 경고 블록 + 야후 검색 기반 비슷한 실존 종목 제안.
    // verified=true / null → 표시 변화 없음 (정상 카드).
    const cardModifier = (item) => item && item.verified === false ? ' panel-rec-card--unverified' : '';

    const renderHeader = (item) => {
        const t = item.ticker || '';
        const n = item.name || '';
        const warningBadge = item.verified === false
            ? `<span class="panel-rec-warning-badge" title="야후 파이낸스에서 실존 확인 안 됨">⚠️</span>`
            : '';
        return `
        <div class="panel-rec-header">
            <span class="panel-rec-ticker">${escapeHtml(t)}</span>
            ${warningBadge}
            <span class="panel-rec-name">${escapeHtml(n)}</span>
            <button class="btn-secondary panel-rec-analyze"
                    onclick="analyzeFromPanel('${safeAttr(t)}', '${safeAttr(n)}')">
                <span class="ms">bar_chart</span> 종목 분석
            </button>
        </div>`;
    };

    const renderWarningBlock = (item) => {
        if (!item || item.verified !== false) return '';
        const sugg = item.suggestions || [];
        const suggBtns = sugg.map(s => {
            const sym = s.symbol || '';
            const nm  = s.name || '';
            const ex  = s.exchange || '';
            return `<button class="panel-rec-suggestion-btn"
                            onclick="analyzeFromPanel('${safeAttr(sym)}', '${safeAttr(nm)}')">
                        <strong>${escapeHtml(sym)}</strong>
                        <span>${escapeHtml(nm)}</span>
                        ${ex ? `<span class="caption muted">${escapeHtml(ex)}</span>` : ''}
                    </button>`;
        }).join('');
        const suggBlock = sugg.length ? `
            <div class="panel-rec-suggestions">
                <span class="caption">💡 비슷한 실존 종목:</span>
                <div class="panel-rec-suggestion-list">${suggBtns}</div>
            </div>` : '';
        return `
        <div class="panel-rec-warning-block">
            <span class="panel-rec-warning-text">
                <strong>AI가 잘못된 티커를 생성했을 수 있습니다.</strong>
                야후 파이낸스에서 이 티커의 실존 확인이 안 됐습니다.
            </span>
            ${suggBlock}
        </div>`;
    };

    // Rank 1 — agreed
    const agreedCards = agreed.length === 0 ? `<div class="caption muted">없음</div>` :
        agreed.map(c => `
            <div class="panel-rec-card panel-rec-agreed${cardModifier(c)}">
                ${renderHeader(c)}
                <div class="panel-rec-summary">${escapeHtml(joinReasons(c.reasons))}</div>
                <div class="panel-rec-foot caption muted">
                    지지: ${(c.supporters || []).map(personaLabel).map(escapeHtml).join(' · ')}
                </div>
                ${renderWarningBlock(c)}
            </div>`).join('');

    // Rank 2 — persuaded
    const persuadedCards = persuaded.length === 0 ? `<div class="caption muted">없음</div>` :
        persuaded.map(p => `
            <div class="panel-rec-card panel-rec-persuaded${cardModifier(p)}">
                ${renderHeader(p)}
                <div class="panel-rec-summary">
                    <strong>최초 추천:</strong> ${escapeHtml(personaLabel(p.originally_by))}
                    → <strong>현재 지지:</strong> ${(p.now_supported_by || []).map(personaLabel).map(escapeHtml).join(' · ')}
                </div>
                ${p.turning_point ? `<div class="panel-rec-foot caption muted">💡 설득 지점: ${escapeHtml(p.turning_point)}</div>` : ''}
                ${renderWarningBlock(p)}
            </div>`).join('');

    // Rank 3+ — disputed
    const disputedCards = disputed.length === 0 ? `<div class="caption muted">없음</div>` :
        disputed.map(d => {
            const forLine = `👍 찬성 (${(d.for_side || []).map(personaLabel).join(', ')}) ${joinReasons(d.for_reasons)}`;
            const againstLine = `👎 반대 (${(d.against_side || []).map(personaLabel).join(', ')}) ${joinReasons(d.against_reasons)}`;
            return `
                <div class="panel-rec-card panel-rec-disputed${cardModifier(d)}">
                    ${renderHeader(d)}
                    <div class="panel-rec-summary panel-rec-for-line">${escapeHtml(forLine)}</div>
                    <div class="panel-rec-summary panel-rec-against-line">${escapeHtml(againstLine)}</div>
                    ${d.next_question ? `<div class="panel-rec-foot caption muted">추가 논의: ${escapeHtml(d.next_question)}</div>` : ''}
                    ${renderWarningBlock(d)}
                </div>`;
        }).join('');

    // Solo
    const soloCards = solo.length === 0 ? `<div class="caption muted">없음</div>` :
        solo.map(o => `
            <div class="panel-rec-card panel-rec-solo${cardModifier(o)}">
                ${renderHeader(o)}
                <div class="panel-rec-summary">${escapeHtml(o.reason || '(근거 미제공)')}</div>
                <div class="panel-rec-foot caption muted">${escapeHtml(personaLabel(o.supporter))}</div>
                ${renderWarningBlock(o)}
            </div>`).join('');

    return `
        <h3 class="subheader"><span class="ms" style="color:#facc15;">workspace_premium</span> 🥇 Rank 1 — 합의 (양쪽 처음부터 지지)</h3>
        <div class="panel-rec-list">${agreedCards}</div>

        <h3 class="subheader mt-16"><span class="ms" style="color:#60a5fa;">handshake</span> 🥈 Rank 2 — 설득됨 (토론 중 지지 전환)</h3>
        <div class="panel-rec-list">${persuadedCards}</div>

        <h3 class="subheader mt-16"><span class="ms orange">help_center</span> 🥉 Rank 3+ — 여전히 논쟁 중</h3>
        <div class="panel-rec-list">${disputedCards}</div>

        <h3 class="subheader mt-16"><span class="ms">lightbulb</span> 🔹 단독 추천 (합의 실패)</h3>
        <div class="panel-rec-list">${soloCards}</div>
    `;
}


// ──────────────────────────────────────────
// 최종 요약 (토론 보기 맨 아래)
// ──────────────────────────────────────────
function renderPanelFinalSummary(s, data) {
    const agreed    = s.agreed    || [];
    const persuaded = s.persuaded || [];
    const disputed  = s.disputed  || [];
    const solo      = s.solo      || [];
    const total = agreed.length + persuaded.length + disputed.length + solo.length;

    if (total === 0) {
        return `
            <div class="panel-final-summary">
                <h4><span class="ms">summarize</span> 최종 요약</h4>
                <p class="caption muted">중재자가 추천 종목을 분류하지 못했습니다.</p>
            </div>`;
    }

    const personaMap = {};
    _panelPersonas.forEach(p => { personaMap[p.id] = p; });
    const personaLabel = id => {
        const p = personaMap[id];
        return p ? `${p.emoji || ''} ${p.name_ko}` : id;
    };

    const agreedItems = agreed.map(c => `
        <li><strong>${escapeHtml(c.ticker)}</strong> — ${escapeHtml((c.reasons || []).filter(Boolean).join(' · ') || '합의 도출')}
            <span class="caption muted"> (${(c.supporters || []).map(personaLabel).map(escapeHtml).join(' · ')})</span>
        </li>`).join('');
    const persuadedItems = persuaded.map(p => `
        <li><strong>${escapeHtml(p.ticker)}</strong> — ${escapeHtml(p.turning_point || '토론 중 설득')}
            <span class="caption muted"> (${escapeHtml(personaLabel(p.originally_by))} → ${(p.now_supported_by || []).map(personaLabel).map(escapeHtml).join(' · ')})</span>
        </li>`).join('');
    const disputedItems = disputed.map(d => `
        <li><strong>${escapeHtml(d.ticker)}</strong> — 찬성 ${(d.for_side || []).length}명 vs 반대 ${(d.against_side || []).length}명</li>
    `).join('');
    const soloItems = solo.map(o => `
        <li><strong>${escapeHtml(o.ticker)}</strong> — ${escapeHtml(o.reason || '단독 추천')}
            <span class="caption muted"> (${escapeHtml(personaLabel(o.supporter))})</span>
        </li>`).join('');

    return `
        <div class="panel-final-summary">
            <h4><span class="ms">summarize</span> 최종 요약</h4>
            <div class="panel-final-summary-meta caption muted">
                ${data.personas.length}명 · ${data.rounds.length} 라운드 · 수렴 ${Math.round((s.convergence_score || 0) * 100)}%
            </div>
            ${agreed.length ? `<div class="panel-final-summary-block">
                <div class="panel-final-summary-title">🥇 합의</div>
                <ul>${agreedItems}</ul></div>` : ''}
            ${persuaded.length ? `<div class="panel-final-summary-block">
                <div class="panel-final-summary-title">🥈 설득됨</div>
                <ul>${persuadedItems}</ul></div>` : ''}
            ${disputed.length ? `<div class="panel-final-summary-block">
                <div class="panel-final-summary-title">🥉 논쟁</div>
                <ul>${disputedItems}</ul></div>` : ''}
            ${solo.length ? `<div class="panel-final-summary-block">
                <div class="panel-final-summary-title">🔹 단독</div>
                <ul>${soloItems}</ul></div>` : ''}
        </div>`;
}


// ──────────────────────────────────────────
// 토론 로그 (접이식, 새 phase 명칭)
// ──────────────────────────────────────────
function renderPanelRounds(rounds) {
    return rounds.map(r => {
        const phaseLabel = {
            recommend: `Round ${r.round_num} · 개별 추천`,
            debate:    `Round ${r.round_num} · 크로스 토론`,
            moderator: `Round ${r.round_num} · 중재자 집계`,
            // 구버전 호환
            individual: `Round ${r.round_num} · 개별 분석`,
            critique:   `Round ${r.round_num} · 크로스 비판`,
        }[r.phase] || `Round ${r.round_num} · ${r.phase}`;

        if (r.phase === 'moderator' && r.synthesis) {
            const s = r.synthesis;
            const score = Math.round((s.convergence_score || 0) * 100);
            const agreedStr    = (s.agreed    || []).map(x => x.ticker).join(', ') || '-';
            const persuadedStr = (s.persuaded || []).map(x => x.ticker).join(', ') || '-';
            const disputedStr  = (s.disputed  || []).map(x => x.ticker).join(', ') || '-';
            const soloStr      = (s.solo      || []).map(x => x.ticker).join(', ') || '-';
            return `
                <div class="panel-round panel-round-moderator">
                    <div class="panel-round-header">${phaseLabel} · 수렴 ${score}%</div>
                    <div class="panel-round-moderator-summary">
                        <div>🥇 합의: ${escapeHtml(agreedStr)}</div>
                        <div>🥈 설득됨: ${escapeHtml(persuadedStr)}</div>
                        <div>🥉 논쟁: ${escapeHtml(disputedStr)}</div>
                        <div>🔹 단독: ${escapeHtml(soloStr)}</div>
                    </div>
                </div>`;
        }

        const bubbles = (r.outputs || []).map(o => `
            <div class="panel-bubble">
                <div class="panel-bubble-header">
                    <span class="panel-bubble-emoji">${o.emoji || ''}</span>
                    <span class="panel-bubble-name">${escapeHtml(o.persona_name)}</span>
                    <span class="caption muted">in:${o.tokens_in} out:${o.tokens_out}</span>
                </div>
                <div class="panel-bubble-body">${escapeHtml(o.content).replace(/\n/g, '<br>')}</div>
            </div>`).join('');

        return `
            <div class="panel-round">
                <div class="panel-round-header">${phaseLabel}</div>
                ${bubbles}
            </div>`;
    }).join('');
}


// ──────────────────────────────────────────
// 헬퍼
// ──────────────────────────────────────────
function analyzeFromPanel(ticker, name) {
    if (typeof analyzeFromAnywhere === 'function') {
        analyzeFromAnywhere(ticker, name);
        return;
    }
    const analysisTab = document.querySelector('[data-tab="tab-analysis"]');
    if (analysisTab) analysisTab.click();
    const input = document.getElementById('searchInput');
    if (input) {
        input.value = ticker;
        const btn = document.getElementById('searchBtn');
        if (btn) btn.click();
    }
}


function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
