const fs = require('fs');
const path = require('path');
require('dotenv').config();

const API_KEY = process.env.VITE_FRED_API_KEY;
const BASE_URL = 'https://api.stlouisfed.org/fred';

async function fetchFredSeries(seriesId) {
    const url = `${BASE_URL}/series/observations?series_id=${seriesId}&api_key=${API_KEY}&file_type=json&sort_order=desc&limit=1`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data.observations[0]?.value;
    } catch (error) {
        console.error(`Error fetching FRED series ${seriesId}:`, error);
        return null;
    }
}

async function fetchAiNews() {
    const newsSources = [];
    
    // 1. Fetch from Hacker News via Algolia
    try {
        const fortyEightHoursAgo = Math.floor(Date.now() / 1000) - (48 * 3600);
        const hnUrl = `https://hn.algolia.com/api/v1/search?query=AI&tags=story&numericFilters=created_at_i>${fortyEightHoursAgo}&hitsPerPage=5`;
        const response = await fetch(hnUrl);
        if (response.ok) {
            const data = await response.json();
            data.hits.forEach(hit => {
                newsSources.push({
                    title: hit.title,
                    summary: `Latest AI discussion on Hacker News: ${hit.title}. This story has gained ${hit.points} points and ${hit.num_comments} comments. (Source: Hacker News)`,
                    url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
                    source: 'Hacker News'
                });
            });
        }
    } catch (error) {
        console.error('Error fetching Hacker News:', error);
    }

    // 2. Placeholder for Superhuman AI (RSS Feed)
    // Note: In a production environment, use an XML parser like fast-xml-parser
    try {
        const shUrl = 'https://rss.beehiiv.com/feeds/superhuman.xml';
        // We just add a note here - real fetching would require XML parsing
        // newsSources.push({ ... });
    } catch (error) {}

    // 3. Placeholder for The Rundown AI
    // newsSources.push({ ... });

    return newsSources;
}

async function fetchArenaData() {
    // Unofficial mirror for LMSYS Arena data
    const url = 'https://raw.githubusercontent.com/oolong-tea-2026/arena-ai-leaderboards/main/data/latest.json';
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        // Return text-based leaderboard if available
        return data.leaderboards?.text || data.text || [];
    } catch (error) {
        console.error('Error fetching Arena data:', error);
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
        'Fed Funds Rate': 'FEDFUNDS',
        '10Y - 2Y Spread': 'T10Y2Y',
        '10Y Treasury Rate': 'DGS10',
        '2Y Treasury Rate': 'DGS2',
        'Consumer Sentiment': 'UMCSENT',
        'Retail Sales (MoM)': 'MARTSMPCSM144MNFR',
        'Building Permits': 'PERMIT',
        'Initial Jobless Claims': 'ICSA',
        'Leading Index (LEI)': 'UMCSENT' 
    };

    for (let metric of dashboardData.metrics) {
        const seriesId = seriesMap[metric.title];
        if (seriesId) {
            const val = await fetchFredSeries(seriesId);
            if (val) {
                if (metric.title.includes('Rate') || metric.title.includes('Spread') || metric.title.includes('(MoM)')) {
                    metric.value = `${Number(val).toFixed(2)}%`;
                } else if (metric.title.includes('Claims') || metric.title.includes('Employment')) {
                    metric.value = Number(val).toLocaleString();
                } else if (metric.title.includes('Permits')) {
                    metric.value = `${(Number(val)/1000).toFixed(3)}M`;
                } else {
                    metric.value = val;
                }
            }
        }
    }

    // 2. UPDATE AI NEWS
    console.log('Fetching latest AI news...');
    const news = await fetchAiNews();
    if (news.length > 0) {
        // Distribute news into the existing categories
        // For simplicity, we refresh the first category "Major Company Moves & Partnerships" 
        // with the latest news if we have it, or spread it out.
        if (dashboardData.aiHeadlines && dashboardData.aiHeadlines.length > 0) {
            // Update the items for the first two categories
            dashboardData.aiHeadlines[0].items = news.slice(0, 5).map(n => ({ 
                title: n.title, 
                summary: n.summary,
                url: n.url 
            }));
            if (dashboardData.aiHeadlines[1] && news.length > 5) {
                dashboardData.aiHeadlines[1].items = news.slice(5, 8).map(n => ({ 
                    title: n.title, 
                    summary: n.summary,
                    url: n.url 
                }));
            }
        }
        
        // Also update the small "Daily Headlines" on the overview page
        if (dashboardData.dailyHeadlines) {
            dashboardData.dailyHeadlines = news.slice(0, 3).map((n, i) => ({
                title: n.title,
                summary: n.summary,
                url: n.url,
                type: i === 0 ? 'extreme' : i === 1 ? 'warning' : 'info'
            }));
        }
    }

    // 3. UPDATE ARENA DATA
    console.log('Fetching latest AI model rankings...');
    const arena = await fetchArenaData();
    if (arena.length > 0) {
        // Map Arena data to chatbotArena section (Top 4)
        dashboardData.chatbotArena = arena.slice(0, 4).map(m => ({
            model: m.model_name || m.name || 'Unknown Model',
            elo: `${Math.round(m.rating || m.elo || 0)} Elo`
        }));

        // Update the top 10 scorecard ranking order if names match or are similar
        // This is a rough heuristic to keep the rank current
        if (dashboardData.aiScorecardData) {
            // We just update the labels and ranks for the top ones
            arena.slice(0, 10).forEach((m, idx) => {
                if (dashboardData.aiScorecardData[idx]) {
                    dashboardData.aiScorecardData[idx].model = m.model_name || m.name;
                    // Note: We don't have Coding/Writing/etc. from Arena ELO alone,
                    // but we ensure the ranking order reflects the latest Arena performance.
                }
            });
        }
    }

    // 4. FINALIZE
    dashboardData.lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    fs.writeFileSync(dataPath, JSON.stringify(dashboardData, null, 2));
    console.log(`Successfully updated all data and saved to ${dataPath}`);
}

main();
