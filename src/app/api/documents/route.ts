import { NextResponse } from 'next/server';
import { DocumentService } from '@/services/documentService';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required to view documents' },
        { status: 401 }
      );
    }

    const docs = await DocumentService.getDocuments(user.id);

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
    // 1. Authenticate Request
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required to delete documents' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
    }

    // 2. Role Check: Only trainers and admins can delete documents (Req #17)
    const role = user.app_metadata?.role;
    if (role !== 'admin' && role !== 'trainer') {
      return NextResponse.json(
        { error: 'Forbidden: Document management requires trainer or admin privilege' },
        { status: 403 }
      );
    }

    // 3. IDOR Check: Trainers can only delete their own uploaded documents; Admins can delete any
    if (role !== 'admin') {
      const allDocs = await DocumentService.getDocuments();
      const targetDoc = allDocs.find((d) => d.id === id);
      if (targetDoc && targetDoc.userId && targetDoc.userId !== user.id && targetDoc.userId !== 'public') {
        return NextResponse.json(
          { error: 'Forbidden: You do not have permission to delete this document' },
          { status: 403 }
        );
      }
    }

    const deleted = await DocumentService.deleteDocument(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error('Failed to delete document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
