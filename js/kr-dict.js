/* ==========================================================================
 * 한국어 종목 사전 + 자동완성 검색 헬퍼 (공유 모듈)
 *
 * 사용:
 *   const items = NexusKrDict.searchKrDict('ㅅ');     // 초성 매칭
 *   const items = NexusKrDict.searchKrDict('삼성');   // 부분 매칭
 *   const items = NexusKrDict.searchKrDict('AAPL');   // ticker prefix
 *   const ticker = NexusKrDict.resolveKrName('삼성전자');  // → '005930.KS'
 *
 * 기존 app.js (종목 분석) 와 portfolio.js (포트폴리오 모달) 모두 사용 →
 * 동일 검색 UX 보장.
 *
 * 사전 업데이트는 이 파일 한 곳만.
 * ========================================================================== */
(function () {
    'use strict';

    if (window.NexusKrDict) return;

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
        const q = (query || '').trim();
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
        const q = (query || '').trim();
        const found = KR_DICT.find(item =>
            item.name === q || item.ticker.toUpperCase() === q.toUpperCase()
        );
        return found ? found.ticker : null;
    }

    window.NexusKrDict = {
        KR_DICT,
        CHOSUNG_LIST,
        getChosung,
        isChosungOnly,
        searchKrDict,
        resolveKrName,
    };
})();
