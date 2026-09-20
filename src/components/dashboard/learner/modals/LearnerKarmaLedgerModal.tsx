'use client';

import React from 'react';
import { X, Award, Flame, CheckCircle2, Sparkles } from 'lucide-react';

interface LearnerKarmaLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  points?: number;
  isHindi?: boolean;
}

export function LearnerKarmaLedgerModal({
  isOpen,
  onClose,
  points = 620,
  isHindi = false,
}: LearnerKarmaLedgerModalProps) {
  if (!isOpen) return null;

  const activities = [
    {
      id: 'act-1',
      title: isHindi
        ? 'अनुसूची 0.0 सीमांकन अभ्यास उत्तीर्ण (+50 KP)'
        : 'Completed Schedule 0.0 Demarcation Drill (+50 KP)',
      category: 'Field Demarcation',
      date: 'Today, 10:45 AM',
      points: '+50',
    },
    {
      id: 'act-2',
      title: isHindi
        ? 'पीएलएफएस अनुसूची 10.4 संवीक्षा मॉड्यूल (+75 KP)'
        : 'Passed PLFS Schedule 10.4 Scrutiny Module (+75 KP)',
      category: 'Employment Survey',
      date: 'Yesterday',
      points: '+75',
    },
    {
      id: 'act-3',
      title: isHindi
        ? 'कैपी टैबलेट डेटा प्रविष्टि मूल्यांकन उत्तीर्ण (+100 KP)'
        : 'CAPI Offline Data Entry Assessment Passed (+100 KP)',
      category: 'CAPI Field Protocol',
      date: '17 Sep 2026',
      points: '+100',
    },
    {
      id: 'act-4',
      title: isHindi
        ? 'दैनिक निरंतरता स्ट्रीक बोनस (+25 KP)'
        : '4-Day Consecutive Learning Streak Bonus (+25 KP)',
      category: 'Karmayogi Habit',
      date: '16 Sep 2026',
      points: '+25',
    },
  ];

  const badges = [
    {
      name: isHindi ? 'प्रथम संवीक्षक' : 'First Scrutineer',
      desc: isHindi ? 'पहला फील्ड मॉड्यूल उत्तीर्ण' : 'First Survey Module Completed',
      icon: Award,
      color: 'text-[#1C4CA1] bg-[#1C4CA1]/10 border-[#1C4CA1]/20',
    },
    {
      name: isHindi ? 'कैपी विशेषज्ञ' : 'CAPI Pioneer',
      desc: isHindi ? '100% सटीक ऑफ़लाइन डेटा' : 'Zero Sync Errors in Remote Survey',
      icon: Sparkles,
      color: 'text-[#FFA72F] bg-[#FFA72F]/15 border-[#FFA72F]/30',
    },
    {
      name: isHindi ? 'शून्य-त्रुटि विवरणी' : 'Zero Query Return',
      desc: isHindi ? 'दोषरहित अनुसूची संवीक्षा' : 'Flawless Schedule 10.4 Return',
      icon: CheckCircle2,
      color: 'text-emerald-700 bg-emerald-500/15 border-emerald-500/30',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="karma-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-[#D8DFEE] shadow-2xl overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-[#1C4CA1] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 p-1 border border-white/20">
              <Award className="h-6 w-6 text-[#FFA72F]" />
            </div>
            <div>
              <h2 id="karma-modal-title" className="text-sm font-black tracking-wide uppercase text-[#FFA72F]">
                {isHindi ? 'कर्मयोगी भारत • क्षमता प्रोत्साहन लेजर' : 'Karmayogi Bharat • Karma Ledger'}
              </h2>
              <p className="text-[11px] text-white/90">
                {isHindi ? 'अधिकारी अंक, स्तर एवं उपलब्धि बैज' : 'Officer Competency Points, Tier & Badges'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close karma modal"
            className="rounded-xl p-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 bg-[#EDF0F7]/40">
          {/* Top Score Bento */}
          <div className="rounded-2xl bg-white border border-[#D8DFEE] p-5 shadow-xs flex items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#475569]">
                {isHindi ? 'कुल संचित कर्म अंक' : 'Total Accumulated Karma Points'}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-black font-mono text-[#1C4CA1]">+{points}</span>
                <span className="text-xs font-bold text-[#FFA72F]">KP</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFA72F]/20 text-[#1F273A] border border-[#FFA72F]/40">
                  {isHindi ? 'स्तर 3 • वरिष्ठ संवीक्षा सहयोगी' : 'Level 3 • Senior Scrutiny Associate'}
                </span>
              </div>
            </div>

            {/* Learning Streak */}
            <div className="rounded-2xl bg-[#EDF0F7] border border-[#D8DFEE] p-3.5 text-center shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-500/20 text-amber-600 mx-auto mb-1">
                <Flame className="h-5 w-5 fill-amber-500 text-amber-600" />
              </div>
              <span className="text-sm font-black text-[#1F273A]">4 Days</span>
              <p className="text-[9px] font-bold text-[#475569] uppercase tracking-wider">
                {isHindi ? 'सक्रिय स्ट्रीक' : 'Active Streak'}
              </p>
            </div>
          </div>

          {/* Badges Showcase */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#475569] mb-2.5">
              {isHindi ? 'अर्जित कैडर बैज' : 'Earned Cadre Badges'}
            </h3>
            <div className="grid grid-cols-3 gap-2.5">
              {badges.map((b, i) => {
                const Icon = b.icon;
                return (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-white border border-[#D8DFEE] flex flex-col items-center text-center space-y-1.5 shadow-2xs"
                  >
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center border ${b.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[11px] font-bold text-[#1F273A] leading-tight line-clamp-1">
                      {b.name}
                    </span>
                    <span className="text-[9px] text-[#475569] line-clamp-1">{b.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Ledger History */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#475569]">
                {isHindi ? 'हालिया अंक इतिहास' : 'Recent Points Ledger'}
              </h3>
              <span className="text-[10px] text-[#1C4CA1] font-bold">iGOT Synced</span>
            </div>
            <div className="space-y-2">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-xl bg-white border border-[#D8DFEE] flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="font-bold text-[#1F273A] truncate">{act.title}</p>
                    <p className="text-[10px] text-[#475569] mt-0.5">
                      {act.category} • {act.date}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-[#1C4CA1] shrink-0 bg-[#FFA72F]/20 px-2 py-0.5 rounded-md text-[11px] border border-[#FFA72F]/30">
                    {act.points}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#D8DFEE] flex items-center justify-between">
          <span className="text-[11px] text-[#475569]">
            {isHindi
              ? 'अंक राष्ट्रीय सिविल सेवा पोर्टल पर सिंक किए जाते हैं'
              : 'Points sync to National Civil Service Profile (iGOT)'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1C4CA1] text-white text-xs font-bold hover:bg-[#1164BE] transition-colors cursor-pointer shadow-xs"
          >
            {isHindi ? 'ठीक है' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
