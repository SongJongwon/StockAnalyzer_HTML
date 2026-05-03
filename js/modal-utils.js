/* ==========================================================================
 * NexusModal — 사이트 전체 모달 body 스크롤 잠금 유틸리티
 *
 * 사용:
 *   NexusModal.lock();    // 모달 열 때 호출 — 카운터 +1, 0→1 전환 시 body 잠금
 *   NexusModal.unlock();  // 모달 닫을 때 호출 — 카운터 -1, 1→0 전환 시 body 잠금 해제
 *
 * 카운터 방식이라 모달이 중첩되어 열려도 안전 (마지막 모달 닫힐 때만 해제).
 * 실제 잠금은 `body.modal-open { overflow: hidden }` CSS 클래스로 처리 —
 * style.css 와 맞물려 동작.
 *
 * 의존성: 없음. 모든 다른 스크립트보다 먼저 로드되어도 무관.
 * ========================================================================== */
(function () {
    'use strict';

    if (window.NexusModal) return;  // 중복 로드 가드 (legal 페이지 등에서 우연히 두 번 include 시)

    let _openCount = 0;

    function lock() {
        _openCount += 1;
        if (_openCount === 1) {
            document.body.classList.add('modal-open');
        }
    }

    function unlock() {
        if (_openCount <= 0) return;  // pair mismatch 보호 — 음수 방지
        _openCount -= 1;
        if (_openCount === 0) {
            document.body.classList.remove('modal-open');
        }
    }

    function isLocked() { return _openCount > 0; }
    function getOpenCount() { return _openCount; }

    /** 디버그용 — 페이지 상태 꼬임 시 강제 해제 (정상 흐름에서는 불필요) */
    function reset() {
        _openCount = 0;
        document.body.classList.remove('modal-open');
    }

    window.NexusModal = { lock, unlock, isLocked, getOpenCount, reset };
})();
