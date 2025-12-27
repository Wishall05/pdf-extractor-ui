# Motyl PDF Extractor - Next.js Demo App

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

A high-performance, modern web application that demonstrates how to extract text and metadata from PDF documents using the **Motyl PDF API**.

**[🔴 Live Demo](https://motyl-pdf-extractor.vercel.app)** | **[🔑 Get API Key](https://rapidapi.com/vishal05pandey/api/pdf-extractor-api1)**

---

## 🚀 Features

*   **PDF to Text**: Extract clean, formatted text from any PDF document.
*   **Metadata Extraction**: Get page count, word count, language, and more.
*   **Secure Proxy**: Demonstrates how to hide your API key using a Next.js Backend Route.
*   **Modern UI**: Built with Tailwind CSS, featuring drag-and-drop upload and responsive design.
*   **Developer Friendly**: Includes a "Show Raw JSON" toggle to inspect the API response structure.

## 🛠️ Tech Stack

*   **Framework**: Next.js 14 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **API**: [Motyl PDF Extractor API](https://rapidapi.com/vishal05pandey/api/pdf-extractor-api1) (via RapidAPI)

## 📦 Installation & Setup

This project is a perfect starting point for integrating PDF extraction into your own Next.js application.

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/motyl-pdf-extractor.git
    cd motyl-pdf-extractor
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env.local` file in the root directory and add your RapidAPI key:
    ```bash
    RAPIDAPI_KEY=your_actual_rapidapi_key_here
    ```
    > **Note:** You can get a free API key by subscribing to the [Motyl PDF Extractor API](https://rapidapi.com/vishal05pandey/api/pdf-extractor-api1).

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## 💡 Code Example: Secure API Proxy

The most important part of this demo is `app/api/convert/route.ts`. It shows how to forward a file to the API without exposing your credentials to the client.

```typescript
// app/api/convert/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  // Forward to Motyl API
  const response = await fetch('https://pdf-extractor-api1.p.rapidapi.com/api/extract-text', {
    method: 'POST',
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!, // Key is safe on the server
      'X-RapidAPI-Host': 'pdf-extractor-api1.p.rapidapi.com',
    },
    body: formData, // Next.js handles the multipart boundary automatically
  });

  const data = await response.json();
  return NextResponse.json(data);
}
```

## 🚀 Deploy to Vercel

You can deploy this template to Vercel in one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fmotyl-pdf-extractor&env=RAPIDAPI_KEY)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Powered by [Motyl PDF API](https://rapidapi.com/vishal05pandey/api/pdf-extractor-api1)**
