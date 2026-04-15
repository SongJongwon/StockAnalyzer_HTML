/* ═══════════════════════════════════════════════════════════
   StockAnalyzer B - Frontend Application
   Complete JS matching A version functionality
   ═══════════════════════════════════════════════════════════ */

const API = "https://stockanalyzer-backend.onrender.com";

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
const STOCKS_PER_PAGE = 5;

// ── DOM refs ──
const searchInput = document.getElementById('searchInput');
const periodSelect = document.getElementById('periodSelect');
const searchBtn = document.getElementById('searchBtn');
const sidebar = document.getElementById('sidebar');

// ═══════════════════════════════════════════════
// Init
// ═══════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    setupSearch();
    setupSidebar();
    setupTopMenu();
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

function analyzeFromAnywhere(ticker) {
    searchInput.value = ticker;
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
    resultDiv.innerHTML = '<div class="loading">종목 검색 중...</div>';

    try {
        // 1단계: 검색 → 티커 확보
        const searchRes = await fetch(`${API}/api/stock/search?q=${encodeURIComponent(query)}`);
        if (!searchRes.ok) {
            const err = await searchRes.json().catch(() => ({}));
            throw new Error(err.detail || `'${query}' 종목을 찾을 수 없습니다. 영문 종목명 또는 티커로 검색해보세요.`);
        }
        const searchData = await searchRes.json();
        const symbol = searchData.symbol;
        // 한글명 우선, 그 다음 백엔드 이름, 마지막으로 티커
        const name = krName || searchData.name || symbol;

        // 검색 결과 안내
        resultDiv.innerHTML = `<div class="loading">${name} (${symbol}) 분석 중...</div>`;

        // 2단계: 분석
        const res = await fetch(`${API}/api/stock/analyze/${encodeURIComponent(symbol)}?period=${period}`);
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || '데이터를 불러올 수 없습니다.');
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
            <p class="caption mt-8">Yahoo Finance API 요청 제한 / 데이터 부족 / 티커 심볼 오류를 확인해주세요.</p>
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

function signalEmoji(s) { return s === '매수' ? '🟢' : (s === '매도' ? '🔴' : '🟡'); }
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
    const rsiMsg = `RSI ${fmt(d.rsi, 1)} — ${rsi_s === '매수' ? '과매도' : rsi_s === '매도' ? '과매수' : '중립'}`;
    const macdMsg = macd_s === '매수' ? 'MACD > Signal — 상승' : 'MACD < Signal — 하락';
    const bbMsg = bb_s === '매수' ? '하단 이탈 — 반등 기대' : (bb_s === '매도' ? '상단 이탈 — 과열' : '중간 범위');
    const maMsg = ma_s === '매수' ? '정배열 (MA20 > MA60)' : (ma_s === '매도' ? '역배열' : 'MA 혼조');
    const stkMsg = `스토캐스틱 ${stk_s === '매수' ? '과매도' : stk_s === '매도' ? '과매수' : '중립'} (K:${fmt(d.stoch_k, 1)})`;

    // Strategy advice
    let advTitle, advColor, advDesc, advEntry;
    if (verdict === '강한 매수' || verdict === '매수 우세') {
        advTitle = '✅ 매수 고려 가능'; advColor = '#00C851';
        advDesc = `현재 ${buy_cnt}개 지표가 매수 신호. `;
        if (bb_s === '매수') advDesc += 'BB 하단 지지 → 반등 기대. ';
        if (rsi_s === '매수') advDesc += 'RSI 과매도 → 단기 반등. ';
        if (macd_s === '매수') advDesc += 'MACD 상승전환 → 모멘텀 회복. ';
        if (ma_s === '매수') advDesc += 'MA 정배열 → 상승 추세.';
        advEntry = `현재가 또는 매수 목표가(${dualPrice(entry, sym, rate)}) 부근 분할 매수 권장`;
    } else if (verdict === '강한 매도' || verdict === '매도 우세') {
        advTitle = '🚫 매수 비추천 (관망 또는 익절)'; advColor = '#FF4444';
        advDesc = `현재 ${sell_cnt}개 지표 매도 신호. `;
        if (bb_s === '매도') advDesc += 'BB 상단 이탈 → 단기 과열. ';
        if (rsi_s === '매도') advDesc += 'RSI 과매수 → 조정 가능성. ';
        if (ma_s === '매도') advDesc += 'MA 역배열 → 하락 추세.';
        advEntry = `추가 하락 시 ${dualPrice(entry, sym, rate)} 부근 재진입 검토`;
    } else {
        advTitle = '⏳ 관망 (추세 확인 후 진입)'; advColor = '#FFA500';
        advDesc = '지표 혼조. MACD 방향 전환 또는 RSI 30 이하 진입 시 매수 신호. 분할 접근 권장.';
        advEntry = `목표 매수가 ${dualPrice(entry, sym, rate)} 부근 분할 접근 검토`;
    }

    // Build reasons string
    let reasons = [];
    if (rsi_s === '매수') reasons.push(`RSI ${fmt(d.rsi, 0)} 과매도`);
    if (macd_s === '매수') reasons.push('MACD 상승전환');
    if (bb_s === '매수') reasons.push('BB 하단 지지');
    if (ma_s === '매수') reasons.push('MA 정배열');
    if (stk_s === '매수') reasons.push('스토캐스틱 과매도');
    if (rsi_s === '매도') reasons.push(`RSI ${fmt(d.rsi, 0)} 과매수`);
    if (bb_s === '매도') reasons.push('BB 상단 이탈');
    if (ma_s === '매도') reasons.push('MA 역배열');

    const rrColor = rr >= 1.5 ? '#aaffaa' : '#ffaaaa';

    container.innerHTML = `
        <h2 class="subheader">📌 ${name} (${sym})</h2>

        <!-- Price Metrics Row -->
        <div class="metrics-row">
            <div class="metric-card">
                <div class="label">현재가</div>
                <div class="value">${priceMain}</div>
                <div class="delta ${chg >= 0 ? 'positive' : 'negative'}">${chg >= 0 ? '+' : ''}${fmt(chg)}%</div>
                <div class="sub">${priceSub}</div>
            </div>
            <div class="metric-card">
                <div class="label">고가</div>
                <div class="value">${dualPrice(high, sym, rate)}</div>
            </div>
            <div class="metric-card">
                <div class="label">저가</div>
                <div class="value">${dualPrice(low, sym, rate)}</div>
            </div>
            <div class="metric-card">
                <div class="label">거래량</div>
                <div class="value">${Number(volume).toLocaleString()}</div>
            </div>
        </div>
        <div class="info-bar">USD/KRW: ${fmt(rate, 1)} · ${krw ? '원화 종목 (KRX)' : '달러 종목'}</div>
        <hr class="divider">

        <!-- Verdict Banner -->
        <div class="verdict-banner" style="background:${vColor}22;border-color:${vColor};color:${vColor};">
            <h2>종합 판단: ${verdict}</h2>
            <div class="sub">매수 신호 ${buy_cnt}개 · 매도 신호 ${sell_cnt}개 · 중립 ${5 - buy_cnt - sell_cnt}개</div>
        </div>

        <!-- Indicator Cards -->
        <h3 class="subheader">📊 지표별 분석</h3>
        <div class="indicators-grid">
            ${renderIndicatorCard('RSI (14)', rsi_s, rsiMsg, `${fmt(d.rsi, 1)}`)}
            ${renderIndicatorCard('MACD', macd_s, macdMsg, `${fmt(d.macd, 3)}`)}
            ${renderIndicatorCard('볼린저밴드', bb_s, bbMsg, `상단 ${fmtPrice(d.bb_u)} / 하단 ${fmtPrice(d.bb_l)}`)}
            ${renderIndicatorCard('이동평균', ma_s, maMsg, `MA20: ${fmtPrice(d.ma20)} / MA60: ${fmtPrice(d.ma60)}`)}
            ${renderIndicatorCard('스토캐스틱', stk_s, stkMsg, `K: ${fmt(d.stoch_k, 1)} / D: ${fmt(d.stoch_d, 1)}`)}
        </div>
        <hr class="divider">

        <!-- Strategy Panel -->
        <h3 class="subheader">💡 매매 전략</h3>
        <div class="action-banner" style="background:${advColor}18;border-color:${advColor};">
            <div class="title" style="color:${advColor};">${advTitle}</div>
            <div class="detail">${advDesc}</div>
            <div class="note">${advEntry}</div>
        </div>
        <div class="strategy-grid">
            ${renderStrategyCard('매수 목표가', entry, '#44aaff', 'BB 하단 / MA20 지지', sym)}
            ${renderStrategyCard('1차 목표가', t1, '#ffffff', `기대수익 ${ret1 >= 0 ? '+' : ''}${ret1.toFixed(1)}% | BB 중심`, sym)}
            ${renderStrategyCard('2차 목표가', t2, '#ffaa00', `기대수익 ${ret2 >= 0 ? '+' : ''}${ret2.toFixed(1)}% | BB 상단`, sym)}
            ${renderStrategyCard('손절 기준가', sl, '#FF4444', `손실 ${slPct.toFixed(1)}% | 매수가 -4%`, sym)}
            <div class="strategy-card">
                <div class="label">Risk/Reward</div>
                <div class="price" style="color:${rrColor};">1 : ${rr.toFixed(2)}</div>
                <div class="desc">1.5 이상 양호 · 2.0 이상 우수</div>
            </div>
        </div>
        <hr class="divider">

        <!-- Trading Strategy Sub-tabs -->
        <h3 class="subheader">📊 트레이딩 전략 분석</h3>
        <div class="sub-tabs" id="tradingSubTabs">
            <button class="sub-tab active" data-subtab="st-short">⚡ 단기 (1일~2주)</button>
            <button class="sub-tab" data-subtab="st-swing">🔄 스윙 (2주~3개월)</button>
            <button class="sub-tab" data-subtab="st-long">📈 장기 (6개월~수년)</button>
        </div>
        <div id="st-short" class="sub-tab-content active">${renderShortTermStrategy(d, sym, rate)}</div>
        <div id="st-swing" class="sub-tab-content">${renderSwingStrategy(d, sym, rate)}</div>
        <div id="st-long" class="sub-tab-content">${renderLongTermStrategy(d, sym, rate)}</div>
        <hr class="divider">

        <!-- 내 매수가 분석 -->
        <hr class="divider">
        <h3 class="subheader">💰 내 매수가 분석</h3>
        <div class="my-buy-form">
            <div class="my-buy-row">
                <div class="my-buy-field">
                    <label class="input-label">입력 통화</label>
                    <div class="radio-row">
                        <label><input type="radio" name="myCurrency" value="USD" ${!isKRW(sym) ? 'checked' : ''}> USD ($)</label>
                        <label><input type="radio" name="myCurrency" value="KRW" ${isKRW(sym) ? 'checked' : ''}> KRW (₩)</label>
                    </div>
                </div>
                <div class="my-buy-field">
                    <label class="input-label">매수 금액</label>
                    <input type="text" id="myPriceInput" placeholder="${isKRW(sym) ? '예: 75000' : '예: 150.50'}">
                </div>
                <div class="my-buy-field">
                    <label class="input-label">보유 수량</label>
                    <input type="text" id="myQtyInput" placeholder="예: 10">
                </div>
            </div>
            <button class="btn-analyze" onclick="applyMyBuy('${sym}', ${close}, ${entry}, ${t1}, ${t2}, ${sl})" style="margin-top:0.5rem;">✅ 적용</button>
        </div>
        <div id="myBuyResult">
            <p class="caption">매수 금액을 입력하면 손절·목표가 시나리오가 표시됩니다.</p>
        </div>

        <!-- Chart -->
        <hr class="divider">
        <div class="chart-header">
            <h3 class="subheader" style="margin:0;">📉 차트</h3>
            <div class="chart-currency-toggle">
                <span class="caption" style="margin-right:0.5rem;">Y축 단위:</span>
                <button class="chart-currency-btn active" onclick="toggleChartCurrency(this, 'native')">${krw ? 'KRW' : 'USD'}</button>
                <button class="chart-currency-btn" onclick="toggleChartCurrency(this, '${krw ? 'USD' : 'KRW'}')">${krw ? 'USD' : 'KRW'}</button>
            </div>
        </div>
        <p class="caption mb-8">범례를 클릭하면 해당 라인을 숨기거나 표시할 수 있습니다.</p>
        <div id="chartContainer"></div>
        <hr class="divider">

        <!-- Financials Expandable -->
        <div class="expandable" id="financialsSection">
            <div class="expandable-header" onclick="toggleExpandable('financialsSection')">
                <span>📋 재무제표 분석 (클릭하여 펼치기)</span>
                <span class="arrow">▶</span>
            </div>
            <div class="expandable-body" id="financialsBody">
                <div class="loading">재무 데이터 로딩 중...</div>
            </div>
        </div>

        <!-- PDF Download -->
        <button class="pdf-btn" onclick="downloadPDF('${sym}')">📄 PDF 보고서 다운로드</button>
        <p class="caption mt-8 text-center">본 분석은 참고용이며 투자 권유가 아닙니다.</p>
    `;

    // Setup sub-tabs
    setupSubTabs('tradingSubTabs');

    // Render chart
    renderPlotlyChart(d);

    // Load financials lazily
    loadFinancials(sym);
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
        resultDiv.innerHTML = '<p class="caption">매수 금액을 입력하면 손절·목표가 시나리오가 표시됩니다.</p>';
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
    const pnlIcon = pnlPct >= 0 ? '📈' : '📉';

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
                <div class="label">내 매수가</div>
                <div class="value" style="font-size:1.1rem;">${dualPrice(myPrice, sym, rate)}</div>
            </div>
            <div class="metric-card">
                <div class="label">현재가</div>
                <div class="value" style="font-size:1.1rem;">${dualPrice(curPrice, sym, rate)}</div>
                <div class="delta ${pnlPct >= 0 ? 'positive' : 'negative'}">${pnlIcon} ${pnlPct >= 0 ? '+' : ''}${pnlPct.toFixed(2)}%</div>
            </div>`;
    if (myQty > 0) {
        summaryHtml += `
            <div class="metric-card">
                <div class="label">평가금액</div>
                <div class="value" style="font-size:1.1rem;">${dualPrice(curPrice * myQty, sym, rate)}</div>
            </div>
            <div class="metric-card">
                <div class="label">평가손익</div>
                <div class="value" style="font-size:1.1rem;color:${pnlColor};">${dualPrice(Math.abs(pnlAbs), sym, rate)}</div>
                <div class="delta" style="color:${pnlColor};">${pnlAbs >= 0 ? '+' : '-'}${Math.abs(pnlPct).toFixed(2)}%</div>
            </div>`;
    } else {
        summaryHtml += `
            <div class="metric-card">
                <div class="label">수익률</div>
                <div class="value" style="font-size:1.1rem;color:${pnlColor};">${pnlPct >= 0 ? '+' : ''}${pnlPct.toFixed(2)}%</div>
            </div>
            <div class="metric-card">
                <div class="label">현재 판단</div>
                <div class="value" style="font-size:1.1rem;">—</div>
            </div>`;
    }
    summaryHtml += '</div><hr class="divider">';

    // 시나리오 카드
    function scenarioCard(title, color, slP, tgP, rr, periodNote, strategyNote) {
        const slRet = (slP - myPrice) / myPrice * 100;
        const tgRet = (tgP - myPrice) / myPrice * 100;
        let judge, judgeC;
        if (curPrice >= tgP) { judge = '🎯 목표 도달'; judgeC = '#ffaa00'; }
        else if (curPrice <= slP) { judge = '🔴 손절 구간'; judgeC = '#FF4444'; }
        else { judge = '⏳ 보유 중'; judgeC = 'var(--muted)'; }
        return `<div class="scenario-card" style="border:1px solid ${color}55;background:${color}08;">
            <div class="title" style="color:${color};">${title}</div>
            <div class="period">${periodNote}</div>
            <div class="target-label">🎯 목표가 (수익 목표)</div>
            <div class="target-val" style="color:#00C851;">${dualPrice(tgP, sym, rate)} <span style="color:var(--muted-dark);font-size:0.8em;">(+${tgRet.toFixed(1)}%)</span></div>
            <div class="target-label" style="margin-top:8px;">🛑 손절선</div>
            <div class="target-val" style="color:#FF4444;">${dualPrice(slP, sym, rate)} <span style="color:var(--muted-dark);font-size:0.8em;">(${slRet.toFixed(1)}%)</span></div>
            <div class="rr-badge" style="background:${color}18;color:${color};">손익비 1 : ${rr.toFixed(1)}</div>
            <div class="strategy-note">${strategyNote}</div>
            <div class="status" style="color:${judgeC};">현재 상태: ${judge}</div>
        </div>`;
    }

    summaryHtml += '<h4 class="subheader">📋 전략별 손절 · 목표가 시나리오</h4>';
    summaryHtml += '<div class="scenario-grid">';
    summaryHtml += scenarioCard('🔴 단기 트레이딩', '#44aaff', slShort, tgShort, rrShort,
        '1일 ~ 2주 | 분봉·시간봉 중심',
        'VWAP·BB 중심선 저항 돌파 시 목표 / RSI·MACD 단기 신호 활용');
    summaryHtml += scenarioCard('🟡 스윙 트레이딩', '#aa88ff', slSwing, tgSwing, rrSwing,
        '2주 ~ 3개월 | 일봉·주봉 중심',
        'BB 상단·20/60일 MA 저항선 목표 / 피보나치 61.8~100% 확장 기준');
    summaryHtml += scenarioCard('🟢 장기 투자', '#44dd88', slLong, tgLong, rrLong,
        '6개월 ~ 수년 | 주봉·월봉 중심',
        'PER×EPS 적정주가 / 52주 신고가 돌파 추세 / 펀더멘털 성장 기반');
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
    const rsi_t = rsi < 35 ? '과매도 → 반등' : (rsi > 65 ? '과매수 → 조정' : '중립 구간');
    const bb_c = bb_pctB < 20 ? '#00C851' : (bb_pctB > 80 ? '#FF4444' : '#FFA500');
    const bb_t = bb_pctB < 20 ? '하단 근접 → 지지' : (bb_pctB > 80 ? '상단 과열' : '중간 구간');

    let mc, mt;
    if (macd_cross) { mc = '#00C851'; mt = '골든크로스 🎯'; }
    else if (macd_death) { mc = '#FF4444'; mt = '데드크로스 ⚠️'; }
    else if (macd > msig) { mc = '#44aaff'; mt = '상승 추세 유지'; }
    else { mc = '#FFA500'; mt = '하락 추세 유지'; }

    const vc = vwap_dev < -1 ? '#00C851' : (vwap_dev > 1 ? '#FF4444' : '#FFA500');
    const vt = vwap_dev < -1 ? 'VWAP 하회 → 저평가' : (vwap_dev > 1 ? 'VWAP 상회 → 고평가' : 'VWAP 근접');

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
    if (buy_cnt >= 3) { ac = '#00C851'; at = '✅ 단기 매수 구간'; ag = '다수 지표 과매도 진입. MACD 크로스 확인 후 분할 진입 권장.'; }
    else if (buy_cnt >= 2) { ac = '#44aaff'; at = '⏳ 단기 진입 검토'; ag = '일부 매수 조건 충족. MACD 골든크로스 또는 RSI 30 이하 추가 확인 권장.'; }
    else { ac = '#FFA500'; at = '⚠️ 관망 권장'; ag = '단기 과매수 또는 혼조 신호. BB 하단 / RSI 30 이하 시 재진입 검토.'; }

    return `
        <p class="caption mb-8">RSI 과매도/과매수 · MACD 크로스 신호 · 볼린저밴드 %B · VWAP 편차 기반 목표가</p>
        <div class="strategy-grid-4">
            ${renderSignalCard('📉', 'RSI (14)', `${rsi.toFixed(1)}`, rsi_t, rsi_c, '30↓ 강매수 / 70↑ 매도')}
            ${renderSignalCard('📊', 'MACD', `${macd.toFixed(3)}`, mt, mc, `Sig ${msig.toFixed(3)} | Δ${(macd - msig) >= 0 ? '+' : ''}${(macd - msig).toFixed(3)}`)}
            ${renderSignalCard('📡', 'BB %B', `${bb_pctB.toFixed(1)}%`, bb_t, bb_c, `폭 ${fmtPrice(bb_w)} (${(bb_w / bb_m * 100).toFixed(1)}%)`)}
            ${renderSignalCard('⚖️', 'VWAP', fmtPrice(vwap), vt, vc, `현가 대비 ${vwap_dev >= 0 ? '+' : ''}${vwap_dev.toFixed(1)}%`)}
        </div>

        <h4 class="subheader">🎯 단기 목표가 산출</h4>
        <div class="strategy-grid-4">
            ${renderTargetCard('현재가', close, '#ffffff', '기준가', sym)}
            ${renderTargetCard('1차 목표', st_t1, '#00C851', `BB중심/VWAP | ${((st_t1 - close) / close * 100).toFixed(1)}%`, sym)}
            ${renderTargetCard('2차 목표', st_t2, '#ffaa00', `BB상단 | ${((st_t2 - close) / close * 100).toFixed(1)}%`, sym)}
            ${renderTargetCard('손절선', st_sl, '#FF4444', `BB하단·최근저점 | ${((st_sl - close) / close * 100).toFixed(1)}%`, sym)}
        </div>
        <div class="rr-bar">
            <span>손익비(1차): <b style="color:${rr1c};">1:${st_rr1.toFixed(1)}</b></span>
            <span>손익비(2차): <b style="color:${rr2c};">1:${st_rr2.toFixed(1)}</b></span>
            <span>매수신호: <b style="color:${sc};">${buy_cnt}/4</b></span>
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
        const nearLabel = near ? '<div class="near-label">◀ 현재근접</div>' : '';
        fibHtml += `<div class="${cls}"><div class="pct" style="color:${c};">${f.pct}</div><div class="level">${fmtPrice(f.level)}</div>${nearLabel}</div>`;
    });

    // MA status
    const maTc = ma20 > ma60 ? '#00C851' : '#FF4444';
    const ma20Dev = (close - ma20) / ma20 * 100;
    const ma60Dev = (close - ma60) / ma60 * 100;
    const trend = ma20 > ma60 ? '정배열 📈' : '역배열 📉';

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
        ac = '#00C851'; atTxt = '✅ 스윙 매수 구간 (눌림목)'; ag = '정배열 + 피보나치 지지권. 손익비 1:2 분할 진입 권장.';
    } else if (!(ma20 > ma60)) {
        ac = '#FF4444'; atTxt = '⚠️ 스윙 진입 비추천'; ag = 'MA 역배열. MA20 돌파 확인 후 재진입 검토.';
    } else {
        ac = '#FFA500'; atTxt = '⏳ 눌림목 대기';
        const fib38 = fibs.find(f => f.pct === '38.2%');
        const fib50 = fibs.find(f => f.pct === '50%');
        ag = `상승추세 중 MA20 위. 피보 38.2%~50% 되돌림 구간(${fib38 ? fmtPrice(fib38.level) : '-'}~${fib50 ? fmtPrice(fib50.level) : '-'}) 진입 검토.`;
    }

    return `
        <p class="caption mb-8">피보나치 되돌림 지지/저항 · 20/60일 이동평균 · 손익비 1:2 기반 목표가</p>

        <h4 class="subheader">📐 피보나치 되돌림 (최근 60거래일)</h4>
        <div class="fib-grid">${fibHtml || '<div class="caption">피보나치 데이터 없음</div>'}</div>

        <h4 class="subheader">📈 20/60일 이동평균</h4>
        <div class="ma-grid">
            <div class="signal-card" style="border:1px solid #44aaff55;border-radius:10px;padding:10px;">
                <div style="font-size:0.75em;color: var(--muted);">20일 이평선</div>
                <div style="font-size:0.9em;font-weight:bold;color:#44aaff;margin:4px 0;">${dualPrice(ma20, sym, rate)}</div>
                <div style="font-size:0.7em;color:${ma20Dev >= 0 ? '#00C851' : '#FF4444'};">현재가 대비 ${ma20Dev >= 0 ? '+' : ''}${ma20Dev.toFixed(1)}%</div>
            </div>
            <div class="signal-card" style="border:1px solid #ff880055;border-radius:10px;padding:10px;">
                <div style="font-size:0.75em;color: var(--muted);">60일 이평선</div>
                <div style="font-size:0.9em;font-weight:bold;color:#ff8800;margin:4px 0;">${dualPrice(ma60, sym, rate)}</div>
                <div style="font-size:0.7em;color:${ma60Dev >= 0 ? '#00C851' : '#FF4444'};">현재가 대비 ${ma60Dev >= 0 ? '+' : ''}${ma60Dev.toFixed(1)}%</div>
            </div>
            <div class="signal-card" style="border:1px solid ${maTc}55;border-radius:10px;padding:10px;">
                <div style="font-size:0.75em;color: var(--muted);">배열 상태</div>
                <div style="font-size:1.0em;font-weight:bold;color:${maTc};margin:4px 0;">${trend}</div>
                <div style="font-size:0.7em;color: var(--muted-darker);">MA20 ${ma20 > ma60 ? '>' : '<'} MA60</div>
            </div>
        </div>

        <h4 class="subheader">🎯 스윙 목표가 산출 (손익비 1:2)</h4>
        <div class="strategy-grid-4">
            ${renderTargetCard('진입가', sw_entry, '#ffffff', '현재가 기준', sym)}
            ${renderTargetCard('1차 목표', sw_t1, '#00C851', `손익비 1:2 | ${((sw_t1 - sw_entry) / sw_entry * 100).toFixed(1)}%`, sym)}
            ${renderTargetCard('2차 목표', sw_t2, '#ffaa00', `손익비 1:3 | ${((sw_t2 - sw_entry) / sw_entry * 100).toFixed(1)}%`, sym)}
            ${renderTargetCard('손절선', sw_sl, '#FF4444', `피보 지지 하단 | ${((sw_sl - sw_entry) / sw_entry * 100).toFixed(1)}%`, sym)}
        </div>
        <div class="rr-bar">
            <span>손익비(1차): <b style="color:${rr1c};">1:${sw_rr1.toFixed(1)}</b></span>
            <span>손익비(2차): <b style="color:${rr2c};">1:${sw_rr2.toFixed(1)}</b></span>
            <span>피보 지지: <b>${nearSupport.pct} (${fmtPrice(nearSupport.level)})</b></span>
            <span>피보 저항: <b>${nearResist.pct} (${fmtPrice(nearResist.level)})</b></span>
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
        const jd = rawVal != null && rawVal > threshHi ? '우수' : (rawVal != null && rawVal > threshLo ? '양호' : '부진');
        const valStr = rawVal != null ? `${rawVal.toFixed(1)}${unit}` : '—';
        return `<div class="signal-card" style="border:1px solid ${c}55;border-radius:10px;padding:12px;">
            <div style="font-size:0.75em;color: var(--muted);">${label}</div>
            <div style="font-size:1.1em;font-weight:bold;color:${c};margin:5px 0;">${valStr}</div>
            <div style="font-size:0.7em;color: var(--muted-darker);">${rawVal != null ? jd : '데이터 없음'}</div>
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
    let dcfHtml = '<div class="caption">FCF 데이터 없음. DCF 계산 불가. (FCF > 0인 흑자 기업에만 적용)</div>';
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
        const dj = dcfPrem > 30 ? '강한 매수 (30%+ 저평가)' : (dcfPrem > 10 ? '매수 고려 (10%+ 저평가)' : (dcfPrem > -10 ? '적정 수준' : '고평가 주의'));

        dcfHtml = `
            <div class="dcf-detail">
                <div class="row">
                    <div><div class="lbl">FCF/주</div><div class="val">${dualPrice(fcfPs, sym, rate)}</div></div>
                    <div><div class="lbl">PV (5년 FCF)</div><div class="val">${dualPrice(pv5y, sym, rate)}</div></div>
                    <div><div class="lbl">PV (영구가치)</div><div class="val">${dualPrice(pvTerm, sym, rate)}</div></div>
                </div>
                <div class="dcf-result">
                    <span style="color: var(--muted);font-size:0.78em;">DCF 내재가치: </span>
                    <span style="font-size:1.1em;font-weight:bold;color:${dc};">${dualPrice(dcfValue, sym, rate)}</span>
                    <span style="color:${dc};font-size:0.84em;margin-left:8px;">(${dcfPrem >= 0 ? '+' : ''}${dcfPrem.toFixed(1)}%)</span>
                </div>
                <div style="font-size:0.8em;color:${dc};font-weight:bold;margin-top:6px;">${dj}</div>
            </div>
        `;
    }

    // Summary fair value
    const validFv = [perFair, pbFair, dcfValue].filter(v => v != null && v > 0);
    let summaryHtml = '<div class="caption">재무 데이터 부족으로 종합 평가 불가</div>';
    if (validFv.length > 0) {
        const avgFv = validFv.reduce((a, b) => a + b, 0) / validFv.length;
        const avgPrem = (avgFv - close) / close * 100;
        const ac = avgPrem > 0 ? '#00C851' : '#FF4444';
        const jl = avgPrem > 30 ? '💚 강한 저평가' : (avgPrem > 10 ? '✅ 저평가 구간' : (avgPrem > -10 ? '📊 적정 수준' : (avgPrem > -30 ? '⚠️ 고평가 주의' : '🔴 심한 고평가')));
        summaryHtml = `
            <div class="summary-box" style="border-color:${ac}55;background:${ac}0d;">
                <div class="title">📊 종합 적정주가</div>
                <div class="value" style="color:${ac};">${dualPrice(avgFv, sym, rate)}</div>
                <div class="pct" style="color:${ac};">${avgPrem >= 0 ? '+' : ''}${avgPrem.toFixed(1)}%</div>
                <div class="note">PER / PBR / DCF 평균</div>
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
                <div style="font-size:0.7em;color:${c};">현재가 대비 ${prem >= 0 ? '+' : ''}${prem.toFixed(1)}%</div>
                <div style="font-size:0.65em;color: var(--muted-darker);margin-top:2px;">${desc}</div>
            </div>`;
        }
        return `<div class="signal-card" style="border:1px solid #33333355;border-radius:10px;padding:12px;">
            <div style="font-size:0.75em;color: var(--muted);">${lbl}</div>
            <div style="font-size:0.8em;color: var(--muted-darker);margin:8px 0;">${desc}</div>
        </div>`;
    }

    const perPbrStr = pe && pb ? `PER ${pe.toFixed(1)}x | PBR ${pb.toFixed(2)}x` : '데이터 없음';

    return `
        <p class="caption mb-8">PER/PBR 적정주가 · ROE 분석 · DCF 내재가치 (잉여현금흐름 5년 할인 + 영구가치)</p>

        <h4 class="subheader">📊 수익성 지표 (ROE · 영업이익률 · 이익성장률)</h4>
        <div class="profitability-grid">
            ${profCard('ROE', roeVal, 15, 8, '%')}
            ${profCard('영업이익률', opVal, 15, 8, '%')}
            ${profCard('이익성장률(YoY)', egVal, 15, 5, '%')}
        </div>

        <h4 class="subheader">📐 PER / PBR 기반 적정주가</h4>
        <div class="fair-value-grid">
            ${fairValueCard('PER 적정주가', perFair, perPrem, eps ? `EPS ${fmtPrice(eps)} × PER ${sectorPer.toFixed(0)}x` : '데이터 없음')}
            ${fairValueCard('PBR 적정주가', pbFair, pbPrem, 'BPS × 적정PBR (ROE×10, 최소 1.0)')}
            ${fairValueCard('현재 PER/PBR', null, null, perPbrStr)}
        </div>

        <h4 class="subheader">💰 DCF 내재가치 분석</h4>
        <p class="caption mb-8">5년 성장 + 영구가치(Gordon Growth Model) · 잉여현금흐름(FCF/주) 기반 · 성장률 ${(growthR * 100).toFixed(1)}% / WACC 10% / 영구성장 3%</p>
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
        document.getElementById('chartContainer').innerHTML = '<div class="loading">차트 데이터 없음</div>';
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
    const bbUTrace = { x: dates, y: bbUs, type: 'scatter', mode: 'lines', name: 'BB 상단', line: { color: 'gray', width: 1, dash: 'dot' }, legendgroup: 'bb' };
    const bbLTrace = { x: dates, y: bbLs, type: 'scatter', mode: 'lines', name: 'BB 하단', line: { color: 'gray', width: 1, dash: 'dot' }, fill: 'tonexty', fillcolor: 'rgba(128,128,128,0.08)', legendgroup: 'bb' };

    // ── 전략 라인 (라인만 표시, 우측 annotation으로 가격 레이블) ──
    const hline = (y, color, name) => ({
        x: [dates[0], dates[dates.length-1]], y: [y, y],
        type: 'scatter', mode: 'lines', name: name,
        line: { color: color, width: 1.2, dash: 'dash' },
        legendgroup: 'strategy', showlegend: false,
    });

    const entryTrace = hline(entry, '#44aaff', `매수목표`);
    const t1Trace = hline(t1, '#ffaa00', `1차 목표`);
    const t2Trace = hline(t2, '#aaaaaa', `2차 목표`);
    const slTrace = hline(sl, '#FF4444', `손절선`);

    // 우측 차트 바깥에 가격 레이블 annotation
    const strategyAnnotations = [
        { x: 1.002, y: entry, xref: 'paper', yref: 'y', text: `매수 ${prefix}${fmtPrice(entry)}`, showarrow: false, font: { color: '#44aaff', size: 10 }, xanchor: 'left', bgcolor: 'rgba(0,0,0,0)' },
        { x: 1.002, y: t1,    xref: 'paper', yref: 'y', text: `1차  ${prefix}${fmtPrice(t1)}`,    showarrow: false, font: { color: '#ffaa00', size: 10 }, xanchor: 'left', bgcolor: 'rgba(0,0,0,0)' },
        { x: 1.002, y: t2,    xref: 'paper', yref: 'y', text: `2차  ${prefix}${fmtPrice(t2)}`,    showarrow: false, font: { color: '#aaaaaa', size: 10 }, xanchor: 'left', bgcolor: 'rgba(0,0,0,0)' },
        { x: 1.002, y: sl,    xref: 'paper', yref: 'y', text: `손절 ${prefix}${fmtPrice(sl)}`,    showarrow: false, font: { color: '#FF4444', size: 10 }, xanchor: 'left', bgcolor: 'rgba(0,0,0,0)' },
    ];

    // ── MACD 서브차트 ──
    const histColors = macdHists.map(h => h >= 0 ? '#00C851' : '#FF4444');
    const histTrace = { x: dates, y: macdHists, type: 'bar', name: 'MACD 히스토그램', marker: { color: histColors }, yaxis: 'y2', showlegend: true, legendgroup: 'macd' };
    const macdTrace = { x: dates, y: macds, type: 'scatter', mode: 'lines', name: 'MACD선', line: { color: '#4488ff', width: 1.5 }, yaxis: 'y2', legendgroup: 'macd' };
    const macdSigTrace = { x: dates, y: macdSigs, type: 'scatter', mode: 'lines', name: 'Signal선', line: { color: '#ff8800', width: 1.5 }, yaxis: 'y2', legendgroup: 'macd' };

    // ── RSI 서브차트 ──
    const rsiTrace = { x: dates, y: rsis, type: 'scatter', mode: 'lines', name: 'RSI', line: { color: 'purple', width: 1.5 }, yaxis: 'y3', legendgroup: 'rsi' };
    const rsi70Trace = { x: [dates[0], dates[dates.length-1]], y: [70, 70], type: 'scatter', mode: 'lines', name: '과매수(70)', line: { color: '#FF4444', width: 1, dash: 'dot' }, yaxis: 'y3', legendgroup: 'rsi', showlegend: true };
    const rsi30Trace = { x: [dates[0], dates[dates.length-1]], y: [30, 30], type: 'scatter', mode: 'lines', name: '과매도(30)', line: { color: '#00C851', width: 1, dash: 'dot' }, yaxis: 'y3', legendgroup: 'rsi', showlegend: true };

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
// Financials (lazy load)
// ═══════════════════════════════════════════════

async function loadFinancials(sym) {
    try {
        const res = await fetch(`${API}/api/stock/financials/${encodeURIComponent(sym)}`);
        if (!res.ok) throw new Error('Failed');
        const fin = await res.json();
        renderFinancials(fin);
    } catch (_) {
        document.getElementById('financialsBody').innerHTML = '<div class="caption">재무 데이터를 불러올 수 없습니다.</div>';
    }
}

function renderFinancials(fin) {
    const body = document.getElementById('financialsBody');

    const valItems = [
        ['시가총액', fmtLarge(fin.market_cap)],
        ['PER(TTM)', fmtX(fin.pe_trailing)],
        ['PER(Forward)', fmtX(fin.pe_forward)],
        ['PBR', fmtX(fin.pb)],
        ['EV/EBITDA', fmtX(fin.ev_ebitda)],
        ['배당수익률', fmtPct(fin.div_yield)],
    ];

    let valHtml = '<h4 class="subheader">📐 밸류에이션</h4><div class="fin-val-grid">';
    valItems.forEach(([label, val]) => {
        valHtml += `<div class="fin-val-card"><div class="label">${label}</div><div class="value">${val}</div></div>`;
    });
    valHtml += '</div>';

    // Profitability / Growth / Stability
    const profItems = [
        ['매출(TTM)', fmtLarge(fin.rev_ttm)],
        ['매출총이익률', fmtPct(fin.gross_margin)],
        ['영업이익률', fmtPct(fin.op_margin)],
        ['순이익률', fmtPct(fin.net_margin)],
        ['ROE', fmtPct(fin.roe)],
        ['ROA', fmtPct(fin.roa)],
    ];

    const growthItems = [
        ['매출 성장률(YoY)', fmtPct(fin.rev_growth)],
        ['이익 성장률(YoY)', fmtPct(fin.earn_growth)],
        ['EPS(TTM)', fin.eps_ttm != null ? Number(fin.eps_ttm).toFixed(2) : '—'],
        ['영업현금흐름', fmtLarge(fin.op_cf)],
        ['잉여현금흐름(FCF)', fmtLarge(fin.fcf)],
    ];

    const de = fin.debt_equity;
    const cr = fin.current_ratio;
    const deColor = de && de > 200 ? '#FF4444' : (de && de > 100 ? '#FFA500' : '#00C851');
    const crColor = cr && cr < 1 ? '#FF4444' : (cr && cr < 1.5 ? '#FFA500' : '#00C851');
    const stabItems = [
        ['부채비율(D/E)', de != null ? `${de.toFixed(1)}%` : '—', deColor],
        ['유동비율', cr != null ? cr.toFixed(2) : '—', crColor],
        ['PSR', fmtX(fin.ps), '#ffffff'],
    ];

    let colHtml = '<div class="fin-3col">';
    colHtml += '<div><h4 class="subheader">📊 수익성</h4>';
    profItems.forEach(([l, v]) => { colHtml += `<div class="fin-row"><span class="label">${l}</span><span class="value">${v}</span></div>`; });
    colHtml += '</div>';
    colHtml += '<div><h4 class="subheader">📈 성장성 & 현금흐름</h4>';
    growthItems.forEach(([l, v]) => { colHtml += `<div class="fin-row"><span class="label">${l}</span><span class="value">${v}</span></div>`; });
    colHtml += '</div>';
    colHtml += '<div><h4 class="subheader">🛡️ 안정성</h4>';
    stabItems.forEach(([l, v, c]) => { colHtml += `<div class="fin-row"><span class="label">${l}</span><span class="value" style="color:${c || 'inherit'};">${v}</span></div>`; });
    colHtml += '</div></div>';

    // Income chart
    let chartHtml = '';
    if (fin.income && Object.keys(fin.income).length > 0) {
        chartHtml = '<div id="finChartContainer" style="height:320px;margin-top:16px;"></div>';
    }

    body.innerHTML = valHtml + colHtml + chartHtml;

    // Render income chart with Plotly
    if (fin.income && Object.keys(fin.income).length > 0) {
        const years = Object.keys(fin.income).sort();
        const revs = years.map(y => fin.income[y].revenue ? fin.income[y].revenue / 1e9 : 0);
        const ops = years.map(y => fin.income[y].op_income ? fin.income[y].op_income / 1e9 : 0);
        const nets = years.map(y => fin.income[y].net_income ? fin.income[y].net_income / 1e9 : 0);
        const fcfs = years.map(y => fin.cashflow && fin.cashflow[y] && fin.cashflow[y].fcf ? fin.cashflow[y].fcf / 1e9 : 0);

        const traces = [
            { x: years, y: revs, type: 'bar', name: '매출', marker: { color: '#4488ff' } },
            { x: years, y: ops, type: 'bar', name: '영업이익', marker: { color: '#00C851' } },
            { x: years, y: nets, type: 'bar', name: '순이익', marker: { color: '#ffaa00' } },
            { x: years, y: fcfs, type: 'scatter', mode: 'lines+markers', name: 'FCF', line: { color: '#ff4488', width: 2 }, marker: { size: 8 } },
        ];

        const fc = chartColors();
        const layout = {
            title: '연간 손익 & 현금흐름 (단위: 십억$)',
            barmode: 'group',
            template: fc.template,
            paper_bgcolor: fc.bg,
            plot_bgcolor: fc.plot,
            font: { color: fc.text },
            height: 320,
            margin: { l: 40, r: 10, t: 40, b: 30 },
            showlegend: true,
            legend: { orientation: 'h', y: 1.12 },
        };

        setTimeout(() => {
            const el = document.getElementById('finChartContainer');
            if (el) Plotly.newPlot(el, traces, layout, { responsive: true });
        }, 100);
    }
}

// ═══════════════════════════════════════════════
// PDF Download
// ═══════════════════════════════════════════════

async function downloadPDF(sym) {
    const btn = document.querySelector('.pdf-btn');
    btn.disabled = true;
    btn.textContent = '📄 PDF 생성 중...';
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
            let msg = 'PDF 생성 실패';
            try { const j = await res.json(); msg = j.detail || msg; } catch (_) {}
            throw new Error(msg);
        }
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${sym.replace(/\./g, '_')}_분석보고서.pdf`;
        a.click();
        URL.revokeObjectURL(url);
    } catch (e) {
        alert(e.message);
    } finally {
        btn.disabled = false;
        btn.textContent = '📄 PDF 보고서 다운로드';
    }
}

// ═══════════════════════════════════════════════
// Tab 2: Watchlist
// ═══════════════════════════════════════════════

let watchlistLoaded = false;

async function loadWatchlist(force = false) {
    if (watchlistLoaded && !force) return;
    const container = document.getElementById('watchlistContent');
    container.innerHTML = '<div class="loading">전체 종목 분석 중... (최초 로딩 30초 내외)</div>';

    try {
        const res = await fetch(`${API}/api/market/watchlist`);
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        renderWatchlist(data, container);
        watchlistLoaded = true;
    } catch (e) {
        container.innerHTML = `<div class="error-msg">추천 종목을 불러올 수 없습니다.</div>`;
    }
}

function renderWatchlist(data, container) {
    let html = '';
    for (const [category, rows] of Object.entries(data)) {
        if (!rows || rows.length === 0) continue;
        html += `<div class="watchlist-category"><h4>${category}</h4>`;
        html += `<table class="wl-table"><thead><tr>
            <th>종목</th><th>현재가</th><th>등락</th><th>RSI</th><th>매수 목표가</th>
            <th>1차 목표</th><th>2차 목표</th><th>단기</th><th>중기</th><th>장기</th><th>추천 이유</th>
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
                <td style="color:var(--text-secondary);max-width:200px;">${r.reason || '지표 혼조'}</td>
            </tr>`;
        }
        html += '</tbody></table></div>';
    }
    html += '<hr class="divider"><p class="caption">본 분석은 참고용이며 투자 권유가 아닙니다.</p>';
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
        contentContainer.innerHTML = `<div class="error-msg">테마 데이터를 불러올 수 없습니다.</div>`;
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
        return `<button class="theme-btn ${isSel ? 'active' : ''} ${isFav ? 'fav' : ''}" onclick="selectTheme('${name.replace(/'/g, "\\'")}')">${isFav ? '⭐ ' : ''}${name}</button>`;
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
            <button onclick="toggleFavorite('${escapedName}')" class="btn-icon" title="즐겨찾기">${isFav ? '⭐' : '☆'}</button>
            <div>
                <h4>${name}</h4>
                <p class="caption">${theme.desc || ''}</p>
            </div>
        </div>
    `;

    container.innerHTML = headerHtml + '<div class="loading">테마 종목 실시간 분석 중... (최초 30초 내외)</div>';

    try {
        const res = await fetch(`${API}/api/market/themes/${encodeURIComponent(name)}/analyze`);
        if (!res.ok) throw new Error('Failed');
        const stocks = await res.json();
        // 캐시: 정적 테마 데이터에 분석 결과 저장
        themesData[name].analyzed_stocks = stocks;
        renderThemeStocksTable(headerHtml, stocks, container);
    } catch (e) {
        // 분석 실패 시 정적 목록만 표시
        let html = headerHtml + '<p class="caption mb-8">실시간 분석을 불러올 수 없습니다. 정적 목록을 표시합니다.</p>';
        if (theme.stocks) {
            html += '<table class="theme-table"><thead><tr><th>종목</th><th>티커</th><th>설명</th></tr></thead><tbody>';
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
    html += `<p class="text-sm mb-8"><b>총 ${total}개 종목</b> · 매수 신호 강도 순 · 페이지 ${page + 1} / ${totalPages}</p>`;
    html += `<table class="theme-table">
        <thead><tr>
            <th style="width:44px">순위</th>
            <th>종목</th>
            <th>현재가</th>
            <th>등락</th>
            <th>RSI</th>
            <th>매수가</th>
            <th>목표가</th>
            <th>단기수익</th>
            <th>판단</th>
            <th>매수 근거</th>
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
            <td style="color:var(--text-secondary);font-size:0.88em;">${r.reason || '지표 혼조'}</td>
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
        <button class="btn-secondary" onclick="themePagePrev()" ${page === 0 ? 'disabled' : ''}>◀ 이전</button>
        <span class="info">페이지 ${page + 1} / ${totalPages} · 전체 ${total}개 종목</span>
        <button class="btn-secondary" onclick="themePageNext()" ${page >= totalPages - 1 ? 'disabled' : ''}>다음 ▶</button>
    </div>`;
    html += '<hr class="divider"><p class="caption">본 분석은 참고용이며 투자 권유가 아닙니다.</p>';

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

    // AI 분석 자동 요청
    _loadThemeAI(sid, r);
}

function _buildThemeDetailHtml(r, sid) {
    const close = r.close;
    const sym   = r.ticker;
    const rate  = exchangeRate;

    if (r.close === null || r.close === undefined) {
        return `<div style="padding:16px;color:var(--muted);">데이터를 불러올 수 없는 종목입니다.</div>`;
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

    const rsiMsg  = `RSI ${fmt(r.rsi, 1)} — ${rsi_s === '매수' ? '과매도' : rsi_s === '매도' ? '과매수' : '중립'}`;
    const macdMsg = macd_s === '매수' ? 'MACD > Signal — 상승' : 'MACD < Signal — 하락';
    const bbMsg   = bb_s === '매수' ? '하단 이탈 — 반등 기대' : (bb_s === '매도' ? '상단 이탈 — 과열' : '중간 범위');
    const maMsg   = ma_s === '매수' ? '정배열 (MA20 > MA60)' : (ma_s === '매도' ? '역배열' : 'MA 혼조');
    const stkMsg  = `스토캐스틱 ${stk_s === '매수' ? '과매도' : stk_s === '매도' ? '과매수' : '중립'} (K:${fmt(r.stoch_k, 1)})`;

    return `
    <div class="theme-detail-inner">
        ${r.desc ? `<p class="theme-detail-desc">${r.desc}</p>` : ''}

        <!-- 종합 판단 배너 -->
        <div class="verdict-banner" style="background:${vColor}22;border-color:${vColor};color:${vColor};margin-bottom:14px;">
            <h2>종합 판단: ${r.verdict}</h2>
            <div class="sub">매수 신호 ${buy_cnt}개 · 매도 신호 ${sell_cnt}개 · 중립 ${5 - buy_cnt - sell_cnt}개</div>
        </div>

        <!-- 지표 카드 5개 -->
        <h4 class="subheader" style="font-size:0.95em;margin-bottom:8px;">📊 지표별 분석</h4>
        <div class="indicators-grid" style="margin-bottom:16px;">
            ${renderIndicatorCard('RSI (14)',   rsi_s,  rsiMsg,  fmt(r.rsi, 1))}
            ${renderIndicatorCard('MACD',       macd_s, macdMsg, fmt(r.macd, 3))}
            ${renderIndicatorCard('볼린저밴드', bb_s,   bbMsg,   `상단 ${fmtPrice(r.bb_u)} / 하단 ${fmtPrice(r.bb_l)}`)}
            ${renderIndicatorCard('이동평균',   ma_s,   maMsg,   `MA20: ${fmtPrice(r.ma20)} / MA60: ${fmtPrice(r.ma60)}`)}
            ${renderIndicatorCard('스토캐스틱', stk_s,  stkMsg,  `K: ${fmt(r.stoch_k,1)} / D: ${fmt(r.stoch_d,1)}`)}
        </div>

        <!-- 매매 정보 -->
        <div class="strategy-grid-4" style="margin-bottom:16px;">
            ${renderTargetCard('매수 목표가', r.entry,   '#44aaff', '볼밴 하단 or MA20', sym)}
            ${renderTargetCard('1차 목표가', r.target1,  '#00C851', `+${fmt(r.ret_short, 1)}%`, sym)}
            ${renderTargetCard('2차 목표가', r.target2,  '#ffaa00', `+${fmt(r.ret_mid,   1)}%`, sym)}
            ${renderTargetCard('손절선',     r.entry * 0.96, '#FF4444', '매수가 -4%', sym)}
        </div>

        <!-- AI 분석 -->
        <div class="ai-analysis-box" id="ai-box-${sid}">
            <div class="ai-analysis-header">🤖 AI 분석 <span class="ai-badge">Claude AI</span></div>
            <div class="ai-analysis-body" id="ai-body-${sid}">
                <div class="loading" style="font-size:0.9em;">AI 분석 중...</div>
            </div>
        </div>

        <!-- 전체 분석 버튼 -->
        <div style="text-align:right;margin-top:12px;">
            <button class="btn-secondary" onclick="analyzeFromAnywhere('${sym}')">📈 전체 상세 분석 보기</button>
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

    try {
        const res = await fetch(`${API}/api/market/ai-analysis`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ticker:     r.ticker,
                name:       r.name,
                desc:       r.desc || '',
                close:      r.close,
                change_pct: r.change_pct,
                rsi:        r.rsi,
                macd:       r.macd,
                macd_sig:   r.macd_sig,
                bb_u:       r.bb_u,
                bb_m:       r.bb_m,
                bb_l:       r.bb_l,
                ma20:       r.ma20,
                ma60:       r.ma60,
                stoch_k:    r.stoch_k,
                stoch_d:    r.stoch_d,
                buy_cnt:    r.buy_cnt,
                sell_cnt:   r.sell_cnt,
                verdict:    r.verdict,
                reason:     r.reason || '',
            }),
        });
        const data = await res.json();
        const text = data.analysis || 'AI 분석 결과를 받지 못했습니다.';
        _themeAiCache[sid] = text;
        if (bodyEl) bodyEl.innerHTML = `<p class="ai-text">${text.replace(/\n/g, '<br>')}</p>`;
    } catch (e) {
        if (bodyEl) bodyEl.innerHTML = `<p style="color:var(--muted);">AI 분석 요청 실패: ${e.message}</p>`;
    }
}

function themePagePrev() {
    if (themePage > 0) { themePage--; renderThemeContent(currentTheme); }
}

function themePageNext() {
    themePage++;
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
    container.innerHTML = '<div class="loading">글로벌 지수 로딩 중...</div>';
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
        container.innerHTML = html || '<div class="caption">지수 데이터를 불러올 수 없습니다.</div>';
    } catch (_) {
        container.innerHTML = '<div class="error-msg">지수 데이터를 불러올 수 없습니다.</div>';
    }
}

async function loadNaverNews() {
    const newsContainer = document.getElementById('naverNewsContent');
    const signalsContainer = document.getElementById('naverSignals');
    newsContainer.innerHTML = '<div class="loading">뉴스 로딩 중...</div>';
    signalsContainer.innerHTML = '<div class="loading">신호 분석 중...</div>';

    try {
        const res = await fetch(`${API}/api/market/naver-news`);
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        renderNaverNews(data.news || [], newsContainer);
        renderNaverSignals(data.signals || [], signalsContainer);
    } catch (_) {
        newsContainer.innerHTML = '<div class="caption">네이버 뉴스를 불러올 수 없습니다.</div>';
        signalsContainer.innerHTML = '<div class="caption">신호 분석 불가.</div>';
    }
}

function renderNaverNews(news, container) {
    if (news.length === 0) {
        container.innerHTML = '<div class="caption">뉴스를 불러올 수 없습니다.</div>';
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
        html += `<button class="news-tab ${i === 0 ? 'active' : ''}" data-newscat="${cat}" onclick="switchNewsTab(this, '${cat}')">📌 ${cat}</button>`;
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
        container.innerHTML = '<div class="caption">현재 뉴스에서 특별한 상승 트리거가 감지되지 않았습니다.</div>';
        return;
    }

    let html = '';
    signals.forEach(trig => {
        html += `<div class="signal-trigger">
            <div class="cat">${trig.icon || '📌'} ${trig.category}</div>
            <div class="reason">📌 ${trig.reason}</div>
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
                    <button class="analyze-btn" onclick="analyzeFromAnywhere('${s.ticker}')">📊 분석</button>
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
            newsToggle.textContent = hidden ? '🔔 뉴스 알림 숨기기' : '🔔 뉴스 알림 보기';
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
            refreshStatus.textContent = `🔄 ${val}${unitText}마다 자동 업데이트`;
        }
    }
    if (refreshInterval) refreshInterval.addEventListener('change', updateRefreshStatus);
    if (refreshUnit) refreshUnit.addEventListener('change', updateRefreshStatus);
}

async function loadSidebarNews() {
    const triggeredDiv = document.getElementById('triggeredStocks');
    const newsListDiv = document.getElementById('newsList');
    const filterDiv = document.getElementById('newsSourceFilter');

    triggeredDiv.innerHTML = '<div class="loading">로딩 중...</div>';
    newsListDiv.innerHTML = '';
    filterDiv.innerHTML = '';

    try {
        const res = await fetch(`${API}/api/market/news`);
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        const news = data.news || [];
        const triggered = data.triggered || [];

        // Triggered stocks
        if (triggered.length > 0) {
            let html = '';
            triggered.forEach((trig, ti) => {
                html += `<div class="trigger-group">
                    <div class="trigger-header">${trig.icon || '📌'} ${trig.category}</div>
                    <div class="trigger-body">
                        <div class="trigger-reason">📌 ${trig.reason}</div>`;
                // Matched news
                (trig.matched_news || []).slice(0, 2).forEach(mn => {
                    const title = mn.title && mn.title.length > 45 ? mn.title.substring(0, 45) + '...' : mn.title;
                    html += `<div class="trigger-news"><a href="${mn.link}" target="_blank">${title}</a> <span style="color: var(--text-secondary);">[${mn.publisher || ''}]</span></div>`;
                });
                // Stock buttons
                (trig.stocks || []).forEach((s, si) => {
                    html += `<button class="trigger-stock-btn" onclick="analyzeFromAnywhere('${s.ticker}')">📊 ${s.name} (${s.ticker})</button>`;
                });
                html += '</div></div>';
            });
            triggeredDiv.innerHTML = html;
        } else {
            triggeredDiv.innerHTML = '<div class="caption" style="padding:8px 0;">현재 특별한 급등 트리거 없음</div>';
        }

        // News by source
        if (news.length > 0) {
            const sourceMap = {};
            news.forEach(item => {
                const pub = item.publisher || '';
                let src;
                if (pub.includes('네이버')) src = '📰 네이버증권';
                else if (pub.includes('인베스팅')) src = '🌐 인베스팅닷컴';
                else if (pub.includes('Yahoo')) src = '🇺🇸 야후파이낸스';
                else src = '📌 기타';
                if (!sourceMap[src]) sourceMap[src] = [];
                sourceMap[src].push(item);
            });

            const sources = Object.keys(sourceMap);
            let selectedSrc = sources[0];

            // Source filter buttons
            filterDiv.innerHTML = sources.map(src =>
                `<button class="news-source-btn ${src === selectedSrc ? 'active' : ''}" onclick="filterSidebarNews(this, '${src}')">${src} (${sourceMap[src].length}건)</button>`
            ).join('');

            // Store data for filtering
            window._sidebarNewsMap = sourceMap;
            renderSidebarNewsList(selectedSrc);
        }
    } catch (_) {
        triggeredDiv.innerHTML = '<div class="caption">뉴스를 불러올 수 없습니다.</div>';
    }
}

function filterSidebarNews(btn, src) {
    document.querySelectorAll('.news-source-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderSidebarNewsList(src);
}

function renderSidebarNewsList(src) {
    const container = document.getElementById('newsList');
    const items = (window._sidebarNewsMap || {})[src] || [];
    container.innerHTML = items.map(item =>
        `<div class="sidebar-news-item">
            <a href="${item.link}" target="_blank">${item.title}</a><br>
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

function toggleExpandable(id) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('open');
}
