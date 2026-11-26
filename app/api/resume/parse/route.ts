import { NextResponse } from 'next/server';
import { extractEntitiesFromText } from '@/lib/parser';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse/lib/pdf-parse.js');

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('resume') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No resume file uploaded' }, { status: 400 });
        }
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);


        const pdfData = await pdfParse(buffer);
        const rawText = pdfData.text;

        if (!rawText || rawText.trim().length === 0) {
            return NextResponse.json(
                { error: 'Could not extract text from the provided PDF.' },
                { status: 422 }
            );
        }

        const extractedData = extractEntitiesFromText(rawText);

        return NextResponse.json({
            success: true,
            fileName: file.name,
            fileSize: file.size,
            data: extractedData
        });
    } catch (err: any) {
        console.error('Resume parsing error:', err);
        return NextResponse.json(
            { error: err.message || 'Failed to parse resume' },
            { status: 500 }
        );
    }
}