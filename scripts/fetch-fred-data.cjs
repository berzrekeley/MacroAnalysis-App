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

    const dataPath = path.join(__dirname, '../src/data/macroData.json');
    if (!fs.existsSync(dataPath)) {
        console.error(`Data file not found at ${dataPath}`);
        process.exit(1);
    }

    let dashboardData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    console.log('Fetching latest macro data from FRED...');

    // Mapping metrics to FRED series
    const seriesMap = {
        'Fed Funds Rate': 'FEDFUNDS',
        '10Y - 2Y Spread': 'T10Y2Y',
        '10Y Treasury Rate': 'DGS10',
        '2Y Treasury Rate': 'DGS2',
        'Consumer Sentiment': 'UMCSENT',
        'Retail Sales (MoM)': 'MARTSMPCSM144MNFR',
        'Building Permits': 'PERMIT',
        'Initial Jobless Claims': 'ICSA',
        'Leading Index (LEI)': 'UMCSENT' // Placeholder if LEI isn't available, or use specific LEI series
    };

    // Update metrics
    for (let metric of dashboardData.metrics) {
        const seriesId = seriesMap[metric.title];
        if (seriesId) {
            const val = await fetchFredSeries(seriesId);
            if (val) {
                // Formatting based on type
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

    // Update lastUpdated
    dashboardData.lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // Save back to JSON
    fs.writeFileSync(dataPath, JSON.stringify(dashboardData, null, 2));
    console.log(`Successfully updated macro data and saved to ${dataPath}`);
}

main();
