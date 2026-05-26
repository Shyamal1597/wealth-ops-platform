
import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { HttpsProxyAgent } from 'https-proxy-agent';

export async function GET() {
    try {
        const url = 'https://www.bseindia.com/markets/equity/EQReports/setcal.aspx';

        // Configure axios with a realistic User-Agent to mimic a browser
        const config: any = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
            },
            timeout: 10000 // 10 second timeout
        };

        // Add proxy support if environment variables are set (optional, good practice)
        if (process.env.HTTPS_PROXY) {
            config.httpsAgent = new HttpsProxyAgent(process.env.HTTPS_PROXY);
        }

        const { data } = await axios.get(url, config);
        const $ = cheerio.load(data);

        const settlementData: any[] = [];

        // Select the main table - based on inspection, it's likely a GridView or standard table
        // We'll look for the table that contains "Settlement No" in the header
        const table = $('table').filter((i, el) => {
            return $(el).text().includes('Settlement No');
        }).first();

        if (table.length > 0) {
            // Iterate over rows, skipping the header row
            table.find('tr').each((i, row) => {
                if (i === 0) return; // Skip header

                const cols = $(row).find('td');
                if (cols.length > 0) {
                    const settlementNo = $(cols[0]).text().trim();
                    const depositoryNo = $(cols[1]).text().trim();
                    const tradingDate = $(cols[2]).text().trim();
                    const entryDate = $(cols[3]).text().trim();
                    const confirmationDate = $(cols[4]).text().trim();
                    const payInPayOut = $(cols[5]).text().trim();
                    const auctionSettlNo = $(cols[6]).text().trim();
                    const submissionDate = $(cols[7]).text().trim();
                    const auctionPayOut = $(cols[8]).text().trim();

                    if (settlementNo) {
                        settlementData.push({
                            settlementNo,
                            depositoryNo,
                            tradingDate,
                            entryDate,
                            confirmationDate,
                            payInPayOut,
                            auctionSettlNo,
                            submissionDate,
                            auctionPayOut
                        });
                    }
                }
            });
        }

        return NextResponse.json({
            success: true,
            data: settlementData,
            source: 'BSE India',
            timestamp: new Date().toISOString()
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
            },
        });

    } catch (error: any) {
        console.error('Error fetching BSE settlement calendar:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch settlement data', details: error.message },
            { status: 500 }
        );
    }
}
