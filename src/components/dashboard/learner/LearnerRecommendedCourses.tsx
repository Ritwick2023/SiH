'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Bookmark } from 'lucide-react';

interface LearnerRecommendedCoursesProps {
  isHindi?: boolean;
}

export function LearnerRecommendedCourses({ isHindi = false }: LearnerRecommendedCoursesProps) {
  const sectionTitle = isHindi ? 'आपके लिए अनुशंसित' : 'Recommended for You';
  const viewAllText = isHindi ? 'सभी देखें →' : 'View All →';
  const startLearningText = isHindi ? 'सीखना शुरू करें →' : 'Start Learning →';

  const courses = [
    {
      id: 'official-stats',
      image: '/images/course-official-statistics.jpg',
      badge: isHindi ? 'अनुशंसित' : 'Recommended',
      badgeBg: 'bg-[#1C4CA1]',
      title: isHindi ? 'आधिकारिक सांख्यिकी का परिचय' : 'Introduction to Official Statistics',
      level: isHindi ? 'शुरुआती' : 'Beginner',
      duration: isHindi ? '4 घंटे' : '4 hrs',
      rating: '4.8',
      reviews: '320',
      href: '/courses',
    },
    {
      id: 'data-vis',
      image: '/images/course-data-visualization.jpg',
      badge: isHindi ? 'आपकी भूमिका के अनुसार' : 'Based on Your Role',
      badgeBg: 'bg-[#16A34A]',
      title: isHindi ? 'सरकार के लिए डेटा विज़ुअलाइज़ेशन' : 'Data Visualization for Government',
      level: isHindi ? 'मध्यवर्ती' : 'Intermediate',
      duration: isHindi ? '6 घंटे' : '6 hrs',
      rating: '4.7',
      reviews: '210',
      href: '/courses',
    },
    {
      id: 'evidence-policy',
      image: '/images/course-evidence-policy.jpg',
      badge: isHindi ? 'लोकप्रिय' : 'Popular',
      badgeBg: 'bg-[#9333EA]',
      title: isHindi ? 'साक्ष्य-आधारित नीति निर्माण' : 'Evidence-Based Policy Making',
      level: isHindi ? 'मध्यवर्ती' : 'Intermediate',
      duration: isHindi ? '5 घंटे' : '5 hrs',
      rating: '4.9',
      reviews: '180',
      href: '/courses',
    },
  ];

  return (
    <section className="space-y-4 select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-extrabold text-lg text-[#1F273A] tracking-tight">
          {sectionTitle}
        </h2>
        <Link
          href="/courses"
          prefetch={true}
          className="text-xs font-bold text-[#1C4CA1] hover:text-[#1164BE] hover:underline transition-colors"
        >
          {viewAllText}
        </Link>
      </div>

      {/* 3-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course) => (
          <div
            key={course.id}
            className="group rounded-2xl bg-white border border-[#D8DFEE] overflow-hidden shadow-xs hover:border-[#1C4CA1]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            {/* Image Header with Badges */}
            <div className="relative h-44 w-full overflow-hidden bg-slate-100">
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Category Badge (Top-Left) */}
              <div className="absolute top-3 left-3 z-10">
                <span
                  className={`${course.badgeBg} text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs`}
                >
                  {course.badge}
                </span>
              </div>
              {/* Bookmark Button (Top-Right) */}
              <button
                type="button"
                aria-label="Bookmark course"
                className="absolute top-3 right-3 z-10 h-7 w-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-600 hover:text-[#1C4CA1] shadow-2xs transition-colors cursor-pointer"
              >
                <Bookmark className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Card Content Body */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-[#1F273A] group-hover:text-[#1C4CA1] transition-colors line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {course.level} | {course.duration}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mt-2">
                  <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                  <span className="text-xs font-bold text-[#1F273A]">
                    {course.rating}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ({course.reviews})
                  </span>
                </div>
              </div>

              {/* Start Learning Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <Link
                  href={course.href}
                  prefetch={true}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl border border-slate-200 hover:border-[#1C4CA1] hover:bg-[#1C4CA1] hover:text-white text-xs font-bold text-[#1C4CA1] transition-all cursor-pointer active:scale-98 shadow-2xs"
                >
                  <span>{startLearningText}</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LearnerRecommendedCourses;
