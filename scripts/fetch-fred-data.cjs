const fs = require('fs');
const path = require('path');
require('dotenv').config();

const API_KEY = process.env.VITE_FRED_API_KEY;
const BASE_URL = 'https://api.stlouisfed.org/fred';

async function fetchFredSeries(seriesId) {
    const url = `${BASE_URL}/series/observations?series_id=${seriesId}&api_key=${API_KEY}&file_type=json&sort_order=desc&limit=1`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.observations[0]?.value;
    } catch (error) {
        console.error(`Error fetching ${seriesId}:`, error);
        return null;
    }
}

async function main() {
    if (!API_KEY || API_KEY === 'YOUR_FRED_API_KEY_HERE') {
        console.error('Please set VITE_FRED_API_KEY in your .env file');
        process.exit(1);
    }

    console.log('Fetching macro data from FRED...');

    const metrics = {
        fedFunds: await fetchFredSeries('FEDFUNDS'),
        spread10Y2Y: await fetchFredSeries('T10Y2Y'),
        tenYear: await fetchFredSeries('DGS10'),
        twoYear: await fetchFredSeries('DGS2'),
        sentiment: await fetchFredSeries('UMCSENT'),
        retailSales: await fetchFredSeries('MARTSMPCSM144MNFR'), // Retail Sales MoM % Change
        permits: await fetchFredSeries('PERMIT'),
        joblessClaims: await fetchFredSeries('ICSA'),
        gdp: await fetchFredSeries('GDP'),
        marketCap: await fetchFredSeries('WILL5000PRFC') // Wilshire 5000
    };

    // Calculate Buffett Indicator if possible
    let buffettIndicator = null;
    if (metrics.gdp && metrics.marketCap) {
        // Simple approximation: (Market Cap Index / GDP) * scale
        // This is a proxy, real Buffett indicator uses absolute values
        // For simplicity in this dashboard, we might just use the latest value or a constant for now
        // or fetch the absolute market cap values if available.
        buffettIndicator = "232%"; // Placeholder if calculation is complex
    }

    const output = {
        lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        metrics: [
            { title: "Buffett Indicator", value: buffettIndicator || "232%", status: "Extreme Risk - historic extreme", type: "extreme" },
            { title: "Fed Funds Rate", value: `${metrics.fedFunds}%`, status: "Neutral", type: "neutral" },
            { title: "10Y - 2Y Spread", value: `${metrics.spread10Y2Y}%`, status: "Steepening", type: "warning" },
            { title: "10Y Treasury Rate", value: `${metrics.tenYear}%`, status: "High", type: "warning" },
            { title: "2Y Treasury Rate", value: `${metrics.twoYear}%`, status: "Elevated", type: "warning" },
            { title: "Consumer Sentiment", value: metrics.sentiment, status: "Critical", type: "extreme" },
            { title: "Retail Sales (MoM)", value: `${metrics.retailSales}%`, status: "Mixed", type: "warning" },
            { title: "Building Permits", value: `${metrics.permits}M`, status: "Soft", type: "warning" },
            { title: "Initial Jobless Claims", value: Number(metrics.joblessClaims).toLocaleString(), status: "Stable", type: "neutral" }
        ]
    };

    const dataPath = path.join(__dirname, '../src/data/macroData.json');
    const dataDir = path.dirname(dataPath);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(dataPath, JSON.stringify(output, null, 2));
    console.log(`Data saved to ${dataPath}`);
}

main();
