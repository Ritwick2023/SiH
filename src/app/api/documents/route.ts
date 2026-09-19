import { NextResponse } from 'next/server';
import { DocumentService } from '@/services/documentService';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    const userId = user?.id || 'demo-user-1';

    const docs = await DocumentService.getDocuments(userId);

    // Purge any lingering test survey manuals from Firestore
    const testDocs = docs.filter((d) => {
      const t = (d.title || '').toLowerCase();
      const f = (d.filename || '').toLowerCase();
      return t.includes('test_survey') || f.includes('test_survey');
    });
    for (const td of testDocs) {
      if (td.id) {
        DocumentService.deleteDocument(td.id).catch(() => {});
      }
    }

    const cleanDocs = docs.filter((d) => {
      const t = (d.title || '').toLowerCase();
      const f = (d.filename || '').toLowerCase();
      return !t.includes('test_survey') && !f.includes('test_survey');
    });

    return NextResponse.json({
      success: true,
      documents: cleanDocs,
    });
  } catch (error) {
    console.error('Failed to fetch documents:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve documents', documents: DocumentService.getSampleDocuments() },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
    }

    const deleted = await DocumentService.deleteDocument(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error('Failed to delete document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
