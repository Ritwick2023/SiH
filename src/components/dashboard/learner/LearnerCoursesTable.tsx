'use client';

import React from 'react';
import Link from 'next/link';
import { OFFICIAL_LEARNING_CATALOG, type OfficialLearningItem } from '@/data/officialLearningCatalog';
import { BookOpen, Award, ArrowUpRight, CheckCircle2, Play } from 'lucide-react';

interface LearnerCoursesTableProps {
  isHindi?: boolean;
}

export function LearnerCoursesTable({ isHindi = false }: LearnerCoursesTableProps) {
  // Real government course modules from NSSTA & MoSPI
  const displayItems = [
    OFFICIAL_LEARNING_CATALOG.find((i) => i.id === 'manual-capi-handbook')!,
    OFFICIAL_LEARNING_CATALOG.find((i) => i.id === 'nssta-data-collection-workshop')!,
    OFFICIAL_LEARNING_CATALOG.find((i) => i.id === 'nssta-data-analytics-viz')!,
    OFFICIAL_LEARNING_CATALOG.find((i) => i.id === 'manual-plfs-vol1')!,
    OFFICIAL_LEARNING_CATALOG.find((i) => i.id === 'nssta-r-data-extraction-ai')!,
  ].filter(Boolean);

  const progressMap: Record<string, { completedLessons: number; totalLessons: number; status: 'in-progress' | 'recommended' | 'completed' }> = {
    'nssta-data-collection-workshop': { completedLessons: 1, totalLessons: 2, status: 'in-progress' },
    'manual-capi-handbook': { completedLessons: 4, totalLessons: 5, status: 'in-progress' },
    'nssta-data-analytics-viz': { completedLessons: 0, totalLessons: 3, status: 'recommended' },
    'manual-plfs-vol1': { completedLessons: 5, totalLessons: 5, status: 'completed' },
    'nssta-r-data-extraction-ai': { completedLessons: 0, totalLessons: 5, status: 'recommended' },
  };

  return (
    <div className="rounded-3xl bg-white border border-[#D8DFEE] p-6 shadow-xs overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#D8DFEE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1C4CA1]" />
            <h2 className="text-lg font-bold text-[#1F273A]">
              {isHindi ? 'नामांकित एवं अनुशंसित मॉड्यूल' : 'Enrolled & Recommended Modules'}
            </h2>
          </div>
          <p className="text-xs text-[#475569] mt-0.5">
            {isHindi
              ? 'iGOT कर्मयोगी और एनएसएसटीए आधिकारिक पाठ्यक्रम'
              : 'Direct integration with iGOT Karmayogi & NSSTA Faculty Modules'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#475569]">
          <span className="px-3 py-1 rounded-full bg-[#1C4CA1]/10 text-[#1C4CA1]">
            {isHindi ? 'सभी (5)' : 'All (5)'}
          </span>
          <span className="px-3 py-1 rounded-full bg-[#EDF0F7] text-[#475569] border border-[#D8DFEE]">
            {isHindi ? 'सक्रिय (2)' : 'In Progress (2)'}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#D8DFEE] text-[11px] font-bold text-[#475569] uppercase tracking-wider">
              <th className="pb-3 pl-2">{isHindi ? 'पाठ्यक्रम' : 'Course Module'}</th>
              <th className="pb-3 hidden md:table-cell">{isHindi ? 'चरण' : 'Stage'}</th>
              <th className="pb-3">{isHindi ? 'प्रगति' : 'Progress'}</th>
              <th className="pb-3 hidden sm:table-cell">{isHindi ? 'कर्मा अंक' : 'Karma Points'}</th>
              <th className="pb-3 pr-2 text-right">{isHindi ? 'कार्रवाई' : 'Action'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D8DFEE] text-xs">
            {displayItems.map((course: OfficialLearningItem) => {
              const progress = progressMap[course.id] || { completedLessons: 0, totalLessons: 5, status: 'recommended' };
              const percent = Math.round((progress.completedLessons / progress.totalLessons) * 100);
              const courseTitle = isHindi && course.title_hi ? course.title_hi : course.title;

              return (
                <tr key={course.id} className="hover:bg-[#EDF0F7]/50 transition-colors">
                  {/* Course Title & Provider */}
                  <td className="py-4 pl-2 pr-4">
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-xl bg-[#1C4CA1]/10 text-[#1C4CA1] flex items-center justify-center shrink-0 mt-0.5">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/pathways/${course.id}`}
                          className="font-bold text-[#1F273A] hover:text-[#1C4CA1] transition-colors line-clamp-1 block"
                        >
                          {courseTitle}
                        </Link>
                        <p className="text-[11px] text-[#475569] truncate mt-0.5">{course.provider}</p>
                      </div>
                    </div>
                  </td>

                  {/* Stage */}
                  <td className="py-4 pr-4 hidden md:table-cell">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      course.stage === 'FOUNDATIONAL'
                        ? 'bg-blue-500/15 text-blue-700'
                        : course.stage === 'APPLIED'
                          ? 'bg-[#1C4CA1]/15 text-[#1C4CA1]'
                          : 'bg-purple-500/15 text-purple-700'
                    }`}>
                      {course.stage}
                    </span>
                  </td>

                  {/* Progress bar */}
                  <td className="py-4 pr-4 min-w-32.5">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[#475569]">
                          {progress.completedLessons}/{progress.totalLessons}
                        </span>
                        <span className="font-bold text-[#1F273A]">{percent}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[#EDF0F7] overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            percent === 100 ? 'bg-emerald-600' : 'bg-[#1C4CA1]'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Karma Points */}
                  <td className="py-4 pr-4 hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1F273A] bg-[#FFA72F]/20 px-2 py-0.5 rounded-full border border-[#FFA72F]/40">
                      <Award className="h-3 w-3 text-[#1C4CA1]" />
                      +50 KP
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-4 pr-2 text-right">
                    {progress.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs px-2 py-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {isHindi ? 'पूर्ण' : 'Passed'}
                      </span>
                    ) : progress.status === 'in-progress' ? (
                      <Link
                        href={`/pathways/${course.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1C4CA1] text-white font-bold hover:bg-[#1164BE] transition-colors shadow-2xs"
                      >
                        <Play className="h-3 w-3 fill-current text-[#FFA72F]" />
                        <span>{isHindi ? 'जारी रखें' : 'Resume'}</span>
                      </Link>
                    ) : (
                      <Link
                        href={`/pathways/${course.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white text-[#1C4CA1] border border-[#D8DFEE] font-bold hover:bg-[#EDF0F7] transition-colors"
                      >
                        <span>{isHindi ? 'प्रारंभ' : 'Start'}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Link to Discovery Hub */}
      <div className="mt-4 pt-3 border-t border-[#D8DFEE] flex items-center justify-between">
        <span className="text-[11px] text-[#475569]">
          {isHindi ? '10 आधिकारिक मॉड्यूल उपलब्ध' : '10 verified government modules available'}
        </span>
        <Link
          href="/pathways"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#1C4CA1] hover:text-[#1164BE] hover:underline"
        >
          <span>{isHindi ? 'सभी पाठ्यक्रम देखें →' : 'View All 10 Courses & Modules →'}</span>
        </Link>
      </div>
    </div>
  );
}
