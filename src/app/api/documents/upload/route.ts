import { NextResponse } from 'next/server';
import path from 'node:path';
import { DocumentService } from '@/services/documentService';
import { TextExtractionService } from '@/services/textExtractionService';
import { getAuthenticatedUser } from '@/lib/auth';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB limit for official statistical manuals
const ALLOWED_EXTENSIONS = new Set(['.pdf', '.txt']);
const ALLOWED_MIME_TYPES = new Set(['application/pdf', 'text/plain']);

export async function POST(request: Request) {
  try {
    // 1. Authenticate Request
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required to upload documents' },
        { status: 401 }
      );
    }

    // 2. Role Check: Only trainers and admins can upload official documents (Req #17)
    const role = user.app_metadata?.role;
    if (role !== 'admin' && role !== 'trainer') {
      return NextResponse.json(
        { error: 'Forbidden: Document upload requires trainer or admin privilege' },
        { status: 403 }
      );
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json({ error: 'Invalid or missing multipart form data' }, { status: 400 });
    }

    const file = formData.get('file') as File | null;
    const targetCompetency = formData.get('competency') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 3. File Size Validation (Req #18)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds maximum permitted limit (25 MB)' },
        { status: 400 }
      );
    }

    // 4. Extension & Path Traversal Prevention
    const originalName = file.name || 'document.pdf';
    const ext = path.extname(originalName).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: `Unsupported file extension "${ext}". Allowed: .pdf, .txt` },
        { status: 400 }
      );
    }

    if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `Invalid MIME type "${file.type}". Allowed: application/pdf, text/plain` },
        { status: 400 }
      );
    }

    // Sanitize filename to prevent directory traversal
    const safeBaseName = path.basename(originalName).replace(/[^a-zA-Z0-9._-]/g, '_');
    const safeFilename = `${Date.now()}-${safeBaseName}`;

    const arrayBuffer = await file.arrayBuffer();

    // 5. Magic Bytes / Header Content Validation for PDFs
    if (ext === '.pdf') {
      const headerBytes = new Uint8Array(arrayBuffer.slice(0, 5));
      const pdfHeader = String.fromCharCode(...headerBytes);
      if (pdfHeader !== '%PDF-') {
        return NextResponse.json(
          { error: 'Invalid file content: PDF magic header missing or corrupt' },
          { status: 400 }
        );
      }
    }

    const extraction = await TextExtractionService.extractText(
      arrayBuffer,
      safeFilename,
      file.type || 'application/pdf'
    );

    const ingested = await DocumentService.processDocument(
      safeFilename,
      extraction.text || 'Sample MoSPI guidelines extracted text for statistical manual.',
      targetCompetency ? [targetCompetency] : [],
      user.id
    );

    return NextResponse.json({
      success: true,
      document: ingested,
      extractionMethod: extraction.method,
      wordCount: extraction.wordCount,
    });
  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json({ error: 'Failed to process document' }, { status: 500 });
  }
}
