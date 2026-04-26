/**
 * Nexus Alpha — Phase 1 인증 클라이언트 유틸
 *
 *   전역 객체: window.NexusAuth
 *
 *   로컬(localhost:8000) 에서는 백엔드 정적 서빙 + 같은 오리진이므로 CORS 없음.
 *   운영 배포에서는 프론트(GitHub Pages) ↔ 백엔드(Render) 도메인 분리 → API_BASE 에 백엔드 절대 URL.
 */
(function (global) {
    'use strict';

    // ─── API_BASE : 호스트명 기반 자동 전환 ────────────────
    const IS_LOCALHOST = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    const API_BASE = IS_LOCALHOST
        ? 'http://localhost:8000'
        : 'https://stockanalyzer-backend.onrender.com';

    const STORAGE = {
        ACCESS: 'nexus_access_token',
        REFRESH: 'nexus_refresh_token',
        USER: 'nexus_user',
    };

    // ─── 토큰 관리 ──────────────────────────────────────
    function getAccessToken() { return localStorage.getItem(STORAGE.ACCESS); }
    function getRefreshToken() { return localStorage.getItem(STORAGE.REFRESH); }
    function getUser() {
        try { return JSON.parse(localStorage.getItem(STORAGE.USER) || 'null'); }
        catch { return null; }
    }
    function saveTokens(access, refresh, user) {
        if (access)  localStorage.setItem(STORAGE.ACCESS, access);
        if (refresh) localStorage.setItem(STORAGE.REFRESH, refresh);
        if (user)    localStorage.setItem(STORAGE.USER, JSON.stringify(user));
    }
    function clearTokens() {
        localStorage.removeItem(STORAGE.ACCESS);
        localStorage.removeItem(STORAGE.REFRESH);
        localStorage.removeItem(STORAGE.USER);
    }

    // ─── API 호출 래퍼 ──────────────────────────────────
    async function apiFetch(path, { method = 'GET', body = null, auth = false } = {}) {
        const headers = { 'Content-Type': 'application/json' };
        if (auth) {
            const tok = getAccessToken();
            if (tok) headers['Authorization'] = 'Bearer ' + tok;
        }
        const resp = await fetch(API_BASE + path, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null,
            credentials: 'omit',  // 쿠키 사용 안 함 (JWT 방식)
        });
        let data = null;
        try { data = await resp.json(); } catch { /* 응답 body 없을 수 있음 */ }
        if (!resp.ok) {
            const msg = (data && (data.detail || data.message)) || ('HTTP ' + resp.status);
            throw new Error(msg);
        }
        return data;
    }

    // ─── DEV 상태 확인 + 자동 리다이렉트 ────────────────
    let _devStatusCache = null;

    // localStorage 에 남은 DEV fake_user 흔적인지 판정 (id=000...0 또는 dev_mode 플래그)
    function _isStaleDevUser(u) {
        if (!u || typeof u !== 'object') return false;
        if (u.dev_mode === true) return true;
        if (typeof u.id === 'string' && u.id.startsWith('00000000-0000-0000-0000-')) return true;
        if (u.email === 'dev@nexus.local') return true;
        return false;
    }

    async function getDevStatus() {
        if (_devStatusCache) return _devStatusCache;
        try {
            _devStatusCache = await apiFetch('/api/auth/dev-status');
        } catch {
            _devStatusCache = { dev_mode: false, env: 'unknown' };
        }

        // 디버그 로그 — 사용자/개발자가 DevTools 콘솔에서 즉시 확인 가능
        try {
            console.log('[NexusAuth] dev-status:', _devStatusCache, '· API_BASE:', API_BASE);
        } catch { /* ignore */ }

        // 🧹 prod 환경에서 token 없는데 stale DEV fake_user 가 localStorage 에 남아있으면 자동 정리.
        //    원인: 이전에 로컬 DEV_MODE 로 접속했을 때 fake_user 가 저장되었거나,
        //          *.github.io 도메인에서 임시로 dev_mode 응답을 받았던 경우.
        //    이대로 두면 비로그인 분기 대신 "dev@nexus.local · VIP" 가 표시되어 DEV 화면처럼 보임.
        if (!_devStatusCache.dev_mode) {
            const u = getUser();
            if (_isStaleDevUser(u) && !getAccessToken()) {
                console.warn('[NexusAuth] prod 환경에서 stale DEV fake_user 감지 → localStorage 정리:', u && u.email);
                clearTokens();
            }
        }

        return _devStatusCache;
    }

    async function checkAndRedirectIfDev() {
        const overlay = document.getElementById('devLoadingOverlay');
        const s = await getDevStatus();
        if (!s.dev_mode) return false;

        // 로딩 오버레이 표시 후 짧게 대기 → 메인 진입
        if (overlay) overlay.hidden = false;
        console.warn('%c🔓 DEV MODE', 'background:#facc15;color:#000;padding:2px 8px;border-radius:3px;font-weight:bold;',
            'localhost/사설망에서 자동 로그인됨. Fake user:', s.fake_user);
        // DEV 모드에서는 가짜 토큰 대신 "dev 세션" 표시 — 백엔드가 모든 요청을 IP 기반 바이패스 처리
        localStorage.setItem(STORAGE.USER, JSON.stringify(s.fake_user || {}));
        setTimeout(() => { window.location.replace('index.html'); }, 400);
        return true;
    }

    // ─── 상단 노란 DEV 배너 삽입 ────────────────────────
    async function installDevBannerIfNeeded() {
        const s = await getDevStatus();
        if (!s.dev_mode) return;
        if (document.getElementById('nexusDevBanner')) return;
        const user = s.fake_user || {};
        const bar = document.createElement('div');
        bar.id = 'nexusDevBanner';
        bar.textContent =
            '🔓 DEV MODE — 자동 로그인 (' +
            (user.email || 'dev') + ' · plan: ' + (user.plan || '?') +
            ')  ·  배포 환경에서는 비활성화됩니다';
        Object.assign(bar.style, {
            position: 'sticky', top: '0', zIndex: '9999',
            background: '#facc15', color: '#1f2937',
            padding: '6px 12px', textAlign: 'center',
            fontSize: '12px', fontWeight: '600',
            borderBottom: '1px solid #a16207',
        });
        document.body.insertBefore(bar, document.body.firstChild);
    }

    // ─── 회원가입·로그인·로그아웃 ───────────────────────
    async function signup(payload) {
        const data = await apiFetch('/api/auth/signup', { method: 'POST', body: payload });
        saveTokens(data.access_token, data.refresh_token, data.user);
        return data;
    }
    async function login(payload) {
        const data = await apiFetch('/api/auth/login', { method: 'POST', body: payload });
        saveTokens(data.access_token, data.refresh_token, data.user);
        return data;
    }
    async function logout() {
        try { await apiFetch('/api/auth/logout', { method: 'POST', auth: true }); } catch { /* ignore */ }
        clearTokens();
    }
    async function refresh() {
        const rt = getRefreshToken();
        if (!rt) throw new Error('refresh 토큰이 없습니다.');
        const data = await apiFetch('/api/auth/refresh', { method: 'POST', body: { refresh_token: rt } });
        saveTokens(data.access_token, data.refresh_token, data.user);
        return data;
    }

    // ─── 페이지 보호 (Phase 2+ 에서 기존 index.html 등에서 호출) ─
    async function requireAuth() {
        const s = await getDevStatus();
        if (s.dev_mode) return s.fake_user;  // DEV 면 통과
        if (!getAccessToken()) {
            window.location.replace('login.html');
            throw new Error('no auth');
        }
        return getUser();
    }

    // ─── 노출 ───────────────────────────────────────────
    global.NexusAuth = {
        API_BASE,
        IS_LOCALHOST,
        getAccessToken, getRefreshToken, getUser,
        saveTokens, clearTokens,
        apiFetch,
        getDevStatus, checkAndRedirectIfDev, installDevBannerIfNeeded,
        signup, login, logout, refresh,
        requireAuth,
    };
})(window);
