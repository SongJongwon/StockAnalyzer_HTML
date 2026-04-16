/* ═══════════════════════════════════════════════════════════
   StockAnalyzer B - Frontend Application
   Complete JS matching A version functionality
   ═══════════════════════════════════════════════════════════ */

const API = "https://stockanalyzer-backend.onrender.com";

// ══════════════════════════════════════════════════════
// Language / i18n
// ══════════════════════════════════════════════════════
let currentLang = localStorage.getItem('lang') || 'ko';

const LANG = {
    ko: {
        // App
        app_title: '주식 기술적 분석기',
        // Tabs
        tab_analysis: '종목 분석', tab_watchlist: '추천 종목',
        tab_themes: '테마주', tab_global: '글로벌 시장 & 뉴스분석',
        // Sidebar
        auto_update: '자동 업데이트', news_hide: '뉴스 알림 숨기기',
        news_show: '뉴스 알림 보기', realtime_news: '실시간 뉴스 알림',
        news_caption: '출처: 네이버금융 · 인베스팅닷컴(한국어)',
        surge_stocks: '급등 예상 종목', latest_news: '최신 뉴스',
        news_refresh: '뉴스 새로고침', no_trigger: '현재 특별한 급등 트리거 없음',
        // Search
        ticker_input_label: '티커 또는 종목명 입력',
        ticker_placeholder: '예: 삼성전자, AAPL',
        period_label: '기간', analyze_btn: '분석하기',
        period_3mo: '3개월', period_6mo: '6개월', period_1y: '1년', period_2y: '2년',
        welcome_msg: '티커(AAPL) 또는 한글·영문 종목명 모두 검색 가능합니다.',
        // Signals (internal values stay Korean; these are display-only)
        buy: '매수', sell: '매도', neutral: '중립',
        strong_buy: '강한 매수', buy_lean: '매수 우세',
        strong_sell: '강한 매도', sell_lean: '매도 우세',
        // Price cards
        price: '현재가', high: '고가', low: '저가', volume: '거래량',
        krx_stock: '원화 종목 (KRX)', usd_stock: '달러 종목',
        // Verdict
        verdict_label: '종합 판단', buy_signals: '매수 신호', sell_signals: '매도 신호',
        // Analysis sections
        ai_analysis: 'AI 분석', analyzing: '분석 중...',
        ai_loading: 'AI 코멘트 불러오는 중...', company_loading: '회사 정보 로딩 중...',
        company_error: '회사 정보를 불러올 수 없습니다.',
        indicator_analysis: '지표별 분석', trading_strategy: '매매 전략',
        short_term: '단기 (1일~2주)', swing: '스윙 (2주~3개월)', long_term: '장기 (6개월~수년)',
        my_buy: '내 매수가 분석', chart_label: '차트',
        financials_title: '재무제표 분석', pdf_report: 'PDF 보고서 다운로드',
        disclaimer: '본 분석은 참고용이며 투자 권유가 아닙니다.',
        // Strategy advice
        advice_buy: '매수 고려 가능', advice_sell: '매수 비추천 (관망 또는 익절)',
        advice_neutral: '관망 (추세 확인 후 진입)',
        // RSI/indicator messages
        rsi_oversold: '과매도', rsi_overbought: '과매수',
        macd_up: '상승', macd_down: '하락',
        bb_lower: '하단 이탈 — 반등 기대', bb_upper: '상단 이탈 — 과열', bb_mid: '중간 범위',
        ma_up: '정배열 (MA20 > MA60)', ma_down: '역배열', ma_mixed: 'MA 혼조',
        // Strategy labels
        buy_target: '매수 목표가', target1: '1차 목표가', target2: '2차 목표가', stoploss: '손절 기준가',
        // Financials
        valuation: '밸류에이션', market_cap: '시가총액', div_yield: '배당수익률',
        profitability: '수익성', revenue_ttm: '매출 (TTM)',
        op_margin: '영업이익률', net_margin: '순이익률',
        growth: '성장성 & 현금흐름',
        rev_growth: '매출 성장률 (YoY)', earn_growth: '영업이익 성장률 (YoY)',
        op_cf: '영업현금흐름', fcf: '잉여현금흐름 (FCF)',
        stability: '안정성', debt_equity: '부채비율 (D/E)',
        current_ratio: '유동비율', interest_coverage: '이자보상배율',
        native_currency: '원본', unit_label: '단위',
        // Chart traces
        annual_chart: '연간 손익 & 현금흐름',
        c_revenue: '매출', c_op_income: '영업이익', c_net_income: '순이익', c_op_cf: '영업CF',
        unit_krw: '조원', unit_usd: '십억$',
        // Misc
        loading: '로딩 중...', no_data: '데이터 없음',
        full_analysis_btn: '차트 · 재무 전체 분석 보기',
        data_refresh: '데이터 새로고침',
        // Short-term strategy
        rsi_oversold_bounce: '과매도 → 반등', rsi_overbought_correct: '과매수 → 조정',
        rsi_neutral_zone: '중립 구간',
        bb_lower_support: '하단 근접 → 지지', bb_upper_hot: '상단 과열', bb_mid_range: '중간 구간',
        macd_golden: '골든크로스', macd_dead: '데드크로스',
        macd_up_trend: '상승 추세 유지', macd_down_trend: '하락 추세 유지',
        vwap_low: 'VWAP 하회 → 저평가', vwap_high: 'VWAP 상회 → 고평가', vwap_near: 'VWAP 근접',
        st_buy_zone: '단기 매수 구간', st_enter_check: '단기 진입 검토', watch_rec: '관망 권장',
        st_target_title: '단기 목표가 산출',
        entry_price: '진입가', current_price_label: '현재가', target1_short: '1차 목표',
        target2_short: '2차 목표', stoploss_line: '손절선',
        profit_ratio: '손익비', buy_signal_cnt: '매수신호',
        // Swing strategy
        fib_title: '피보나치 되돌림 (최근 60거래일)',
        ma_title: '20/60일 이동평균',
        swing_target_title: '스윙 목표가 산출 (손익비 1:2)',
        ma20_label: '20일 이평선', ma60_label: '60일 이평선', ma_status: '배열 상태',
        ma_golden: '정배열', ma_dead_arr: '역배열',
        vs_current_pct: '현재가 대비',
        fib_near: '◀ 현재근접', fib_support: '피보 지지', fib_resist: '피보 저항',
        swing_buy_zone: '스윙 매수 구간 (눌림목)', swing_avoid: '스윙 진입 비추천',
        swing_wait: '눌림목 대기',
        // Long-term strategy
        prof_title: '수익성 지표 (ROE · 영업이익률 · 이익성장률)',
        per_pbr_title: 'PER / PBR 기반 적정주가', dcf_title: 'DCF 내재가치 분석',
        excellent: '우수', good: '양호', poor: '부진', no_data_label: '데이터 없음',
        fcf_ps: 'FCF/주', pv_5y: 'PV (5년 FCF)', pv_term: 'PV (영구가치)',
        dcf_intrinsic: 'DCF 내재가치',
        dcf_no_fcf: 'FCF 데이터 없음. DCF 계산 불가.',
        fair_value_total: '종합 적정주가', per_pbr_avg: 'PER / PBR / DCF 평균',
        no_fin_data: '재무 데이터 부족으로 종합 평가 불가',
        strong_undervalue: '강한 저평가', undervalue_zone: '저평가 구간',
        fair_value: '적정 수준', overvalue_warn: '고평가 주의', strong_overvalue: '심한 고평가',
        per_fair: 'PER 적정주가', pbr_fair: 'PBR 적정주가', current_per_pbr: '현재 PER/PBR',
        dcf_strong_buy: '강한 매수 (30%+ 저평가)', dcf_buy: '매수 고려 (10%+ 저평가)',
        dcf_overvalue: '고평가 주의',
        // Watchlist
        wl_loading: '전체 종목 분석 중... (최초 로딩 30초 내외)',
        wl_error: '추천 종목을 불러올 수 없습니다.',
        wl_name: '종목', wl_price: '현재가', wl_change: '등락', wl_rsi: 'RSI',
        wl_entry: '매수 목표가', wl_target1: '1차 목표', wl_target2: '2차 목표',
        wl_short: '단기', wl_mid: '중기', wl_long: '장기',
        wl_reason: '추천 이유', wl_mixed: '지표 혼조',
        // Theme
        theme_loading: '테마 종목 실시간 분석 중... (최초 30초 내외)',
        theme_error: '테마 데이터를 불러올 수 없습니다.',
        theme_static_fail: '실시간 분석을 불러올 수 없습니다. 정적 목록을 표시합니다.',
        theme_name_col: '종목', theme_ticker_col: '티커', theme_desc_col: '설명',
        rank_col: '순위', change_col: '등락', entry_col: '매수가', target_col: '목표가',
        short_return: '단기수익', verdict_col: '판단', buy_basis: '매수 근거',
        // Global
        global_loading: '글로벌 지수 로딩 중...', global_error: '지수 데이터를 불러올 수 없습니다.',
        naver_news_loading: '뉴스 로딩 중...', signal_loading: '신호 분석 중...',
        naver_error: '네이버 뉴스를 불러올 수 없습니다.', signal_error: '신호 분석 불가.',
        no_rise_trigger: '현재 뉴스에서 특별한 상승 트리거가 감지되지 않았습니다.',
        // Company info
        employees_unit: '명', no_company_info: '회사 정보 없음',
        // My buy form
        input_currency: '입력 통화', buy_amount: '매수 금액',
        hold_qty: '보유 수량', apply_btn: '적용',
        my_buy_placeholder: '매수 금액을 입력하면 손절·목표가 시나리오가 표시됩니다.',
        my_buy_price_label: '내 매수가',
        // Theme detail indicators
        bb_indicator: '볼린저밴드', ma_indicator: '이동평균', stoch_indicator: '스토캐스틱',
        verdict_title: '종합 판단',
        buy_signals_cnt: '매수 신호', sell_signals_cnt: '매도 신호', neutral_cnt: '중립',
        theme_full_analysis: '차트 · 재무 전체 분석 보기',
        stoch_oversold: '과매도', stoch_overbought: '과매수',
        bb_entry: 'BB 하단 / MA20 지지',
        sidebar_news_error: '뉴스를 불러올 수 없습니다.',
        fin_error: '재무 데이터를 불러올 수 없습니다.',
        chart_no_data: '차트 데이터 없음',
        // Chart traces
        bb_upper_trace: 'BB 상단', bb_lower_trace: 'BB 하단',
        macd_hist: 'MACD 히스토그램', macd_line: 'MACD선', signal_line: 'Signal선',
        overbought_70: '과매수(70)', oversold_30: '과매도(30)',
        ma20_trace: 'MA-20', ma60_trace: 'MA-60',
        // Chart annotations
        buy_target_ann: '매수', target1_ann: '1차', target2_ann: '2차', stoploss_ann: '손절',
        // Loading/error
        searching: '종목 검색 중...',
        not_found_err: '종목을 찾을 수 없습니다. 영문 종목명 또는 티커로 검색해보세요.',
        data_load_error: '데이터를 불러올 수 없습니다.',
        yahoo_hint: 'Yahoo Finance API 요청 제한 / 데이터 부족 / 티커 심볼 오류를 확인해주세요.',
        // Trading section
        trading_analysis: '트레이딩 전략 분석',
        // API modal
        api_view_hide: '보기/숨기기', api_save: '저장', api_delete: '삭제', api_register: '등록',
        api_priority: 'AI 우선순위', api_auto: '자동',
        api_claude_first: 'Claude 우선', api_gpt_first: 'GPT 우선', api_gemini_first: 'Gemini 우선',
        api_delete_confirm: '등록된 API 키를 삭제하시겠습니까?',
        claude_model_desc: 'claude-haiku-4-5 모델 사용',
        openai_model_desc: 'gpt-4o-mini 모델 사용',
        gemini_model_desc: 'gemini-1.5-flash 모델 사용',
        // PDF
        pdf_generating: 'PDF 생성 중...', pdf_failed: 'PDF 생성 실패',
        // Financials
        fin_loading: '재무 데이터 로딩 중...',
        fin_unit_krw: '조원', fin_unit_usd: '십억$',
        fin_legend_hint: '범례를 클릭하면 해당 라인을 숨기거나 표시할 수 있습니다.',
        fin_y_axis: 'Y축 단위:',
        // Theme pagination
        prev_page: '◀ 이전', next_page: '다음 ▶',
        per_page_title: '페이지당 종목 수',
        // Disclaimer (used in multiple places)
        disclaimer_text: '본 분석은 참고용이며 투자 권유가 아닙니다.',
        // News
        news_count_unit: '건',
        // Auto-update
        auto_update_status: '마다 자동 업데이트',
        // Company info translation badge
        co_translating: '번역 중...', co_ai_badge: 'AI번역',
        // AI error
        ai_request_failed: 'AI 분석 요청 실패',
        // Analyzing text
        analyzing_stock: '분석 중...',
        fav_title: '즐겨찾기',
        // Refresh unit options
        sec_unit: '초', min_unit: '분', hour_unit: '시간',
        // Sidebar tooltips
        sidebar_collapse_title: '사이드바 접기', sidebar_expand_title: '사이드바 펼치기',
        // Watchlist tab static
        wl_tab_title: '카테고리별 추천 종목',
        wl_tab_caption: '기술적 지표 기반 실시간 분석 · 매수·매도가는 볼린저밴드 지지/저항 기준',
        // Theme tab static
        theme_tab_title: '테마별 종목',
        theme_tab_caption: '테마를 선택하면 현재 매수 신호 강도 순으로 종목을 정렬합니다.',
        theme_fav_pin: '즐겨찾기한 테마는 상단에 고정됩니다.',
        theme_select_label: '테마 선택',
        // Global tab static
        global_tab_title: '글로벌 시장 지수',
        global_tab_caption: '데이터 출처: Yahoo Finance · 5분 단위 자동 갱신',
        refresh_market_btn: '시장 새로고침',
        naver_news_tab_title: '네이버 금융 최신 뉴스',
        naver_news_tab_caption: '출처: finance.naver.com · 15분 단위 갱신',
        naver_signals_title: '뉴스 기반 상승 예상 종목',
        naver_signals_caption: '네이버 금융 최신 뉴스 키워드 분석 · 매수 신호 종목만 표시',
        // Disclaimer & modal
        disclaimer_full: '본 분석은 참고용이며 투자 권유가 아닙니다. 모든 투자의 책임은 투자자 본인에게 있습니다.',
        api_modal_title: 'AI API 키 설정', api_menu_label: 'AI API 설정',
        // My buy analysis
        eval_amount: '평가금액', eval_pnl: '평가손익', return_rate: '수익률', current_verdict: '현재 판단',
        target_reached: '목표 도달', stop_zone: '손절 구간', holding: '보유 중',
        target_profit_label: '목표가 (수익 목표)', rr_label: '손익비 1 :', current_status: '현재 상태',
        scenario_title: '전략별 손절 · 목표가 시나리오',
        scenario_short_title: '단기 트레이딩', scenario_short_period: '1일 ~ 2주 | 분봉·시간봉 중심',
        scenario_short_note: 'VWAP·BB 중심선 저항 돌파 시 목표 / RSI·MACD 단기 신호 활용',
        scenario_swing_title: '스윙 트레이딩', scenario_swing_period: '2주 ~ 3개월 | 일봉·주봉 중심',
        scenario_swing_note: 'BB 상단·20/60일 MA 저항선 목표 / 피보나치 61.8~100% 확장 기준',
        scenario_long_title: '장기 투자', scenario_long_period: '6개월 ~ 수년 | 주봉·월봉 중심',
        scenario_long_note: 'PER×EPS 적정주가 / 52주 신고가 돌파 추세 / 펀더멘털 성장 기반',
        // Translation / AI
        co_trans_badge: '번역',
        ai_no_result: 'AI 분석 결과를 받지 못했습니다.',
        // News sources
        src_naver: '네이버증권', src_investing: '인베스팅닷컴', src_yahoo: '야후파이낸스', src_other: '기타',
    },
    en: {
        // App
        app_title: 'Stock Technical Analyzer',
        // Tabs
        tab_analysis: 'Analysis', tab_watchlist: 'Watchlist',
        tab_themes: 'Themes', tab_global: 'Global Market & News',
        // Sidebar
        auto_update: 'Auto Update', news_hide: 'Hide News',
        news_show: 'Show News', realtime_news: 'Live News Alerts',
        news_caption: 'Source: Naver Finance · Investing.com (KR)',
        surge_stocks: 'Surge Watch', latest_news: 'Latest News',
        news_refresh: 'Refresh News', no_trigger: 'No surge triggers detected',
        // Search
        ticker_input_label: 'Enter Ticker or Stock Name',
        ticker_placeholder: 'e.g. Samsung, AAPL',
        period_label: 'Period', analyze_btn: 'Analyze',
        period_3mo: '3 Months', period_6mo: '6 Months', period_1y: '1 Year', period_2y: '2 Years',
        welcome_msg: 'Search by ticker (AAPL) or company name in Korean/English.',
        // Signals
        buy: 'Buy', sell: 'Sell', neutral: 'Neutral',
        strong_buy: 'Strong Buy', buy_lean: 'Buy Leaning',
        strong_sell: 'Strong Sell', sell_lean: 'Sell Leaning',
        // Price cards
        price: 'Price', high: 'High', low: 'Low', volume: 'Volume',
        krx_stock: 'KRW Stock (KRX)', usd_stock: 'USD Stock',
        // Verdict
        verdict_label: 'Verdict', buy_signals: 'Buy Signals', sell_signals: 'Sell Signals',
        // Analysis sections
        ai_analysis: 'AI Analysis', analyzing: 'Analyzing...',
        ai_loading: 'Loading AI analysis...', company_loading: 'Loading company info...',
        company_error: 'Company info unavailable.',
        indicator_analysis: 'Indicator Analysis', trading_strategy: 'Trading Strategy',
        short_term: 'Short-term (1d–2wk)', swing: 'Swing (2wk–3mo)', long_term: 'Long-term (6mo+)',
        my_buy: 'My Buy Price', chart_label: 'Chart',
        financials_title: 'Financial Analysis', pdf_report: 'Download PDF Report',
        disclaimer: 'For reference only. Not investment advice.',
        // Strategy advice
        advice_buy: 'Consider Buying', advice_sell: 'Avoid (Watch or Take Profit)',
        advice_neutral: 'Wait (Confirm Trend First)',
        // RSI/indicator messages
        rsi_oversold: 'Oversold', rsi_overbought: 'Overbought',
        macd_up: 'Rising', macd_down: 'Falling',
        bb_lower: 'Lower Band — Bounce Expected', bb_upper: 'Upper Band — Overheated', bb_mid: 'Mid Range',
        ma_up: 'Aligned (MA20 > MA60)', ma_down: 'Inverted', ma_mixed: 'MA Mixed',
        // Strategy labels
        buy_target: 'Buy Target', target1: 'Target 1', target2: 'Target 2', stoploss: 'Stop Loss',
        // Financials
        valuation: 'Valuation', market_cap: 'Market Cap', div_yield: 'Dividend Yield',
        profitability: 'Profitability', revenue_ttm: 'Revenue (TTM)',
        op_margin: 'Operating Margin', net_margin: 'Net Margin',
        growth: 'Growth & Cash Flow',
        rev_growth: 'Revenue Growth (YoY)', earn_growth: 'Op. Income Growth (YoY)',
        op_cf: 'Operating Cash Flow', fcf: 'Free Cash Flow (FCF)',
        stability: 'Stability', debt_equity: 'Debt/Equity',
        current_ratio: 'Current Ratio', interest_coverage: 'Interest Coverage',
        native_currency: 'Native', unit_label: 'Unit',
        // Chart traces
        annual_chart: 'Annual P&L & Cash Flow',
        c_revenue: 'Revenue', c_op_income: 'Op. Income', c_net_income: 'Net Income', c_op_cf: 'Op. CF',
        unit_krw: 'Trillion KRW', unit_usd: 'Billion USD',
        // Misc
        loading: 'Loading...', no_data: 'N/A',
        full_analysis_btn: 'Full Chart & Financial Analysis',
        data_refresh: 'Refresh Data',
        // Short-term strategy
        rsi_oversold_bounce: 'Oversold → Bounce', rsi_overbought_correct: 'Overbought → Correction',
        rsi_neutral_zone: 'Neutral Zone',
        bb_lower_support: 'Near Lower Band → Support', bb_upper_hot: 'Upper Band — Overheated', bb_mid_range: 'Mid Range',
        macd_golden: 'Golden Cross', macd_dead: 'Death Cross',
        macd_up_trend: 'Uptrend Continuing', macd_down_trend: 'Downtrend Continuing',
        vwap_low: 'Below VWAP → Undervalued', vwap_high: 'Above VWAP → Overvalued', vwap_near: 'Near VWAP',
        st_buy_zone: 'Short-term Buy Zone', st_enter_check: 'Consider Entry', watch_rec: 'Watch & Wait',
        st_target_title: 'Short-term Target Prices',
        entry_price: 'Entry', current_price_label: 'Current', target1_short: 'Target 1',
        target2_short: 'Target 2', stoploss_line: 'Stop Loss',
        profit_ratio: 'R:R', buy_signal_cnt: 'Buy Signals',
        // Swing strategy
        fib_title: 'Fibonacci Retracement (Last 60 Sessions)',
        ma_title: 'MA20 / MA60',
        swing_target_title: 'Swing Targets (R:R 1:2)',
        ma20_label: 'MA20', ma60_label: 'MA60', ma_status: 'Alignment',
        ma_golden: 'Aligned (Bullish)', ma_dead_arr: 'Inverted (Bearish)',
        vs_current_pct: 'vs. Current',
        fib_near: '◀ Near Current', fib_support: 'Fib Support', fib_resist: 'Fib Resistance',
        swing_buy_zone: 'Swing Buy Zone (Pullback)', swing_avoid: 'Avoid Swing Entry',
        swing_wait: 'Wait for Pullback',
        // Long-term strategy
        prof_title: 'Profitability (ROE · Op. Margin · Earnings Growth)',
        per_pbr_title: 'PER / PBR Fair Value', dcf_title: 'DCF Intrinsic Value',
        excellent: 'Excellent', good: 'Good', poor: 'Weak', no_data_label: 'N/A',
        fcf_ps: 'FCF/Share', pv_5y: 'PV (5yr FCF)', pv_term: 'PV (Terminal)',
        dcf_intrinsic: 'DCF Intrinsic Value',
        dcf_no_fcf: 'No FCF data. DCF not available.',
        fair_value_total: 'Avg. Fair Value', per_pbr_avg: 'PER / PBR / DCF Average',
        no_fin_data: 'Insufficient financial data for valuation',
        strong_undervalue: 'Strong Buy (Deeply Undervalued)', undervalue_zone: 'Undervalued',
        fair_value: 'Fair Value', overvalue_warn: 'Overvalued — Caution', strong_overvalue: 'Significantly Overvalued',
        per_fair: 'PER Fair Value', pbr_fair: 'PBR Fair Value', current_per_pbr: 'Current PER/PBR',
        dcf_strong_buy: 'Strong Buy (30%+ Undervalued)', dcf_buy: 'Consider Buy (10%+ Undervalued)',
        dcf_overvalue: 'Overvalued — Caution',
        // Watchlist
        wl_loading: 'Analyzing all stocks... (first load ~30s)',
        wl_error: 'Failed to load watchlist.',
        wl_name: 'Stock', wl_price: 'Price', wl_change: 'Chg%', wl_rsi: 'RSI',
        wl_entry: 'Buy Target', wl_target1: 'Target 1', wl_target2: 'Target 2',
        wl_short: 'Short', wl_mid: 'Mid', wl_long: 'Long',
        wl_reason: 'Reason', wl_mixed: 'Mixed Signals',
        // Theme
        theme_loading: 'Analyzing theme stocks... (~30s first load)',
        theme_error: 'Failed to load theme data.',
        theme_static_fail: 'Real-time analysis failed. Showing static list.',
        theme_name_col: 'Stock', theme_ticker_col: 'Ticker', theme_desc_col: 'Description',
        rank_col: 'Rank', change_col: 'Chg%', entry_col: 'Entry', target_col: 'Target',
        short_return: 'Short Ret.', verdict_col: 'Signal', buy_basis: 'Basis',
        // Global
        global_loading: 'Loading global indices...', global_error: 'Failed to load indices.',
        naver_news_loading: 'Loading news...', signal_loading: 'Analyzing signals...',
        naver_error: 'Failed to load Naver news.', signal_error: 'Signal analysis unavailable.',
        no_rise_trigger: 'No significant surge triggers detected in current news.',
        // Company info
        employees_unit: '', no_company_info: 'No company info available',
        // My buy form
        input_currency: 'Currency', buy_amount: 'Buy Price',
        hold_qty: 'Qty', apply_btn: 'Apply',
        my_buy_placeholder: 'Enter your buy price to see P&L scenario.',
        my_buy_price_label: 'My Entry',
        // Theme detail indicators
        bb_indicator: 'Bollinger Band', ma_indicator: 'Moving Avg', stoch_indicator: 'Stochastic',
        verdict_title: 'Signal',
        buy_signals_cnt: 'Buy Signals', sell_signals_cnt: 'Sell Signals', neutral_cnt: 'Neutral',
        theme_full_analysis: 'Full Chart & Financial Analysis',
        stoch_oversold: 'Oversold', stoch_overbought: 'Overbought',
        bb_entry: 'BB Lower / MA20 Support',
        sidebar_news_error: 'Failed to load news.',
        fin_error: 'Failed to load financial data.',
        chart_no_data: 'No chart data',
        // Chart traces
        bb_upper_trace: 'BB Upper', bb_lower_trace: 'BB Lower',
        macd_hist: 'MACD Histogram', macd_line: 'MACD', signal_line: 'Signal',
        overbought_70: 'Overbought(70)', oversold_30: 'Oversold(30)',
        ma20_trace: 'MA-20', ma60_trace: 'MA-60',
        // Chart annotations
        buy_target_ann: 'Buy', target1_ann: 'T1', target2_ann: 'T2', stoploss_ann: 'SL',
        // Loading/error
        searching: 'Searching stock...',
        not_found_err: 'Stock not found. Try an English name or ticker.',
        data_load_error: 'Failed to load data.',
        yahoo_hint: 'Check: Yahoo Finance rate limit / insufficient data / invalid ticker symbol.',
        // Trading section
        trading_analysis: 'Trading Strategy Analysis',
        // API modal
        api_view_hide: 'Show/Hide', api_save: 'Save', api_delete: 'Delete', api_register: 'Register',
        api_priority: 'AI Priority', api_auto: 'Auto',
        api_claude_first: 'Claude First', api_gpt_first: 'GPT First', api_gemini_first: 'Gemini First',
        api_delete_confirm: 'Delete this API key?',
        claude_model_desc: 'Uses claude-haiku-4-5 model',
        openai_model_desc: 'Uses gpt-4o-mini model',
        gemini_model_desc: 'Uses gemini-1.5-flash model',
        // PDF
        pdf_generating: 'Generating PDF...', pdf_failed: 'PDF generation failed',
        // Financials
        fin_loading: 'Loading financial data...',
        fin_unit_krw: 'Tril KRW', fin_unit_usd: 'Bil USD',
        fin_legend_hint: 'Click legend items to show/hide lines.',
        fin_y_axis: 'Y-Axis:',
        // Theme pagination
        prev_page: '◀ Prev', next_page: 'Next ▶',
        per_page_title: 'Stocks per page',
        // Disclaimer
        disclaimer_text: 'For reference only. Not investment advice.',
        // News
        news_count_unit: '',
        // Auto-update
        auto_update_status: 'auto-update interval',
        // Company info translation badge
        co_translating: 'translating...', co_ai_badge: 'AI-translated',
        // AI error
        ai_request_failed: 'AI analysis request failed',
        // Analyzing text
        analyzing_stock: 'Analyzing...',
        fav_title: 'Favorite',
        // Refresh unit options
        sec_unit: 'sec', min_unit: 'min', hour_unit: 'hr',
        // Sidebar tooltips
        sidebar_collapse_title: 'Collapse sidebar', sidebar_expand_title: 'Expand sidebar',
        // Watchlist tab static
        wl_tab_title: 'Recommended Stocks by Category',
        wl_tab_caption: 'Real-time technical analysis · Buy/Sell based on Bollinger Band support/resistance',
        // Theme tab static
        theme_tab_title: 'Stocks by Theme',
        theme_tab_caption: 'Select a theme to sort stocks by buy signal strength.',
        theme_fav_pin: 'Favorites are pinned to the top.',
        theme_select_label: 'Select Theme',
        // Global tab static
        global_tab_title: 'Global Market Indices',
        global_tab_caption: 'Source: Yahoo Finance · Auto-refreshed every 5 minutes',
        refresh_market_btn: 'Refresh Market',
        naver_news_tab_title: 'Naver Finance Latest News',
        naver_news_tab_caption: 'Source: finance.naver.com · Updated every 15 minutes',
        naver_signals_title: 'News-Based Surge Candidates',
        naver_signals_caption: 'Keyword analysis from Naver Finance · Buy signals only',
        // Disclaimer & modal
        disclaimer_full: 'For reference only. Not investment advice. All investment decisions are the investor\'s responsibility.',
        api_modal_title: 'AI API Key Settings', api_menu_label: 'AI API Settings',
        // My buy analysis
        eval_amount: 'Portfolio Value', eval_pnl: 'Unrealized P&L', return_rate: 'Return', current_verdict: 'Current Signal',
        target_reached: 'Target Reached', stop_zone: 'Stop Zone', holding: 'Holding',
        target_profit_label: 'Target (Profit Goal)', rr_label: 'R:R 1:', current_status: 'Status',
        scenario_title: 'Strategy Stop/Target Scenarios',
        scenario_short_title: 'Short-term', scenario_short_period: '1d–2wk | Minute/Hourly Chart',
        scenario_short_note: 'Target on VWAP/BB mid breakout / RSI·MACD short signals',
        scenario_swing_title: 'Swing Trade', scenario_swing_period: '2wk–3mo | Daily/Weekly Chart',
        scenario_swing_note: 'BB upper/MA20-60 resistance targets / Fibonacci 61.8–100% extension',
        scenario_long_title: 'Long-term', scenario_long_period: '6mo+ | Weekly/Monthly Chart',
        scenario_long_note: 'PER×EPS fair value / 52-week high breakout / Fundamental growth',
        // Translation / AI
        co_trans_badge: 'Translated',
        ai_no_result: 'No AI analysis result received.',
        // News sources
        src_naver: 'Naver Finance', src_investing: 'Investing.com', src_yahoo: 'Yahoo Finance', src_other: 'Other',
    },
};

/** 번역 헬퍼 */
function L(key) { return LANG[currentLang]?.[key] ?? LANG.ko[key] ?? key; }

/** 내부 신호값(매수/매도/중립)을 현재 언어로 표시 */
function dSignal(s) {
    const m = {
        '매수': 'buy', '매도': 'sell', '중립': 'neutral',
        '강한 매수': 'strong_buy', '매수 우세': 'buy_lean',
        '강한 매도': 'strong_sell', '매도 우세': 'sell_lean',
    };
    return m[s] ? L(m[s]) : s;
}

/** 정적 HTML의 data-i18n 요소에 번역 적용 */
function applyLangStatic() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        el.textContent = L(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = L(el.dataset.i18nPlaceholder);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        el.title = L(el.dataset.i18nTitle);
    });
    // 페이지 타이틀
    document.title = L('app_title');
    // 토글 버튼 텍스트
    const btn = document.getElementById('langToggleBtn');
    if (btn) btn.textContent = currentLang === 'ko' ? '🇺🇸 EN' : '🇰🇷 KO';
    document.documentElement.lang = currentLang;
    // 뉴스 토글 버튼 텍스트 동기화 (현재 visible 상태에 따라)
    const newsPanel = document.getElementById('newsPanel');
    const newsToggleEl = document.getElementById('newsToggle');
    if (newsToggleEl && newsPanel) {
        const hidden = newsPanel.style.display === 'none';
        newsToggleEl.innerHTML = `<span class="ms">notifications</span> ${hidden ? L('news_show') : L('news_hide')}`;
    }
    // 리프레시 상태 텍스트 재업데이트
    const _rsInterval = document.getElementById('refreshInterval');
    const _rsUnit = document.getElementById('refreshUnit');
    const _rsStatus = document.getElementById('refreshStatus');
    if (_rsInterval && _rsUnit && _rsStatus) {
        const val = _rsInterval.value;
        const unitText = _rsUnit.options[_rsUnit.selectedIndex]?.text || '';
        _rsStatus.innerHTML = `<span class="ms">refresh</span> ${val}${unitText} ${L('auto_update_status')}`;
    }
}

/** 언어 전환 */
function toggleLang() {
    currentLang = currentLang === 'ko' ? 'en' : 'ko';
    localStorage.setItem('lang', currentLang);
    applyLangStatic();
    // 동적 컨텐츠 재렌더
    if (window._lastAnalysisData) {
        renderAnalysis(window._lastAnalysisData, document.getElementById('analysisResult'));
    }
    if (window._finData) {
        _drawFinancials();
    }
    // Watchlist re-render if loaded
    if (watchlistLoaded && window._lastWatchlistData) {
        renderWatchlist(window._lastWatchlistData, document.getElementById('watchlistContent'));
    }
    // Theme re-render if loaded
    if (themesLoaded && currentTheme) {
        renderThemeStocksTable(
            document.getElementById('themeContent')?._lastHeaderHtml || '',
            themesData[currentTheme]?.analyzed_stocks || [],
            document.getElementById('themeContent')
        );
    }
}

// ══════════════════════════════════════════════════════

// ═══════════════════════════════════════════════
// Korean Name → Ticker Dictionary
// ═══════════════════════════════════════════════

const KR_DICT = [
    // US Stocks
    { name: '테슬라',           ticker: 'TSLA',       en: 'Tesla' },
    { name: '애플',             ticker: 'AAPL',       en: 'Apple' },
    { name: '엔비디아',         ticker: 'NVDA',       en: 'NVIDIA' },
    { name: '마이크로소프트',   ticker: 'MSFT',       en: 'Microsoft' },
    { name: '구글',             ticker: 'GOOGL',      en: 'Alphabet' },
    { name: '알파벳',           ticker: 'GOOGL',      en: 'Alphabet' },
    { name: '아마존',           ticker: 'AMZN',       en: 'Amazon' },
    { name: '메타',             ticker: 'META',       en: 'Meta' },
    { name: '넷플릭스',         ticker: 'NFLX',       en: 'Netflix' },
    { name: '팔란티어',         ticker: 'PLTR',       en: 'Palantir' },
    { name: '코인베이스',       ticker: 'COIN',       en: 'Coinbase' },
    { name: '마이크론',         ticker: 'MU',         en: 'Micron' },
    { name: '인텔',             ticker: 'INTC',       en: 'Intel' },
    { name: '퀄컴',             ticker: 'QCOM',       en: 'Qualcomm' },
    { name: '브로드컴',         ticker: 'AVGO',       en: 'Broadcom' },
    { name: '오라클',           ticker: 'ORCL',       en: 'Oracle' },
    { name: '세일즈포스',       ticker: 'CRM',        en: 'Salesforce' },
    { name: '스포티파이',       ticker: 'SPOT',       en: 'Spotify' },
    { name: '우버',             ticker: 'UBER',       en: 'Uber' },
    { name: '에어비앤비',       ticker: 'ABNB',       en: 'Airbnb' },
    { name: '버크셔해서웨이',   ticker: 'BRK-B',      en: 'Berkshire Hathaway' },
    { name: '존슨앤존슨',       ticker: 'JNJ',        en: 'Johnson & Johnson' },
    { name: '비자',             ticker: 'V',          en: 'Visa' },
    { name: '마스터카드',       ticker: 'MA',         en: 'Mastercard' },
    { name: '코카콜라',         ticker: 'KO',         en: 'Coca-Cola' },
    { name: '월마트',           ticker: 'WMT',        en: 'Walmart' },
    { name: '디즈니',           ticker: 'DIS',        en: 'Disney' },
    { name: '보잉',             ticker: 'BA',         en: 'Boeing' },
    { name: '골드만삭스',       ticker: 'GS',         en: 'Goldman Sachs' },
    { name: 'JP모건',           ticker: 'JPM',        en: 'JPMorgan Chase' },
    // KR Stocks
    { name: '삼성전자',         ticker: '005930.KS',  en: 'Samsung Electronics' },
    { name: 'SK하이닉스',       ticker: '000660.KS',  en: 'SK Hynix' },
    { name: 'LG에너지솔루션',   ticker: '373220.KS',  en: 'LG Energy Solution' },
    { name: '삼성바이오로직스', ticker: '207940.KS',  en: 'Samsung Biologics' },
    { name: '현대차',           ticker: '005380.KS',  en: 'Hyundai Motor' },
    { name: '기아',             ticker: '000270.KS',  en: 'Kia' },
    { name: '셀트리온',         ticker: '068270.KS',  en: 'Celltrion' },
    { name: 'POSCO홀딩스',      ticker: '005490.KS',  en: 'POSCO Holdings' },
    { name: 'KB금융',           ticker: '105560.KS',  en: 'KB Financial' },
    { name: '신한지주',         ticker: '055550.KS',  en: 'Shinhan Financial' },
    { name: '카카오',           ticker: '035720.KS',  en: 'Kakao' },
    { name: '네이버',           ticker: '035420.KS',  en: 'NAVER' },
    { name: '삼성SDI',          ticker: '006400.KS',  en: 'Samsung SDI' },
    { name: 'LG화학',           ticker: '051910.KS',  en: 'LG Chem' },
    { name: 'LG전자',           ticker: '066570.KS',  en: 'LG Electronics' },
    { name: '하이브',           ticker: '352820.KS',  en: 'HYBE' },
    { name: '크래프톤',         ticker: '259960.KS',  en: 'Krafton' },
    { name: '카카오뱅크',       ticker: '323410.KS',  en: 'Kakao Bank' },
    { name: '카카오페이',       ticker: '377300.KS',  en: 'Kakao Pay' },
    { name: '두산에너빌리티',   ticker: '034020.KS',  en: 'Doosan Enerbility' },
    { name: '한화에어로스페이스',ticker: '012450.KS', en: 'Hanwha Aerospace' },
    { name: '삼성물산',         ticker: '028260.KS',  en: 'Samsung C&T' },
    { name: '현대모비스',       ticker: '012330.KS',  en: 'Hyundai Mobis' },
    { name: '한국전력',         ticker: '015760.KS',  en: 'Korea Electric Power' },
    { name: '씨에스윈드',       ticker: '112570.KS',  en: 'CS Wind' },
    // Crypto
    { name: '비트코인',         ticker: 'BTC-USD',    en: 'Bitcoin' },
    { name: '이더리움',         ticker: 'ETH-USD',    en: 'Ethereum' },
    { name: '리플',             ticker: 'XRP-USD',    en: 'XRP' },
    { name: '솔라나',           ticker: 'SOL-USD',    en: 'Solana' },
    { name: '도지코인',         ticker: 'DOGE-USD',   en: 'Dogecoin' },
];

// ── 초성 검색 ──
const CHOSUNG_LIST = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

function getChosung(str) {
    return [...str].map(ch => {
        const code = ch.charCodeAt(0) - 0xAC00;
        if (code < 0 || code > 11171) return ch;
        return CHOSUNG_LIST[Math.floor(code / 28 / 21)];
    }).join('');
}

function isChosungOnly(str) {
    return str.length > 0 && /^[ㄱ-ㅎ]+$/.test(str);
}

function searchKrDict(query) {
    const q = query.trim();
    if (!q) return [];
    if (isChosungOnly(q)) {
        return KR_DICT.filter(item => getChosung(item.name).startsWith(q));
    }
    const lower = q.toLowerCase();
    return KR_DICT.filter(item =>
        item.name.includes(q) ||
        item.ticker.toLowerCase().startsWith(lower) ||
        item.en.toLowerCase().startsWith(lower)
    );
}

function resolveKrName(query) {
    const q = query.trim();
    return KR_DICT.find(item =>
        item.name === q || item.ticker.toUpperCase() === q.toUpperCase()
    )?.ticker || null;
}

// ── Autocomplete state ──
let acItems = [];
let acIndex = -1;
let acDebounceTimer = null;

function renderAutocomplete() {
    const list = document.getElementById('autocompleteList');
    if (!list) return;
    const q = searchInput.value.trim();
    acIndex = -1;
    if (!q) { list.style.display = 'none'; return; }

    // 로컬 KR_DICT 우선 즉시 표시
    const local = searchKrDict(q).map(item => ({ name: item.name, ticker: item.ticker }));
    if (local.length > 0) showAcList(local);

    // 한글 포함 시 백엔드 suggest API 호출 (디바운스 200ms)
    if (/[가-힣]/.test(q)) {
        clearTimeout(acDebounceTimer);
        acDebounceTimer = setTimeout(async () => {
            try {
                const res = await fetch(`${API}/api/stock/suggest?q=${encodeURIComponent(q)}`);
                if (!res.ok) return;
                const items = await res.json();
                if (items.length > 0) showAcList(items);
            } catch (_) {}
        }, 200);
    }
}

function showAcList(items) {
    const list = document.getElementById('autocompleteList');
    if (!list) return;
    acItems = items.slice(0, 8);
    list.innerHTML = acItems.map((item, i) =>
        `<div class="autocomplete-item" data-i="${i}">
            <span class="ac-name">${item.name}</span>
            <span class="ac-right">
                ${item.en ? `<span class="ac-en">${item.en}</span>` : ''}
                <span class="ac-ticker">${item.ticker}</span>
            </span>
        </div>`
    ).join('');
    list.style.display = 'block';
    list.querySelectorAll('.autocomplete-item').forEach(el => {
        el.addEventListener('mousedown', e => {
            e.preventDefault();
            selectAcItem(parseInt(el.dataset.i));
        });
    });
}

function hideAutocomplete() {
    const list = document.getElementById('autocompleteList');
    if (list) list.style.display = 'none';
}

function moveAcSelection(dir) {
    const list = document.getElementById('autocompleteList');
    if (!list || list.style.display === 'none') return false;
    const items = list.querySelectorAll('.autocomplete-item');
    if (!items.length) return false;
    items[acIndex]?.classList.remove('active');
    acIndex = Math.max(0, Math.min(items.length - 1, acIndex + dir));
    items[acIndex].classList.add('active');
    return true;
}

function selectAcItem(i) {
    const item = acItems[i];
    if (!item) return;
    // 한글명을 input에 입력하면 runAnalysis에서 보존됨
    searchInput.value = item.name || item.ticker;
    hideAutocomplete();
    runAnalysis();
}

// ── State ──
let exchangeRate = 1380.0;
let favorites = new Set(JSON.parse(localStorage.getItem('sa_favorites') || '[]'));
let currentTheme = null;
let themePage = 0;
let STOCKS_PER_PAGE = parseInt(localStorage.getItem('sa_per_page') || '10', 10);

// ── DOM refs ──
const searchInput = document.getElementById('searchInput');
const periodSelect = document.getElementById('periodSelect');
const searchBtn = document.getElementById('searchBtn');
const sidebar = document.getElementById('sidebar');

// ═══════════════════════════════════════════════
// Init
// ═══════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    applyLangStatic();   // 저장된 언어 설정 즉시 적용
    setupTabs();
    setupSearch();
    setupSidebar();
    setupTopMenu();
    updateApiStatusMini();
    loadExchangeRate();
    loadSidebarNews();
});

// ═══════════════════════════════════════════════
// ═══════════════════════════════════════════════
// Theme (Light / Dark / System)
// ═══════════════════════════════════════════════

function isDarkMode() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
}

function chartColors() {
    const dark = isDarkMode();
    return {
        bg:   dark ? '#0e1117' : '#ffffff',
        plot: dark ? '#161b22' : '#f8f9fa',
        grid: dark ? '#2a2a3e' : '#e6e9ef',
        text: dark ? '#e0e0e0' : '#262730',
        template: dark ? 'plotly_dark' : 'plotly_white',
    };
}

function applyTheme(mode) {
    let isDark;
    if (mode === 'dark') {
        isDark = true;
    } else if (mode === 'light') {
        isDark = false;
    } else {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

    // 이미 렌더링된 Plotly 차트를 테마에 맞게 즉시 업데이트
    const cc = chartColors();
    document.querySelectorAll('.js-plotly-plot').forEach(el => {
        Plotly.relayout(el, {
            paper_bgcolor: cc.bg,
            plot_bgcolor: cc.plot,
            'font.color': cc.text,
            'xaxis.gridcolor': cc.grid,
            'yaxis.gridcolor': cc.grid,
            'yaxis2.gridcolor': cc.grid,
            'yaxis3.gridcolor': cc.grid,
        }).catch(() => {});
    });
}

// ═══════════════════════════════════════════════
// Top-right Menu (Streamlit ⋮ 메뉴)
// ═══════════════════════════════════════════════

function setupTopMenu() {
    const btn = document.getElementById('topMenuBtn');
    const dropdown = document.getElementById('topMenuDropdown');
    if (!btn || !dropdown) return;

    // 토글
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
    });

    // 외부 클릭 시 닫기
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== btn) {
            dropdown.classList.remove('open');
        }
    });

    // 테마 모드 전환
    const savedTheme = localStorage.getItem('sa_theme') || 'system';
    applyTheme(savedTheme);
    // 저장된 테마에 맞게 버튼 활성화
    document.querySelectorAll('.theme-mode-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.mode === savedTheme);
    });

    document.querySelectorAll('.theme-mode-btn').forEach(tbtn => {
        tbtn.addEventListener('click', () => {
            const mode = tbtn.dataset.mode;
            document.querySelectorAll('.theme-mode-btn').forEach(b => b.classList.remove('active'));
            tbtn.classList.add('active');
            localStorage.setItem('sa_theme', mode);
            applyTheme(mode);
        });
    });

    // 시스템 테마 변경 감지
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if ((localStorage.getItem('sa_theme') || 'system') === 'system') {
            applyTheme('system');
        }
    });

    // Rerun
    document.getElementById('menuRerun')?.addEventListener('click', () => {
        dropdown.classList.remove('open');
        location.reload();
    });

    // Auto rerun 토글
    document.getElementById('menuAutoRerun')?.addEventListener('click', function() {
        this.classList.toggle('toggled');
        const icon = this.querySelector('.menu-icon');
        if (this.classList.contains('toggled')) {
            icon.textContent = '●';
        } else {
            icon.textContent = '○';
        }
    });

    // Clear cache
    document.getElementById('menuClearCache')?.addEventListener('click', () => {
        dropdown.classList.remove('open');
        localStorage.clear();
        sessionStorage.clear();
        location.reload();
    });

    // API Key 설정
    document.getElementById('menuApiKeys')?.addEventListener('click', () => {
        dropdown.classList.remove('open');
        openApiKeyModal();
    });

    // Print
    document.getElementById('menuPrint')?.addEventListener('click', () => {
        dropdown.classList.remove('open');
        window.print();
    });

    // 키보드 단축키 R = Rerun
    document.addEventListener('keydown', (e) => {
        if (e.key === 'r' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            location.reload();
        }
    });
}

// ═══════════════════════════════════════════════
// AI API Key Management
// ═══════════════════════════════════════════════

const AI_PROVIDERS = [
    {
        id: 'anthropic',
        name: 'Anthropic Claude',
        sub: L('claude_model_desc'),
        icon: 'psychology',
        iconBg: '#7c3aed22',
        iconColor: '#7c3aed',
        placeholder: 'sk-ant-api03-...',
        storageKey: 'sa_key_anthropic',
    },
    {
        id: 'openai',
        name: 'OpenAI GPT',
        sub: L('openai_model_desc'),
        icon: 'auto_awesome',
        iconBg: '#10a37f22',
        iconColor: '#10a37f',
        placeholder: 'sk-proj-...',
        storageKey: 'sa_key_openai',
    },
    {
        id: 'gemini',
        name: 'Google Gemini',
        sub: L('gemini_model_desc'),
        icon: 'stars',
        iconBg: '#4285f422',
        iconColor: '#4285f4',
        placeholder: 'AIza...',
        storageKey: 'sa_key_gemini',
    },
];

function getApiKey(providerId) {
    const p = AI_PROVIDERS.find(p => p.id === providerId);
    return p ? (localStorage.getItem(p.storageKey) || '') : '';
}

function setApiKey(providerId, key) {
    const p = AI_PROVIDERS.find(p => p.id === providerId);
    if (p) localStorage.setItem(p.storageKey, key.trim());
}

function removeApiKey(providerId) {
    const p = AI_PROVIDERS.find(p => p.id === providerId);
    if (p) localStorage.removeItem(p.storageKey);
}

function getAiPriority() {
    return localStorage.getItem('sa_ai_priority') || 'auto';
}

function setAiPriority(val) {
    localStorage.setItem('sa_ai_priority', val);
}

/** 현재 활성 API 키 정보 반환 */
function getActiveApiKeyInfo() {
    const priority = getAiPriority();
    if (priority !== 'auto') {
        const key = getApiKey(priority);
        if (key) return { provider: priority, key };
        // 지정 provider 키 없으면 fallback
    }
    // auto: 등록된 것 중 첫 번째
    for (const p of AI_PROVIDERS) {
        const key = getApiKey(p.id);
        if (key) return { provider: p.id, key };
    }
    return null;
}

/** 메뉴 내 미니 상태 업데이트 */
function updateApiStatusMini() {
    const el = document.getElementById('apiStatusMini');
    if (!el) return;
    const active = getActiveApiKeyInfo();
    if (active) {
        el.textContent = 'ON';
        el.className = 'api-status-mini on';
    } else {
        el.textContent = '';
        el.className = 'api-status-mini off';
    }
}

function openApiKeyModal() {
    const modal = document.getElementById('apiKeyModal');
    if (!modal) return;
    modal.style.display = 'flex';
    renderApiKeyModal();
}

function closeApiKeyModal() {
    const modal = document.getElementById('apiKeyModal');
    if (modal) modal.style.display = 'none';
    updateApiStatusMini();
}

function handleModalOverlayClick(e) {
    if (e.target === document.getElementById('apiKeyModal')) closeApiKeyModal();
}

function renderApiKeyModal() {
    const body = document.getElementById('apiKeyModalBody');
    if (!body) return;

    const priority = getAiPriority();

    let html = '';

    AI_PROVIDERS.forEach(p => {
        const key = getApiKey(p.id);
        const hasKey = !!key;
        const masked = hasKey ? (key.substring(0, 12) + '••••••••••••' + key.slice(-4)) : '';

        html += `
        <div class="api-provider-row" id="apr-${p.id}">
            <div class="api-provider-icon" style="background:${p.iconBg};color:${p.iconColor};">
                <span class="ms">${p.icon}</span>
            </div>
            <div class="api-provider-info">
                <div class="api-provider-name">${p.name}</div>
                <div class="api-provider-sub">${p.sub}</div>
                ${hasKey ? `<div class="api-key-preview" id="kprev-${p.id}">${masked}</div>` : ''}
                <div id="kinput-${p.id}" style="display:none;">
                    <div class="api-key-input-wrap">
                        <input type="password" id="kinput-field-${p.id}" placeholder="${p.placeholder}" autocomplete="off">
                        <button class="api-key-btn" onclick="toggleKeyVisibility('${p.id}')" title="${L('api_view_hide')}">
                            <span class="ms" id="keye-${p.id}">visibility</span>
                        </button>
                        <button class="api-key-btn primary" onclick="saveApiKey('${p.id}')">
                            <span class="ms">save</span> ${L('api_save')}
                        </button>
                    </div>
                </div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;flex-shrink:0;">
                <span class="api-status-badge ${hasKey ? 'on' : 'off'}" id="kbadge-${p.id}">${hasKey ? 'ON' : 'OFF'}</span>
                <div style="display:flex;gap:6px;">
                    ${hasKey
                        ? `<button class="api-key-btn danger" onclick="deleteApiKey('${p.id}')"><span class="ms">delete</span> ${L('api_delete')}</button>`
                        : `<button class="api-key-btn" onclick="showKeyInput('${p.id}')"><span class="ms">add</span> ${L('api_register')}</button>`
                    }
                </div>
            </div>
        </div>`;
    });

    // Priority selector
    const priorityOptions = [
        { val: 'auto',      label: L('api_auto') },
        { val: 'anthropic', label: L('api_claude_first') },
        { val: 'openai',    label: L('api_gpt_first') },
        { val: 'gemini',    label: L('api_gemini_first') },
    ];

    html += `
    <div class="api-priority-section">
        <label><span class="ms sm">tune</span> ${L('api_priority')}</label>
        <div class="api-priority-btns">
            ${priorityOptions.map(o => `
                <button class="api-priority-btn ${priority === o.val ? 'active' : ''}"
                        onclick="selectAiPriority('${o.val}')" id="apri-${o.val}">
                    ${o.label}
                </button>`).join('')}
        </div>
    </div>`;

    body.innerHTML = html;
}

function showKeyInput(providerId) {
    document.getElementById(`kinput-${providerId}`).style.display = 'block';
    document.getElementById(`kinput-field-${providerId}`)?.focus();
}

function toggleKeyVisibility(providerId) {
    const input = document.getElementById(`kinput-field-${providerId}`);
    const eye   = document.getElementById(`keye-${providerId}`);
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        if (eye) eye.textContent = 'visibility_off';
    } else {
        input.type = 'password';
        if (eye) eye.textContent = 'visibility';
    }
}

function saveApiKey(providerId) {
    const input = document.getElementById(`kinput-field-${providerId}`);
    if (!input) return;
    const key = input.value.trim();
    if (!key) { input.style.borderColor = 'var(--red)'; return; }
    setApiKey(providerId, key);
    renderApiKeyModal(); // 재렌더
}

function deleteApiKey(providerId) {
    if (!confirm(L('api_delete_confirm'))) return;
    removeApiKey(providerId);
    renderApiKeyModal();
}

function selectAiPriority(val) {
    setAiPriority(val);
    document.querySelectorAll('.api-priority-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`apri-${val}`)?.classList.add('active');
}

// ═══════════════════════════════════════════════
// Tabs
// ═══════════════════════════════════════════════

function setupTabs() {
    document.querySelectorAll('.tab').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
            // Lazy load tab data
            if (btn.dataset.tab === 'tab-watchlist') loadWatchlist();
            if (btn.dataset.tab === 'tab-themes') loadThemes();
            if (btn.dataset.tab === 'tab-global') loadGlobal();
        });
    });
}

// ═══════════════════════════════════════════════
// Search & Analysis (Tab 1)
// ═══════════════════════════════════════════════

function setupSearch() {
    searchBtn.addEventListener('click', () => { hideAutocomplete(); runAnalysis(); });
    searchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            if (acIndex >= 0) { selectAcItem(acIndex); }
            else { hideAutocomplete(); runAnalysis(); }
        } else if (e.key === 'ArrowDown') { moveAcSelection(1);  e.preventDefault(); }
        else if (e.key === 'ArrowUp')   { moveAcSelection(-1); e.preventDefault(); }
        else if (e.key === 'Escape')    { hideAutocomplete(); }
    });
    searchInput.addEventListener('input', () => renderAutocomplete());
    searchInput.addEventListener('blur',  () => setTimeout(hideAutocomplete, 150));
    document.getElementById('refreshWatchlist')?.addEventListener('click', () => loadWatchlist(true));
    document.getElementById('refreshIndices')?.addEventListener('click', () => loadGlobal(true));
    document.getElementById('refreshNaverNews')?.addEventListener('click', () => loadGlobal(true));
    document.getElementById('refreshNews')?.addEventListener('click', () => loadSidebarNews());
}

function analyzeFromAnywhere(ticker, name) {
    // 이름이 있으면 "종목명 (티커)" 형식으로 입력창에 표시
    if (name && name !== ticker) {
        searchInput.value = `${name} (${ticker})`;
    } else {
        searchInput.value = ticker;
    }
    // Switch to tab 1
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelector('[data-tab="tab-analysis"]').classList.add('active');
    document.getElementById('tab-analysis').classList.add('active');
    runAnalysis();
}

async function runAnalysis() {
    let query = searchInput.value.trim();
    if (!query) return;

    // "네이버 (035420.KS)" 형식이 그대로 넘어오면 티커 부분만 추출
    const parenMatch = query.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
    if (parenMatch) {
        query = parenMatch[2].trim();   // 괄호 안의 티커 사용
    }

    // 한글 종목명 → 티커 자동 변환 (원래 한글명 보존)
    let krName = parenMatch ? parenMatch[1].trim() : null;
    const resolved = !krName ? resolveKrName(query) : null;
    if (resolved && resolved !== query) {
        krName = query;
        query = resolved;
    }

    const period = periodSelect.value;
    const welcomeMsg = document.getElementById('welcomeMsg');
    const resultDiv = document.getElementById('analysisResult');
    if (welcomeMsg) welcomeMsg.style.display = 'none';
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `<div class="loading">${L('searching')}</div>`;

    try {
        // 1단계: 검색 → 티커 확보
        const searchRes = await fetch(`${API}/api/stock/search?q=${encodeURIComponent(query)}`);
        if (!searchRes.ok) {
            const err = await searchRes.json().catch(() => ({}));
            throw new Error(err.detail || `'${query}' ${L('not_found_err')}`);
        }
        const searchData = await searchRes.json();
        const symbol = searchData.symbol;
        // 한글명 우선, 그 다음 백엔드 이름, 마지막으로 티커
        let name = krName || searchData.name || symbol;

        // 이름을 모를 때(티커만 직접 입력) → 회사 정보 API에서 long_name 보완
        if (name === symbol) {
            try {
                const infoRes = await fetch(`${API}/api/stock/info/${encodeURIComponent(symbol)}`);
                if (infoRes.ok) {
                    const infoData = await infoRes.json();
                    if (infoData.long_name) name = infoData.long_name;
                }
            } catch (_) {}
        }

        // 검색 결과 안내
        resultDiv.innerHTML = `<div class="loading">${name} (${symbol}) ${L('analyzing_stock')}</div>`;

        // 2단계: 분석
        const res = await fetch(`${API}/api/stock/analyze/${encodeURIComponent(symbol)}?period=${period}`);
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || L('data_load_error'));
        }
        const data = await res.json();
        data.symbol = symbol;
        data.name = name;
        // 입력창에 "네이버 (035420.KS)" 형식으로 표시
        searchInput.value = name !== symbol ? `${name} (${symbol})` : symbol;
        renderAnalysis(data, resultDiv);
    } catch (e) {
        resultDiv.innerHTML = `<div class="error-msg">
            <p>${e.message}</p>
            <p class="caption mt-8">${L('yahoo_hint')}</p>
        </div>`;
    }
}

// ═══════════════════════════════════════════════
// Formatting Helpers
// ═══════════════════════════════════════════════

function fmt(n, dec = 2) {
    if (n == null || isNaN(n)) return '—';
    return Number(n).toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

function fmtPrice(p) {
    if (p == null) return '—';
    p = Number(p);
    if (p >= 1000) return p.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    if (p >= 10) return p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return p.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

function fmtLarge(v) {
    if (v == null) return '—';
    v = Number(v);
    if (Math.abs(v) >= 1e12) return (v / 1e12).toFixed(2) + 'T';
    if (Math.abs(v) >= 1e9) return (v / 1e9).toFixed(2) + 'B';
    if (Math.abs(v) >= 1e6) return (v / 1e6).toFixed(2) + 'M';
    return v.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function fmtPct(v) { return v != null ? (v * 100).toFixed(1) + '%' : '—'; }
function fmtX(v) { return v != null ? Number(v).toFixed(1) + 'x' : '—'; }

function isKRW(sym) { return sym && (sym.endsWith('.KS') || sym.endsWith('.KQ')); }

function dualPrice(price, sym, rate) {
    if (price == null) return '—';
    rate = rate || exchangeRate;
    if (isKRW(sym)) {
        return `₩${Number(price).toLocaleString(undefined, {maximumFractionDigits: 0})} ($${(price / rate).toFixed(2)})`;
    }
    return `$${fmtPrice(price)} (₩${(price * rate).toLocaleString(undefined, {maximumFractionDigits: 0})})`;
}

function signalEmoji(s) { return s === '매수' ? '<span class="ms green">check_circle</span>' : (s === '매도' ? '<span class="ms red">cancel</span>' : '<span class="ms orange">radio_button_unchecked</span>'); }
function signalClass(s) { return s === '매수' ? 'positive' : (s === '매도' ? 'negative' : 'neutral'); }
function signalColor(s) { return s === '매수' ? '#00C851' : (s === '매도' ? '#FF4444' : '#FFA500'); }

async function loadExchangeRate() {
    try {
        const res = await fetch(`${API}/api/market/exchange-rate`);
        if (res.ok) {
            const d = await res.json();
            exchangeRate = d.rate || 1380.0;
        }
    } catch (_) {}
}

// ═══════════════════════════════════════════════
// Render Full Analysis (Tab 1)
// ═══════════════════════════════════════════════

function renderAnalysis(data, container) {
    window._lastAnalysisData = data;  // 언어 전환 시 재렌더용
    const d = data;
    const sym = d.symbol;
    const name = d.name || sym;
    const close = d.close;
    const chg = d.change_pct;
    const rate = exchangeRate;
    const krw = isKRW(sym);

    // Signal calculations
    const rsi_s = d.rsi < 40 ? '매수' : (d.rsi > 65 ? '매도' : '중립');
    const macd_s = d.macd > d.macd_sig ? '매수' : '매도';
    const bb_s = close < d.bb_l ? '매수' : (close > d.bb_u ? '매도' : '중립');
    const ma_s = close > d.ma20 && d.ma20 > d.ma60 ? '매수' : (close < d.ma20 && d.ma20 < d.ma60 ? '매도' : '중립');
    const stk_s = (d.stoch_k < 25 && d.stoch_d < 25) ? '매수' : ((d.stoch_k > 75 && d.stoch_d > 75) ? '매도' : '중립');

    const buy_cnt = [rsi_s, macd_s, bb_s, ma_s, stk_s].filter(s => s === '매수').length;
    const sell_cnt = [rsi_s, macd_s, bb_s, ma_s, stk_s].filter(s => s === '매도').length;

    // Verdict
    let verdict, vColor;
    if (buy_cnt >= 4) { verdict = '강한 매수'; vColor = '#00C851'; }
    else if (buy_cnt >= 3) { verdict = '매수 우세'; vColor = '#44bb44'; }
    else if (sell_cnt >= 4) { verdict = '강한 매도'; vColor = '#FF4444'; }
    else if (sell_cnt >= 3) { verdict = '매도 우세'; vColor = '#ff7777'; }
    else { verdict = '중립'; vColor = '#FFA500'; }

    // Entry / targets / stoploss
    const entry = Math.min(d.bb_l, d.ma20);
    const t1 = d.bb_m;
    const t2 = d.bb_u;
    const sl = entry * 0.96;
    const rr = (t1 - entry) / Math.max(entry - sl, 1e-9);
    const ret1 = (t1 - entry) / entry * 100;
    const ret2 = (t2 - entry) / entry * 100;
    const slPct = (sl - entry) / entry * 100;

    // Price display
    const priceMain = krw ? `₩${Number(close).toLocaleString(undefined, {maximumFractionDigits: 0})}` : `$${fmtPrice(close)}`;
    const priceSub = krw ? `($${(close / rate).toFixed(2)})` : `(₩${(close * rate).toLocaleString(undefined, {maximumFractionDigits: 0})})`;

    const high = d.high || close;
    const low = d.low || close;
    const volume = d.volume || 0;

    // RSI / MACD / BB messages
    const rsiMsg = `RSI ${fmt(d.rsi, 1)} — ${rsi_s === '매수' ? L('rsi_oversold') : rsi_s === '매도' ? L('rsi_overbought') : L('neutral')}`;
    const macdMsg = macd_s === '매수' ? `MACD > Signal — ${L('macd_up')}` : `MACD < Signal — ${L('macd_down')}`;
    const bbMsg = bb_s === '매수' ? L('bb_lower') : (bb_s === '매도' ? L('bb_upper') : L('bb_mid'));
    const maMsg = ma_s === '매수' ? L('ma_up') : (ma_s === '매도' ? L('ma_down') : L('ma_mixed'));
    const stkMsg = `Stoch ${stk_s === '매수' ? L('rsi_oversold') : stk_s === '매도' ? L('rsi_overbought') : L('neutral')} (K:${fmt(d.stoch_k, 1)})`;

    // Strategy advice
    let advTitle, advColor, advDesc, advEntry;
    if (verdict === '강한 매수' || verdict === '매수 우세') {
        advTitle = `<span class="ms green">check_circle</span> ${L('advice_buy')}`; advColor = '#00C851';
        advDesc = currentLang === 'ko'
            ? `현재 ${buy_cnt}개 지표가 매수 신호. ` + (bb_s === '매수' ? 'BB 하단 지지 → 반등 기대. ' : '') + (rsi_s === '매수' ? 'RSI 과매도 → 단기 반등. ' : '') + (macd_s === '매수' ? 'MACD 상승전환 → 모멘텀 회복. ' : '') + (ma_s === '매수' ? 'MA 정배열 → 상승 추세.' : '')
            : `${buy_cnt} indicators show Buy. ` + (bb_s === '매수' ? 'BB lower support → bounce expected. ' : '') + (rsi_s === '매수' ? 'RSI oversold → short-term rebound. ' : '') + (macd_s === '매수' ? 'MACD crossover → momentum recovery. ' : '') + (ma_s === '매수' ? 'MA aligned → uptrend.' : '');
        advEntry = currentLang === 'ko'
            ? `현재가 또는 매수 목표가(${dualPrice(entry, sym, rate)}) 부근 분할 매수 권장`
            : `Consider scaling in near current price or buy target (${dualPrice(entry, sym, rate)})`;
    } else if (verdict === '강한 매도' || verdict === '매도 우세') {
        advTitle = `<span class="ms red">block</span> ${L('advice_sell')}`; advColor = '#FF4444';
        advDesc = currentLang === 'ko'
            ? `현재 ${sell_cnt}개 지표 매도 신호. ` + (bb_s === '매도' ? 'BB 상단 이탈 → 단기 과열. ' : '') + (rsi_s === '매도' ? 'RSI 과매수 → 조정 가능성. ' : '') + (ma_s === '매도' ? 'MA 역배열 → 하락 추세.' : '')
            : `${sell_cnt} indicators show Sell. ` + (bb_s === '매도' ? 'BB upper breakout → overheated. ' : '') + (rsi_s === '매도' ? 'RSI overbought → pullback risk. ' : '') + (ma_s === '매도' ? 'MA inverted → downtrend.' : '');
        advEntry = currentLang === 'ko'
            ? `추가 하락 시 ${dualPrice(entry, sym, rate)} 부근 재진입 검토`
            : `Watch for re-entry near ${dualPrice(entry, sym, rate)} on further dip`;
    } else {
        advTitle = `<span class="ms orange">hourglass_empty</span> ${L('advice_neutral')}`; advColor = '#FFA500';
        advDesc = currentLang === 'ko'
            ? '지표 혼조. MACD 방향 전환 또는 RSI 30 이하 진입 시 매수 신호. 분할 접근 권장.'
            : 'Mixed signals. Watch for MACD reversal or RSI below 30 before entry. Scale in cautiously.';
        advEntry = currentLang === 'ko'
            ? `목표 매수가 ${dualPrice(entry, sym, rate)} 부근 분할 접근 검토`
            : `Consider scaling in near target entry ${dualPrice(entry, sym, rate)}`;
    }

    // Build reasons string
    let reasons = [];
    if (rsi_s === '매수') reasons.push(`RSI ${fmt(d.rsi, 0)} ${L('rsi_oversold')}`);
    if (macd_s === '매수') reasons.push(currentLang === 'ko' ? 'MACD 상승전환' : 'MACD Crossover Up');
    if (bb_s === '매수') reasons.push(currentLang === 'ko' ? 'BB 하단 지지' : 'BB Lower Support');
    if (ma_s === '매수') reasons.push(currentLang === 'ko' ? 'MA 정배열' : 'MA Aligned');
    if (stk_s === '매수') reasons.push(`Stoch ${L('rsi_oversold')}`);
    if (rsi_s === '매도') reasons.push(`RSI ${fmt(d.rsi, 0)} ${L('rsi_overbought')}`);
    if (bb_s === '매도') reasons.push(currentLang === 'ko' ? 'BB 상단 이탈' : 'BB Upper Breakout');
    if (ma_s === '매도') reasons.push(currentLang === 'ko' ? 'MA 역배열' : 'MA Inverted');

    const rrColor = rr >= 1.5 ? '#aaffaa' : '#ffaaaa';

    container.innerHTML = `
        <h2 class="subheader"><span class="ms">push_pin</span> ${name} (${sym})</h2>

        <!-- Company Info Card -->
        <div class="company-info-card" id="companyInfoCard">
            <div class="loading" style="font-size:0.85em;">${L('company_loading')}</div>
        </div>

        <!-- Price Metrics Row -->
        <div class="metrics-row">
            <div class="metric-card">
                <div class="label">${L('price')}</div>
                <div class="value">${priceMain}</div>
                <div class="delta ${chg >= 0 ? 'positive' : 'negative'}">${chg >= 0 ? '+' : ''}${fmt(chg)}%</div>
                <div class="sub">${priceSub}</div>
            </div>
            <div class="metric-card">
                <div class="label">${L('high')}</div>
                <div class="value">${dualPrice(high, sym, rate)}</div>
            </div>
            <div class="metric-card">
                <div class="label">${L('low')}</div>
                <div class="value">${dualPrice(low, sym, rate)}</div>
            </div>
            <div class="metric-card">
                <div class="label">${L('volume')}</div>
                <div class="value">${Number(volume).toLocaleString()}</div>
            </div>
        </div>
        <div class="info-bar">USD/KRW: ${fmt(rate, 1)} · ${krw ? L('krx_stock') : L('usd_stock')}</div>
        <hr class="divider">

        <!-- Verdict Banner -->
        <div class="verdict-banner" style="background:${vColor}22;border-color:${vColor};color:${vColor};">
            <h2>${L('verdict_label')}: ${dSignal(verdict)}</h2>
            <div class="sub">${L('buy_signals')} ${buy_cnt}${currentLang === 'ko' ? '개' : ''} · ${L('sell_signals')} ${sell_cnt}${currentLang === 'ko' ? '개' : ''} · ${L('neutral')} ${5 - buy_cnt - sell_cnt}</div>
        </div>

        <!-- AI 분석 (키 등록 시 자동 표시) -->
        <div class="ai-analysis-box" id="mainAiBox" style="margin-bottom:16px;">
            <div class="ai-analysis-header"><span class="ms">smart_toy</span> ${L('ai_analysis')} <span class="ai-badge" id="mainAiBadge">${L('analyzing')}</span></div>
            <div class="ai-analysis-body" id="mainAiBody">
                <div class="loading" style="font-size:0.9em;">${L('ai_loading')}</div>
            </div>
        </div>

        <!-- Indicator Cards -->
        <h3 class="subheader"><span class="ms">bar_chart</span> ${L('indicator_analysis')}</h3>
        <div class="indicators-grid">
            ${renderIndicatorCard('RSI (14)', rsi_s, rsiMsg, `${fmt(d.rsi, 1)}`)}
            ${renderIndicatorCard('MACD', macd_s, macdMsg, `${fmt(d.macd, 3)}`)}
            ${renderIndicatorCard(currentLang === 'ko' ? '볼린저밴드' : 'Bollinger Band', bb_s, bbMsg, `Upper ${fmtPrice(d.bb_u)} / Lower ${fmtPrice(d.bb_l)}`)}
            ${renderIndicatorCard(currentLang === 'ko' ? '이동평균' : 'Moving Avg', ma_s, maMsg, `MA20: ${fmtPrice(d.ma20)} / MA60: ${fmtPrice(d.ma60)}`)}
            ${renderIndicatorCard(currentLang === 'ko' ? '스토캐스틱' : 'Stochastic', stk_s, stkMsg, `K: ${fmt(d.stoch_k, 1)} / D: ${fmt(d.stoch_d, 1)}`)}
        </div>
        <hr class="divider">

        <!-- Strategy Panel -->
        <h3 class="subheader"><span class="ms">lightbulb</span> ${L('trading_strategy')}</h3>
        <div class="action-banner" style="background:${advColor}18;border-color:${advColor};">
            <div class="title" style="color:${advColor};">${advTitle}</div>
            <div class="detail">${advDesc}</div>
            <div class="note">${advEntry}</div>
        </div>
        <div class="strategy-grid">
            ${renderStrategyCard(L('buy_target'), entry, '#44aaff', currentLang === 'ko' ? 'BB 하단 / MA20 지지' : 'BB Lower / MA20 Support', sym)}
            ${renderStrategyCard(L('target1'), t1, '#ffffff', `${currentLang === 'ko' ? '기대수익' : 'Expected'} ${ret1 >= 0 ? '+' : ''}${ret1.toFixed(1)}% | BB Mid`, sym)}
            ${renderStrategyCard(L('target2'), t2, '#ffaa00', `${currentLang === 'ko' ? '기대수익' : 'Expected'} ${ret2 >= 0 ? '+' : ''}${ret2.toFixed(1)}% | BB Upper`, sym)}
            ${renderStrategyCard(L('stoploss'), sl, '#FF4444', `${currentLang === 'ko' ? '손실' : 'Loss'} ${slPct.toFixed(1)}% | -4%`, sym)}
            <div class="strategy-card">
                <div class="label">Risk/Reward</div>
                <div class="price" style="color:${rrColor};">1 : ${rr.toFixed(2)}</div>
                <div class="desc">${currentLang === 'ko' ? '1.5 이상 양호 · 2.0 이상 우수' : '≥1.5 Good · ≥2.0 Excellent'}</div>
            </div>
        </div>
        <hr class="divider">

        <!-- Trading Strategy Sub-tabs -->
        <h3 class="subheader"><span class="ms">bar_chart</span> ${L('trading_analysis')}</h3>
        <div class="sub-tabs" id="tradingSubTabs">
            <button class="sub-tab active" data-subtab="st-short"><span class="ms">bolt</span> ${L('short_term')}</button>
            <button class="sub-tab" data-subtab="st-swing"><span class="ms">sync</span> ${L('swing')}</button>
            <button class="sub-tab" data-subtab="st-long"><span class="ms">trending_up</span> ${L('long_term')}</button>
        </div>
        <div id="st-short" class="sub-tab-content active">${renderShortTermStrategy(d, sym, rate)}</div>
        <div id="st-swing" class="sub-tab-content">${renderSwingStrategy(d, sym, rate)}</div>
        <div id="st-long" class="sub-tab-content">${renderLongTermStrategy(d, sym, rate)}</div>
        <hr class="divider">

        <!-- 내 매수가 분석 -->
        <hr class="divider">
        <h3 class="subheader"><span class="ms">payments</span> ${L('my_buy')}</h3>
        <div class="my-buy-form">
            <div class="my-buy-row">
                <div class="my-buy-field">
                    <label class="input-label">${L('input_currency')}</label>
                    <div class="radio-row">
                        <label><input type="radio" name="myCurrency" value="USD" ${!isKRW(sym) ? 'checked' : ''}> USD ($)</label>
                        <label><input type="radio" name="myCurrency" value="KRW" ${isKRW(sym) ? 'checked' : ''}> KRW (₩)</label>
                    </div>
                </div>
                <div class="my-buy-field">
                    <label class="input-label">${L('buy_amount')}</label>
                    <input type="text" id="myPriceInput" placeholder="${isKRW(sym) ? '예: 75000' : '예: 150.50'}">
                </div>
                <div class="my-buy-field">
                    <label class="input-label">${L('hold_qty')}</label>
                    <input type="text" id="myQtyInput" placeholder="예: 10">
                </div>
            </div>
            <button class="btn-analyze" onclick="applyMyBuy('${sym}', ${close}, ${entry}, ${t1}, ${t2}, ${sl})" style="margin-top:0.5rem;"><span class="ms green">check_circle</span> ${L('apply_btn')}</button>
        </div>
        <div id="myBuyResult">
            <p class="caption">${L('my_buy_placeholder')}</p>
        </div>

        <!-- Chart -->
        <hr class="divider">
        <div class="chart-header">
            <h3 class="subheader" style="margin:0;"><span class="ms">show_chart</span> ${L('chart_label')}</h3>
            <div class="chart-currency-toggle">
                <span class="caption" style="margin-right:0.5rem;">${L('fin_y_axis')}</span>
                <button class="chart-currency-btn active" onclick="toggleChartCurrency(this, 'native')">${krw ? 'KRW' : 'USD'}</button>
                <button class="chart-currency-btn" onclick="toggleChartCurrency(this, '${krw ? 'USD' : 'KRW'}')">${krw ? 'USD' : 'KRW'}</button>
            </div>
        </div>
        <p class="caption mb-8">${L('fin_legend_hint')}</p>
        <div id="chartContainer"></div>
        <hr class="divider">

        <!-- Financials Expandable -->
        <div class="expandable" id="financialsSection">
            <div class="expandable-header" onclick="toggleExpandable('financialsSection')">
                <span><span class="ms">assignment</span> ${L('financials_title')}</span>
                <span class="arrow">▶</span>
            </div>
            <div class="expandable-body" id="financialsBody">
                <div class="loading">${L('fin_loading')} <span class="caption">(Yahoo Finance)</span></div>
            </div>
        </div>

        <!-- PDF Download -->
        <button class="pdf-btn" onclick="downloadPDF('${sym}')"><span class="ms">description</span> ${L('pdf_report')}</button>
        <p class="caption mt-8 text-center">${L('disclaimer')}</p>
    `;

    // Setup sub-tabs
    setupSubTabs('tradingSubTabs');

    // Render chart
    renderPlotlyChart(d);

    // Load company info
    loadCompanyInfo(sym);

    // Load financials lazily
    loadFinancials(sym);

    // AI 분석 (키 등록된 경우에만)
    _loadMainAI(sym, name, d, buy_cnt, sell_cnt, verdict);
}

// ═══════════════════════════════════════════════
// 내 매수가 분석 (A버전 동일 로직)
// ═══════════════════════════════════════════════

function applyMyBuy(sym, curPrice, entry, t1, t2, sl) {
    const rate = exchangeRate;
    const krw = isKRW(sym);
    const currencyRadio = document.querySelector('input[name="myCurrency"]:checked');
    const useUsd = currencyRadio ? currencyRadio.value === 'USD' : !krw;
    const priceStr = document.getElementById('myPriceInput')?.value?.replace(/,/g, '') || '';
    const qtyStr = document.getElementById('myQtyInput')?.value?.replace(/,/g, '') || '';
    const resultDiv = document.getElementById('myBuyResult');
    if (!resultDiv) return;

    let rawP = parseFloat(priceStr);
    if (!rawP || rawP <= 0) {
        resultDiv.innerHTML = `<p class="caption">${L('my_buy_placeholder')}</p>`;
        return;
    }

    // 통화 변환
    let myPrice;
    if (useUsd && krw) myPrice = rawP * rate;
    else if (!useUsd && !krw) myPrice = rawP / rate;
    else myPrice = rawP;

    const myQty = parseFloat(qtyStr) || 0;
    const pnlPct = (curPrice - myPrice) / myPrice * 100;
    const pnlAbs = (curPrice - myPrice) * Math.max(myQty, 1);
    const pnlColor = pnlPct >= 0 ? '#00C851' : '#FF4444';
    const pnlIcon = pnlPct >= 0 ? '<span class="ms green">trending_up</span>' : '<span class="ms red">trending_down</span>';

    // 단기: +5% 목표, 손익비 1:1.5
    const tgShort = Math.max(myPrice * 1.05, t1);
    const slShort = myPrice - (tgShort - myPrice) / 1.5;
    const rrShort = (tgShort - myPrice) / Math.max(myPrice - slShort, 1e-9);

    // 스윙: +20% 목표, 손익비 1:2
    const tgSwing = Math.max(myPrice * 1.20, t2);
    const slSwing = myPrice - (tgSwing - myPrice) / 2.0;
    const rrSwing = (tgSwing - myPrice) / Math.max(myPrice - slSwing, 1e-9);

    // 장기: +35% 목표, 손익비 1:3
    const tgLong = myPrice * 1.35;
    const slLong = myPrice - (tgLong - myPrice) / 3.0;
    const rrLong = (tgLong - myPrice) / Math.max(myPrice - slLong, 1e-9);

    // 현재 손익 요약
    let summaryHtml = `
        <div class="metrics-row mt-8">
            <div class="metric-card">
                <div class="label">${L('my_buy_price_label')}</div>
                <div class="value" style="font-size:1.1rem;">${dualPrice(myPrice, sym, rate)}</div>
            </div>
            <div class="metric-card">
                <div class="label">${L('current_price_label')}</div>
                <div class="value" style="font-size:1.1rem;">${dualPrice(curPrice, sym, rate)}</div>
                <div class="delta ${pnlPct >= 0 ? 'positive' : 'negative'}">${pnlIcon} ${pnlPct >= 0 ? '+' : ''}${pnlPct.toFixed(2)}%</div>
            </div>`;
    if (myQty > 0) {
        summaryHtml += `
            <div class="metric-card">
                <div class="label">${L('eval_amount')}</div>
                <div class="value" style="font-size:1.1rem;">${dualPrice(curPrice * myQty, sym, rate)}</div>
            </div>
            <div class="metric-card">
                <div class="label">${L('eval_pnl')}</div>
                <div class="value" style="font-size:1.1rem;color:${pnlColor};">${dualPrice(Math.abs(pnlAbs), sym, rate)}</div>
                <div class="delta" style="color:${pnlColor};">${pnlAbs >= 0 ? '+' : '-'}${Math.abs(pnlPct).toFixed(2)}%</div>
            </div>`;
    } else {
        summaryHtml += `
            <div class="metric-card">
                <div class="label">${L('return_rate')}</div>
                <div class="value" style="font-size:1.1rem;color:${pnlColor};">${pnlPct >= 0 ? '+' : ''}${pnlPct.toFixed(2)}%</div>
            </div>
            <div class="metric-card">
                <div class="label">${L('current_verdict')}</div>
                <div class="value" style="font-size:1.1rem;">—</div>
            </div>`;
    }
    summaryHtml += '</div><hr class="divider">';

    // 시나리오 카드
    function scenarioCard(title, color, slP, tgP, rr, periodNote, strategyNote) {
        const slRet = (slP - myPrice) / myPrice * 100;
        const tgRet = (tgP - myPrice) / myPrice * 100;
        let judge, judgeC;
        if (curPrice >= tgP) { judge = `<span class="ms orange">my_location</span> ${L('target_reached')}`; judgeC = '#ffaa00'; }
        else if (curPrice <= slP) { judge = `<span class="ms red">stop_circle</span> ${L('stop_zone')}`; judgeC = '#FF4444'; }
        else { judge = `<span class="ms">hourglass_empty</span> ${L('holding')}`; judgeC = 'var(--muted)'; }
        return `<div class="scenario-card" style="border:1px solid ${color}55;background:${color}08;">
            <div class="title" style="color:${color};">${title}</div>
            <div class="period">${periodNote}</div>
            <div class="target-label"><span class="ms orange">my_location</span> ${L('target_profit_label')}</div>
            <div class="target-val" style="color:#00C851;">${dualPrice(tgP, sym, rate)} <span style="color:var(--muted-dark);font-size:0.8em;">(+${tgRet.toFixed(1)}%)</span></div>
            <div class="target-label" style="margin-top:8px;"><span class="ms red">stop_circle</span> ${L('stoploss')}</div>
            <div class="target-val" style="color:#FF4444;">${dualPrice(slP, sym, rate)} <span style="color:var(--muted-dark);font-size:0.8em;">(${slRet.toFixed(1)}%)</span></div>
            <div class="rr-badge" style="background:${color}18;color:${color};">${L('rr_label')} ${rr.toFixed(1)}</div>
            <div class="strategy-note">${strategyNote}</div>
            <div class="status" style="color:${judgeC};">${L('current_status')}: ${judge}</div>
        </div>`;
    }

    summaryHtml += `<h4 class="subheader"><span class="ms">assignment</span> ${L('scenario_title')}</h4>`;
    summaryHtml += '<div class="scenario-grid">';
    summaryHtml += scenarioCard(`<span class="ms">bolt</span> ${L('scenario_short_title')}`, '#44aaff', slShort, tgShort, rrShort,
        L('scenario_short_period'), L('scenario_short_note'));
    summaryHtml += scenarioCard(`<span class="ms">sync</span> ${L('scenario_swing_title')}`, '#aa88ff', slSwing, tgSwing, rrSwing,
        L('scenario_swing_period'), L('scenario_swing_note'));
    summaryHtml += scenarioCard(`<span class="ms green">trending_up</span> ${L('scenario_long_title')}`, '#44dd88', slLong, tgLong, rrLong,
        L('scenario_long_period'), L('scenario_long_note'));
    summaryHtml += '</div>';

    resultDiv.innerHTML = summaryHtml;
}

function renderIndicatorCard(name, signal, msg, val) {
    return `<div class="indicator-card">
        <div class="emoji">${signalEmoji(signal)}</div>
        <div class="name">${name}</div>
        <div class="val">${val}</div>
        <div class="msg">${msg}</div>
    </div>`;
}

function renderStrategyCard(label, price, color, desc, sym) {
    return `<div class="strategy-card">
        <div class="label">${label}</div>
        <div class="price" style="color:${color};">${dualPrice(price, sym)}</div>
        <div class="desc">${desc}</div>
    </div>`;
}

// ═══════════════════════════════════════════════
// Short-term Strategy
// ═══════════════════════════════════════════════

function renderShortTermStrategy(d, sym, rate) {
    const close = d.close;
    const rsi = d.rsi;
    const macd = d.macd;
    const msig = d.macd_sig;
    const bb_u = d.bb_u, bb_m = d.bb_m, bb_l = d.bb_l;
    const bb_w = Math.max(bb_u - bb_l, 1e-9);
    const bb_pctB = (close - bb_l) / bb_w * 100;
    const vwap = d.vwap || close;
    const vwap_dev = (close - vwap) / vwap * 100;

    // Signals
    const macd_cross = d.macd_cross || false;
    const macd_death = d.macd_death || false;

    const rsi_c = rsi < 35 ? '#00C851' : (rsi > 65 ? '#FF4444' : '#FFA500');
    const rsi_t = rsi < 35 ? L('rsi_oversold_bounce') : (rsi > 65 ? L('rsi_overbought_correct') : L('rsi_neutral_zone'));
    const bb_c = bb_pctB < 20 ? '#00C851' : (bb_pctB > 80 ? '#FF4444' : '#FFA500');
    const bb_t = bb_pctB < 20 ? L('bb_lower_support') : (bb_pctB > 80 ? L('bb_upper_hot') : L('bb_mid_range'));

    let mc, mt;
    if (macd_cross) { mc = '#00C851'; mt = L('macd_golden') + ' <span class="ms orange">my_location</span>'; }
    else if (macd_death) { mc = '#FF4444'; mt = L('macd_dead') + ' <span class="ms orange">warning</span>'; }
    else if (macd > msig) { mc = '#44aaff'; mt = L('macd_up_trend'); }
    else { mc = '#FFA500'; mt = L('macd_down_trend'); }

    const vc = vwap_dev < -1 ? '#00C851' : (vwap_dev > 1 ? '#FF4444' : '#FFA500');
    const vt = vwap_dev < -1 ? L('vwap_low') : (vwap_dev > 1 ? L('vwap_high') : L('vwap_near'));

    // Targets
    const buy_cnt = (rsi < 40 ? 1 : 0) + (close < bb_l ? 1 : 0) + (close < vwap * 0.99 ? 1 : 0) + (macd_cross ? 1 : 0);
    const st_t1 = close < bb_m ? Math.max(bb_m, vwap) : bb_u;
    const st_t2 = close < bb_m ? bb_u : bb_u * 1.025;
    const st_sl = Math.min(bb_l, d.recent_low || bb_l) * 0.995;
    const st_rr1 = (st_t1 - close) / Math.max(close - st_sl, 1e-9);
    const st_rr2 = (st_t2 - close) / Math.max(close - st_sl, 1e-9);

    const rr1c = st_rr1 >= 1.5 ? '#aaffaa' : '#ffaaaa';
    const rr2c = st_rr2 >= 2.0 ? '#aaffaa' : '#ffaaaa';
    const sc = buy_cnt >= 3 ? '#00C851' : (buy_cnt >= 2 ? '#44aaff' : '#FFA500');

    let ac, at, ag;
    if (buy_cnt >= 3) { ac = '#00C851'; at = '<span class="ms green">check_circle</span> ' + L('st_buy_zone'); ag = currentLang === 'ko' ? '다수 지표 과매도 진입. MACD 크로스 확인 후 분할 진입 권장.' : 'Multiple oversold signals. Consider staged entry after MACD cross confirmation.'; }
    else if (buy_cnt >= 2) { ac = '#44aaff'; at = '<span class="ms orange">hourglass_empty</span> ' + L('st_enter_check'); ag = currentLang === 'ko' ? '일부 매수 조건 충족. MACD 골든크로스 또는 RSI 30 이하 추가 확인 권장.' : 'Some buy conditions met. Wait for MACD golden cross or RSI below 30.'; }
    else { ac = '#FFA500'; at = '<span class="ms orange">warning</span> ' + L('watch_rec'); ag = currentLang === 'ko' ? '단기 과매수 또는 혼조 신호. BB 하단 / RSI 30 이하 시 재진입 검토.' : 'Overbought or mixed signals. Re-enter when near BB lower / RSI below 30.'; }

    return `
        <p class="caption mb-8">${currentLang === 'ko' ? 'RSI 과매도/과매수 · MACD 크로스 신호 · 볼린저밴드 %B · VWAP 편차 기반 목표가' : 'RSI Oversold/Overbought · MACD Cross Signal · BB %B · VWAP Deviation Targets'}</p>
        <div class="strategy-grid-4">
            ${renderSignalCard('<span class="ms">trending_down</span>', 'RSI (14)', `${rsi.toFixed(1)}`, rsi_t, rsi_c, '30↓ 강매수 / 70↑ 매도')}
            ${renderSignalCard('<span class="ms">bar_chart</span>', 'MACD', `${macd.toFixed(3)}`, mt, mc, `Sig ${msig.toFixed(3)} | Δ${(macd - msig) >= 0 ? '+' : ''}${(macd - msig).toFixed(3)}`)}
            ${renderSignalCard('<span class="ms">radar</span>', 'BB %B', `${bb_pctB.toFixed(1)}%`, bb_t, bb_c, `${currentLang === 'ko' ? '폭' : 'Width'} ${fmtPrice(bb_w)} (${(bb_w / bb_m * 100).toFixed(1)}%)`)}
            ${renderSignalCard('<span class="ms">balance</span>', 'VWAP', fmtPrice(vwap), vt, vc, `${L('vs_current_pct')} ${vwap_dev >= 0 ? '+' : ''}${vwap_dev.toFixed(1)}%`)}
        </div>

        <h4 class="subheader"><span class="ms">my_location</span> ${L('st_target_title')}</h4>
        <div class="strategy-grid-4">
            ${renderTargetCard(L('current_price_label'), close, '#ffffff', currentLang === 'ko' ? '기준가' : 'Base', sym)}
            ${renderTargetCard(L('target1_short'), st_t1, '#00C851', `${currentLang === 'ko' ? 'BB중심/VWAP' : 'BB Mid/VWAP'} | ${((st_t1 - close) / close * 100).toFixed(1)}%`, sym)}
            ${renderTargetCard(L('target2_short'), st_t2, '#ffaa00', `${currentLang === 'ko' ? 'BB상단' : 'BB Upper'} | ${((st_t2 - close) / close * 100).toFixed(1)}%`, sym)}
            ${renderTargetCard(L('stoploss_line'), st_sl, '#FF4444', `${currentLang === 'ko' ? 'BB하단·최근저점' : 'BB Lower·Recent Low'} | ${((st_sl - close) / close * 100).toFixed(1)}%`, sym)}
        </div>
        <div class="rr-bar">
            <span>${L('profit_ratio')}(1): <b style="color:${rr1c};">1:${st_rr1.toFixed(1)}</b></span>
            <span>${L('profit_ratio')}(2): <b style="color:${rr2c};">1:${st_rr2.toFixed(1)}</b></span>
            <span>${L('buy_signal_cnt')}: <b style="color:${sc};">${buy_cnt}/4</b></span>
            <span>VWAP: <b>${fmtPrice(vwap)}</b></span>
        </div>
        <div class="action-banner mt-16" style="background:${ac}18;border-color:${ac};">
            <div class="title" style="color:${ac};">${at}</div>
            <div class="detail" style="color: var(--muted-dark);font-size:0.82em;margin-top:5px;">${ag}</div>
        </div>
    `;
}

function renderSignalCard(icon, name, value, sig, color, detail) {
    return `<div class="signal-card" style="border:1px solid ${color}55;background:${color}0d;">
        <div class="icon">${icon}</div>
        <div class="name">${name}</div>
        <div class="value" style="color:${color};">${value}</div>
        <div class="sig">${sig}</div>
        <div class="detail">${detail}</div>
    </div>`;
}

function renderTargetCard(label, price, color, desc, sym) {
    return `<div class="signal-card" style="border:1px solid ${color}55;background:${color}0d;">
        <div class="label" style="font-size:0.75em;color: var(--muted);">${label}</div>
        <div class="value" style="font-size:0.9em;font-weight:bold;color:${color};margin:5px 0;">${dualPrice(price, sym)}</div>
        <div class="detail" style="font-size:0.67em;color: var(--muted-darker);">${desc}</div>
    </div>`;
}

// ═══════════════════════════════════════════════
// Swing Strategy
// ═══════════════════════════════════════════════

function renderSwingStrategy(d, sym, rate) {
    const close = d.close;
    const ma20 = d.ma20, ma60 = d.ma60;
    const fibs = d.fibonacci || [];

    // Build fib HTML
    const fibColors = { '0%': '#666', '23.6%': '#4488ff', '38.2%': '#44aaff', '50%': '#ffffff', '61.8%': '#ffaa00', '78.6%': '#ff8844', '100%': '#ff4444' };
    let fibHtml = '';
    let nearSupport = fibs[0] || { pct: '0%', level: close * 0.9 };
    let nearResist = fibs[fibs.length - 1] || { pct: '100%', level: close * 1.1 };

    for (const f of fibs) {
        if (f.level <= close) nearSupport = f;
    }
    for (const f of fibs) {
        if (f.level > close) { nearResist = f; break; }
    }

    fibs.forEach(f => {
        const near = Math.abs(f.level - close) / Math.max(close, 1e-9) < 0.025;
        const c = fibColors[f.pct] || '#888';
        const cls = near ? 'fib-card near' : 'fib-card';
        const nearLabel = near ? `<div class="near-label">${L('fib_near')}</div>` : '';
        fibHtml += `<div class="${cls}"><div class="pct" style="color:${c};">${f.pct}</div><div class="level">${fmtPrice(f.level)}</div>${nearLabel}</div>`;
    });

    // MA status
    const maTc = ma20 > ma60 ? '#00C851' : '#FF4444';
    const ma20Dev = (close - ma20) / ma20 * 100;
    const ma60Dev = (close - ma60) / ma60 * 100;
    const trend = ma20 > ma60 ? L('ma_golden') + ' <span class="ms green">trending_up</span>' : L('ma_dead_arr') + ' <span class="ms red">trending_down</span>';

    // Swing targets
    const sw_entry = close;
    const sw_sl = nearSupport.level < sw_entry ? nearSupport.level * 0.99 : sw_entry * 0.95;
    const sw_risk = Math.max(sw_entry - sw_sl, sw_entry * 0.01);
    const sw_t1 = sw_entry + sw_risk * 2;
    const sw_t2 = sw_entry + sw_risk * 3;
    const sw_rr1 = (sw_t1 - sw_entry) / Math.max(sw_risk, 1e-9);
    const sw_rr2 = (sw_t2 - sw_entry) / Math.max(sw_risk, 1e-9);
    const rr1c = sw_rr1 >= 1.8 ? '#aaffaa' : '#ffaaaa';
    const rr2c = sw_rr2 >= 2.5 ? '#aaffaa' : '#ffaaaa';

    const uptrend = ma20 > ma60 && close > ma20;
    const atSupport = close <= nearSupport.level * 1.04;
    let ac, atTxt, ag;
    if (uptrend && atSupport) {
        ac = '#00C851'; atTxt = '<span class="ms green">check_circle</span> ' + L('swing_buy_zone'); ag = currentLang === 'ko' ? '정배열 + 피보나치 지지권. 손익비 1:2 분할 진입 권장.' : 'Bullish alignment + Fibonacci support. Consider staged entry at R:R 1:2.';
    } else if (!(ma20 > ma60)) {
        ac = '#FF4444'; atTxt = '<span class="ms orange">warning</span> ' + L('swing_avoid'); ag = currentLang === 'ko' ? 'MA 역배열. MA20 돌파 확인 후 재진입 검토.' : 'Bearish MA alignment. Wait for MA20 breakout before re-entry.';
    } else {
        ac = '#FFA500'; atTxt = '<span class="ms orange">hourglass_empty</span> ' + L('swing_wait');
        const fib38 = fibs.find(f => f.pct === '38.2%');
        const fib50 = fibs.find(f => f.pct === '50%');
        ag = currentLang === 'ko' ? `상승추세 중 MA20 위. 피보 38.2%~50% 되돌림 구간(${fib38 ? fmtPrice(fib38.level) : '-'}~${fib50 ? fmtPrice(fib50.level) : '-'}) 진입 검토.` : `Uptrend above MA20. Consider entry at Fib 38.2%–50% zone (${fib38 ? fmtPrice(fib38.level) : '-'}–${fib50 ? fmtPrice(fib50.level) : '-'}).`;
    }

    return `
        <p class="caption mb-8">${currentLang === 'ko' ? '피보나치 되돌림 지지/저항 · 20/60일 이동평균 · 손익비 1:2 기반 목표가' : 'Fibonacci support/resistance · MA20/MA60 · R:R 1:2 targets'}</p>

        <h4 class="subheader"><span class="ms">straighten</span> ${L('fib_title')}</h4>
        <div class="fib-grid">${fibHtml || `<div class="caption">${currentLang === 'ko' ? '피보나치 데이터 없음' : 'No Fibonacci data'}</div>`}</div>

        <h4 class="subheader"><span class="ms">trending_up</span> ${L('ma_title')}</h4>
        <div class="ma-grid">
            <div class="signal-card" style="border:1px solid #44aaff55;border-radius:10px;padding:10px;">
                <div style="font-size:0.75em;color: var(--muted);">${L('ma20_label')}</div>
                <div style="font-size:0.9em;font-weight:bold;color:#44aaff;margin:4px 0;">${dualPrice(ma20, sym, rate)}</div>
                <div style="font-size:0.7em;color:${ma20Dev >= 0 ? '#00C851' : '#FF4444'};">${L('vs_current_pct')} ${ma20Dev >= 0 ? '+' : ''}${ma20Dev.toFixed(1)}%</div>
            </div>
            <div class="signal-card" style="border:1px solid #ff880055;border-radius:10px;padding:10px;">
                <div style="font-size:0.75em;color: var(--muted);">${L('ma60_label')}</div>
                <div style="font-size:0.9em;font-weight:bold;color:#ff8800;margin:4px 0;">${dualPrice(ma60, sym, rate)}</div>
                <div style="font-size:0.7em;color:${ma60Dev >= 0 ? '#00C851' : '#FF4444'};">${L('vs_current_pct')} ${ma60Dev >= 0 ? '+' : ''}${ma60Dev.toFixed(1)}%</div>
            </div>
            <div class="signal-card" style="border:1px solid ${maTc}55;border-radius:10px;padding:10px;">
                <div style="font-size:0.75em;color: var(--muted);">${L('ma_status')}</div>
                <div style="font-size:1.0em;font-weight:bold;color:${maTc};margin:4px 0;">${trend}</div>
                <div style="font-size:0.7em;color: var(--muted-darker);">MA20 ${ma20 > ma60 ? '>' : '<'} MA60</div>
            </div>
        </div>

        <h4 class="subheader"><span class="ms">my_location</span> ${L('swing_target_title')}</h4>
        <div class="strategy-grid-4">
            ${renderTargetCard(L('entry_price'), sw_entry, '#ffffff', currentLang === 'ko' ? '현재가 기준' : 'Based on current', sym)}
            ${renderTargetCard(L('target1_short'), sw_t1, '#00C851', `R:R 1:2 | ${((sw_t1 - sw_entry) / sw_entry * 100).toFixed(1)}%`, sym)}
            ${renderTargetCard(L('target2_short'), sw_t2, '#ffaa00', `R:R 1:3 | ${((sw_t2 - sw_entry) / sw_entry * 100).toFixed(1)}%`, sym)}
            ${renderTargetCard(L('stoploss_line'), sw_sl, '#FF4444', `${L('fib_support')} | ${((sw_sl - sw_entry) / sw_entry * 100).toFixed(1)}%`, sym)}
        </div>
        <div class="rr-bar">
            <span>${L('profit_ratio')}(1): <b style="color:${rr1c};">1:${sw_rr1.toFixed(1)}</b></span>
            <span>${L('profit_ratio')}(2): <b style="color:${rr2c};">1:${sw_rr2.toFixed(1)}</b></span>
            <span>${L('fib_support')}: <b>${nearSupport.pct} (${fmtPrice(nearSupport.level)})</b></span>
            <span>${L('fib_resist')}: <b>${nearResist.pct} (${fmtPrice(nearResist.level)})</b></span>
        </div>
        <div class="action-banner mt-16" style="background:${ac}18;border-color:${ac};">
            <div class="title" style="color:${ac};">${atTxt}</div>
            <div class="detail" style="color: var(--muted-dark);font-size:0.82em;margin-top:5px;">${ag}</div>
        </div>
    `;
}

// ═══════════════════════════════════════════════
// Long-term Strategy
// ═══════════════════════════════════════════════

function renderLongTermStrategy(d, sym, rate) {
    const close = d.close;
    const fin = d.financials || {};

    const roe = fin.roe;
    const opMargin = fin.op_margin;
    const eg = fin.earn_growth;
    const pe = fin.pe_trailing;
    const pb = fin.pb;
    const eps = fin.eps_ttm;
    const fcf = fin.fcf;
    const revGrowth = fin.rev_growth;
    const marketCap = fin.market_cap;

    // ROE cards
    function profCard(label, rawVal, threshHi, threshLo, unit) {
        const c = rawVal != null && rawVal > threshHi ? '#00C851' : (rawVal != null && rawVal > threshLo ? '#FFA500' : '#FF4444');
        const jd = rawVal != null && rawVal > threshHi ? L('excellent') : (rawVal != null && rawVal > threshLo ? L('good') : L('poor'));
        const valStr = rawVal != null ? `${rawVal.toFixed(1)}${unit}` : '—';
        return `<div class="signal-card" style="border:1px solid ${c}55;border-radius:10px;padding:12px;">
            <div style="font-size:0.75em;color: var(--muted);">${label}</div>
            <div style="font-size:1.1em;font-weight:bold;color:${c};margin:5px 0;">${valStr}</div>
            <div style="font-size:0.7em;color: var(--muted-darker);">${rawVal != null ? jd : L('no_data_label')}</div>
        </div>`;
    }

    const roeVal = roe != null ? roe * 100 : null;
    const opVal = opMargin != null ? opMargin * 100 : null;
    const egVal = eg != null ? eg * 100 : null;

    // PER/PBR fair value
    const sectorPer = pe && pe > 5 && pe < 60 ? pe : 20.0;
    const perFair = eps && eps > 0 ? eps * sectorPer : null;
    let pbFair = null;
    if (pb && close && pb > 0) {
        const bps = close / pb;
        const fairPbr = Math.max(1.0, roe && roe > 0 ? roe * 10 : 1.5);
        pbFair = bps * fairPbr;
    }
    const perPrem = perFair ? (perFair - close) / close * 100 : null;
    const pbPrem = pbFair ? (pbFair - close) / close * 100 : null;

    // DCF
    let dcfHtml = `<div class="caption">${L('dcf_no_fcf')}</div>`;
    let dcfValue = null;
    const defaultG = Math.max(0.0, Math.min(0.30, eg || revGrowth || 0.10));
    const growthR = defaultG;
    const termG = 0.03;
    const wacc = 0.10;

    if (fcf && fcf > 0 && marketCap && marketCap > 0 && close > 0) {
        const shares = marketCap / close;
        const fcfPs = fcf / shares;
        let pv5y = 0;
        for (let t = 1; t <= 5; t++) {
            pv5y += fcfPs * Math.pow(1 + growthR, t) / Math.pow(1 + wacc, t);
        }
        const fcfY5 = fcfPs * Math.pow(1 + growthR, 5);
        const denom = Math.max(wacc - termG, 0.001);
        const pvTerm = (fcfY5 * (1 + termG) / denom) / Math.pow(1 + wacc, 5);
        dcfValue = pv5y + pvTerm;

        const dcfPrem = (dcfValue - close) / close * 100;
        const dc = dcfPrem > 0 ? '#00C851' : '#FF4444';
        const dj = dcfPrem > 30 ? L('dcf_strong_buy') : (dcfPrem > 10 ? L('dcf_buy') : (dcfPrem > -10 ? L('fair_value') : L('dcf_overvalue')));

        dcfHtml = `
            <div class="dcf-detail">
                <div class="row">
                    <div><div class="lbl">${L('fcf_ps')}</div><div class="val">${dualPrice(fcfPs, sym, rate)}</div></div>
                    <div><div class="lbl">${L('pv_5y')}</div><div class="val">${dualPrice(pv5y, sym, rate)}</div></div>
                    <div><div class="lbl">${L('pv_term')}</div><div class="val">${dualPrice(pvTerm, sym, rate)}</div></div>
                </div>
                <div class="dcf-result">
                    <span style="color: var(--muted);font-size:0.78em;">${L('dcf_intrinsic')}: </span>
                    <span style="font-size:1.1em;font-weight:bold;color:${dc};">${dualPrice(dcfValue, sym, rate)}</span>
                    <span style="color:${dc};font-size:0.84em;margin-left:8px;">(${dcfPrem >= 0 ? '+' : ''}${dcfPrem.toFixed(1)}%)</span>
                </div>
                <div style="font-size:0.8em;color:${dc};font-weight:bold;margin-top:6px;">${dj}</div>
            </div>
        `;
    }

    // Summary fair value
    const validFv = [perFair, pbFair, dcfValue].filter(v => v != null && v > 0);
    let summaryHtml = `<div class="caption">${L('no_fin_data')}</div>`;
    if (validFv.length > 0) {
        const avgFv = validFv.reduce((a, b) => a + b, 0) / validFv.length;
        const avgPrem = (avgFv - close) / close * 100;
        const ac = avgPrem > 0 ? '#00C851' : '#FF4444';
        const jl = avgPrem > 30 ? '<span class="ms green">favorite</span> ' + L('strong_undervalue') : (avgPrem > 10 ? '<span class="ms green">check_circle</span> ' + L('undervalue_zone') : (avgPrem > -10 ? '<span class="ms">bar_chart</span> ' + L('fair_value') : (avgPrem > -30 ? '<span class="ms orange">warning</span> ' + L('overvalue_warn') : '<span class="ms red">cancel</span> ' + L('strong_overvalue'))));
        summaryHtml = `
            <div class="summary-box" style="border-color:${ac}55;background:${ac}0d;">
                <div class="title"><span class="ms">bar_chart</span> ${L('fair_value_total')}</div>
                <div class="value" style="color:${ac};">${dualPrice(avgFv, sym, rate)}</div>
                <div class="pct" style="color:${ac};">${avgPrem >= 0 ? '+' : ''}${avgPrem.toFixed(1)}%</div>
                <div class="note">${L('per_pbr_avg')}</div>
                <div class="judge" style="color:${ac};">${jl}</div>
            </div>
        `;
    }

    function fairValueCard(lbl, fv, prem, desc) {
        if (fv != null) {
            const c = prem > 0 ? '#00C851' : '#FF4444';
            return `<div class="signal-card" style="border:1px solid ${c}55;border-radius:10px;padding:12px;background:${c}0d;">
                <div style="font-size:0.75em;color: var(--muted);">${lbl}</div>
                <div style="font-size:0.9em;font-weight:bold;color:${c};margin:5px 0;">${dualPrice(fv, sym, rate)}</div>
                <div style="font-size:0.7em;color:${c};">${L('vs_current_pct')} ${prem >= 0 ? '+' : ''}${prem.toFixed(1)}%</div>
                <div style="font-size:0.65em;color: var(--muted-darker);margin-top:2px;">${desc}</div>
            </div>`;
        }
        return `<div class="signal-card" style="border:1px solid #33333355;border-radius:10px;padding:12px;">
            <div style="font-size:0.75em;color: var(--muted);">${lbl}</div>
            <div style="font-size:0.8em;color: var(--muted-darker);margin:8px 0;">${desc}</div>
        </div>`;
    }

    const perPbrStr = pe && pb ? `PER ${pe.toFixed(1)}x | PBR ${pb.toFixed(2)}x` : L('no_data_label');

    return `
        <p class="caption mb-8">${currentLang === 'ko' ? 'PER/PBR 적정주가 · ROE 분석 · DCF 내재가치 (잉여현금흐름 5년 할인 + 영구가치)' : 'PER/PBR Fair Value · ROE Analysis · DCF Intrinsic Value (5yr FCF + Terminal)'}</p>

        <h4 class="subheader"><span class="ms">bar_chart</span> ${L('prof_title')}</h4>
        <div class="profitability-grid">
            ${profCard('ROE', roeVal, 15, 8, '%')}
            ${profCard(L('op_margin'), opVal, 15, 8, '%')}
            ${profCard(currentLang === 'ko' ? '이익성장률(YoY)' : 'Earnings Growth (YoY)', egVal, 15, 5, '%')}
        </div>

        <h4 class="subheader"><span class="ms">straighten</span> ${L('per_pbr_title')}</h4>
        <div class="fair-value-grid">
            ${fairValueCard(L('per_fair'), perFair, perPrem, eps ? `EPS ${fmtPrice(eps)} × PER ${sectorPer.toFixed(0)}x` : L('no_data_label'))}
            ${fairValueCard(L('pbr_fair'), pbFair, pbPrem, currentLang === 'ko' ? 'BPS × 적정PBR (ROE×10, 최소 1.0)' : 'BPS × Fair PBR (ROE×10, min 1.0)')}
            ${fairValueCard(L('current_per_pbr'), null, null, perPbrStr)}
        </div>

        <h4 class="subheader"><span class="ms">payments</span> ${L('dcf_title')}</h4>
        <p class="caption mb-8">${currentLang === 'ko' ? `5년 성장 + 영구가치(Gordon Growth Model) · 잉여현금흐름(FCF/주) 기반 · 성장률 ${(growthR * 100).toFixed(1)}% / WACC 10% / 영구성장 3%` : `5yr Growth + Terminal (Gordon Growth Model) · FCF/Share based · Growth ${(growthR * 100).toFixed(1)}% / WACC 10% / Terminal 3%`}</p>
        <div class="dcf-layout">
            <div>${dcfHtml}</div>
            <div>${summaryHtml}</div>
        </div>
    `;
}

// ═══════════════════════════════════════════════
// Plotly Chart
// ═══════════════════════════════════════════════

// 차트 데이터를 전역에 저장 (통화 토글용)
let _chartData = null;
let _chartCurrency = 'native'; // 'native' | 'KRW' | 'USD'

function renderPlotlyChart(d) {
    _chartData = d;
    _chartCurrency = 'native';
    _buildChart(d, 'native');
}

function toggleChartCurrency(btn, mode) {
    _chartCurrency = mode;
    document.querySelectorAll('.chart-currency-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (_chartData) _buildChart(_chartData, mode);
}

function _buildChart(d, currencyMode) {
    const chart = d.chart;
    if (!chart || chart.length === 0) {
        document.getElementById('chartContainer').innerHTML = `<div class="loading">${L('chart_no_data')}</div>`;
        return;
    }

    const sym = d.symbol || '';
    const krw = isKRW(sym);
    const rate = exchangeRate;

    // 통화 변환 함수
    let convert;
    let prefix = '';
    if (currencyMode === 'KRW' && !krw) {
        convert = v => v * rate;
        prefix = '₩';
    } else if (currencyMode === 'USD' && krw) {
        convert = v => v / rate;
        prefix = '$';
    } else {
        convert = v => v;
        prefix = krw ? '₩' : '$';
    }

    const dates = chart.map(c => c.date);
    const opens = chart.map(c => convert(c.open));
    const highs = chart.map(c => convert(c.high));
    const lows = chart.map(c => convert(c.low));
    const closes = chart.map(c => convert(c.close));
    const ma20s = chart.map(c => c.ma20 != null ? convert(c.ma20) : null);
    const ma60s = chart.map(c => c.ma60 != null ? convert(c.ma60) : null);
    const bbUs = chart.map(c => c.bb_u != null ? convert(c.bb_u) : null);
    const bbLs = chart.map(c => c.bb_l != null ? convert(c.bb_l) : null);
    const macds = chart.map(c => c.macd);
    const macdSigs = chart.map(c => c.macd_sig);
    const macdHists = chart.map(c => c.macd_hist || (c.macd != null && c.macd_sig != null ? c.macd - c.macd_sig : 0));
    const rsis = chart.map(c => c.rsi);

    const entry = convert(Math.min(d.bb_l, d.ma20));
    const t1 = convert(d.bb_m);
    const t2 = convert(d.bb_u);
    const sl = entry * 0.96;

    // ── 메인 차트 트레이스 (legendgroup으로 범례 정리) ──
    const candlestick = {
        x: dates, open: opens, high: highs, low: lows, close: closes,
        type: 'candlestick', name: '캔들',
        increasing: { line: { color: '#00C851' } },
        decreasing: { line: { color: '#FF4444' } },
        showlegend: true,
        legendgroup: 'price',
    };

    const ma20Trace = { x: dates, y: ma20s, type: 'scatter', mode: 'lines', name: 'MA20', line: { color: 'orange', width: 1.2 }, legendgroup: 'ma' };
    const ma60Trace = { x: dates, y: ma60s, type: 'scatter', mode: 'lines', name: 'MA60', line: { color: 'cyan', width: 1.2 }, legendgroup: 'ma' };
    const bbUTrace = { x: dates, y: bbUs, type: 'scatter', mode: 'lines', name: L('bb_upper_trace'), line: { color: 'gray', width: 1, dash: 'dot' }, legendgroup: 'bb' };
    const bbLTrace = { x: dates, y: bbLs, type: 'scatter', mode: 'lines', name: L('bb_lower_trace'), line: { color: 'gray', width: 1, dash: 'dot' }, fill: 'tonexty', fillcolor: 'rgba(128,128,128,0.08)', legendgroup: 'bb' };

    // ── 전략 라인 (라인만 표시, 우측 annotation으로 가격 레이블) ──
    const hline = (y, color, name) => ({
        x: [dates[0], dates[dates.length-1]], y: [y, y],
        type: 'scatter', mode: 'lines', name: name,
        line: { color: color, width: 1.2, dash: 'dash' },
        legendgroup: 'strategy', showlegend: false,
    });

    const entryTrace = hline(entry, '#44aaff', L('buy_target'));
    const t1Trace = hline(t1, '#ffaa00', L('target1'));
    const t2Trace = hline(t2, '#aaaaaa', L('target2'));
    const slTrace = hline(sl, '#FF4444', L('stoploss'));

    // 우측 차트 바깥에 가격 레이블 annotation
    const strategyAnnotations = [
        { x: 1.002, y: entry, xref: 'paper', yref: 'y', text: `${L('buy_target_ann')} ${prefix}${fmtPrice(entry)}`, showarrow: false, font: { color: '#44aaff', size: 10 }, xanchor: 'left', bgcolor: 'rgba(0,0,0,0)' },
        { x: 1.002, y: t1,    xref: 'paper', yref: 'y', text: `${L('target1_ann')}  ${prefix}${fmtPrice(t1)}`,    showarrow: false, font: { color: '#ffaa00', size: 10 }, xanchor: 'left', bgcolor: 'rgba(0,0,0,0)' },
        { x: 1.002, y: t2,    xref: 'paper', yref: 'y', text: `${L('target2_ann')}  ${prefix}${fmtPrice(t2)}`,    showarrow: false, font: { color: '#aaaaaa', size: 10 }, xanchor: 'left', bgcolor: 'rgba(0,0,0,0)' },
        { x: 1.002, y: sl,    xref: 'paper', yref: 'y', text: `${L('stoploss_ann')} ${prefix}${fmtPrice(sl)}`,    showarrow: false, font: { color: '#FF4444', size: 10 }, xanchor: 'left', bgcolor: 'rgba(0,0,0,0)' },
    ];

    // ── MACD 서브차트 ──
    const histColors = macdHists.map(h => h >= 0 ? '#00C851' : '#FF4444');
    const histTrace = { x: dates, y: macdHists, type: 'bar', name: L('macd_hist'), marker: { color: histColors }, yaxis: 'y2', showlegend: true, legendgroup: 'macd' };
    const macdTrace = { x: dates, y: macds, type: 'scatter', mode: 'lines', name: L('macd_line'), line: { color: '#4488ff', width: 1.5 }, yaxis: 'y2', legendgroup: 'macd' };
    const macdSigTrace = { x: dates, y: macdSigs, type: 'scatter', mode: 'lines', name: L('signal_line'), line: { color: '#ff8800', width: 1.5 }, yaxis: 'y2', legendgroup: 'macd' };

    // ── RSI 서브차트 ──
    const rsiTrace = { x: dates, y: rsis, type: 'scatter', mode: 'lines', name: 'RSI', line: { color: 'purple', width: 1.5 }, yaxis: 'y3', legendgroup: 'rsi' };
    const rsi70Trace = { x: [dates[0], dates[dates.length-1]], y: [70, 70], type: 'scatter', mode: 'lines', name: L('overbought_70'), line: { color: '#FF4444', width: 1, dash: 'dot' }, yaxis: 'y3', legendgroup: 'rsi', showlegend: true };
    const rsi30Trace = { x: [dates[0], dates[dates.length-1]], y: [30, 30], type: 'scatter', mode: 'lines', name: L('oversold_30'), line: { color: '#00C851', width: 1, dash: 'dot' }, yaxis: 'y3', legendgroup: 'rsi', showlegend: true };

    const cc = chartColors();
    const layout = {
        height: 850,
        template: cc.template,
        paper_bgcolor: cc.bg,
        plot_bgcolor: cc.plot,
        font: { color: cc.text, family: 'Pretendard, sans-serif' },
        showlegend: true,
        legend: {
            orientation: 'h',
            x: 0.5, xanchor: 'center',
            y: 1.0, yanchor: 'bottom',
            font: { size: 11 },
            itemclick: 'toggle', itemdoubleclick: 'toggleothers',
            bgcolor: 'rgba(0,0,0,0)',
            tracegroupgap: 4,
        },
        margin: { l: 55, r: 115, t: 130, b: 30 },
        xaxis: { rangeslider: { visible: false }, domain: [0, 1], gridcolor: cc.grid },
        yaxis:  { domain: [0.42, 1],    title: { text: prefix, standoff: 5 }, gridcolor: cc.grid, tickprefix: prefix, separatethousands: true },
        yaxis2: { domain: [0.22, 0.40], title: { text: 'MACD', font: { size: 11 } }, gridcolor: cc.grid, anchor: 'x' },
        yaxis3: { domain: [0, 0.20],    title: { text: 'RSI',  font: { size: 11 } }, gridcolor: cc.grid, range: [0, 100], anchor: 'x' },
        annotations: strategyAnnotations,
        shapes: [
            // RSI 30-70 밴드
            { type: 'rect', y0: 30, y1: 70, x0: 0, x1: 1, xref: 'paper', yref: 'y3', fillcolor: 'rgba(128,128,128,0.05)', line: { width: 0 } },
        ],
    };

    const traces = [
        candlestick, ma20Trace, ma60Trace, bbUTrace, bbLTrace,
        entryTrace, t1Trace, t2Trace, slTrace,
        histTrace, macdTrace, macdSigTrace,
        rsiTrace, rsi70Trace, rsi30Trace,
    ];

    Plotly.newPlot('chartContainer', traces, layout, { responsive: true, displayModeBar: true });
}

// ═══════════════════════════════════════════════
// Company Info
// ═══════════════════════════════════════════════

async function loadCompanyInfo(sym) {
    const card = document.getElementById('companyInfoCard');
    if (!card) return;
    try {
        const res = await fetch(`${API}/api/stock/info/${encodeURIComponent(sym)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const info = await res.json();
        renderCompanyInfo(info, card);
        // 영문 설명이 있으면 비동기 번역
        if (info.summary) {
            _translateSummary(info.summary);
        }
    } catch (e) {
        card.innerHTML = `<span class="caption muted">${L('company_error')}</span>`;
    }
}

async function _translateSummary(text) {
    const el = document.getElementById('coSummaryText');
    if (!el) return;

    el.innerHTML += ` <span class="co-translating caption">(${L('co_translating')})</span>`;

    try {
        const body = {
            text,
            user_anthropic_key: getApiKey('anthropic') || '',
            user_openai_key:    getApiKey('openai')    || '',
            user_gemini_key:    getApiKey('gemini')    || '',
            ai_provider: getAiPriority() || 'auto',
        };
        const res = await fetch(`${API}/api/stock/translate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error('translate failed');
        const data = await res.json();

        if (data.translated && data.method !== 'original') {
            const badge = data.method.startsWith('AI')
                ? `<span class="co-trans-badge ai">${L('co_ai_badge')}</span>`
                : `<span class="co-trans-badge">${L('co_trans_badge')}</span>`;
            el.innerHTML = data.translated + ' ' + badge;
        } else {
            // 번역 실패 → 원문 유지, 표시 안내 제거
            el.textContent = text;
        }
    } catch (_) {
        el.textContent = text;
    }
}

function renderCompanyInfo(info, card) {
    const parts = [];
    if (info.sector)    parts.push(`<span class="co-tag"><span class="ms sm">category</span> ${info.sector}</span>`);
    if (info.industry)  parts.push(`<span class="co-tag"><span class="ms sm">factory</span> ${info.industry}</span>`);
    if (info.country)   parts.push(`<span class="co-tag"><span class="ms sm">public</span> ${info.country}</span>`);
    if (info.employees) parts.push(`<span class="co-tag"><span class="ms sm">group</span> ${Number(info.employees).toLocaleString()}${L('employees_unit')}</span>`);
    if (info.exchange)  parts.push(`<span class="co-tag"><span class="ms sm">store</span> ${info.exchange}</span>`);
    if (info.currency)  parts.push(`<span class="co-tag"><span class="ms sm">payments</span> ${info.currency}</span>`);

    let html = '';
    if (parts.length > 0) {
        html += `<div class="co-tags">${parts.join('')}</div>`;
    }
    if (info.summary) {
        const maxLen = 500;
        const shortSummary = info.summary.length > maxLen ? info.summary.slice(0, maxLen) + '...' : info.summary;
        html += `<p class="co-summary" id="coSummaryText">${shortSummary}</p>`;
    }
    if (info.website) {
        html += `<a class="co-link caption" href="${info.website}" target="_blank" rel="noopener"><span class="ms sm">link</span> ${info.website}</a>`;
    }

    if (!html) {
        card.innerHTML = `<span class="caption muted">${L('no_company_info')}</span>`;
        return;
    }
    card.innerHTML = html;
}

// ═══════════════════════════════════════════════
// Financials (lazy load)
// ═══════════════════════════════════════════════

async function loadFinancials(sym) {
    try {
        const res = await fetch(`${API}/api/stock/financials/${encodeURIComponent(sym)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const fin = await res.json();
        // 섹션 자동 펼치기 (Plotly가 보이는 상태에서 렌더링되도록)
        const sec = document.getElementById('financialsSection');
        if (sec && !sec.classList.contains('open')) sec.classList.add('open');
        renderFinancials(fin);
    } catch (e) {
        const body = document.getElementById('financialsBody');
        if (body) body.innerHTML = `<div class="caption">${L('fin_error')} (${e.message})</div>`;
    }
}

// 재무제표 현재 통화 상태 (USD or KRW)
let _finCurrency = 'USD';
let _finData = null;

function renderFinancials(fin) {
    _finData = fin;
    _finCurrency = 'USD';
    _drawFinancials();
}

function toggleFinCurrency(btn) {
    _finCurrency = _finCurrency === 'USD' ? 'KRW' : 'USD';
    document.querySelectorAll('.fin-currency-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    _drawFinancials();
}

function _drawFinancials() {
    const fin = _finData;
    const body = document.getElementById('financialsBody');
    if (!fin || !body) return;

    const displayKrw  = _finCurrency === 'KRW';          // 사용자가 선택한 표시 통화
    const nativeKrw   = (fin.currency || 'USD') === 'KRW'; // 데이터 원본 통화
    const rate        = exchangeRate || 1350;

    /**
     * 금액 변환 + 포맷
     * - 원본이 KRW이고 USD로 보고 싶으면 ÷ rate
     * - 원본이 USD이고 KRW로 보고 싶으면 × rate
     * - 같은 통화면 그대로
     */
    function moneyVal(v) {
        if (v == null) return '—';
        let converted = v;
        if (nativeKrw  && !displayKrw) converted = v / rate;   // KRW → USD
        if (!nativeKrw && displayKrw)  converted = v * rate;   // USD → KRW
        return fmtLargeCurrency(converted, displayKrw);
    }

    /** EPS 변환: yfinance는 항상 주가 통화 기준 */
    function epsVal(v) {
        if (v == null) return '—';
        let converted = v;
        if (nativeKrw  && !displayKrw) converted = v / rate;
        if (!nativeKrw && displayKrw)  converted = v * rate;
        return displayKrw
            ? `₩${Math.round(converted).toLocaleString()}`
            : `$${converted.toFixed(2)}`;
    }

    const nativeLabel = nativeKrw ? 'KRW' : 'USD';
    const toggleHtml = ''; // 토글은 차트 헤더 우측으로 이동

    // ── 밸류에이션 ──────────────────────────────────────────
    const valItems = [
        { label: L('market_cap'),   value: moneyVal(fin.market_cap) },
        { label: 'PER (TTM)',       value: fmtX(fin.pe_trailing) },
        { label: 'PER (Fwd)',       value: fmtX(fin.pe_forward) },
        { label: 'PBR',             value: fmtX(fin.pb) },
        { label: 'PSR',             value: fmtX(fin.ps) },
        { label: 'EV/EBITDA',       value: fmtX(fin.ev_ebitda) },
        { label: L('div_yield'),    value: fmtPct(fin.div_yield) },
        { label: 'EPS (TTM)',       value: epsVal(fin.eps_ttm) },
    ];

    let valHtml = `<h4 class="subheader"><span class="ms">straighten</span> ${L('valuation')}</h4><div class="fin-val-grid">`;
    valItems.forEach(({ label, value }) => {
        valHtml += `<div class="fin-val-card"><div class="label">${label}</div><div class="value">${value}</div></div>`;
    });
    valHtml += '</div>';

    // ── 수익성 ──────────────────────────────────────────────
    const profItems = [
        [L('revenue_ttm'),  moneyVal(fin.rev_ttm)],
        [L('op_margin'),    fmtPct(fin.op_margin)],
        [L('net_margin'),   fmtPct(fin.net_margin)],
        ['ROE',             fmtPct(fin.roe)],
        ['ROA',             fmtPct(fin.roa)],
    ];

    // ── 성장성 & 현금흐름 ────────────────────────────────────
    const growthItems = [
        [L('rev_growth'),   fmtPct(fin.rev_growth)],
        [L('earn_growth'),  fmtPct(fin.earn_growth)],
        [L('op_cf'),        moneyVal(fin.op_cf)],
        [L('fcf'),          moneyVal(fin.fcf)],
    ];

    // ── 안정성 ──────────────────────────────────────────────
    const de = fin.debt_equity;
    const cr = fin.current_ratio;
    const ic = fin.interest_coverage;
    const deColor = de != null ? (de > 200 ? '#FF4444' : de > 100 ? '#FFA500' : '#00C851') : null;
    const crColor = cr != null ? (cr < 1   ? '#FF4444' : cr < 1.5 ? '#FFA500' : '#00C851') : null;
    const icColor = ic != null ? (ic < 1.5 ? '#FF4444' : ic < 3   ? '#FFA500' : '#00C851') : null;
    const stabItems = [
        [L('debt_equity'),       de != null ? `${de.toFixed(1)}%` : '—', deColor],
        [L('current_ratio'),     cr != null ? cr.toFixed(2)        : '—', crColor],
        [L('interest_coverage'), ic != null ? `${ic.toFixed(1)}x` : '—', icColor],
    ];

    let colHtml = '<div class="fin-3col">';
    colHtml += `<div><h4 class="subheader"><span class="ms">bar_chart</span> ${L('profitability')}</h4>`;
    profItems.forEach(([l, v]) => {
        colHtml += `<div class="fin-row"><span class="label">${l}</span><span class="value">${v}</span></div>`;
    });
    colHtml += '</div>';
    colHtml += `<div><h4 class="subheader"><span class="ms">trending_up</span> ${L('growth')}</h4>`;
    growthItems.forEach(([l, v]) => {
        colHtml += `<div class="fin-row"><span class="label">${l}</span><span class="value">${v}</span></div>`;
    });
    colHtml += '</div>';
    colHtml += `<div><h4 class="subheader"><span class="ms">shield</span> ${L('stability')}</h4>`;
    stabItems.forEach(([l, v, c]) => {
        const style = c ? ` style="color:${c};"` : '';
        colHtml += `<div class="fin-row"><span class="label">${l}</span><span class="value"${style}>${v}</span></div>`;
    });
    colHtml += '</div></div>';

    // ── 연간 차트 영역 ──────────────────────────────────────
    const hasChart = fin.income && Object.keys(fin.income).length > 0;
    const chartHtml = hasChart
        ? `<div class="fin-chart-header">
               <h4 class="subheader" style="margin:0;"><span class="ms">insert_chart</span> ${L('annual_chart')}</h4>
               <div class="fin-currency-toggle" style="margin:0;">
                   <span class="caption" style="color:var(--muted);">${L('native_currency')}: ${nativeLabel} · ${L('unit_label')}:</span>
                   <button class="fin-currency-btn ${!displayKrw ? 'active' : ''}" onclick="toggleFinCurrency(this)">USD ($)</button>
                   <button class="fin-currency-btn ${displayKrw  ? 'active' : ''}" onclick="toggleFinCurrency(this)">KRW (₩)</button>
               </div>
           </div>
           <div id="finChartContainer" style="height:340px;"></div>`
        : '';

    body.innerHTML = toggleHtml + valHtml + colHtml + chartHtml;

    // ── Plotly 차트 ─────────────────────────────────────────
    if (hasChart) {
        const years = Object.keys(fin.income).sort();

        // 표시 단위 결정
        // KRW 표시: 조원(1e12) / USD 표시: 십억달러(1e9)
        const chartUnit  = displayKrw ? 1e12 : 1e9;
        const unitLabel  = displayKrw ? L('fin_unit_krw') : L('fin_unit_usd');

        // 원본값 → 표시 통화 → 차트 단위로 나누기
        function toChartVal(v) {
            if (v == null) return null;
            let cv = v;
            if (nativeKrw  && !displayKrw) cv = v / rate;
            if (!nativeKrw && displayKrw)  cv = v * rate;
            return cv / chartUnit;
        }

        const revs = years.map(y => toChartVal(fin.income[y]?.revenue));
        const ops  = years.map(y => toChartVal(fin.income[y]?.op_income));
        const nets = years.map(y => toChartVal(fin.income[y]?.net_income));
        const cfs  = years.map(y => toChartVal(fin.cashflow?.[y]?.op_cf));

        const traces = [
            { x: years, y: revs, type: 'bar',   name: L('c_revenue'),   marker: { color: '#4488ff' } },
            { x: years, y: ops,  type: 'bar',   name: L('c_op_income'), marker: { color: '#00C851' } },
            { x: years, y: nets, type: 'bar',   name: L('c_net_income'), marker: { color: '#ffaa00' } },
            { x: years, y: cfs,  type: 'scatter', mode: 'lines+markers',
              name: L('c_op_cf'), line: { color: '#ff4488', width: 2 }, marker: { size: 8 } },
        ];

        const fc = chartColors();
        const layout = {
            title: {
                text: `${L('annual_chart')} (${L('unit_label')}: ${unitLabel})`,
                font: { size: 13, color: fc.text },
                x: 0.5,
            },
            barmode: 'group',
            template: fc.template,
            paper_bgcolor: fc.bg,
            plot_bgcolor:  fc.plot,
            font:   { color: fc.text, size: 11 },
            height: 340,
            margin: { l: 70, r: 20, t: 45, b: 40 },
            showlegend: true,
            legend: { orientation: 'h', y: 1.18 },
            xaxis: { type: 'category' },
            yaxis: { tickformat: '.2f' },   // Y축 제목 제거 (차트 제목에 단위 표시)
        };

        setTimeout(() => {
            const el = document.getElementById('finChartContainer');
            if (el) Plotly.newPlot(el, traces, layout, { responsive: true });
        }, 300);
    }
}

// 재무제표 섹션 수동 토글 시 Plotly 차트 크기 복원
function toggleExpandable(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('open');
    if (el.classList.contains('open') && id === 'financialsSection') {
        setTimeout(() => {
            const chart = document.getElementById('finChartContainer');
            if (chart && chart._fullLayout) Plotly.relayout(chart, { autosize: true });
        }, 50);
    }
}

function fmtLargeCurrency(v, isKrw) {
    if (v == null) return '—';
    const abs = Math.abs(v);
    const sign = v < 0 ? '-' : '';
    if (isKrw) {
        if (abs >= 1e16) return `${sign}${(v / 1e16).toFixed(2)}경원`;
        if (abs >= 1e12) return `${sign}${(v / 1e12).toFixed(2)}조원`;
        if (abs >= 1e8)  return `${sign}${(v / 1e8).toFixed(1)}억원`;
        return `${sign}${Math.round(v).toLocaleString()}원`;
    } else {
        if (abs >= 1e12) return `${sign}$${(v / 1e12).toFixed(2)}T`;
        if (abs >= 1e9)  return `${sign}$${(v / 1e9).toFixed(2)}B`;
        if (abs >= 1e6)  return `${sign}$${(v / 1e6).toFixed(2)}M`;
        return `${sign}$${Math.round(v).toLocaleString()}`;
    }
}

// ═══════════════════════════════════════════════
// Main Analysis Tab — AI Comment
// ═══════════════════════════════════════════════

async function _loadMainAI(sym, name, d, buy_cnt, sell_cnt, verdict) {
    const boxEl  = document.getElementById('mainAiBox');
    const bodyEl = document.getElementById('mainAiBody');
    const badgeEl = document.getElementById('mainAiBadge');
    if (!boxEl || !bodyEl) return;

    const userAnthropicKey = getApiKey('anthropic');
    const userOpenaiKey    = getApiKey('openai');
    const userGeminiKey    = getApiKey('gemini');
    const activeKey = getActiveApiKeyInfo();

    // 등록된 키가 없으면 박스 숨김
    if (!activeKey) {
        boxEl.style.display = 'none';
        return;
    }

    const providerInfo = AI_PROVIDERS.find(p => p.id === activeKey.provider);
    if (badgeEl) badgeEl.textContent = providerInfo ? providerInfo.name : 'AI';

    try {
        const res = await fetch(`${API}/api/market/ai-analysis`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ticker:            sym,
                name:              name,
                desc:              '',
                close:             d.close,
                change_pct:        d.change_pct || 0,
                rsi:               d.rsi,
                macd:              d.macd,
                macd_sig:          d.macd_sig,
                bb_u:              d.bb_u,
                bb_m:              d.bb_m,
                bb_l:              d.bb_l,
                ma20:              d.ma20,
                ma60:              d.ma60,
                stoch_k:           d.stoch_k,
                stoch_d:           d.stoch_d,
                buy_cnt:           buy_cnt,
                sell_cnt:          sell_cnt,
                verdict:           verdict,
                reason:            '',
                user_anthropic_key: userAnthropicKey,
                user_openai_key:    userOpenaiKey,
                user_gemini_key:    userGeminiKey,
                ai_provider:       getAiPriority(),
            }),
        });
        const data = await res.json();
        const text = data.analysis || '';

        if (!text || text.includes('API 키가 없습니다')) {
            boxEl.style.display = 'none';
            return;
        }

        bodyEl.innerHTML = `<p class="ai-text">${text.replace(/\n/g, '<br>')}</p>`;
    } catch (e) {
        bodyEl.innerHTML = `<p style="color:var(--muted);font-size:0.85em;">${L('ai_request_failed')}: ${e.message}</p>`;
    }
}

// ═══════════════════════════════════════════════
// PDF Download
// ═══════════════════════════════════════════════

async function downloadPDF(sym) {
    const btn = document.querySelector('.pdf-btn');
    btn.disabled = true;
    btn.innerHTML = `<span class="ms">hourglass_empty</span> ${L('pdf_generating')}`;
    try {
        const name = _chartData?.name || sym;
        const res = await fetch(`${API}/api/pdf/report`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                symbol: sym,
                period: periodSelect.value,
                name: name,
            }),
        });
        if (!res.ok) {
            let msg = L('pdf_failed');
            try { const j = await res.json(); msg = j.detail || msg; } catch (_) {}
            throw new Error(msg);
        }
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${sym.replace(/\./g, '_')}_analysis.pdf`;
        a.click();
        URL.revokeObjectURL(url);
    } catch (e) {
        alert(e.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<span class="ms">description</span> ${L('pdf_report')}`;
    }
}

// ═══════════════════════════════════════════════
// Tab 2: Watchlist
// ═══════════════════════════════════════════════

let watchlistLoaded = false;

async function loadWatchlist(force = false) {
    if (watchlistLoaded && !force) return;
    const container = document.getElementById('watchlistContent');
    container.innerHTML = `<div class="loading">${L('wl_loading')}</div>`;

    try {
        const res = await fetch(`${API}/api/market/watchlist`);
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        renderWatchlist(data, container);
        watchlistLoaded = true;
    } catch (e) {
        container.innerHTML = `<div class="error-msg">${L('wl_error')}</div>`;
    }
}

function renderWatchlist(data, container) {
    window._lastWatchlistData = data;
    let html = '';
    for (const [category, rows] of Object.entries(data)) {
        if (!rows || rows.length === 0) continue;
        html += `<div class="watchlist-category"><h4>${category}</h4>`;
        html += `<table class="wl-table"><thead><tr>
            <th>${L('wl_name')}</th><th>${L('wl_price')}</th><th>${L('wl_change')}</th><th>${L('wl_rsi')}</th><th>${L('wl_entry')}</th>
            <th>${L('wl_target1')}</th><th>${L('wl_target2')}</th><th>${L('wl_short')}</th><th>${L('wl_mid')}</th><th>${L('wl_long')}</th><th>${L('wl_reason')}</th>
        </tr></thead><tbody>`;
        for (const r of rows) {
            const chg = r.change_pct ?? 0;
            const rsi = r.rsi ?? 50;
            const cc = chg >= 0 ? '#00C851' : '#FF4444';
            const rsiC = rsi < 40 ? '#00C851' : (rsi > 65 ? '#FF4444' : '#FFA500');
            const vColor = r.color || '#FFA500';
            const retS = r.ret_short ?? 0;
            const retM = r.ret_mid ?? 0;
            const retL = r.ret_long ?? 0;
            const crs = retS > 0 ? '#00C851' : '#FF4444';
            const crm = retM > 0 ? '#00C851' : '#FF4444';
            const crl = retL > 0 ? '#00C851' : '#FF4444';
            const noData = r.close === null || r.close === undefined;
            html += `<tr>
                <td class="name-cell" style="min-width:120px;">
                    <div class="name">${r.name}</div>
                    <div class="ticker">${r.ticker}</div>
                    <div class="verdict" style="color:${vColor};">${r.verdict || '—'}</div>
                    ${r.desc ? `<div class="wl-desc">${r.desc}</div>` : ''}
                </td>
                <td style="font-weight:600;">${noData ? '<span style="color:var(--muted);">—</span>' : fmtPrice(r.close)}</td>
                <td style="color:${cc};font-weight:600;">${noData ? '—' : (chg >= 0 ? '+' : '') + Number(chg).toFixed(1) + '%'}</td>
                <td style="color:${rsiC};font-weight:600;">${noData ? '—' : Number(rsi).toFixed(1)}</td>
                <td style="color:#44aaff;">${noData ? '—' : fmtPrice(r.entry)}</td>
                <td>${noData ? '—' : fmtPrice(r.target1)}</td>
                <td style="color:#ffaa00;">${noData ? '—' : fmtPrice(r.target2)}</td>
                <td style="color:${crs};font-weight:600;">${noData ? '—' : Number(retS).toFixed(1) + '%'}</td>
                <td style="color:${crm};font-weight:600;">${noData ? '—' : Number(retM).toFixed(1) + '%'}</td>
                <td style="color:${crl};font-weight:600;">${noData ? '—' : Number(retL).toFixed(1) + '%'}</td>
                <td style="color:var(--text-secondary);max-width:200px;">${r.reason || L('wl_mixed')}</td>
            </tr>`;
        }
        html += '</tbody></table></div>';
    }
    html += `<hr class="divider"><p class="caption">${L('disclaimer_text')}</p>`;
    container.innerHTML = html;
}

// ═══════════════════════════════════════════════
// Tab 3: Themes
// ═══════════════════════════════════════════════

let themesData = null;
let themesLoaded = false;

async function loadThemes(force = false) {
    if (themesLoaded && !force) return;
    const btnContainer = document.getElementById('themeButtons');
    const contentContainer = document.getElementById('themeContent');

    try {
        const res = await fetch(`${API}/api/market/themes`);
        if (!res.ok) throw new Error('Failed');
        themesData = await res.json();
        renderThemeButtons(btnContainer);
        // Select first theme
        const firstTheme = Object.keys(themesData)[0];
        if (firstTheme) selectTheme(firstTheme);
        themesLoaded = true;
    } catch (e) {
        contentContainer.innerHTML = `<div class="error-msg">${L('theme_error')}</div>`;
    }
}

function renderThemeButtons(container) {
    const names = Object.keys(themesData);
    // Sort: favorites first
    const sorted = [...names].sort((a, b) => {
        const af = favorites.has(a) ? 0 : 1;
        const bf = favorites.has(b) ? 0 : 1;
        return af - bf || a.localeCompare(b);
    });

    container.innerHTML = sorted.map(name => {
        const isFav = favorites.has(name);
        const isSel = name === currentTheme;
        return `<button class="theme-btn ${isSel ? 'active' : ''} ${isFav ? 'fav' : ''}" onclick="selectTheme('${name.replace(/'/g, "\\'")}')">${isFav ? '<span class="ms filled orange">star</span> ' : ''}${name}</button>`;
    }).join('');
}

async function selectTheme(name) {
    currentTheme = name;
    themePage = 0;
    renderThemeButtons(document.getElementById('themeButtons'));
    await renderThemeContent(name);
}

// ── 테마 종목 상태 ──────────────────────────────────────────
const _themeStockMap = {};   // safeId -> full stock data
const _themeAiCache = {};    // safeId -> AI analysis text

function _safeId(ticker) {
    return ticker.replace(/[^a-zA-Z0-9]/g, '_');
}

async function renderThemeContent(name) {
    const container = document.getElementById('themeContent');
    const theme = themesData[name];
    if (!theme) return;

    const isFav = favorites.has(name);
    const escapedName = name.replace(/'/g, "\\'");

    let headerHtml = `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
            <button onclick="toggleFavorite('${escapedName}')" class="btn-icon" title="${L('fav_title')}">${isFav ? '<span class="ms filled orange">star</span>' : '<span class="ms">star</span>'}</button>
            <div>
                <h4>${name}</h4>
                <p class="caption">${theme.desc || ''}</p>
            </div>
        </div>
    `;

    container.innerHTML = headerHtml + `<div class="loading">${L('theme_loading')}</div>`;

    try {
        const res = await fetch(`${API}/api/market/themes/${encodeURIComponent(name)}/analyze`);
        if (!res.ok) throw new Error('Failed');
        const stocks = await res.json();
        // 캐시: 정적 테마 데이터에 분석 결과 저장
        themesData[name].analyzed_stocks = stocks;
        renderThemeStocksTable(headerHtml, stocks, container);
    } catch (e) {
        // 분석 실패 시 정적 목록만 표시
        let html = headerHtml + `<p class="caption mb-8">${L('theme_static_fail')}</p>`;
        if (theme.stocks) {
            html += `<table class="theme-table"><thead><tr><th>${L('theme_name_col')}</th><th>${L('theme_ticker_col')}</th><th>${L('theme_desc_col')}</th></tr></thead><tbody>`;
            theme.stocks.forEach(s => {
                html += `<tr>
                    <td><b>${s.name}</b></td>
                    <td style="color:var(--muted);">${s.ticker}</td>
                    <td style="color:var(--text-secondary);">${s.desc || ''}</td>
                </tr>`;
            });
            html += '</tbody></table>';
        }
        container.innerHTML = html;
    }
}

function renderThemeStocksTable(headerHtml, stocks, container) {
    const total = stocks.length;
    const totalPages = Math.max(1, Math.ceil(total / STOCKS_PER_PAGE));
    const page = Math.min(themePage, totalPages - 1);
    const start = page * STOCKS_PER_PAGE;
    const pageRows = stocks.slice(start, start + STOCKS_PER_PAGE);

    // 종목 데이터 전역 맵에 저장
    stocks.forEach(r => { _themeStockMap[_safeId(r.ticker)] = r; });

    let html = headerHtml;
    html += `<p class="text-sm mb-8"><b>${currentLang === 'ko' ? `총 ${total}개 종목` : `${total} stocks`}</b> · ${currentLang === 'ko' ? '매수 신호 강도 순' : 'Sorted by signal strength'} · ${currentLang === 'ko' ? `페이지 ${page + 1} / ${totalPages}` : `Page ${page + 1} / ${totalPages}`}</p>`;
    html += `<table class="theme-table">
        <thead><tr>
            <th style="width:44px">${L('rank_col')}</th>
            <th>${L('theme_name_col')}</th>
            <th>${L('wl_price')}</th>
            <th>${L('change_col')}</th>
            <th>${L('wl_rsi')}</th>
            <th>${L('entry_col')}</th>
            <th>${L('target_col')}</th>
            <th>${L('short_return')}</th>
            <th>${L('verdict_col')}</th>
            <th>${L('buy_basis')}</th>
            <th style="width:32px"></th>
        </tr></thead><tbody>`;

    pageRows.forEach((r, i) => {
        const rank = start + i + 1;
        const badge = rank === 1 ? '🥇' : (rank === 2 ? '🥈' : (rank === 3 ? '🥉' : `#${rank}`));
        const sid = _safeId(r.ticker);
        const cc = (r.change_pct || 0) >= 0 ? '#00C851' : '#FF4444';
        const rsiC = r.rsi < 40 ? '#00C851' : (r.rsi > 65 ? '#FF4444' : '#FFA500');
        const vColor = r.color || '#FFA500';
        const noData = r.close === null || r.close === undefined;

        html += `
        <tr class="theme-stock-row" id="tsr-${sid}" onclick="toggleThemeRow('${sid}')">
            <td style="text-align:center;font-size:1.1em;">${badge}</td>
            <td class="name-cell" style="min-width:110px;">
                <div class="name">${r.name}</div>
                <div class="ticker">${r.ticker}</div>
            </td>
            <td style="font-weight:600;">${noData ? '—' : fmtPrice(r.close)}</td>
            <td style="color:${cc};font-weight:600;">${noData ? '—' : (r.change_pct >= 0 ? '+' : '') + Number(r.change_pct).toFixed(1) + '%'}</td>
            <td style="color:${rsiC};font-weight:600;">${noData ? '—' : Number(r.rsi).toFixed(1)}</td>
            <td style="color:#44aaff;">${noData ? '—' : fmtPrice(r.entry)}</td>
            <td style="color:#ffaa00;">${noData ? '—' : fmtPrice(r.target2)}</td>
            <td style="color:${(r.ret_short || 0) > 0 ? '#00C851' : '#FF4444'};font-weight:600;">${noData ? '—' : Number(r.ret_short || 0).toFixed(1) + '%'}</td>
            <td style="color:${vColor};font-weight:bold;">${r.verdict || '—'}</td>
            <td style="color:var(--text-secondary);font-size:0.88em;">${r.reason || L('wl_mixed')}</td>
            <td style="text-align:center;color:var(--muted);font-size:0.8em;" class="tsr-arrow">▶</td>
        </tr>
        <tr class="theme-detail-row" id="tdr-${sid}">
            <td colspan="11" style="padding:0;">
                <div class="theme-detail-wrap" id="tdw-${sid}"></div>
            </td>
        </tr>`;
    });

    html += '</tbody></table>';
    html += `<div class="pagination">
        <button class="btn-secondary" onclick="themePagePrev()" ${page === 0 ? 'disabled' : ''}>${L('prev_page')}</button>
        <span class="info">${currentLang === 'ko' ? `페이지 ${page + 1} / ${totalPages} · 전체 ${total}개 종목` : `Page ${page + 1} / ${totalPages} · ${total} stocks`}</span>
        <button class="btn-secondary" onclick="themePageNext()" ${page >= totalPages - 1 ? 'disabled' : ''}>${L('next_page')}</button>
        <select class="per-page-select" onchange="setPerPage(this.value)" title="${L('per_page_title')}">
            <option value="10"  ${STOCKS_PER_PAGE === 10  ? 'selected' : ''}>${currentLang === 'ko' ? '10개' : '10'}</option>
            <option value="20"  ${STOCKS_PER_PAGE === 20  ? 'selected' : ''}>${currentLang === 'ko' ? '20개' : '20'}</option>
            <option value="50"  ${STOCKS_PER_PAGE === 50  ? 'selected' : ''}>${currentLang === 'ko' ? '50개' : '50'}</option>
        </select>
    </div>`;
    html += `<hr class="divider"><p class="caption">${L('disclaimer_text')}</p>`;

    container.innerHTML = html;
}

function toggleThemeRow(sid) {
    const detailRow = document.getElementById(`tdr-${sid}`);
    const stockRow  = document.getElementById(`tsr-${sid}`);
    const wrap      = document.getElementById(`tdw-${sid}`);
    if (!detailRow || !stockRow) return;

    const isOpen = stockRow.classList.contains('expanded');
    if (isOpen) {
        stockRow.classList.remove('expanded');
        detailRow.style.display = 'none';
        return;
    }

    stockRow.classList.add('expanded');
    detailRow.style.display = 'table-row';

    const r = _themeStockMap[sid];
    if (!r) return;

    // 콘텐츠가 이미 그려진 경우 재렌더 스킵
    if (wrap.dataset.rendered === '1') return;
    wrap.dataset.rendered = '1';
    wrap.innerHTML = _buildThemeDetailHtml(r, sid);

    // 트레이딩 전략 서브탭 초기화
    setupSubTabs('tst-' + sid);

    // AI 분석 자동 요청
    _loadThemeAI(sid, r);
}

function _buildThemeDetailHtml(r, sid) {
    const close = r.close;
    const sym   = r.ticker;
    const rate  = exchangeRate;

    if (r.close === null || r.close === undefined) {
        return `<div style="padding:16px;color:var(--muted);">${L('no_data_label')}</div>`;
    }

    // 지표 계산
    const rsi_s  = r.rsi < 40 ? '매수' : (r.rsi > 65 ? '매도' : '중립');
    const macd_s = r.macd > r.macd_sig ? '매수' : '매도';
    const bb_s   = close < r.bb_l ? '매수' : (close > r.bb_u ? '매도' : '중립');
    const ma_s   = (close > r.ma20 && r.ma20 > r.ma60) ? '매수' : ((close < r.ma20 && r.ma20 < r.ma60) ? '매도' : '중립');
    const stk_s  = (r.stoch_k < 25 && r.stoch_d < 25) ? '매수' : ((r.stoch_k > 75 && r.stoch_d > 75) ? '매도' : '중립');

    const buy_cnt  = [rsi_s, macd_s, bb_s, ma_s, stk_s].filter(s => s === '매수').length;
    const sell_cnt = [rsi_s, macd_s, bb_s, ma_s, stk_s].filter(s => s === '매도').length;
    const vColor   = r.color || '#FFA500';

    const rsiMsg  = `RSI ${fmt(r.rsi, 1)} — ${rsi_s === '매수' ? L('rsi_oversold') : rsi_s === '매도' ? L('rsi_overbought') : L('neutral')}`;
    const macdMsg = macd_s === '매수' ? `MACD > Signal — ${L('macd_up')}` : `MACD < Signal — ${L('macd_down')}`;
    const bbMsg   = bb_s === '매수' ? L('bb_lower') : (bb_s === '매도' ? L('bb_upper') : L('bb_mid'));
    const maMsg   = ma_s === '매수' ? L('ma_up') : (ma_s === '매도' ? L('ma_down') : L('ma_mixed'));
    const stkMsg  = `${L('stoch_indicator')} ${stk_s === '매수' ? L('stoch_oversold') : stk_s === '매도' ? L('stoch_overbought') : L('neutral')} (K:${fmt(r.stoch_k, 1)})`;

    // 전략 계산용 데이터 객체 (renderShortTermStrategy / renderSwingStrategy 호환)
    const d = {
        close: r.close, rsi: r.rsi, macd: r.macd, macd_sig: r.macd_sig,
        bb_u: r.bb_u, bb_m: r.bb_m, bb_l: r.bb_l,
        ma20: r.ma20, ma60: r.ma60,
        stoch_k: r.stoch_k, stoch_d: r.stoch_d,
        vwap: r.close, // 근사값
        macd_cross: false, macd_death: false,
        recent_low: r.bb_l,
        fibonacci: [],
        financials: {},
    };

    // 매매 전략 advice (renderAnalysis와 동일 로직)
    let advTitle, advColor, advDesc;
    if (buy_cnt >= 3) {
        advTitle = '<span class="ms green">check_circle</span> ' + L('advice_buy'); advColor = '#00C851';
        advDesc = `${buy_cnt} ${currentLang === 'ko' ? '개 지표 매수 신호' : 'buy signals'}. `;
        if (bb_s === '매수') advDesc += currentLang === 'ko' ? 'BB 하단 지지. ' : 'BB lower support. ';
        if (rsi_s === '매수') advDesc += currentLang === 'ko' ? 'RSI 과매도. ' : 'RSI oversold. ';
        if (ma_s === '매수') advDesc += currentLang === 'ko' ? 'MA 정배열.' : 'MA bullish.';
    } else if (sell_cnt >= 3) {
        advTitle = '<span class="ms red">block</span> ' + L('advice_sell'); advColor = '#FF4444';
        advDesc = `${sell_cnt} ${currentLang === 'ko' ? '개 지표 매도 신호' : 'sell signals'}. `;
        if (bb_s === '매도') advDesc += currentLang === 'ko' ? 'BB 상단 과열. ' : 'BB upper overheated. ';
        if (rsi_s === '매도') advDesc += currentLang === 'ko' ? 'RSI 과매수. ' : 'RSI overbought. ';
        if (ma_s === '매도') advDesc += currentLang === 'ko' ? 'MA 역배열.' : 'MA bearish.';
    } else {
        advTitle = '<span class="ms orange">hourglass_empty</span> ' + L('advice_neutral'); advColor = '#FFA500';
        advDesc = currentLang === 'ko' ? '지표 혼조. MACD 방향 전환 또는 RSI 30 이하 시 매수 신호.' : 'Mixed signals. Watch for MACD reversal or RSI below 30.';
    }

    return `
    <div class="theme-detail-inner">
        ${r.desc ? `<p class="theme-detail-desc">${r.desc}</p>` : ''}

        <!-- 종합 판단 배너 -->
        <div class="verdict-banner" style="background:${vColor}22;border-color:${vColor};color:${vColor};margin-bottom:14px;">
            <h2>${L('verdict_title')}: ${dSignal(r.verdict)}</h2>
            <div class="sub">${L('buy_signals_cnt')} ${buy_cnt} · ${L('sell_signals_cnt')} ${sell_cnt} · ${L('neutral_cnt')} ${5 - buy_cnt - sell_cnt}</div>
        </div>

        <!-- 매매 전략 배너 -->
        <div class="action-banner" style="background:${advColor}18;border-color:${advColor};margin-bottom:14px;">
            <div class="title" style="color:${advColor};">${advTitle}</div>
            <div class="detail">${advDesc}</div>
        </div>

        <!-- 지표 카드 5개 -->
        <h3 class="subheader"><span class="ms">bar_chart</span> ${L('indicator_analysis')}</h3>
        <div class="indicators-grid" style="margin-bottom:16px;">
            ${renderIndicatorCard('RSI (14)',           rsi_s,  rsiMsg,  fmt(r.rsi, 1))}
            ${renderIndicatorCard('MACD',               macd_s, macdMsg, fmt(r.macd, 3))}
            ${renderIndicatorCard(L('bb_indicator'),    bb_s,   bbMsg,   `${currentLang === 'ko' ? '상단' : 'Upper'} ${fmtPrice(r.bb_u)} / ${currentLang === 'ko' ? '하단' : 'Lower'} ${fmtPrice(r.bb_l)}`)}
            ${renderIndicatorCard(L('ma_indicator'),    ma_s,   maMsg,   `MA20: ${fmtPrice(r.ma20)} / MA60: ${fmtPrice(r.ma60)}`)}
            ${renderIndicatorCard(L('stoch_indicator'), stk_s,  stkMsg,  `K: ${fmt(r.stoch_k,1)} / D: ${fmt(r.stoch_d,1)}`)}
        </div>

        <!-- 매매 가격 정보 -->
        <h3 class="subheader"><span class="ms">payments</span> ${L('trading_strategy')}</h3>
        <div class="strategy-grid" style="margin-bottom:16px;">
            ${renderStrategyCard(L('buy_target'), r.entry,        '#44aaff', L('bb_entry'), sym)}
            ${renderStrategyCard(L('target1'),    r.target1,      '#00C851', `${currentLang === 'ko' ? '기대수익' : 'Expected'} +${fmt(r.ret_short, 1)}% | ${currentLang === 'ko' ? 'BB 중심' : 'BB Mid'}`, sym)}
            ${renderStrategyCard(L('target2'),    r.target2,      '#ffaa00', `${currentLang === 'ko' ? '기대수익' : 'Expected'} +${fmt(r.ret_mid,   1)}% | ${currentLang === 'ko' ? 'BB 상단' : 'BB Upper'}`, sym)}
            ${renderStrategyCard(L('stoploss'),   r.entry * 0.96, '#FF4444', currentLang === 'ko' ? '손실 -4% | 매수가 -4%' : 'Loss -4% | Entry -4%', sym)}
        </div>
        <hr class="divider">

        <!-- 트레이딩 전략 서브탭 -->
        <h3 class="subheader"><span class="ms">bar_chart</span> ${L('trading_analysis')}</h3>
        <div class="sub-tabs" id="tst-${sid}">
            <button class="sub-tab active" data-subtab="ts-short-${sid}"><span class="ms">bolt</span> ${L('short_term')}</button>
            <button class="sub-tab" data-subtab="ts-swing-${sid}"><span class="ms">sync</span> ${L('swing')}</button>
            <button class="sub-tab" data-subtab="ts-long-${sid}"><span class="ms">trending_up</span> ${L('long_term')}</button>
        </div>
        <div id="ts-short-${sid}" class="sub-tab-content active">${renderShortTermStrategy(d, sym, rate)}</div>
        <div id="ts-swing-${sid}" class="sub-tab-content">${renderSwingStrategy(d, sym, rate)}</div>
        <div id="ts-long-${sid}" class="sub-tab-content">${renderLongTermStrategy(d, sym, rate)}</div>
        <hr class="divider">

        <!-- AI 분석 -->
        <div class="ai-analysis-box" id="ai-box-${sid}">
            <div class="ai-analysis-header"><span class="ms">smart_toy</span> ${L('ai_analysis')} <span class="ai-badge">Claude AI</span></div>
            <div class="ai-analysis-body" id="ai-body-${sid}">
                <div class="loading" style="font-size:0.9em;">${L('analyzing')}</div>
            </div>
        </div>

        <!-- 전체 분석 버튼 (차트 포함) -->
        <div style="text-align:right;margin-top:12px;">
            <button class="btn-secondary" onclick="analyzeFromAnywhere('${sym}', '${(r.name || '').replace(/'/g, '')}')"><span class="ms">show_chart</span> ${L('theme_full_analysis')}</button>
        </div>
    </div>`;
}

async function _loadThemeAI(sid, r) {
    const bodyEl = document.getElementById(`ai-body-${sid}`);
    if (!bodyEl) return;

    if (_themeAiCache[sid]) {
        bodyEl.innerHTML = `<p class="ai-text">${_themeAiCache[sid]}</p>`;
        return;
    }

    // 활성 키 확인 (로컬 저장 키 우선, 없으면 서버 환경변수)
    const activeKey = getActiveApiKeyInfo();
    const userAnthropicKey = getApiKey('anthropic');
    const userOpenaiKey    = getApiKey('openai');
    const aiProvider = activeKey ? activeKey.provider : 'auto';

    try {
        const res = await fetch(`${API}/api/market/ai-analysis`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ticker:            r.ticker,
                name:              r.name,
                desc:              r.desc || '',
                close:             r.close,
                change_pct:        r.change_pct,
                rsi:               r.rsi,
                macd:              r.macd,
                macd_sig:          r.macd_sig,
                bb_u:              r.bb_u,
                bb_m:              r.bb_m,
                bb_l:              r.bb_l,
                ma20:              r.ma20,
                ma60:              r.ma60,
                stoch_k:           r.stoch_k,
                stoch_d:           r.stoch_d,
                buy_cnt:           r.buy_cnt,
                sell_cnt:          r.sell_cnt,
                verdict:           r.verdict,
                reason:            r.reason || '',
                user_anthropic_key: userAnthropicKey,
                user_openai_key:    userOpenaiKey,
                ai_provider:        aiProvider,
            }),
        });
        const data = await res.json();
        const text = data.analysis || L('ai_no_result');

        // API 키 미설정 → AI 박스 전체 숨김 (이미 전략 분석이 표시되므로)
        if (text.includes('ANTHROPIC_API_KEY') || text.includes('API 키가 없습니다')) {
            const boxEl = document.getElementById(`ai-box-${sid}`);
            if (boxEl) boxEl.style.display = 'none';
            return;
        }

        _themeAiCache[sid] = text;
        if (bodyEl) bodyEl.innerHTML = `<p class="ai-text">${text.replace(/\n/g, '<br>')}</p>`;
    } catch (e) {
        if (bodyEl) bodyEl.innerHTML = `<p style="color:var(--muted);">${L('ai_request_failed')}: ${e.message}</p>`;
    }
}

function themePagePrev() {
    if (themePage > 0) { themePage--; renderThemeContent(currentTheme); }
}

function themePageNext() {
    themePage++;
    renderThemeContent(currentTheme);
}

function setPerPage(val) {
    STOCKS_PER_PAGE = parseInt(val, 10);
    localStorage.setItem('sa_per_page', val);
    themePage = 0;
    renderThemeContent(currentTheme);
}

function toggleFavorite(name) {
    if (favorites.has(name)) {
        favorites.delete(name);
    } else {
        favorites.add(name);
    }
    localStorage.setItem('sa_favorites', JSON.stringify([...favorites]));
    renderThemeButtons(document.getElementById('themeButtons'));
    renderThemeContent(name);
}

// ═══════════════════════════════════════════════
// Tab 4: Global Market & News
// ═══════════════════════════════════════════════

let globalLoaded = false;

async function loadGlobal(force = false) {
    if (globalLoaded && !force) return;
    loadIndices();
    loadNaverNews();
    globalLoaded = true;
}

async function loadIndices() {
    const container = document.getElementById('indicesGrid');
    container.innerHTML = `<div class="loading">${L('global_loading')}</div>`;
    try {
        const res = await fetch(`${API}/api/market/indices`);
        if (!res.ok) throw new Error('Failed');
        const indices = await res.json();
        let html = '';
        indices.forEach(idx => {
            const c = idx.pct >= 0 ? '#00C851' : '#FF4444';
            const sign = idx.pct >= 0 ? '▲' : '▼';
            const ps = idx.price < 10000 ? idx.price.toFixed(2) : idx.price.toLocaleString(undefined, { maximumFractionDigits: 0 });
            html += `<div class="index-card" style="border:1px solid ${c}44;background:${c}0a;">
                <div class="name">${idx.name}</div>
                <div class="price">${ps}</div>
                <div class="change" style="color:${c};">${sign} ${Math.abs(idx.pct).toFixed(2)}%</div>
            </div>`;
        });
        container.innerHTML = html || `<div class="caption">${L('global_error')}</div>`;
    } catch (_) {
        container.innerHTML = `<div class="error-msg">${L('global_error')}</div>`;
    }
}

async function loadNaverNews() {
    const newsContainer = document.getElementById('naverNewsContent');
    const signalsContainer = document.getElementById('naverSignals');
    newsContainer.innerHTML = `<div class="loading">${L('naver_news_loading')}</div>`;
    signalsContainer.innerHTML = `<div class="loading">${L('signal_loading')}</div>`;

    try {
        const res = await fetch(`${API}/api/market/naver-news`);
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        renderNaverNews(data.news || [], newsContainer);
        renderNaverSignals(data.signals || [], signalsContainer);
    } catch (_) {
        newsContainer.innerHTML = `<div class="caption">${L('naver_error')}</div>`;
        signalsContainer.innerHTML = `<div class="caption">${L('signal_error')}</div>`;
    }
}

function renderNaverNews(news, container) {
    if (news.length === 0) {
        container.innerHTML = `<div class="caption">${L('naver_error')}</div>`;
        return;
    }

    // Group by category
    const cats = [];
    const catMap = {};
    news.forEach(n => {
        const cat = n.category || '기타';
        if (!catMap[cat]) { catMap[cat] = []; cats.push(cat); }
        catMap[cat].push(n);
    });

    let html = '<div class="news-tabs" id="naverNewsTabs">';
    cats.forEach((cat, i) => {
        html += `<button class="news-tab ${i === 0 ? 'active' : ''}" data-newscat="${cat}" onclick="switchNewsTab(this, '${cat}')"><span class="ms">push_pin</span> ${cat}</button>`;
    });
    html += '</div>';

    cats.forEach((cat, i) => {
        html += `<div class="news-cat-content" data-cat="${cat}" style="${i > 0 ? 'display:none;' : ''}">`;
        catMap[cat].forEach(n => {
            html += `<div class="news-item"><a href="${n.link}" target="_blank">${n.title}</a></div>`;
        });
        html += '</div>';
    });

    container.innerHTML = html;
}

function switchNewsTab(btn, cat) {
    const parent = btn.closest('#naverNewsContent') || btn.closest('#tab-global');
    parent.querySelectorAll('.news-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    parent.querySelectorAll('.news-cat-content').forEach(d => {
        d.style.display = d.dataset.cat === cat ? 'block' : 'none';
    });
}

function renderNaverSignals(signals, container) {
    if (signals.length === 0) {
        container.innerHTML = `<div class="caption">${L('no_rise_trigger')}</div>`;
        return;
    }

    let html = '';
    signals.forEach(trig => {
        html += `<div class="signal-trigger">
            <div class="cat">${trig.icon || '<span class="ms">push_pin</span>'} ${trig.category}</div>
            <div class="reason"><span class="ms">push_pin</span> ${trig.reason}</div>
        </div>`;

        // Stock cards
        if (trig.stocks && trig.stocks.length > 0) {
            html += '<div class="signal-stocks-grid">';
            trig.stocks.forEach(s => {
                const vc = s.color || '#FFA500';
                const cc = (s.change_pct || 0) >= 0 ? '#00C851' : '#FF4444';
                html += `<div class="signal-stock-card" style="border:1px solid ${vc}55;background:${vc}0d;">
                    <div class="name">${s.name}</div>
                    <div class="ticker">${s.ticker}</div>
                    <div class="price">${s.close ? fmtPrice(s.close) : '—'}</div>
                    <div style="color:${cc};font-size:0.78em;">${s.change_pct != null ? (s.change_pct >= 0 ? '+' : '') + Number(s.change_pct).toFixed(2) + '%' : ''}</div>
                    <div class="verdict" style="color:${vc};">${s.verdict || '—'}</div>
                    <button class="analyze-btn" onclick="analyzeFromAnywhere('${s.ticker}', '${(s.name || '').replace(/'/g, '')}')"><span class="ms">bar_chart</span> ${L('analyze_btn')}</button>
                </div>`;
            });
            html += '</div>';
        }
    });

    container.innerHTML = html;
}

// ═══════════════════════════════════════════════
// Sidebar: News & Alerts
// ═══════════════════════════════════════════════

function setupSidebar() {
    // ── 사이드바 접기/펼치기 ──
    const collapseBtn = document.getElementById('sidebarCollapse');
    const expandBtn = document.getElementById('sidebarExpand');

    if (collapseBtn) {
        collapseBtn.addEventListener('click', () => {
            sidebar.classList.add('collapsed');
            if (expandBtn) expandBtn.classList.add('visible');
        });
    }

    if (expandBtn) {
        expandBtn.addEventListener('click', () => {
            sidebar.classList.remove('collapsed');
            expandBtn.classList.remove('visible');
        });
    }

    // ── 뉴스 토글 버튼 (A버전과 동일) ──
    const newsToggle = document.getElementById('newsToggle');
    const newsPanel = document.getElementById('newsPanel');
    if (newsToggle && newsPanel) {
        newsToggle.addEventListener('click', () => {
            const hidden = newsPanel.style.display === 'none';
            newsPanel.style.display = hidden ? 'block' : 'none';
            newsToggle.innerHTML = hidden ? `<span class="ms">notifications</span> ${L('news_hide')}` : `<span class="ms">notifications</span> ${L('news_show')}`;
        });
    }

    // ── 자동 업데이트 상태 표시 ──
    const refreshInterval = document.getElementById('refreshInterval');
    const refreshUnit = document.getElementById('refreshUnit');
    const refreshStatus = document.getElementById('refreshStatus');
    function updateRefreshStatus() {
        if (refreshInterval && refreshUnit && refreshStatus) {
            const val = refreshInterval.value;
            const unitText = refreshUnit.options[refreshUnit.selectedIndex].text;
            refreshStatus.innerHTML = `<span class="ms">refresh</span> ${val}${unitText} ${L('auto_update_status')}`;
        }
    }
    if (refreshInterval) refreshInterval.addEventListener('change', updateRefreshStatus);
    if (refreshUnit) refreshUnit.addEventListener('change', updateRefreshStatus);
}

async function loadSidebarNews() {
    const triggeredDiv = document.getElementById('triggeredStocks');
    const newsListDiv = document.getElementById('newsList');
    const filterDiv = document.getElementById('newsSourceFilter');

    triggeredDiv.innerHTML = `<div class="loading">${L('loading')}</div>`;
    newsListDiv.innerHTML = '';
    filterDiv.innerHTML = '';

    try {
        const res = await fetch(`${API}/api/market/news`);
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        const news = data.news || [];
        const triggered = data.triggered || [];

        // Triggered stocks — 아코디언 형식
        if (triggered.length > 0) {
            let html = '';
            triggered.forEach((trig, ti) => {
                const isOpen = ti === 0;
                const bodyId = `trig-body-${ti}`;
                let bodyHtml = `<div class="trigger-reason">${trig.reason}</div>`;
                (trig.matched_news || []).slice(0, 2).forEach(mn => {
                    const title = mn.title && mn.title.length > 45 ? mn.title.substring(0, 45) + '...' : mn.title;
                    bodyHtml += `<div class="trigger-news"><a href="${mn.link}" target="_blank">${title}</a><span class="trigger-news-pub">[${mn.publisher || ''}]</span></div>`;
                });
                (trig.stocks || []).forEach(s => {
                    bodyHtml += `<button class="trigger-stock-btn" onclick="analyzeFromAnywhere('${s.ticker}', '${(s.name || '').replace(/'/g, '')}')"><span class="ms">bar_chart</span> ${s.name} (${s.ticker})</button>`;
                });
                html += `<div class="trigger-group ${isOpen ? 'open' : ''}">
                    <div class="trigger-header" onclick="toggleTriggerGroup(this)">
                        <span class="trigger-header-text">${trig.icon || '<span class="ms">push_pin</span>'} ${trig.category}</span>
                        <span class="trigger-chevron ms">${isOpen ? 'expand_less' : 'expand_more'}</span>
                    </div>
                    <div class="trigger-body" id="${bodyId}">${bodyHtml}</div>
                </div>`;
            });
            triggeredDiv.innerHTML = html;
        } else {
            triggeredDiv.innerHTML = `<div class="caption" style="padding:8px 0;">${L('no_trigger')}</div>`;
        }

        // News by source — key 기반으로 분류
        if (news.length > 0) {
            const SRC_CFG = {
                naver:     { label: L('src_naver'),     icon: 'newspaper', prefix: ''   },
                investing: { label: L('src_investing'), icon: 'language',  prefix: ''   },
                yahoo:     { label: L('src_yahoo'),     icon: 'public',    prefix: 'us' },
                other:     { label: L('src_other'),     icon: 'push_pin',  prefix: ''   },
            };
            const sourceMap = {};
            news.forEach(item => {
                const pub = item.publisher || '';
                let key;
                if (pub.includes('네이버'))  key = 'naver';
                else if (pub.includes('인베스팅')) key = 'investing';
                else if (pub.includes('Yahoo'))    key = 'yahoo';
                else key = 'other';
                if (!sourceMap[key]) sourceMap[key] = [];
                sourceMap[key].push(item);
            });

            const presentKeys = ['naver', 'investing', 'yahoo', 'other'].filter(k => sourceMap[k]);
            const selectedKey = presentKeys[0];

            // 라디오 버튼 렌더링
            filterDiv.innerHTML = presentKeys.map(key => {
                const cfg = SRC_CFG[key];
                const isActive = key === selectedKey;
                return `<div class="news-radio-item ${isActive ? 'active' : ''}" onclick="filterSidebarNews(this, '${key}')">
                    <div class="news-radio-circle"></div>
                    <span class="news-radio-label">
                        ${cfg.prefix ? `<span class="news-src-prefix">${cfg.prefix}</span>` : ''}
                        <span class="ms sm">${cfg.icon}</span>${cfg.label}
                    </span>
                </div>`;
            }).join('');

            window._sidebarNewsMap = sourceMap;
            window._sidebarSrcCfg = SRC_CFG;
            renderSidebarNewsList(selectedKey);
        }
    } catch (_) {
        triggeredDiv.innerHTML = `<div class="caption">${L('sidebar_news_error')}</div>`;
    }
}

function toggleTriggerGroup(header) {
    const group = header.closest('.trigger-group');
    const chevron = header.querySelector('.trigger-chevron');
    const isOpen = group.classList.toggle('open');
    if (chevron) chevron.textContent = isOpen ? 'expand_less' : 'expand_more';
}

function filterSidebarNews(el, key) {
    document.querySelectorAll('.news-radio-item').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    renderSidebarNewsList(key);
}

function renderSidebarNewsList(key) {
    const container = document.getElementById('newsList');
    const items = (window._sidebarNewsMap || {})[key] || [];
    const cfg = (window._sidebarSrcCfg || {})[key] || { label: key, prefix: '' };

    // 선택된 소스 타이틀 + 건수
    const titleHtml = `<div class="news-source-title">
        ${cfg.prefix ? `<span class="news-src-prefix">${cfg.prefix}</span>` : ''}
        ${cfg.label} · <span class="news-source-count">${items.length}${L('news_count_unit')}</span>
    </div>`;

    container.innerHTML = titleHtml + items.map(item =>
        `<div class="sidebar-news-item">
            <a href="${item.link}" target="_blank">${item.title}</a>
            <span class="pub">${item.publisher || ''}</span>
        </div>`
    ).join('');
}

// ═══════════════════════════════════════════════
// Utility: Sub-tabs, Expandable
// ═══════════════════════════════════════════════

function setupSubTabs(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.querySelectorAll('.sub-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            // Deactivate all in this group
            container.querySelectorAll('.sub-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Show corresponding content
            const parent = container.parentElement;
            parent.querySelectorAll('.sub-tab-content').forEach(c => c.classList.remove('active'));
            const target = parent.querySelector(`#${btn.dataset.subtab}`);
            if (target) target.classList.add('active');
        });
    });
}

// toggleExpandable is defined near renderFinancials (search above)
