import { NextRequest, NextResponse } from 'next/server';

// Configuration Constants
const RAPIDAPI_HOST = 'pdf-extractor-api1.p.rapidapi.com';
const RAPIDAPI_ENDPOINT = `https://${RAPIDAPI_HOST}/api/metadata`;

export async function POST(req: NextRequest) {
  console.log('Received request to /api/metadata');

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const rapidApiKey = process.env.RAPIDAPI_KEY;
    if (!rapidApiKey) {
      console.error('CRITICAL: Missing RAPIDAPI_KEY environment variable');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const backendFormData = new FormData();
    backendFormData.append('file', file);

    // Debug Logging
    console.log('--- Sending request to RapidAPI (Metadata) ---');
    console.log(`URL: ${RAPIDAPI_ENDPOINT}`);
    console.log(`Host Header: ${RAPIDAPI_HOST}`);
    console.log(`File: ${file.name} (${file.size} bytes)`);
    console.log('-------------------------------------------');

    const response = await fetch(RAPIDAPI_ENDPOINT, {
      method: 'POST',
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': RAPIDAPI_HOST,
      },
      body: backendFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`RapidAPI Error: ${response.status} - ${errorText}`);
      return NextResponse.json(
        { error: `API Error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Successfully received metadata from RapidAPI');
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Internal Server Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
