/**
 * theme.js — 라이트/다크 테마 공용 모듈 (index 외 페이지용)
 *
 * - localStorage `sa_theme` 키를 index.html (3-state: system/light/dark) 와 공유
 * - 본 모듈은 2-state 토글만 노출 (light ↔ dark). 'system' 값은 prefers-color-scheme 으로 폴백 후 그대로 유지.
 * - <head> 끝부분에 동기 로드 권장 — DOMContentLoaded 전에 data-theme 속성 적용 (FOUC 방지)
 * - HTML 어디든 <button class="theme-toggle"> 두면 자동 바인딩
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'sa_theme';
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    function readStored() {
        try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    }

    function writeStored(v) {
        try { localStorage.setItem(STORAGE_KEY, v); } catch (e) { /* private mode 등 */ }
    }

    // 효과적 다크 여부 — 'system' / null 은 OS 설정 따라감
    function isEffectiveDark(stored) {
        if (stored === 'dark') return true;
        if (stored === 'light') return false;
        return prefersDark.matches;  // 'system' or null
    }

    function applyDataTheme() {
        var stored = readStored();
        var dark = isEffectiveDark(stored);
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
        return dark;
    }

    // ── 즉시 적용 (FOUC 방지) ─────────────────────────────────
    // documentElement 가 이미 있으므로 DOMContentLoaded 기다리지 않음
    applyDataTheme();

    // ── 토글 버튼 바인딩 + 아이콘 갱신 ─────────────────────
    function syncToggleIcon(btn, dark) {
        // data-icon-light / data-icon-dark 속성으로 커스터마이징 가능
        var lightIcon = btn.getAttribute('data-icon-light') || '🌙';  // 다크 → 클릭 시 라이트로
        var darkIcon  = btn.getAttribute('data-icon-dark')  || '☀️';  // 라이트 → 클릭 시 다크로
        btn.textContent = dark ? lightIcon : darkIcon;
        btn.setAttribute('aria-label', dark ? '라이트 모드로 전환' : '다크 모드로 전환');
        btn.setAttribute('title', btn.getAttribute('aria-label'));
    }

    function bindToggles() {
        var dark = isEffectiveDark(readStored());
        var btns = document.querySelectorAll('.theme-toggle');
        btns.forEach(function (btn) {
            syncToggleIcon(btn, dark);
            btn.addEventListener('click', function () {
                // 현재 effective 상태의 반대로 — 명시적 'light' 또는 'dark' 저장
                var nowDark = isEffectiveDark(readStored());
                var next = nowDark ? 'light' : 'dark';
                writeStored(next);
                applyDataTheme();
                // 모든 토글 버튼 아이콘 동기화
                document.querySelectorAll('.theme-toggle').forEach(function (b) {
                    syncToggleIcon(b, next === 'dark');
                });
            });
        });
    }

    // ── 외부 변경 동기화 ──────────────────────────────────────
    // (1) 다른 탭/창에서 sa_theme 변경 시
    window.addEventListener('storage', function (e) {
        if (e.key !== STORAGE_KEY) return;
        var dark = applyDataTheme();
        document.querySelectorAll('.theme-toggle').forEach(function (b) {
            syncToggleIcon(b, dark);
        });
    });

    // (2) OS 다크 설정 변경 시 — sa_theme 가 'system' 또는 null 일 때만
    prefersDark.addEventListener('change', function () {
        var stored = readStored();
        if (stored === 'light' || stored === 'dark') return;
        var dark = applyDataTheme();
        document.querySelectorAll('.theme-toggle').forEach(function (b) {
            syncToggleIcon(b, dark);
        });
    });

    // ── DOM ready 후 토글 바인딩 ──────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindToggles);
    } else {
        bindToggles();
    }

    // 글로벌 노출 (디버그 / 외부 호출용)
    window.NexusTheme = {
        get: function () { return readStored() || 'system'; },
        set: function (v) {
            if (v !== 'light' && v !== 'dark' && v !== 'system') return;
            if (v === 'system') {
                try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* */ }
            } else {
                writeStored(v);
            }
            applyDataTheme();
        },
        isDark: function () { return isEffectiveDark(readStored()); },
    };
})();
