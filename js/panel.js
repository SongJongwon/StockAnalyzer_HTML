// ═══════════════════════════════════════════════════════════════
// Investor Panel — Tab 5 전용 로직
// app.js 의 L(), API, getApiKey(), getAiPriority() 를 재사용한다.
// ═══════════════════════════════════════════════════════════════

// 상태
let _panelPersonas = [];        // 서버에서 로드한 전체 목록
let _panelLoadedOnce = false;    // 중복 로드 방지


// ──────────────────────────────────────────
// 탭 진입 시 호출 (app.js setupTabs 에서 호출)
// ──────────────────────────────────────────
async function loadPanel() {
    if (_panelLoadedOnce) return;
    _panelLoadedOnce = true;
    await loadPanelPersonas();
    setupPanelStartBtn();
}


// ──────────────────────────────────────────
// 페르소나 목록 로드 + 체크박스 렌더
// ──────────────────────────────────────────
async function loadPanelPersonas() {
    const listEl = document.getElementById('panelPersonaList');
    if (!listEl) return;

    try {
        const res = await fetch(`${API}/api/panel/personas`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        _panelPersonas = data.personas || [];
    } catch (e) {
        listEl.innerHTML = `<div class="caption muted">페르소나 목록 로드 실패: ${e.message}</div>`;
        return;
    }

    if (_panelPersonas.length === 0) {
        listEl.innerHTML = `<div class="caption muted">등록된 페르소나가 없습니다.</div>`;
        return;
    }

    listEl.innerHTML = _panelPersonas.map(p => `
        <label class="panel-persona-item">
            <input type="checkbox" class="panel-persona-check" value="${p.id}" checked>
            <span class="panel-persona-emoji">${p.emoji || ''}</span>
            <span class="panel-persona-name">${p.name_ko}</span>
            <span class="panel-persona-title caption muted">${p.title || ''}</span>
        </label>
    `).join('');
}


// ──────────────────────────────────────────
// 토론 시작 버튼 바인딩
// ──────────────────────────────────────────
function setupPanelStartBtn() {
    const btn = document.getElementById('panelStartBtn');
    if (!btn) return;
    btn.addEventListener('click', startPanelDiscussion);
}


// ──────────────────────────────────────────
// 토론 실행
// ──────────────────────────────────────────
async function startPanelDiscussion() {
    const queryEl = document.getElementById('panelQuery');
    const resultEl = document.getElementById('panelResult');
    const btn = document.getElementById('panelStartBtn');

    const query = (queryEl.value || '').trim();
    if (!query) {
        alert(L('panel_no_query'));
        queryEl.focus();
        return;
    }

    // 선택된 페르소나
    const checked = Array.from(document.querySelectorAll('.panel-persona-check:checked'));
    const personas = checked.map(c => c.value);
    if (personas.length === 0) {
        alert(L('panel_no_personas'));
        return;
    }

    // API 키 확인
    const keys = {
        anthropic: getApiKey('anthropic') || '',
        openai:    getApiKey('openai')    || '',
        gemini:    getApiKey('gemini')    || '',
    };
    if (!keys.anthropic && !keys.openai && !keys.gemini) {
        alert(L('panel_no_keys'));
        return;
    }

    const maxRounds = parseInt(document.getElementById('panelMaxRounds').value, 10);
    const threshold = parseFloat(document.getElementById('panelThreshold').value);

    // UI: 실행 중
    btn.disabled = true;
    btn.textContent = L('panel_running');
    resultEl.style.display = 'block';
    resultEl.innerHTML = `<div class="loading"><span class="ms">hourglass_empty</span> ${L('panel_running')}</div>`;

    try {
        const res = await fetch(`${API}/api/panel/discuss`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query,
                personas,
                max_rounds: maxRounds,
                threshold,
                user_anthropic_key: keys.anthropic,
                user_openai_key:    keys.openai,
                user_gemini_key:    keys.gemini,
                ai_provider:        getAiPriority(),
            }),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }));
            throw new Error(err.detail || `HTTP ${res.status}`);
        }

        const data = await res.json();
        renderPanelResult(data, resultEl);
    } catch (e) {
        resultEl.innerHTML = `
            <div class="panel-error">
                <span class="ms red">error</span>
                <strong>${L('panel_error')}</strong>
                <p class="caption">${e.message || e}</p>
            </div>
        `;
    } finally {
        btn.disabled = false;
        btn.textContent = L('panel_start_btn');
    }
}


// ──────────────────────────────────────────
// 결과 렌더링
// ──────────────────────────────────────────
function renderPanelResult(data, el) {
    const termLabel = {
        convergence: L('panel_term_convergence'),
        max_rounds:  L('panel_term_max_rounds'),
        error:       L('panel_term_error'),
    }[data.terminated_by] || data.terminated_by;

    const s = data.final_synthesis || {};
    const scorePct = Math.round((s.convergence_score || 0) * 100);

    // 메타 정보 카드
    const metaHtml = `
        <div class="panel-meta">
            <div class="panel-meta-item">
                <div class="label">${L('panel_convergence')}</div>
                <div class="value">${scorePct}%</div>
            </div>
            <div class="panel-meta-item">
                <div class="label">${L('panel_meta_rounds')}</div>
                <div class="value">${new Set(data.rounds.map(r => r.round_num)).size}</div>
            </div>
            <div class="panel-meta-item">
                <div class="label">${L('panel_meta_time')}</div>
                <div class="value">${data.total_seconds.toFixed(1)}s</div>
            </div>
            <div class="panel-meta-item">
                <div class="label">${L('panel_meta_tokens')}</div>
                <div class="value">${(data.total_tokens_in + data.total_tokens_out).toLocaleString()}</div>
            </div>
            <div class="panel-meta-item">
                <div class="label">${L('panel_meta_termination')}</div>
                <div class="value">${termLabel}</div>
            </div>
        </div>
    `;

    // 추천 섹션 (합의/논쟁/단독)
    const recommendationsHtml = renderPanelRecommendations(s);

    // 토론 로그 (접어두기)
    const roundsHtml = renderPanelRounds(data.rounds);

    el.innerHTML = `
        ${metaHtml}
        <hr class="divider">
        ${recommendationsHtml}
        <hr class="divider">
        <details class="panel-rounds-details">
            <summary><span class="ms">forum</span> 토론 과정 전체 보기</summary>
            ${roundsHtml}
        </details>
    `;
}


// ──────────────────────────────────────────
// 추천 섹션 (합의/논쟁/단독) — 테마주 탭 카드 스타일 재사용
// ──────────────────────────────────────────
function renderPanelRecommendations(s) {
    const consensus = s.consensus || [];
    const disputed = s.disputed || [];
    const orphan = s.orphan || [];

    const personaMap = {};
    _panelPersonas.forEach(p => { personaMap[p.id] = p; });
    const personaLabel = id => {
        const p = personaMap[id];
        return p ? `${p.emoji || ''} ${p.name_ko}` : id;
    };

    const consensusCards = consensus.length === 0 ? `<div class="caption muted">${L('panel_none')}</div>` :
        consensus.map(c => `
            <div class="panel-rec-card panel-rec-consensus">
                <div class="panel-rec-header">
                    <span class="panel-rec-ticker">${c.ticker}</span>
                    <span class="panel-rec-name">${c.name}</span>
                    <button class="btn-secondary panel-rec-analyze" onclick="analyzeFromPanel('${c.ticker}', '${(c.name || '').replace(/'/g, '')}')"><span class="ms">bar_chart</span> ${L('panel_analyze_stock')}</button>
                </div>
                <div class="panel-rec-body">
                    <div class="panel-rec-row">
                        <span class="panel-rec-label">${L('panel_support')}:</span>
                        <span>${(c.supporters || []).map(personaLabel).join(' · ')}</span>
                    </div>
                    ${(c.reasons || []).length > 0 ? `
                        <div class="panel-rec-row">
                            <span class="panel-rec-label">${L('panel_reason')}:</span>
                            <span>${(c.reasons || []).join(', ')}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');

    const disputedCards = disputed.length === 0 ? `<div class="caption muted">${L('panel_none')}</div>` :
        disputed.map(d => `
            <div class="panel-rec-card panel-rec-disputed">
                <div class="panel-rec-header">
                    <span class="panel-rec-ticker">${d.ticker}</span>
                    <span class="panel-rec-name">${d.name}</span>
                    <button class="btn-secondary panel-rec-analyze" onclick="analyzeFromPanel('${d.ticker}', '${(d.name || '').replace(/'/g, '')}')"><span class="ms">bar_chart</span> ${L('panel_analyze_stock')}</button>
                </div>
                <div class="panel-rec-body">
                    <div class="panel-rec-row panel-rec-for">
                        <span class="panel-rec-label">${L('panel_for')} (${(d.for_side || []).map(personaLabel).join(', ')}):</span>
                        <span>${(d.for_reasons || []).join(', ')}</span>
                    </div>
                    <div class="panel-rec-row panel-rec-against">
                        <span class="panel-rec-label">${L('panel_against')} (${(d.against_side || []).map(personaLabel).join(', ')}):</span>
                        <span>${(d.against_reasons || []).join(', ')}</span>
                    </div>
                    ${d.next_question ? `
                        <div class="panel-rec-row">
                            <span class="panel-rec-label">${L('panel_next_q')}:</span>
                            <span>${d.next_question}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');

    const orphanCards = orphan.length === 0 ? `<div class="caption muted">${L('panel_none')}</div>` :
        orphan.map(o => `
            <div class="panel-rec-card panel-rec-orphan">
                <div class="panel-rec-header">
                    <span class="panel-rec-ticker">${o.ticker}</span>
                    <span class="panel-rec-name">${o.name}</span>
                    <button class="btn-secondary panel-rec-analyze" onclick="analyzeFromPanel('${o.ticker}', '${(o.name || '').replace(/'/g, '')}')"><span class="ms">bar_chart</span> ${L('panel_analyze_stock')}</button>
                </div>
                <div class="panel-rec-body">
                    <div class="panel-rec-row">
                        <span class="panel-rec-label">${personaLabel(o.supporter)}:</span>
                        <span>${o.reason || ''}</span>
                    </div>
                </div>
            </div>
        `).join('');

    return `
        <h3 class="subheader"><span class="ms green">check_circle</span> ${L('panel_consensus')}</h3>
        <div class="panel-rec-list">${consensusCards}</div>

        <h3 class="subheader mt-16"><span class="ms orange">help_center</span> ${L('panel_disputed')}</h3>
        <div class="panel-rec-list">${disputedCards}</div>

        <h3 class="subheader mt-16"><span class="ms">lightbulb</span> ${L('panel_orphan')}</h3>
        <div class="panel-rec-list">${orphanCards}</div>
    `;
}


// ──────────────────────────────────────────
// 토론 로그 렌더 (접이식)
// ──────────────────────────────────────────
function renderPanelRounds(rounds) {
    return rounds.map(r => {
        const phaseLabel = {
            individual: L('panel_round1'),
            critique:   `Round ${r.round_num} · ${L('panel_round_critique')}`,
            moderator:  `Round ${r.round_num} · ${L('panel_round_moderator')}`,
        }[r.phase] || `Round ${r.round_num} · ${r.phase}`;

        if (r.phase === 'moderator' && r.synthesis) {
            const s = r.synthesis;
            const score = Math.round((s.convergence_score || 0) * 100);
            return `
                <div class="panel-round panel-round-moderator">
                    <div class="panel-round-header">${phaseLabel} · 수렴 ${score}%</div>
                    <div class="panel-round-moderator-summary">
                        <div>합의: ${(s.consensus || []).map(c => c.ticker).join(', ') || '-'}</div>
                        <div>논쟁: ${(s.disputed || []).map(d => d.ticker).join(', ') || '-'}</div>
                        <div>단독: ${(s.orphan || []).map(o => o.ticker).join(', ') || '-'}</div>
                    </div>
                </div>
            `;
        }

        const bubbles = (r.outputs || []).map(o => `
            <div class="panel-bubble">
                <div class="panel-bubble-header">
                    <span class="panel-bubble-emoji">${o.emoji || ''}</span>
                    <span class="panel-bubble-name">${o.persona_name}</span>
                    <span class="caption muted">in:${o.tokens_in} out:${o.tokens_out}</span>
                </div>
                <div class="panel-bubble-body">${escapeHtml(o.content).replace(/\n/g, '<br>')}</div>
            </div>
        `).join('');

        return `
            <div class="panel-round">
                <div class="panel-round-header">${phaseLabel}</div>
                ${bubbles}
            </div>
        `;
    }).join('');
}


// ──────────────────────────────────────────
// 헬퍼: 종목 분석 탭으로 이동 (기존 analyzeFromAnywhere 가 있으면 그것 사용)
// ──────────────────────────────────────────
function analyzeFromPanel(ticker, name) {
    if (typeof analyzeFromAnywhere === 'function') {
        analyzeFromAnywhere(ticker, name);
        return;
    }
    // Fallback: Tab 1 로 전환 + 검색 입력
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
