'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bookmark } from 'lucide-react';

interface LearnerContinueLearningCardProps {
  isHindi?: boolean;
}

export function LearnerContinueLearningCard({ isHindi = false }: LearnerContinueLearningCardProps) {
  const cardTitle = isHindi ? 'शिक्षण जारी रखें' : 'Continue Learning';
  const viewMyLearningText = isHindi ? 'मेरा शिक्षण देखें →' : 'View My Learning →';
  const inProgressLabel = isHindi ? 'प्रगति पर' : 'In Progress';
  const courseTitle = isHindi
    ? 'नीति विश्लेषण के लिए सांख्यिकीय विधियाँ'
    : 'Statistical Methods for Policy Analysis';
  const courseMeta = isHindi
    ? 'मुख्य सांख्यिकी | 24 पाठ | 6 घंटे'
    : 'Core Statistics | 24 lessons | 6 hrs';
  const continueBtnText = isHindi ? 'पाठ्यक्रम जारी रखें →' : 'Continue Course →';

  return (
    <div className="rounded-2xl bg-white border border-[#D8DFEE] p-5 shadow-xs flex flex-col justify-between select-none">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <h2 className="font-extrabold text-base text-[#1F273A] tracking-tight">
          {cardTitle}
        </h2>
        <Link
          href="/courses"
          prefetch={true}
          className="text-xs font-bold text-[#1C4CA1] hover:text-[#1164BE] hover:underline transition-colors flex items-center gap-1"
        >
          {viewMyLearningText}
        </Link>
      </div>

      {/* Card Content Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Left Thumbnail */}
        <div className="relative h-28 w-28 rounded-xl overflow-hidden shrink-0 border border-slate-200/80 shadow-2xs">
          <Image
            src="/images/course-statistical-methods.jpg"
            alt={courseTitle}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Right Details */}
        <div className="flex-1 min-w-0 w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#EBF3FC] text-[#1C4CA1] border border-[#BFDBFE] text-[11px] font-bold">
            <Bookmark className="h-3 w-3 fill-current" />
            <span>{inProgressLabel}</span>
          </div>

          {/* Title & Metadata */}
          <h3 className="font-extrabold text-[15px] text-[#1F273A] tracking-tight mt-1.5 leading-snug line-clamp-1">
            {courseTitle}
          </h3>
          <span className="sr-only">Next Recommended Course</span>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {courseMeta}
          </p>

          {/* Progress bar */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#1C4CA1] transition-all duration-500"
                style={{ width: '76%' }}
              />
            </div>
            <span className="text-xs font-bold font-mono text-slate-700 shrink-0">
              76%
            </span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-4 pt-2">
        <Link
          href="/courses"
          prefetch={true}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1C4CA1] hover:bg-[#1164BE] text-white text-xs font-bold transition-all shadow-xs hover:shadow cursor-pointer active:scale-98"
        >
          <span>{continueBtnText}</span>
        </Link>
      </div>
    </div>
  );
}

export default LearnerContinueLearningCard;
