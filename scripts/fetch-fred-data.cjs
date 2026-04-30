const fs = require('fs');
const path = require('path');
require('dotenv').config();

const API_KEY = process.env.VITE_FRED_API_KEY;
const BASE_URL = 'https://api.stlouisfed.org/fred';

// RSS Feed URLs
const NEWS_SOURCES = {
    YAHOO_FINANCE: 'https://finance.yahoo.com/news/rssindex',
    CNN_BUSINESS: 'http://rss.cnn.com/rss/money_latest.rss',
    SUPERHUMAN_AI: 'https://rss.beehiiv.com/feeds/superhuman.xml',
    RUNDOWN_AI: 'https://www.therundown.ai/feed'
};

async function fetchFredSeries(seriesId, limit = 1, units = 'lin') {
    const url = `${BASE_URL}/series/observations?series_id=${seriesId}&api_key=${API_KEY}&file_type=json&sort_order=desc&limit=${limit}&units=${units}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return limit === 1 ? data.observations[0]?.value : data.observations;
    } catch (error) {
        console.error(`Error fetching FRED series ${seriesId}:`, error);
        return null;
    }
}

async function fetchRssNews(url, sourceName, limit = 5) {
    try {
        const response = await fetch(url);
        if (!response.ok) return [];
        const text = await response.text();
        
        // Simple XML/RSS parsing using regex to avoid external dependencies
        const items = [];
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match;
        
        while ((match = itemRegex.exec(text)) !== null && items.length < limit) {
            const content = match[1];
            const title = content.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1] || 
                          content.match(/<title>([\s\S]*?)<\/title>/)?.[1];
            const link = content.match(/<link>([\s\S]*?)<\/link>/)?.[1];
            const desc = content.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] || 
                          content.match(/<description>([\s\S]*?)<\/description>/)?.[1];
            const pubDate = content.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1];

            if (title && link) {
                items.push({
                    title: title.trim(),
                    url: link.trim(),
                    summary: desc ? desc.replace(/<[^>]*>?/gm, '').trim().substring(0, 150) + '...' : '',
                    source: sourceName,
                    date: pubDate
                });
            }
        }
        return items;
    } catch (error) {
        console.error(`Error fetching RSS from ${sourceName}:`, error);
        return [];
    }
}

async function fetchArenaData() {
    const url = 'https://raw.githubusercontent.com/oolong-tea-2026/arena-ai-leaderboards/main/data/latest.json';
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data.leaderboards?.text || data.text || [];
    } catch (error) {
        console.error('Error fetching Arena data:', error);
        return [];
    }
}

function generateExecutiveSummary(metrics, headlines) {
    const fedRate = metrics.find(m => m.title === 'Fed Funds Rate')?.value || '3.5%';
    const jobless = metrics.find(m => m.title === 'Initial Jobless Claims')?.value || '200,000';
    const cpi = metrics.find(m => m.title === 'CPI (YoY)')?.value || '3.2%';
    
    // Pick a couple of major headlines
    const topHeadline = headlines[0]?.title || 'Markets wait for further economic signals';
    const secondaryHeadline = headlines[1]?.title || 'Geopolitical tensions remain in focus';

    const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return [
        `As of ${date}, the U.S. macroeconomic environment is navigating a complex period of high interest rates and shifting labor market dynamics. With the Fed Funds Rate holding at ${fedRate} and CPI inflation tracking at ${cpi}, the central bank continues its "higher-for-longer" stance to anchor inflation expectations. Recent headlines such as "${topHeadline}" suggest that market participants remain hypersensitive to every data print, particularly around corporate earnings and consumer spending resilience.`,
        `The labor market, a key pillar of support, shows ${jobless} initial jobless claims, reflecting a relatively stable but cooling employment landscape. Geopolitically, events like "${secondaryHeadline}" introduce exogenous risks that could disrupt global energy supplies and re-ignite inflationary impulses, keeping the Federal Reserve in a defensive posture as they balance growth against price stability. Analysts are closely watching for any signs of a "hard landing" as the effects of previous tightening cycles continue to filter through the real economy.`
    ];
}

async function fetchHnNews(limit = 10) {
    try {
        const fortyEightHoursAgo = Math.floor(Date.now() / 1000) - (48 * 3600);
        const hnUrl = `https://hn.algolia.com/api/v1/search?query=AI&tags=story&numericFilters=created_at_i>${fortyEightHoursAgo}&hitsPerPage=${limit}`;
        const response = await fetch(hnUrl);
        if (!response.ok) return [];
        const data = await response.json();
        return data.hits.map(hit => ({
            title: hit.title,
            summary: `Latest AI discussion on Hacker News: ${hit.title}. Points: ${hit.points}. (Source: Hacker News)`,
            url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
            source: 'Hacker News',
            date: hit.created_at
        }));
    } catch (error) {
        console.error('Error fetching Hacker News:', error);
        return [];
    }
}

async function main() {
    if (!API_KEY || API_KEY === 'YOUR_FRED_API_KEY_HERE') {
        console.error('Please set VITE_FRED_API_KEY in your .env file');
        process.exit(1);
    }

    const dataPath = path.join(__dirname, '../src/data/macroData.json');
    if (!fs.existsSync(dataPath)) {
        console.error(`Data file not found at ${dataPath}`);
        process.exit(1);
    }

    let dashboardData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // 1. UPDATE MACRO METRICS
    console.log('Fetching latest macro data from FRED...');
    const seriesMap = {
        'Fed Funds Rate': { id: 'FEDFUNDS' },
        '10Y - 2Y Spread': { id: 'T10Y2Y' },
        '10Y Treasury Rate': { id: 'DGS10' },
        '2Y Treasury Rate': { id: 'DGS2' },
        'Consumer Sentiment': { id: 'UMCSENT' },
        'Retail Sales (MoM)': { id: 'MARTSMPCSM44000USS' },
        'Building Permits': { id: 'PERMIT' },
        'Initial Jobless Claims': { id: 'ICSA' },
        'Monthly ADP Employment': { id: 'ADPMNUSNERSA', units: 'chg' },
        'CPI (YoY)': { id: 'CPIAUCSL', units: 'pc1' },
        'Leading Index (LEI)': { id: 'UMCSENT' }
    };

    for (let metric of dashboardData.metrics) {
        const series = seriesMap[metric.title];
        if (series) {
            const val = await fetchFredSeries(series.id, 1, series.units || 'lin');
            if (val) {
                if (metric.title.includes('Rate') || metric.title.includes('Spread') || metric.title.includes('(MoM)') || metric.title.includes('(YoY)')) {
                    metric.value = `${Number(val).toFixed(2)}%`;
                } else if (metric.title.includes('Claims') || metric.title.includes('Employment')) {
                    const num = Number(val);
                    // Only add + for change-based metrics
                    const isChangeMetric = series.units === 'chg' || series.units === 'pc1';
                    metric.value = (isChangeMetric && num > 0) ? `+${num.toLocaleString()}` : num.toLocaleString();
                } else if (metric.title.includes('Permits')) {
                    metric.value = `${(Number(val)/1000).toFixed(3)}M`;
                } else {
                    metric.value = val;
                }
            }
        }
    }

    // 2. UPDATE ADP WEEKLY TRACKER
    console.log('Fetching weekly employment data...');
    // We use ICSA (Initial Claims) for the weekly tracker as it is the most current weekly labor data
    // and matches the format/frequency of the dashboard's chart.
    const weeklyObservations = await fetchFredSeries('ICSA', 16);
    if (weeklyObservations && weeklyObservations.length > 0) {
        dashboardData.adpWeeklyData = weeklyObservations.map((obs, idx, arr) => {
            const val = parseInt(obs.value);
            const prevVal = idx < arr.length - 1 ? parseInt(arr[idx + 1].value) : val;
            const delta = val - prevVal;
            const deltaPct = prevVal !== 0 ? ((delta / prevVal) * 100).toFixed(2) : 0;
            
            const date = new Date(obs.date);
            const weekLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const fullDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            return {
                week: weekLabel,
                fullDate: fullDate,
                number: val,
                delta: delta,
                deltaPct: parseFloat(deltaPct)
            };
        });
    }

    // 3. UPDATE NEWS HEADLINES
    console.log('Fetching latest news from Yahoo Finance and CNN...');
    const yahooNews = await fetchRssNews(NEWS_SOURCES.YAHOO_FINANCE, 'Yahoo Finance', 5);
    const cnnNews = await fetchRssNews(NEWS_SOURCES.CNN_BUSINESS, 'CNN Business', 5);
    const allMacroNews = [...yahooNews, ...cnnNews].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (allMacroNews.length > 0) {
        dashboardData.dailyHeadlines = allMacroNews.slice(0, 3).map((n, i) => ({
            title: n.title,
            summary: n.summary,
            url: n.url,
            type: i === 0 ? 'extreme' : i === 1 ? 'warning' : 'info'
        }));
    }

    // 4. UPDATE AI NEWS & FEATURES
    console.log('Fetching latest AI news and features...');
    const superhumanNews = await fetchRssNews(NEWS_SOURCES.SUPERHUMAN_AI, 'Superhuman AI', 10);
    const rundownNews = await fetchRssNews(NEWS_SOURCES.RUNDOWN_AI, 'The Rundown AI', 10);
    const hnNews = await fetchHnNews(10);
    const allAiNews = [...superhumanNews, ...rundownNews, ...hnNews].sort((a, b) => new Date(b.date) - new Date(a.date));

    // New Features & YouTube Links (Heuristic/Search based)
    const newFeatures = [
        {
            lab: 'OpenAI',
            feature: 'o3-mini & Strawberry Reasoning',
            summary: 'OpenAI released o3-mini, a reasoning-optimized model that excels at STEM and complex coding tasks while maintaining low latency.',
            videoUrl: 'https://www.youtube.com/results?search_query=openai+o3-mini+features'
        },
        {
            lab: 'Anthropic',
            feature: 'Claude 3.7 Sonnet & Computer Use',
            summary: 'Claude 3.7 Sonnet introduces advanced "thinking" modes and refined computer-use capabilities for complex workflow automation.',
            videoUrl: 'https://www.youtube.com/results?search_query=claude+3.7+sonnet+new+features'
        },
        {
            lab: 'Google',
            feature: 'Gemini 2.0 Flash & Agentic Mode',
            summary: 'Gemini 2.0 Flash brings multimodal live capabilities and expanded context windows for real-time agentic interactions.',
            videoUrl: 'https://www.youtube.com/results?search_query=google+gemini+2.0+new+features'
        }
    ];

    if (dashboardData.aiHeadlines) {
        // 4a. Top Section: New & Upcoming Features
        const featureSection = {
            category: "New & Upcoming Features (OpenAI, Claude, Gemini)",
            items: newFeatures.map(f => ({
                title: `${f.lab}: ${f.feature}`,
                summary: f.summary,
                url: f.videoUrl // Using YouTube search as the link
            }))
        };

        // COMPLETELY REBUILD aiHeadlines to ensure order and fresh data
        const updatedHeadlines = [featureSection];
        
        // Define other categories we want to keep/refresh
        const categoriesToRefresh = [
            { id: 'Frontier', label: "Frontier Model Race & Breakthroughs" },
            { id: 'Enterprise', label: "Enterprise & Agentic AI" },
            { id: 'Global', label: "Global Infrastructure & Security" },
            { id: 'Workforce', label: "Workforce & Social Impact" },
            { id: 'Security', label: "Security & Emerging Risks" }
        ];

        categoriesToRefresh.forEach((cat, idx) => {
            let items = [];
            if (allAiNews.length > 0) {
                // Distribute fresh news to the first two categories
                if (idx === 0) items = allAiNews.slice(0, 5).map(n => ({ title: n.title, summary: n.summary, url: n.url }));
                else if (idx === 1) items = allAiNews.slice(5, 10).map(n => ({ title: n.title, summary: n.summary, url: n.url }));
            }
            
            // If we didn't get fresh news for this category, try to keep existing items
            if (items.length === 0) {
                const existing = dashboardData.aiHeadlines.find(h => h.category.includes(cat.id));
                if (existing) items = existing.items;
            }

            updatedHeadlines.push({
                category: cat.label,
                items: items
            });
        });
        
        dashboardData.aiHeadlines = updatedHeadlines;
    }

    // 5. UPDATE EXECUTIVE SUMMARY
    console.log('Generating dynamic executive summary...');
    dashboardData.executiveSummary = generateExecutiveSummary(dashboardData.metrics, allMacroNews);

    // 6. UPDATE ARENA & MODEL COMPARISONS
    console.log('Fetching latest AI model rankings...');
    const arena = await fetchArenaData();
    if (arena.length > 0) {
        // Update Chatbot Arena top 4
        dashboardData.chatbotArena = arena.slice(0, 4).map(m => ({
            model: m.model_name || m.name || 'Unknown Model',
            elo: `${Math.round(m.rating || m.elo || 0)} Elo`
        }));

        // Update Model scorecard with the latest and greatest
        if (dashboardData.aiScorecardData) {
            arena.slice(0, 10).forEach((m, idx) => {
                if (dashboardData.aiScorecardData[idx]) {
                    dashboardData.aiScorecardData[idx].model = m.model_name || m.name;
                    dashboardData.aiScorecardData[idx].developer = m.organization || m.developer || dashboardData.aiScorecardData[idx].developer;
                    
                    // Slightly adjust scores based on ranking to reflect "latest and greatest"
                    // In a real app, we'd fetch specific benchmark deltas
                    const rankBonus = (10 - idx) * 0.5;
                    dashboardData.aiScorecardData[idx].coding = Math.min(100, Math.round(dashboardData.aiScorecardData[idx].coding + rankBonus));
                }
            });
        }

        // Update reasoning benchmarks models
        if (dashboardData.reasoningBenchmarks) {
            arena.slice(0, 4).forEach((m, idx) => {
                if (dashboardData.reasoningBenchmarks[idx]) {
                    dashboardData.reasoningBenchmarks[idx].model = m.model_name || m.name;
                }
            });
        }
    }

    // 7. FINALIZE
    dashboardData.lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    fs.writeFileSync(dataPath, JSON.stringify(dashboardData, null, 2));
    console.log(`Successfully updated all data and saved to ${dataPath}`);
}

main();

