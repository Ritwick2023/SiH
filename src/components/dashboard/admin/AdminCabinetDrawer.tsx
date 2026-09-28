'use client';

import React from 'react';
import { Download, FileText, Send, ShieldCheck } from 'lucide-react';

interface AdminCabinetDrawerProps {
  onOpenBriefingModal?: () => void;
  onOpenRosterModal?: () => void;
  onOpenSweepModal?: () => void;
  isHindi?: boolean;
}

export function AdminCabinetDrawer({
  onOpenBriefingModal,
  onOpenRosterModal,
  onOpenSweepModal,
  isHindi = false,
}: AdminCabinetDrawerProps) {
  const handleExportPDF = () => {
    if (onOpenBriefingModal) {
      onOpenBriefingModal();
    } else {
      window.print();
    }
  };

  const handleExportCSV = () => {
    if (onOpenRosterModal) {
      onOpenRosterModal();
    } else {
      const csvData =
        'EmployeeID,Name,Designation,Cadre,Zone,Competency,CurrentLevel,TargetLevel,Status\n' +
        'EMP-7842,Sunita Devi,Junior Statistical Officer,FOD,Patna,Census Boundary Demarcation,L3,L4,Active\n' +
        'EMP-3901,Amit Sharma,Senior Statistical Officer,SDRD,Delhi,NIC-2008 Classification,L4,L5,Proficient\n' +
        'EMP-4102,K. V. Raman,Data Processing Assistant,DPD,Kolkata,CAPI Field Verification,L2,L4,Needs Attention\n';
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'National_Cadre_Roster_2026.csv';
      a.click();
    }
  };

  const handleCommissionRound = () => {
    if (onOpenSweepModal) {
      onOpenSweepModal();
    } else {
      alert(isHindi ? 'Q3 2026 के लिए राष्ट्रीय सांख्यिकीय क्षमता निर्माण चक्र अधिकृत किया गया।' : 'National Statistical Capacity Building Round commissioned for Q3 2026.');
    }
  };

  return (
    <div className="rounded-3xl bg-white border border-[#D8DFEE] p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#D8DFEE]">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1C4CA1]" />
            <h2 className="text-base font-bold text-[#1F273A]">
              {isHindi ? 'मंत्रालयीन शासन एवं प्रतिवेदन' : 'Ministerial Governance & Reports'}
            </h2>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1C4CA1]/10 text-[#1C4CA1]">
            <ShieldCheck className="h-3 w-3" />
            {isHindi ? 'मंत्रिमंडल स्तर' : 'Cabinet Level'}
          </span>
        </div>

        <p className="text-xs text-[#475569] mt-2 mb-4">
          {isHindi
            ? 'सचिव (सांख्यिकी) और राष्ट्रीय सांख्यिकी आयोग (एनएससी) के लिए सांविधिक रिपोर्टिंग निर्यात एवं कार्यकारी आदेश।'
            : 'Statutory reporting exports and executive orders for Secretary (Statistics) and National Statistical Commission (NSC).'}
        </p>

        <div className="space-y-3">
          {/* Export PDF */}
          <div className="p-4 rounded-2xl bg-[#EDF0F7]/50 border border-[#D8DFEE] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#1C4CA1]/10 text-[#1C4CA1] flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#1F273A]">
                  {isHindi ? 'सचिव ब्रीफिंग ज्ञापन (पीडीएफ)' : 'Secretary Briefing Memo (PDF)'}
                </h3>
                <p className="text-[11px] text-[#475569]">
                  {isHindi
                    ? 'इकोनोमेट्रिक प्रतिगमन और क्षेत्रीय अंतर चार्ट शामिल'
                    : 'Includes econometric regression & regional gap charts'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleExportPDF}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-[#D8DFEE] text-xs font-bold text-[#1C4CA1] hover:bg-[#EDF0F7] transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isHindi ? 'निर्यात' : 'Export'}</span>
            </button>
          </div>

          {/* Download CSV */}
          <div className="p-4 rounded-2xl bg-[#EDF0F7]/50 border border-[#D8DFEE] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#1164BE]/10 text-[#1164BE] flex items-center justify-center shrink-0">
                <Download className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#1F273A]">
                  {isHindi ? 'राष्ट्रीय संवर्ग नामावली (सीएसवी)' : 'National Cadre Roster (CSV)'}
                </h3>
                <p className="text-[11px] text-[#475569]">
                  {isHindi
                    ? 'सभी 4,850 अधिकारियों की योग्यता स्तर और अंक'
                    : 'Complete 4,850 official competency levels and scores'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-[#D8DFEE] text-xs font-bold text-[#1C4CA1] hover:bg-[#EDF0F7] transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isHindi ? 'डाउनलोड' : 'Download'}</span>
            </button>
          </div>

          {/* Commission Round */}
          <div className="p-4 rounded-2xl bg-[#1C4CA1]/10 border border-[#1C4CA1]/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#1C4CA1] text-white flex items-center justify-center shrink-0">
                <Send className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#1F273A]">
                  {isHindi ? 'तिमाही 3 मूल्यांकन चक्र अधिकृत करें' : 'Commission Q3 Assessment Sweep'}
                </h3>
                <p className="text-[11px] text-[#475569]">
                  {isHindi
                    ? 'सभी 7 क्षेत्रीय प्रभागों में अनिवार्य सत्यापन शुरू करें'
                    : 'Authorize mandatory verification across all 7 regional zones'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCommissionRound}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#1C4CA1] text-white text-xs font-bold hover:bg-[#1164BE] transition-colors shadow-xs cursor-pointer"
            >
              <span>{isHindi ? 'आदेश दें' : 'Order'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[#D8DFEE] flex items-center justify-between text-[11px] text-[#475569]">
        <span>{isHindi ? 'सांख्यिकी मंत्रालय शीर्ष कार्यकारी नोड' : 'MoSPI Apex Executive Node'}</span>
        <span className="font-mono font-bold text-[#1C4CA1]">v2026.4-SEC</span>
      </div>
    </div>
  );
}
