import * as cheerio from 'cheerio';

function isMarketNews(title, content, link) {
    const fullText = (title + ' ' + content).toLowerCase();
    const lowerLink = (link || '').toLowerCase();

    const blockedUrlPatterns = [
        '/sports/', '/sport/', '/entertainment/', '/life/', '/lifestyle/',
        '/politics/', '/world/', '/science/', '/travel/', '/food/',
        '/health/', '/living/', '/arts/', '/culture/', '/style/'
    ];

    if (blockedUrlPatterns.some(pattern => lowerLink.includes(pattern))) {
        return false;
    }

    const strictExclusionKeywords = [
        'actor', 'actress', 'celebrity', 'bollywood', 'hollywood',
        'movie star', 'film star', 'musician', 'singer', 'performer',
        'cricket', 'football', 'tennis', 'golf', 'basketball', 'baseball',
        'soccer', 'athlete', 'player', 'tournament', 'championship',
        'world cup', 'olympics', 'sports match', 'sporting event',
        'tennis star', 'cricket star', 'football star', 'hockey', 'badminton',
        'wrestling', 'boxing', 'formula 1', 'f1', 'race', 'racing',
        'league', 'premier league', 'ipl', 'nfl', 'nba', 'mlb', 'nhl',
        'score', 'vs', 'versus', 'playoff', 'semi-final',
        'quarter-final', 'medal', 'trophy', 'stadium',
        'celebrity home', 'actor home', 'actress home',
        'luxury mansion', 'beverly hills home', 'malibu home', 'l.a. home',
        'movie', 'film', 'music concert', 'album', 'grammy', 'oscar',
        'box office', 'streaming show', 'tv series', 'netflix show',
        'weather', 'fashion show', 'fashion week', 'festival',
        'murder', 'crime scene', 'arrest', 'wedding', 'divorce',
        'pickleball', 'ipl auction'
    ];

    const hasStrictExclusions = strictExclusionKeywords.some(keyword => {
        const commonWords = ['score', 'vs', 'versus', 'medal'];
        if (commonWords.includes(keyword)) {
            const regex = new RegExp(`\\b${keyword}\\b`, 'i');
            return regex.test(fullText);
        }
        return fullText.includes(keyword);
    });

    if (hasStrictExclusions) return false;

    const financialKeywords = [
        'stock', 'share', 'equity', 'ipo', 'listing', 'profit', 'revenue', 'earnings', 'dividend',
        'rally', 'surge', 'fall', 'crash', 'inflation', 'interest rate', 'bond yield', 'treasury',
        'mutual fund', 'portfolio', 'valuation', 'market cap', 'pe ratio', 'eps', 'brokerage',
        'analyst', 'budget', 'bank', 'sector', 'industry', 'quarterly', 'q1', 'q2', 'q3', 'q4',
        'yoy', 'growth', 'investment', 'trading', 'investor', 'market', 'financial', 'economic',
        'business', 'company', 'corporate', 'fiscal', 'funding', 'startup', 'venture', 'private equity',
        'vc', 'acquisition', 'merger', 'deal', 'nifty', 'sensex', 'nse', 'bse', 'sebi', 'rbi',
        'rupee', 'gdp', 'capital', 'fund', 'crore', 'billion', 'million'
    ];

    let financialKeywordCount = 0;
    financialKeywords.forEach(keyword => {
        if (fullText.includes(keyword)) financialKeywordCount++;
    });

    return financialKeywordCount >= 2;
}

const response = await fetch('https://www.vccircle.com/', {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
    },
});

const html = await response.text();
const $ = cheerio.load(html);
const seen = new Set();
const items = [];

$('a[href]').each((i, el) => {
    const href = $(el).attr('href') || '';
    const title = $(el).text().trim();
    const isArticleSlug = href.match(/(?:vccircle\.com\/|^\/)[a-z0-9]+(-[a-z0-9]+){3,}/);
    if (!isArticleSlug || title.length < 20) return;
    const link = href.startsWith('http') ? href : `https://www.vccircle.com${href}`;
    if (!link.includes('vccircle.com')) return;
    if (seen.has(link)) return;
    seen.add(link);
    items.push({ title, link, content: '' });
});

console.log(`Found ${items.length} articles. Testing isMarketNews filter:`);
let passed = 0, rejected = 0;
items.slice(0, 20).forEach(item => {
    const result = isMarketNews(item.title, item.content, item.link);
    if (result) { passed++; console.log(`✅ PASS: ${item.title.substring(0, 80)}`); }
    else { rejected++; console.log(`❌ FAIL: ${item.title.substring(0, 80)}`); }
});
console.log(`\nPassed: ${passed}, Rejected: ${rejected}`);
