'use client';

import React from 'react';
import { Flame, Clock, Award, Play, Zap } from 'lucide-react';

interface LearnerDailyDrillWidgetProps {
  onStartDrill?: () => void;
  isHindi?: boolean;
}

export function LearnerDailyDrillWidget({
  onStartDrill,
  isHindi = false,
}: LearnerDailyDrillWidgetProps) {
  const cardTitle = isHindi ? 'दैनिक माइक्रो-अभ्यास' : 'Daily Field Simulation Drill';
  const drillHeadline = isHindi
    ? 'अनुसूची 0.0: परिवार सूचीकरण एवं सीमा निर्धारण'
    : 'Schedule 0.0: Household Demarcation & Listing';
  const drillDesc = isHindi
    ? 'सीईबी सीमा सत्यापन, भौतिक स्थल अनुरेखण और हेमलेट-समूह उप-विभाजन नियमों में दक्षता परखें।'
    : 'Test your mastery of CEB boundary verification, physical landmark tracing, and hamlet-group subdivision rules.';
  const startBtnText = isHindi ? 'आज का अभ्यास शुरू करें →' : 'Start Today’s Drill →';
  const streakText = isHindi ? '5-दिन स्ट्रीक' : '5-Day Streak';
  const pointsText = isHindi ? '+50 कर्म पॉइंट' : '+50 Karma Pts';
  const durationText = isHindi ? '8 मिनट' : '8 mins';
  const cadreText = isHindi ? 'एनएसएसओ एफओडी' : 'NSSO FOD • PLFS';

  return (
    <div className="rounded-2xl bg-gradient-to-br from-white via-[#FAF7F0] to-[#FFF9EE] border border-[#FED7AA]/80 p-5 shadow-xs flex flex-col justify-between select-none">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-amber-100/80 mb-3.5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EA580C]/10 text-[#EA580C]">
              <Zap className="h-4 w-4 fill-current" />
            </div>
            <h3 className="font-extrabold text-sm text-[#1F273A] tracking-tight">
              {cardTitle}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EA580C]/10 border border-[#EA580C]/25 text-[#C2410C] text-[11px] font-bold">
            <Flame className="h-3 w-3 fill-current text-[#EA580C]" />
            <span>{streakText}</span>
          </div>
        </div>

        {/* Drill Headline & Metadata */}
        <div>
          <h4 className="font-extrabold text-sm text-[#1F273A] tracking-tight leading-snug">
            {drillHeadline}
          </h4>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {drillDesc}
          </p>

          {/* Quick Badges Strip */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] font-semibold text-slate-600">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-[#FED7AA] text-[#9A3412]">
              <Clock className="h-3 w-3 text-[#EA580C]" />
              {durationText}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
              {cadreText}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] font-bold">
              <Award className="h-3 w-3 text-[#059669]" />
              {pointsText}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={onStartDrill}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold transition-all shadow-xs hover:shadow cursor-pointer active:scale-98"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          <span>{startBtnText}</span>
        </button>
      </div>
    </div>
  );
}

export default LearnerDailyDrillWidget;
