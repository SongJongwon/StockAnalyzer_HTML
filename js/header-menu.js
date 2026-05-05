/* ==========================================================================
 * Phase 9 PR-9B — 헤더 진입 버튼 공유 모듈
 *
 * 역할:
 *   - 페이지 내 모든 .portfolio-link 요소에 active 클래스 자동 적용
 *     (현재 URL 이 portfolio.html 이면)
 *   - 비로그인 사용자에게는 .portfolio-link 숨김 (NexusAuth 의존)
 *
 * 마크업 패턴 (각 페이지에서 직접 추가):
 *   <a class="portfolio-link" href="portfolio.html">
 *     📊<span class="portfolio-link-label">포트폴리오</span>
 *   </a>
 *
 * 스타일은 portfolio.css 의 .portfolio-link 가 담당 (다크/라이트 + 호버 + 모바일).
 *
 * 의존: auth.js (NexusAuth) — 로그인 상태 체크
 * ========================================================================== */
(function () {
    'use strict';

    if (window._portfolioHeaderMenuMounted) return;
    window._portfolioHeaderMenuMounted = true;

    const PORTFOLIO_PATH_RE = /portfolio\.html(\?|#|$)/;

    function isPortfolioPage() {
        return PORTFOLIO_PATH_RE.test(location.pathname + location.search + location.hash);
    }

    async function isAuthed() {
        if (!window.NexusAuth) return false;
        try {
            const token = NexusAuth.getAccessToken();
            if (token) return true;
            const dev = await NexusAuth.getDevStatus();
            return !!(dev && dev.dev_mode);
        } catch (_) {
            return false;
        }
    }

    async function applyAll() {
        const links = document.querySelectorAll('.portfolio-link');
        if (!links.length) return;

        const active = isPortfolioPage();
        const authed = await isAuthed();

        links.forEach((el) => {
            // active 자동 토글
            if (active) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
            // 비로그인 시 숨김 (포트폴리오는 로그인 필수 기능)
            el.hidden = !authed;
            if (!el.getAttribute('aria-label')) {
                el.setAttribute('aria-label', '포트폴리오');
            }
        });
    }

    // 1) 즉시 시도 (이미 DOM 준비된 케이스)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyAll);
    } else {
        applyAll();
    }

    // 2) 동적 헤더 (index.html 의 nexusUserMenu IIFE 가 비동기 mount) 대응 —
    //    MutationObserver 로 .portfolio-link 가 나중에 추가돼도 자동 처리.
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType !== 1) continue;
                if (node.classList && node.classList.contains('portfolio-link')) {
                    applyAll();
                    return;
                }
                if (node.querySelector && node.querySelector('.portfolio-link')) {
                    applyAll();
                    return;
                }
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 외부에서 강제 재실행 가능 (로그인/로그아웃 후 등)
    window.NexusPortfolioMenu = { refresh: applyAll };
})();
