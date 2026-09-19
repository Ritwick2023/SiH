'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ProvenanceBadge } from '@/components/ProvenanceBadge';
import { DocumentService, type IngestedDocument } from '@/services/documentService';
import {
  Upload,
  FileText,
  CheckCircle2,
  RefreshCw,
  Layers,
  Brain,
  Eye,
  X,
  BookOpen,
  Trash2,
  Download,
  Database,
  Search,
  Sparkles,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { useSafeLocale } from '@/lib/useSafeLocale';

export default function DocumentsPage() {
  const locale = useSafeLocale();
  const isHindi = locale === 'hi';
  const [documents, setDocuments] = useState<IngestedDocument[]>(() =>
    DocumentService.getSampleDocuments()
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [selectedCompetency, setSelectedCompetency] = useState('comp-capi');
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [selectedChunkDoc, setSelectedChunkDoc] = useState<IngestedDocument | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterComp, setActiveFilterComp] = useState<string>('all');
  const [deleteConfirmDoc, setDeleteConfirmDoc] = useState<IngestedDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredDocuments = documents.filter((d) => {
    const lowerTitle = (d.title || '').toLowerCase();
    const lowerFilename = (d.filename || '').toLowerCase();
    if (
      lowerTitle.includes('test_survey') ||
      lowerFilename.includes('test_survey') ||
      d.title === 'Test_Survey_Manual' ||
      d.filename === 'Test_Survey_Manual.txt'
    ) {
      return false;
    }

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      d.title.toLowerCase().includes(q) ||
      d.filename.toLowerCase().includes(q) ||
      (d.targetCompetencies && d.targetCompetencies.some((c) => c.toLowerCase().includes(q)));
    const matchesComp =
      activeFilterComp === 'all' ||
      (d.targetCompetencies && d.targetCompetencies.includes(activeFilterComp));
    return matchesSearch && matchesComp;
  });

  // Manual refresh handler
  const handleRefresh = async () => {
    setIsLoadingDocs(true);
    try {
      const res = await fetch('/api/documents');
      if (res.ok) {
        const data = await res.json();
        if (data.documents && data.documents.length > 0) {
          const cleanDocs = data.documents.filter((d: IngestedDocument) => {
            const t = (d.title || '').toLowerCase();
            const f = (d.filename || '').toLowerCase();
            const isTest = t.includes('test_survey') || f.includes('test_survey');
            if (isTest && d.id) {
              fetch(`/api/documents?id=${encodeURIComponent(d.id)}`, { method: 'DELETE' }).catch(() => {});
            }
            return !isTest;
          });
          setDocuments(cleanDocs);
        }
      }
    } catch (err) {
      console.warn('Could not fetch from /api/documents:', err);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  // Initial load from backend Firestore with automated purge of test survey artifacts
  useEffect(() => {
    let active = true;
    fetch('/api/documents')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.documents?.length > 0) {
          const cleanDocs = data.documents.filter((d: IngestedDocument) => {
            const t = (d.title || '').toLowerCase();
            const f = (d.filename || '').toLowerCase();
            const isTest = t.includes('test_survey') || f.includes('test_survey');
            if (isTest && d.id) {
              fetch(`/api/documents?id=${encodeURIComponent(d.id)}`, { method: 'DELETE' }).catch(() => {});
            }
            return !isTest;
          });
          setDocuments(cleanDocs);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch from /api/documents:', err);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleOpenDeleteConfirm = (doc: IngestedDocument) => {
    setDeleteConfirmDoc(doc);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmDoc) return;
    const { id, title } = deleteConfirmDoc;
    setIsDeleting(true);
    try {
      await fetch(`/api/documents?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      setUploadMessage(
        isHindi
          ? `दस्तावेज़ संग्रह से "${title}" हटा दिया गया।`
          : `Removed "${title}" from document repository.`
      );
      setDeleteConfirmDoc(null);
    } catch (err) {
      console.error('Failed to delete document:', err);
      setUploadMessage(
        isHindi
          ? `दस्तावेज़ "${title}" को हटाने में विफल।`
          : `Failed to remove "${title}" from document repository.`
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('competency', selectedCompetency);

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.document) {
        setDocuments((prev) => [data.document, ...prev]);
        setUploadMessage(isHindi ? `"${file.name}" को ${data.document.chunkCount} अनुक्रमित खंडों में सफलतापूर्वक संसाधित किया गया।` : `Successfully parsed "${file.name}" into ${data.document.chunkCount} indexed chunks.`);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadMessage(isHindi ? 'अपलोड विफल रहा। सिमुलेटेड ऑफ़लाइन दस्तावेज़ विखंडन का उपयोग कर रहे हैं।' : 'Upload failed. Using simulated offline document ingestion.');
      // Local fallback parsing
      const text = await file.text();
      const localDoc = await DocumentService.processDocument(file.name, text, [selectedCompetency]);
      setDocuments((prev) => [localDoc, ...prev]);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2d1f17]">
            {isHindi ? 'MoSPI दस्तावेज़ प्रसंस्करण केंद्र' : 'MoSPI Document Processing Hub'}
          </h1>
          <p className="text-sm text-[#705849] mt-0.5">
            {isHindi
              ? 'स्वचालित विखंडन और अनुक्रमण के लिए सांख्यिकीय नियमावली, सर्वेक्षण अनुसूचियां और FRAC पाठ्यचर्या अपलोड करें।'
              : 'Upload statistical manuals, survey schedules, and FRAC curriculum guides for automated chunking.'}
          </p>
        </div>
        <ProvenanceBadge provenance="VERIFIED_OFFICIAL" />
      </div>

      {/* Upload Box */}
      <Card className="rounded-2xl bg-white shadow-card">
        <CardHeader>
          <CardTitle className="text-lg text-[#2d1f17]">
            {isHindi ? 'नई नियमावली या अनुसूची अपलोड करें' : 'Ingest New Manual or Schedule'}
          </CardTitle>
          <CardDescription className="text-[#705849]">
            {isHindi
              ? 'स्वचालित अर्थगत विखंडन और क्षमता मानचित्रण के साथ मल्टी-मॉडल निष्कर्षण पाइपलाइन।'
              : 'Multi-modal extraction pipeline with automated semantic chunking and competency mapping.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <div>
              <label className="block text-xs font-semibold text-[#705849] uppercase tracking-wider mb-1.5">
                {isHindi ? 'लक्षित FRAC क्षमता' : 'Target FRAC Competency'}
              </label>
              <select
                value={selectedCompetency}
                onChange={(e) => setSelectedCompetency(e.target.value)}
                className="w-full text-sm rounded-xl p-3 bg-[#F2E6D8]/40 text-[#2d1f17] focus:outline-none focus:ring-2 focus:ring-[#555934]/20 transition-all shadow-2xs cursor-pointer"
              >
                <option value="comp-capi">{isHindi ? 'CAPI टैबलेट संचालन' : 'CAPI Tablet Operation'}</option>
                <option value="comp-demarcation">{isHindi ? 'ब्लॉक सीमांकन एवं यूएफएस (अनुसूची 0.0)' : 'Block Demarcation & UFS (Schedule 0.0)'}</option>
                <option value="comp-data">{isHindi ? 'डेटा प्रविष्टि एवं संवीक्षा (PLFS)' : 'Data Entry & Scrutiny (PLFS)'}</option>
                <option value="comp-survey">{isHindi ? 'सर्वेक्षण प्रतिचयन एवं डिजाइन' : 'Survey Sampling & Design'}</option>
                <option value="comp-scrutiny">{isHindi ? 'क्षेत्र संवीक्षा एवं सत्यापन' : 'Field Scrutiny & Validation'}</option>
              </select>
            </div>
          </div>

          <label className="flex flex-col items-center justify-center rounded-2xl p-8 text-center bg-[#F2E6D8]/35 hover:bg-[#F2E6D8]/65 transition cursor-pointer">
            <Upload className="h-10 w-10 text-[#555934] mb-2" />
            <p className="font-semibold text-[#2d1f17]">
              {isHindi ? 'MoSPI दस्तावेज़ चुनने के लिए क्लिक करें या यहाँ खींचें' : 'Click to browse or drop MoSPI documents'}
            </p>
            <p className="text-xs text-[#705849] mt-1">
              {isHindi
                ? 'पीडीएफ मैनुअल, टेक्स्ट अर्क, सर्वेक्षण निर्देश (PLFS, ASI, NSS) समर्थित हैं'
                : 'Supports PDF manuals, text extracts, survey instructions (PLFS, ASI, NSS)'}
            </p>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            {isUploading && (
              <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-[#555934]">
                <RefreshCw className="h-4 w-4 animate-spin" />
                {isHindi ? 'दस्तावेज़ खंडों का विश्लेषण और क्षमता टैगिंग जारी है...' : 'Parsing document chunks and assigning competency tags...'}
              </div>
            )}
          </label>

          {uploadMessage && (
            <div className="p-3.5 bg-[#555934]/12 text-[#555934] text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#555934] shrink-0" />
              {uploadMessage}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Library Table with Interactive Documents Bar */}
      <Card className="rounded-2xl bg-white shadow-card">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg text-[#2d1f17]">
                {isHindi ? 'अनुक्रमित दस्तावेज़ संग्रह' : 'Ingested Document Repository'}
              </CardTitle>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#555934]/12 text-[#555934]">
                <Database className="h-3 w-3" />
                {isHindi ? 'फ़ायरस्टोर से सिंक' : 'Firestore Synced'}
              </span>
            </div>
            <CardDescription className="text-[#705849] mt-0.5">
              {isHindi
                ? `${documents.length} संदर्भ नियमावली एआई प्रश्न निर्माण के लिए अनुक्रमित हैं।`
                : `${documents.length} reference manuals indexed for grounding Multi-AI Question Generation.`}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/mcq-generator"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#555934] text-white hover:bg-[#3e4225] transition shadow-xs cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#F8C858]" />
              <span>{isHindi ? 'दस्तावेज़ से क्विज़ बनाएं' : 'Practice Quiz from Manuals'}</span>
            </Link>

            <button
              onClick={handleRefresh}
              disabled={isLoadingDocs}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#555934] bg-[#555934]/10 hover:bg-[#555934]/20 transition disabled:opacity-50 cursor-pointer"
              title="Refresh documents from Firestore"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoadingDocs ? 'animate-spin' : ''}`} />
              {isHindi ? 'रिफ्रेश' : 'Refresh'}
            </button>
          </div>
        </CardHeader>

        {/* Dedicated Documents Bar (Search & Filter Toolbar) */}
        <div className="px-6 pb-4 border-b border-[#F2E6D8] space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#705849]/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isHindi ? "दस्तावेज़ या नियमावली खोजें... (शीर्षक, फ़ाइल या क्षमता)" : "Search documents & manuals by title, filename, or competency..."}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/30 text-[#2d1f17] placeholder:text-[#705849]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#555934]/20 transition shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#705849] hover:text-[#2d1f17]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Document Count Badge */}
            <span className="text-xs font-mono font-semibold text-[#705849] px-2.5 py-1.5 rounded-lg bg-[#FAF6F0] border border-[#BF9B7A]/25 shrink-0 self-center sm:self-auto">
              {filteredDocuments.length} / {documents.length} {isHindi ? 'मैनुअल' : 'manuals'}
            </span>
          </div>

          {/* Competency Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {[
              { id: 'all', label: isHindi ? 'सभी दस्तावेज़' : 'All Manuals' },
              { id: 'comp-capi', label: isHindi ? 'CAPI टैबलेट' : 'CAPI Operations' },
              { id: 'comp-demarcation', label: isHindi ? 'सीमांकन (अनुसूची 0.0)' : 'Demarcation (Sch 0.0)' },
              { id: 'comp-data', label: isHindi ? 'डेटा संवीक्षा (PLFS)' : 'Data Scrutiny (PLFS)' },
              { id: 'comp-survey', label: isHindi ? 'नमूनाकरण एवं डिजाइन' : 'Sampling & Design' },
              { id: 'comp-scrutiny', label: isHindi ? 'फील्ड सत्यापन' : 'Field Validation' },
            ].map((comp) => (
              <button
                key={comp.id}
                type="button"
                onClick={() => setActiveFilterComp(comp.id)}
                className={`px-3 py-1 rounded-xl font-medium transition cursor-pointer shrink-0 ${
                  activeFilterComp === comp.id
                    ? 'bg-[#555934] text-white shadow-2xs font-bold'
                    : 'bg-[#FAF6F0] text-[#705849] hover:bg-[#F2E6D8] border border-[#BF9B7A]/25'
                }`}
              >
                {comp.label}
              </button>
            ))}
          </div>
        </div>

        <CardContent className="pt-4">
          {filteredDocuments.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <FileText className="h-10 w-10 text-[#BF9B7A] mx-auto opacity-50" />
              <p className="text-sm font-semibold text-[#2d1f17]">
                {isHindi ? 'कोई दस्तावेज़ नहीं मिला' : 'No documents match your filter'}
              </p>
              <p className="text-xs text-[#705849]">
                {isHindi ? 'कृपया दूसरा खोज शब्द आज़माएँ या फ़िल्टर रीसेट करें।' : 'Try adjusting your search query or competency filter.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilterComp('all');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#555934] text-white text-xs font-semibold hover:bg-[#3e4225] transition"
              >
                {isHindi ? 'फ़िल्टर साफ़ करें' : 'Clear Filters'}
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#F2E6D8]">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-[#555934]/10 rounded-xl text-[#555934] shrink-0 mt-0.5">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#2d1f17]">{doc.title}</h4>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-[#705849] mt-0.5">
                        <span className="font-mono">{doc.filename}</span>
                        <span>•</span>
                        <span>{(doc.sizeBytes / 1024 / 1024).toFixed(1)} MB</span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 font-semibold text-[#555934]">
                          <Layers className="h-3 w-3" />
                          {doc.chunkCount} {isHindi ? 'खंड' : 'Chunks'}
                        </span>
                      </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <span className="text-xs px-3 py-1 font-semibold rounded-full bg-[#555934]/12 text-[#555934]">
                    {doc.status}
                  </span>

                  {doc.storageUrl && (
                    <a
                      href={doc.storageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-[#F2E6D8]/60 hover:bg-[#E8DACB] text-[#593E2E] text-xs font-semibold rounded-xl transition-all shadow-2xs"
                      title="Download document from cloud storage"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <button
                    onClick={() => setSelectedChunkDoc(doc)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F2E6D8]/60 hover:bg-[#E8DACB] text-[#593E2E] text-xs font-semibold rounded-xl transition-all shadow-2xs cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {isHindi ? 'खंड देखें' : 'View Chunks'}
                  </button>

                  <Link
                    href={`/mcq-generator?docId=${doc.id}&competency=${doc.targetCompetencies[0] || 'comp-capi'}&docTitle=${encodeURIComponent(doc.title)}`}
                    prefetch={true}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#555934] hover:bg-[#3e4225] text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
                  >
                    <Brain className="w-3.5 h-3.5" />
                    {isHindi ? 'MCQ बनाएं' : 'Generate MCQs'}
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleOpenDeleteConfirm(doc)}
                    className="p-2 text-[#8C5B3E] hover:bg-[#8C5B3E]/10 rounded-xl transition cursor-pointer"
                    title={isHindi ? 'दस्तावेज़ हटाएं' : 'Delete document'}
                    aria-label={isHindi ? `दस्तावेज़ "${doc.title}" हटाएं` : `Delete document "${doc.title}"`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      </Card>

      {/* Semantic Chunks Modal */}
      {selectedChunkDoc && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl">
            <div className="p-4 bg-gradient-to-r from-[#555934] to-[#3e4225] rounded-t-2xl flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-white" />
                <h3 className="text-base font-bold text-white">
                  {isHindi ? 'अर्थगत खंड:' : 'Semantic Chunks:'} {selectedChunkDoc.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedChunkDoc(null)}
                className="p-1 text-white/80 hover:text-white rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1 text-sm">
              <p className="text-xs text-slate-500">
                {isHindi
                  ? 'प्रश्न निर्माण के लिए निकाले गए MoSPI अध्याय अनुभाग और पैराग्राफ खंड:'
                  : 'Extracted MoSPI chapter sections and paragraph chunks mapped for question grounding:'}
              </p>
              {(selectedChunkDoc.chunks && selectedChunkDoc.chunks.length > 0
                ? selectedChunkDoc.chunks.map((c) => ({
                    section: c.metadata?.section || `Chunk #${c.chunkIndex}`,
                    page: `Page ${c.metadata?.pageNumber || 1} • ${c.metadata?.wordCount || 0} words`,
                    text: c.text,
                  }))
                : [
                    {
                      section: 'Chapter 1: General Description & Scope',
                      page: 'Page 4, Para 1.2',
                      text: 'The Field Operations Division (FOD) with its headquarters at New Delhi and Faridabad and a network of Zonal, Regional, and Sub-Regional offices across India is responsible for the collection of primary field data.',
                    },
                    {
                      section: 'Chapter 2: Concepts, Definitions & Operational Protocols',
                      page: 'Page 12, Para 2.4',
                      text: 'When the approximate present population of a sample village or UFS block is 1,200 or more, it is divided into a suitable number of sub-divisions called hamlet-groups in rural areas and sub-blocks in urban areas.',
                    },
                    {
                      section: 'Chapter 3: Schedule 0.0 Listing of Households',
                      page: 'Page 18, Para 3.1',
                      text: 'Enumeration must begin from the North-West corner of the FSU and proceed in a clockwise or continuous serpentine sweep to ensure complete coverage without omission or duplication.',
                    },
                    {
                      section: 'Chapter 4: CAPI Tablet Ingestion & Validation Rules',
                      page: 'Page 24, Para 4.3',
                      text: 'All coordinates must achieve a GPS accuracy threshold within ±10 metres with 4 active satellite locks before committing Schedule 0.0 records to the encrypted local SQLite database.',
                    },
                  ]
              ).map((chunk, idx) => (
                <div key={idx} className="p-3 bg-[#F2E6D8]/25 border border-[#F2E6D8] rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#2d1f17]">{chunk.section}</span>
                    <span className="text-[11px] font-mono font-semibold text-[#555934]">{chunk.page}</span>
                  </div>
                  <p className="text-xs text-[#593E2E] leading-relaxed italic">
                    &ldquo;{chunk.text}&rdquo;
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-[#F2E6D8] flex items-center justify-between">
              <span className="text-xs text-[#705849]">
                {isHindi ? 'संबद्ध क्षमता:' : 'Tagged Competency:'} {selectedChunkDoc.targetCompetencies.join(', ')}
              </span>
              <Link
                href={`/mcq-generator?docId=${selectedChunkDoc.id}&competency=${selectedChunkDoc.targetCompetencies[0] || 'comp-capi'}`}
                prefetch={true}
                className="px-4 py-2 bg-[#555934] hover:bg-[#3e4225] text-white text-xs font-bold rounded-xl transition"
              >
                {isHindi ? 'MCQ निर्माण पर आगे बढ़ें →' : 'Proceed to MCQ Generation →'}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* In-Website Document Deletion Confirmation Modal */}
      {deleteConfirmDoc && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          onClick={() => !isDeleting && setDeleteConfirmDoc(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#BF9B7A]/30 space-y-5 animate-in zoom-in-95 duration-150 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top alert badge & close button */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h3 id="delete-dialog-title" className="text-base font-bold text-[#2d1f17]">
                    {isHindi ? 'दस्तावेज़ हटाने की पुष्टि' : 'Remove Document?'}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isHindi ? 'MoSPI डिजिटल रिपॉजिटरी क्रिया' : 'MoSPI Digital Repository Action'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => !isDeleting && setDeleteConfirmDoc(null)}
                disabled={isDeleting}
                aria-label="Close dialog"
                className="p-1.5 text-muted-foreground hover:text-[#2d1f17] hover:bg-[#FAF6F0] rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Info Card */}
            <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#BF9B7A]/30 space-y-1.5">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#8C5B3E] shrink-0" />
                <span className="text-xs font-bold text-[#2d1f17] line-clamp-1">
                  {deleteConfirmDoc.title}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-[#705849] pl-6">
                <span className="font-mono">{deleteConfirmDoc.filename}</span>
                <span>•</span>
                <span>{deleteConfirmDoc.chunkCount} {isHindi ? 'खंड' : 'chunks'}</span>
              </div>
            </div>

            {/* Description prompt */}
            <p className="text-xs text-[#705849] leading-relaxed">
              {isHindi ? (
                <>
                  क्या आप वाकई रिपॉजिटरी से इस दस्तावेज़ को हटाना चाहते हैं? यह क्रिया संबंधित सभी <strong>{deleteConfirmDoc.chunkCount} खंडों</strong> को AI प्रश्न निर्माण बैंक से स्थायी रूप से हटा देगी।
                </>
              ) : (
                <>
                  Are you sure you want to remove this document from the repository? All <strong>{deleteConfirmDoc.chunkCount} indexed chunks</strong> will be unlinked from the AI question generator studio.
                </>
              )}
            </p>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmDoc(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#BF9B7A]/40 text-[#705849] hover:bg-[#FAF6F0] hover:text-[#2d1f17] text-xs font-bold transition cursor-pointer disabled:opacity-50"
              >
                {isHindi ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{isHindi ? 'हटाया जा रहा है...' : 'Removing...'}</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'हटाने की पुष्टि करें' : 'Confirm Delete'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
