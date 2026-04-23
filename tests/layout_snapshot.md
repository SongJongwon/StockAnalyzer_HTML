# 레이아웃 스냅샷 — StockAnalyzer B

> **기준 커밋**: `911c31e` (2026-04-16)  
> **목적**: 레이아웃이 깨졌을 때 복구 기준으로 사용  
> **소스**: `frontend/css/layout.css` (레이아웃 전용 파일)

---

## 1. 전체 앱 구조

```
<body>
  └── .app-layout  (display: flex)
        ├── .sidebar  (width: 21rem, sticky)
        └── main      (flex: 1, padding: 2.75rem 3rem 7rem 3rem)
```

- `.app-layout`: `display: flex`, `min-height: 100vh`
- `.sidebar`: `width: 21rem`, `min-width: 21rem`, `height: 100vh`, `position: sticky; top: 0`
- `.sidebar.collapsed`: `width: 0`, `min-width: 0`, `overflow: hidden`
- `main`: `flex: 1`, `padding: 2.75rem 3rem 7rem 3rem`, `min-width: 0`

---

## 2. 탭 네비게이션

- `.tabs`: `display: flex`, `gap: 0`, `margin-bottom: 1rem`
- `.tab-content`: `display: none` / `.tab-content.active`: `display: block`
- `.sub-tabs` (단기/스윙/장기): `display: flex`, `gap: 0`, `margin-bottom: 16px`
- `.sub-tab-content`: `display: none` / `.sub-tab-content.active`: `display: block`

---

## 3. Tab 1 — 종목 분석

### 검색 바
- `.search-row`: `display: grid`, `grid-template-columns: 3fr 1fr`, `gap: 0.5rem`

### 지표 카드 (5열)
- `.indicators-grid`: `display: grid`, `grid-template-columns: repeat(5, 1fr)`, `gap: 14px`
- `.indicator-card`: `display: flex`, `flex-direction: column`, `align-items: center`, `justify-content: center`, `min-height: 145px`

### 메트릭 카드 행 (4열)
- `.metrics-row`: `display: grid`, `grid-template-columns: repeat(4, 1fr)`, `gap: 0.75rem`

### 매매 전략 카드
- `.strategy-grid` (5열: 매수목표·1차·2차·손절·R/R): `display: grid`, `grid-template-columns: repeat(5, 1fr)`, `gap: 12px`
- `.strategy-grid-4` (4열: 현재가·1차목표·2차목표·손절): `display: grid`, `grid-template-columns: repeat(4, 1fr)`, `gap: 12px`
- `.strategy-card`: `display: flex`, `flex-direction: column`, `align-items: center`, `justify-content: center`, `min-height: 115px`

### 손익비 바
- `.rr-bar`: `display: flex`, `gap: 18px`, `flex-wrap: wrap`

### 피보나치 되돌림 (7열)
- `.fib-grid`: `display: grid`, `grid-template-columns: repeat(7, 1fr)`, `gap: 8px`

### 시나리오 카드 (3열)
- `.scenario-grid`: `display: grid`, `grid-template-columns: repeat(3, 1fr)`, `gap: 12px`

### 재무제표
- `.fin-val-grid` (밸류에이션 6열): `display: grid`, `grid-template-columns: repeat(6, 1fr)`, `gap: 8px`
- `.fin-3col` (수익성·성장성·안정성 3열): `display: grid`, `grid-template-columns: repeat(3, 1fr)`, `gap: 16px`
- `.dcf-layout`: `display: grid`, `grid-template-columns: 2fr 1fr`, `gap: 16px`

### 내 매수가 분석 폼
- `.my-buy-row`: `display: grid`, `grid-template-columns: 1.4fr 1.5fr 1.2fr`, `gap: 0.75rem`, `align-items: end`

---

## 4. Tab 2 — 추천 종목

- `.wl-table`: `width: 100%`, `border-collapse: collapse`

---

## 5. Tab 3 — 테마주

- `.theme-grid` (버튼 4열): `display: grid`, `grid-template-columns: repeat(4, 1fr)`, `gap: 8px`
- `.theme-table`: `width: 100%`, `border-collapse: collapse`

---

## 6. Tab 4 — 글로벌 시장 & 뉴스

- `.indices-grid` (4열): `display: grid`, `grid-template-columns: repeat(4, 1fr)`, `gap: 8px`

---

## 7. 반응형 브레이크포인트

| 뷰포트 | 변경되는 그리드 |
|--------|----------------|
| ≤ 1200px | indicators 3열, strategy 3열, fin-val 3열, fib 4열, indices 3열 |
| ≤ 900px | app-layout 세로 전환, sidebar 전체폭, search-row 1열, metrics 2열, indicators 2열, strategy/strategy-4 2열, scenario 1열, theme 2열, indices 2열, fin-3col 1열, dcf-layout 1열, fib 3열 |
| ≤ 600px | metrics 1열, indicators 1열, theme 1열, indices 1열, fib 2열 |

---

## 복구 방법

레이아웃이 깨진 경우:

1. `frontend/css/layout.css` 내용을 이 문서와 대조
2. 변경된 속성 확인 후 복원
3. `style.css`의 동일 셀렉터에 충돌 규칙이 있는지 확인
4. `layout.css`는 `style.css` 이후에 로드되므로 같은 명시도일 경우 layout.css가 우선
