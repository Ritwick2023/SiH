'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, BookOpen, CheckCircle2, Loader2, Upload, Eye } from 'lucide-react';

interface IngestedDocument {
  id: string;
  manualId: string;
  title: string;
  division: string;
  pages: number;
  chunksCount: number;
  questionsGenerated: number;
  status: 'INDEXED' | 'PROCESSING' | 'SYNCED' | 'READY';
  updatedAt: string;
}

const INGESTED_DOCUMENTS: IngestedDocument[] = [
  {
    id: 'doc-plfs-1',
    manualId: 'manual-plfs-vol1',
    title: 'PLFS 2026 Instructions Vol. 1',
    division: 'Field Operations Division (FOD)',
    pages: 184,
    chunksCount: 412,
    questionsGenerated: 128,
    status: 'READY',
    updatedAt: '19 Sep 2026',
  },
  {
    id: 'doc-sch-0',
    manualId: 'manual-schedule-0',
    title: 'Schedule 0.0 Household Listing & Demarcation Handbook',
    division: 'Survey Design & Research Division (SDRD)',
    pages: 96,
    chunksCount: 224,
    questionsGenerated: 74,
    status: 'READY',
    updatedAt: '18 Sep 2026',
  },
  {
    id: 'doc-capi-hb',
    manualId: 'manual-capi-handbook',
    title: 'ASHE & CAPI Tablet Operational Protocols',
    division: 'Data Processing Division (DPD)',
    pages: 64,
    chunksCount: 148,
    questionsGenerated: 52,
    status: 'SYNCED',
    updatedAt: '16 Sep 2026',
  },
  {
    id: 'doc-nic-2008',
    manualId: 'manual-nic-compendium',
    title: 'National Industrial Classification (NIC-2008) Compendium',
    division: 'Central Statistics Office (CSO)',
    pages: 240,
    chunksCount: 492,
    questionsGenerated: 88,
    status: 'INDEXED',
    updatedAt: '12 Sep 2026',
  },
];

interface IngestedDocumentsLedgerProps {
  onOpenManualReader?: (manualId: string) => void;
}

export function IngestedDocumentsLedger({ onOpenManualReader }: IngestedDocumentsLedgerProps) {
  return (
    <div className="rounded-3xl bg-white border border-[#D8DFEE] p-6 shadow-xs overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#D8DFEE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1164BE]" />
            <h2 className="text-lg font-bold text-[#1F273A]">
              Ingested MoSPI Manuals &amp; Chunks
            </h2>
          </div>
          <p className="text-xs text-[#475569] mt-0.5">
            FR-CONTENT-1..5 • Semantic vector chunks and AI question generation lineage
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/documents"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1164BE] text-white text-xs font-bold hover:bg-[#1C4CA1] transition-colors shadow-2xs"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload New Manual</span>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#D8DFEE] text-[11px] font-bold text-[#475569] uppercase tracking-wider">
              <th className="pb-3 pl-2">Manual / SOP Title</th>
              <th className="pb-3 hidden md:table-cell">MoSPI Division</th>
              <th className="pb-3">Chunks</th>
              <th className="pb-3">Questions</th>
              <th className="pb-3 hidden sm:table-cell">Status</th>
              <th className="pb-3 pr-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D8DFEE] text-xs">
            {INGESTED_DOCUMENTS.map((doc) => (
              <tr key={doc.id} className="hover:bg-[#EDF0F7]/40 transition-colors">
                {/* Title */}
                <td className="py-4 pl-2 pr-4">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-[#1164BE]/10 text-[#1164BE] flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#1F273A] line-clamp-1">{doc.title}</p>
                      <p className="text-[11px] text-[#475569] truncate mt-0.5">
                        {doc.pages} Pages • Updated {doc.updatedAt}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Division */}
                <td className="py-4 pr-4 hidden md:table-cell text-[#475569] font-medium">
                  {doc.division}
                </td>

                {/* Chunks */}
                <td className="py-4 pr-4 font-mono font-bold text-[#1F273A]">
                  {doc.chunksCount}
                </td>

                {/* Questions */}
                <td className="py-4 pr-4 font-mono font-bold text-[#1164BE]">
                  {doc.questionsGenerated}
                </td>

                {/* Status */}
                <td className="py-4 pr-4 hidden sm:table-cell">
                  {['INDEXED', 'SYNCED', 'READY'].includes(doc.status) ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">
                      <CheckCircle2 className="h-3 w-3" />
                      {doc.status}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-800 border border-amber-500/30 animate-pulse">
                      <Loader2 className="h-3 w-3 animate-spin text-amber-600" />
                      {doc.status}
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-4 pr-2 text-right">
                  {onOpenManualReader ? (
                    <button
                      type="button"
                      onClick={() => onOpenManualReader(doc.manualId)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#EDF0F7] border border-[#D8DFEE] text-xs font-bold text-[#1164BE] hover:bg-[#D8DFEE] transition-colors cursor-pointer"
                    >
                      <BookOpen className="h-3 w-3" />
                      <span>Inspect</span>
                    </button>
                  ) : (
                    <Link
                      href="/documents"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#EDF0F7] border border-[#D8DFEE] text-xs font-bold text-[#1164BE] hover:bg-[#D8DFEE] transition-colors"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Chunks</span>
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default IngestedDocumentsLedger;
