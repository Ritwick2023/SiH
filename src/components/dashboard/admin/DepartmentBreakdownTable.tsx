'use client';

import React, { useState } from 'react';
import {
  DepartmentMetric,
  MOCK_REGIONAL_OFFICES,
  flagDepartmentForTraining,
} from '@/services/adminDashboardService';
import { Search, Flag, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface DepartmentBreakdownTableProps {
  onInspectOffice?: (office: DepartmentMetric) => void;
}

export function DepartmentBreakdownTable({ onInspectOffice }: DepartmentBreakdownTableProps) {
  const [departments, setDepartments] = useState<DepartmentMetric[]>(MOCK_REGIONAL_OFFICES);
  const [search, setSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleFlag = (id: string, name: string) => {
    const updated = flagDepartmentForTraining(id);
    setDepartments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isFlagged: updated.isFlagged } : d))
    );

    const isNowFlagged = !departments.find((d) => d.id === id)?.isFlagged;
    setToastMessage(
      isNowFlagged
        ? `Ministerial Flag set for ${name}. Mandating priority NSSTA remedial cohort!`
        : `Priority flag removed for ${name}.`
    );
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filtered = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.zone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-3xl bg-white border border-[#D8DFEE] p-6 shadow-xs overflow-hidden">
      {/* Toast alert banner */}
      {toastMessage && (
        <div className="mb-4 p-3 rounded-2xl bg-[#1C4CA1] text-white text-xs font-bold flex items-center justify-between shadow-xs">
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-white/80 hover:text-white cursor-pointer px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#D8DFEE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1C4CA1]" />
            <h2 className="text-lg font-bold text-[#1F273A]">
              Regional Offices &amp; Division Readiness
            </h2>
          </div>
          <p className="text-xs text-[#475569] mt-0.5">
            FR-ADMIN-4 • Live cadre capacity monitoring and ministerial priority assignment
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filter by RO or zone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#EDF0F7]/50 border border-[#D8DFEE] text-xs text-[#1F273A] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#1C4CA1]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#D8DFEE] text-[11px] font-bold text-[#475569] uppercase tracking-wider">
              <th className="pb-3 pl-2">Regional Office / Division</th>
              <th className="pb-3">Officers</th>
              <th className="pb-3">Readiness</th>
              <th className="pb-3">Error Rate</th>
              <th className="pb-3 hidden sm:table-cell">Status</th>
              <th className="pb-3 pr-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D8DFEE] text-xs">
            {filtered.map((dept) => {
              const isCritical = dept.readinessPercent < 60 || dept.errorRate > 12;
              const isOptimal = dept.readinessPercent >= 80;

              return (
                <tr key={dept.id} className="hover:bg-[#EDF0F7]/40 transition-colors">
                  {/* Name & Zone */}
                  <td className="py-4 pl-2 pr-4">
                    <p className="font-bold text-[#1F273A]">{dept.name}</p>
                    <p className="text-[11px] text-[#475569]">{dept.zone}</p>
                  </td>

                  {/* Officers */}
                  <td className="py-4 pr-4 font-mono font-bold text-[#1F273A]">
                    {dept.headcount}
                  </td>

                  {/* Readiness */}
                  <td className="py-4 pr-4">
                    <div className="space-y-1 min-w-25">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="font-bold text-[#1F273A]">{dept.readinessPercent}%</span>
                        <span className="text-[#475569]">{dept.avgLevel}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[#EDF0F7] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            dept.readinessPercent >= 70 ? 'bg-emerald-600' : 'bg-[#FFA72F]'
                          }`}
                          style={{ width: `${dept.readinessPercent}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Error Rate */}
                  <td className="py-4 pr-4 font-mono font-bold text-[#1C4CA1]">
                    {dept.errorRate}%
                  </td>

                  {/* Status */}
                  <td className="py-4 pr-4 hidden sm:table-cell">
                    {isCritical ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-700 border border-red-500/30">
                        <AlertTriangle className="h-3 w-3" />
                        CRITICAL GAP
                      </span>
                    ) : isOptimal ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">
                        <CheckCircle2 className="h-3 w-3" />
                        OPTIMAL
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 border border-amber-500/30">
                        MONITORING
                      </span>
                    )}
                  </td>

                  {/* Action: Inspect & Flag Priority Training */}
                  <td className="py-4 pr-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onInspectOffice && onInspectOffice(dept)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#EDF0F7] text-[#1C4CA1] border border-[#D8DFEE] hover:bg-white transition-all cursor-pointer shadow-2xs"
                      >
                        <span>Inspect</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleFlag(dept.id, dept.name)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          dept.isFlagged
                            ? 'bg-red-500/15 text-red-700 border border-red-500/40 hover:bg-red-500/25'
                            : 'bg-[#EDF0F7] text-[#1C4CA1] border border-[#D8DFEE] hover:bg-[#1C4CA1] hover:text-white'
                        }`}
                      >
                        <Flag className="h-3 w-3" />
                        <span>{dept.isFlagged ? 'Flagged 🚩' : 'Flag Priority Training'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
