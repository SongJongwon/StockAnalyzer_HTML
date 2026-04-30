/**
 * Phase 4 — BYOK 단일 진실 저장소 (frontend).
 *
 * 모든 BYOK 키는 서버 (user_api_keys 테이블, AES-256-GCM 암호화) 에만 저장됨.
 * 이 모듈은:
 *   - 메타데이터 (provider / key_hint / is_active / last_used_at) 만 메모리 캐시
 *   - 평문 키는 절대 frontend 에 보관하지 않음 (입력 시점 → 즉시 서버 POST → 메모리에서 폐기)
 *   - 호출 (panel/discuss, /ai-analysis) 은 backend 가 user_api_keys 에서 자동 조회 (DB 폴백)
 *
 * 사용처:
 *   - 홈 화면 모달 (app.js)
 *   - mypage BYOK 카드 (mypage.html)
 *   - 두 곳이 같은 캐시 + 같은 endpoint 사용 → 단일 진실
 *
 * NexusByok 글로벌:
 *   ── 동기 조회 (캐시) ──
 *     listProviders()                — [{id, label, placeholder}] BYOK_PROVIDERS 목록
 *     listKeys()                     — 캐시된 메타 배열 [{provider, key_hint, is_active, last_used_at}]
 *     getKey(providerId)             — 메타 객체 또는 null
 *     isConfigured(providerId)       — 등록 여부
 *     isActive(providerId)           — is_active && 등록
 *     getKeyHint(providerId)         — key_hint or ''
 *     getStatus()                    — { ready, byok_configured, dev_mode, error?, count }
 *     getActiveCount()               — 활성 키 수
 *
 *   ── 변경 (async, 서버 호출) ──
 *     async init()                   — 페이지 로드 시 1회 호출. 서버 GET + localStorage 마이그레이션 prompt
 *     async refresh()                — 서버 재조회
 *     async save(providerId, key)    — POST. 성공 시 캐시 갱신 + 옵저버 알림
 *     async remove(providerId)       — DELETE
 *     async setActive(providerId, b) — PATCH
 *
 *   ── 옵저버 ──
 *     on(event, handler)             — 'change' 발생 시 호출. handler 인자 = 새 listKeys()
 *     off(event, handler)
 */
(function () {
    'use strict';

    const PROVIDERS = [
        { id: 'anthropic', label: 'Anthropic Claude', placeholder: 'sk-ant-api03-...' },
        { id: 'openai',    label: 'OpenAI GPT',       placeholder: 'sk-proj-...' },
        { id: 'gemini',    label: 'Google Gemini',    placeholder: 'AIza...' },
        { id: 'groq',      label: 'Groq (무료)',      placeholder: 'gsk_...' },
    ];
    const PROVIDER_IDS = PROVIDERS.map(p => p.id);

    // ── 마이그레이션: 기존 localStorage 키 (Phase 3 이전) ──────
    const LEGACY_KEYS = {
        anthropic: 'sa_key_anthropic',
        openai:    'sa_key_openai',
        gemini:    'sa_key_gemini',
        groq:      'sa_key_groq',
    };
    const LEGACY_ENABLED_PREFIX = 'sa_key_';   // sa_key_<id>_enabled
    const MIGRATION_DONE_FLAG   = 'sa_byok_migrated_to_server';

    // ── 캐시 ───────────────────────────────────────────────
    let _cache = [];                  // [{provider, key_hint, is_active, last_used_at, ...}]
    let _status = {
        ready: false,
        byok_configured: false,
        dev_mode: false,
        error: null,
        count: 0,
    };
    let _initPromise = null;
    const _listeners = new Map();     // event → Set<handler>

    function _emit(event) {
        const set = _listeners.get(event);
        if (!set) return;
        const snap = listKeys();
        set.forEach(h => { try { h(snap); } catch (e) { console.error(`[NexusByok] ${event} handler 오류:`, e); } });
    }

    function _setStatus(patch) {
        _status = Object.assign({}, _status, patch);
        _status.count = _cache.length;
    }

    // ── 다중 탭/페이지 동기화 ──────────────────────────────
    // BroadcastChannel: 같은 origin 의 모든 탭에 변경 통보 (Chrome 54+, FF 38+, Safari 15.4+).
    // focus 이벤트: 탭 활성화 시 best-effort refresh (BroadcastChannel 미지원 폴백 + 안전망).
    // storage 이벤트: localStorage 변경 → 폴백 (BroadcastChannel 가용 시 무시).
    const _SYNC_CHANNEL_NAME = 'nexus-byok-sync';
    const _SYNC_STORAGE_KEY  = 'sa_byok_sync_at';
    let _syncChannel = null;

    try {
        if (typeof BroadcastChannel !== 'undefined') {
            _syncChannel = new BroadcastChannel(_SYNC_CHANNEL_NAME);
            _syncChannel.onmessage = (ev) => {
                if (!ev || !ev.data || ev.data.type !== 'byok_changed') return;
                // 자기 자신이 broadcast 한 메시지는 무시 (이미 캐시 갱신됨)
                if (ev.data.origin === _instanceId) return;
                refresh().catch(() => { /* 옵저버가 error 처리 */ });
            };
        }
    } catch (e) { /* BroadcastChannel 미지원 또는 차단 — 무시 */ }

    // 인스턴스 식별자 (같은 origin 내 탭 구분)
    const _instanceId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    function _broadcastChange() {
        try {
            if (_syncChannel) {
                _syncChannel.postMessage({ type: 'byok_changed', origin: _instanceId, ts: Date.now() });
            } else {
                // BroadcastChannel 미지원 → localStorage 의 sync 키 토글로 storage 이벤트 트리거
                localStorage.setItem(_SYNC_STORAGE_KEY, String(Date.now()));
            }
        } catch (e) { /* ignore */ }
    }

    // storage 이벤트 (BroadcastChannel 폴백 + 안전망)
    window.addEventListener('storage', (ev) => {
        if (ev.key !== _SYNC_STORAGE_KEY) return;
        refresh().catch(() => {});
    });

    // 탭 활성화 시 best-effort refresh — 사용자가 다른 탭에서 변경 후 돌아온 케이스
    window.addEventListener('focus', () => {
        if (_status.ready && !_status.error) {
            refresh().catch(() => {});
        }
    });

    // ── 서버 호출 ──────────────────────────────────────────
    async function _serverList() {
        return await NexusAuth.apiFetch('/api/auth/api-keys', { auth: true });
    }
    async function _serverSave(provider, key) {
        return await NexusAuth.apiFetch('/api/auth/api-keys', {
            method: 'POST', auth: true,
            body: { provider, key },
        });
    }
    async function _serverDelete(provider) {
        return await NexusAuth.apiFetch(`/api/auth/api-keys/${provider}`, {
            method: 'DELETE', auth: true,
        });
    }
    async function _serverPatch(provider, isActive) {
        return await NexusAuth.apiFetch(`/api/auth/api-keys/${provider}`, {
            method: 'PATCH', auth: true,
            body: { is_active: isActive },
        });
    }

    // ── 동기 조회 ─────────────────────────────────────────
    function listProviders() { return PROVIDERS.slice(); }
    function listKeys()      { return _cache.slice(); }
    function getKey(id)      { return _cache.find(k => k.provider === id) || null; }
    function isConfigured(id){ return !!getKey(id); }
    function isActive(id)    { const k = getKey(id); return !!(k && k.is_active !== false); }
    function getKeyHint(id)  { const k = getKey(id); return k ? (k.key_hint || '') : ''; }
    function getStatus()     { return Object.assign({}, _status); }
    function getActiveCount(){ return _cache.filter(k => k.is_active !== false).length; }

    // ── 마이그레이션: localStorage → 서버 ──────────────────
    function _findLegacyKeys() {
        const found = [];
        for (const id of PROVIDER_IDS) {
            const v = (localStorage.getItem(LEGACY_KEYS[id]) || '').trim();
            if (v && v.length >= 8) {
                found.push({ provider: id, key: v });
            }
        }
        return found;
    }

    function _clearLegacyKeys() {
        for (const id of PROVIDER_IDS) {
            localStorage.removeItem(LEGACY_KEYS[id]);
            localStorage.removeItem(LEGACY_ENABLED_PREFIX + id + '_enabled');
        }
    }

    async function _maybeMigrate() {
        if (localStorage.getItem(MIGRATION_DONE_FLAG)) return;
        if (!_status.byok_configured) return;
        if (_status.dev_mode) return;
        const legacy = _findLegacyKeys();
        if (!legacy.length) {
            // 마이그레이션 대상 없음 → 플래그만 세팅 (다음 새로고침에서 prompt 안 뜨도록)
            localStorage.setItem(MIGRATION_DONE_FLAG, '1');
            return;
        }

        const providerNames = legacy.map(l => {
            const p = PROVIDERS.find(p => p.id === l.provider);
            return p ? p.label : l.provider;
        }).join(', ');

        const ok = window.confirm(
            `브라우저에 저장된 AI 키 ${legacy.length}개 (${providerNames}) 가 있습니다.\n\n` +
            `이를 서버에 AES-256 암호화로 안전하게 옮길까요? ` +
            `(이전 후 모든 기기에서 동기화되며, 브라우저의 평문 키는 즉시 삭제됩니다.)\n\n` +
            `[확인] 서버로 이전 + 브라우저 정리\n[취소] 일단 취소 (다음에 다시 묻지 않음)`
        );

        if (!ok) {
            // 사용자 명시적 거부 → 다시 묻지 않음. 단 legacy 키는 그대로 두면 모달이 비교 어려우니 같이 정리.
            // (호환을 원하면 _clearLegacyKeys() 생략 가능 — 현재는 명확성을 위해 정리)
            _clearLegacyKeys();
            localStorage.setItem(MIGRATION_DONE_FLAG, '1');
            return;
        }

        let migrated = 0;
        const errors = [];
        for (const { provider, key } of legacy) {
            try {
                await _serverSave(provider, key);
                migrated++;
            } catch (e) {
                errors.push(`${provider}: ${e.message || e}`);
            }
        }

        if (errors.length) {
            alert(`서버 이전 ${migrated}/${legacy.length} 성공.\n실패:\n${errors.join('\n')}\n\n실패한 키는 브라우저에 남겨둡니다.`);
            // 성공한 것만 클리어 — 부분 실패 시 사용자가 mypage 에서 직접 등록 가능
            for (const { provider } of legacy.slice(0, migrated)) {
                localStorage.removeItem(LEGACY_KEYS[provider]);
                localStorage.removeItem(LEGACY_ENABLED_PREFIX + provider + '_enabled');
            }
        } else {
            _clearLegacyKeys();
            localStorage.setItem(MIGRATION_DONE_FLAG, '1');
            console.log(`[NexusByok] 마이그레이션 ${migrated}건 완료, 브라우저 키 정리됨`);
        }

        // 캐시 새로고침
        await refresh();
    }

    // ── 변경 (async) ──────────────────────────────────────
    async function init() {
        if (_initPromise) return _initPromise;
        _initPromise = (async () => {
            try {
                if (!window.NexusAuth || !NexusAuth.getAccessToken()) {
                    // 비로그인 — 캐시 비우고 status 만 갱신
                    _cache = [];
                    _setStatus({ ready: true, byok_configured: false, dev_mode: false, error: 'not_authenticated' });
                    _emit('change');
                    return;
                }
                const r = await _serverList();
                _cache = (r.items || []).slice();
                _setStatus({
                    ready: true,
                    byok_configured: !!r.byok_configured,
                    dev_mode: !!r.dev_mode,
                    error: null,
                });
                _emit('change');
                await _maybeMigrate();
            } catch (e) {
                _cache = [];
                _setStatus({ ready: true, byok_configured: false, dev_mode: false, error: String(e.message || e) });
                _emit('change');
                console.warn('[NexusByok] init 실패:', e);
            }
        })();
        return _initPromise;
    }

    async function refresh() {
        try {
            const r = await _serverList();
            _cache = (r.items || []).slice();
            _setStatus({
                ready: true,
                byok_configured: !!r.byok_configured,
                dev_mode: !!r.dev_mode,
                error: null,
            });
            _emit('change');
            return _cache.slice();
        } catch (e) {
            _setStatus({ error: String(e.message || e) });
            _emit('change');
            throw e;
        }
    }

    async function save(providerId, plainKey) {
        const id = (providerId || '').toLowerCase();
        if (!PROVIDER_IDS.includes(id)) throw new Error(`알 수 없는 provider: ${providerId}`);
        if (!plainKey || plainKey.trim().length < 8) throw new Error('키가 너무 짧습니다 (최소 8자).');
        await _serverSave(id, plainKey.trim());
        await refresh();
        _broadcastChange();
    }

    async function remove(providerId) {
        const id = (providerId || '').toLowerCase();
        if (!PROVIDER_IDS.includes(id)) throw new Error(`알 수 없는 provider: ${providerId}`);
        await _serverDelete(id);
        await refresh();
        _broadcastChange();
    }

    async function setActive(providerId, isActiveBool) {
        const id = (providerId || '').toLowerCase();
        if (!PROVIDER_IDS.includes(id)) throw new Error(`알 수 없는 provider: ${providerId}`);
        await _serverPatch(id, !!isActiveBool);
        await refresh();
        _broadcastChange();
    }

    // ── 옵저버 ────────────────────────────────────────────
    function on(event, handler) {
        if (!_listeners.has(event)) _listeners.set(event, new Set());
        _listeners.get(event).add(handler);
    }
    function off(event, handler) {
        const set = _listeners.get(event);
        if (set) set.delete(handler);
    }

    // ── export ────────────────────────────────────────────
    window.NexusByok = {
        listProviders,
        listKeys,
        getKey,
        isConfigured,
        isActive,
        getKeyHint,
        getStatus,
        getActiveCount,
        init,
        refresh,
        save,
        remove,
        setActive,
        on,
        off,
    };
})();
