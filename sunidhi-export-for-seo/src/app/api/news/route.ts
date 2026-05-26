import { NextResponse } from 'next/server';

// CONFIGURATION: Replace this with your actual n8n webhook URL
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'YOUR_N8N_WEBHOOK_URL_HERE';

export async function GET() {
  try {
    // Fetch from your n8n webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Cache for 5 minutes (300 seconds)
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      throw new Error(`n8n webhook returned status: ${response.status}`);
    }

    const data = await response.json();

    // Return the data - assuming your n8n workflow returns { articles: [...] }
    // If your n8n returns a different structure, adjust accordingly
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Error fetching news from n8n:', error);

    // Return fallback data or empty array
    return NextResponse.json(
      {
        articles: [],
        error: 'Failed to fetch news updates. Please try again later.'
      },
      { status: 500 }
    );
  }
}

// Optional: POST endpoint if you want to manually trigger refresh
export async function POST() {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Don't cache on manual refresh
    });

    if (!response.ok) {
      throw new Error(`n8n webhook returned status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching news from n8n:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news updates' },
      { status: 500 }
    );
  }
}
