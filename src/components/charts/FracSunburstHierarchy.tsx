'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { OFFICIAL_FRAC_COMPETENCIES } from '@/data/fracCadres';
import { ShieldCheck, ZoomIn } from 'lucide-react';

interface SunburstNode {
  name: string;
  name_hi?: string;
  value?: number;
  level?: number;
  category?: string;
  children?: SunburstNode[];
  description?: string;
}

type SunburstCoords = {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  depth?: number;
  children?: unknown;
};

/** D3 partition node augmented with `current` and `target` animation coords */
type PartitionNode = d3.HierarchyRectangularNode<SunburstNode> & {
  current: SunburstCoords;
  target: SunburstCoords;
};

// Generate authentic hierarchical FRAC data structure
function buildFracHierarchyData(): SunburstNode {
  const compList = Object.values(OFFICIAL_FRAC_COMPETENCIES);

  return {
    name: 'Mission Karmayogi FRAC',
    children: [
      {
        name: 'Field Operations Division (FOD)',
        category: 'Cadre',
        children: compList
          .filter((c) => ['Domain', 'Practical'].includes(c.category))
          .map((c) => ({
            name: c.name,
            name_hi: c.name_hi,
            category: c.category,
            description: c.description,
            children: [
              { name: 'L1: Awareness', value: 120, level: 1 },
              { name: 'L2: Guided Application', value: 340, level: 2 },
              { name: 'L3: Independent Field App', value: 480, level: 3 },
              { name: 'L4: Supervisory', value: 150, level: 4 },
              { name: 'L5: Strategic Expert', value: 45, level: 5 },
            ],
          })),
      },
      {
        name: 'Subordinate Statistical Service (SSS)',
        category: 'Cadre',
        children: compList
          .filter((c) => ['Domain', 'Cognitive'].includes(c.category))
          .map((c) => ({
            name: c.name,
            name_hi: c.name_hi,
            category: c.category,
            description: c.description,
            children: [
              { name: 'L1: Awareness', value: 80, level: 1 },
              { name: 'L2: Guided Application', value: 210, level: 2 },
              { name: 'L3: Independent Scrutiny', value: 520, level: 3 },
              { name: 'L4: Quality Lead', value: 240, level: 4 },
              { name: 'L5: Methodologist', value: 65, level: 5 },
            ],
          })),
      },
      {
        name: 'NSSTA Training Faculty',
        category: 'Cadre',
        children: compList.slice(0, 3).map((c) => ({
          name: c.name,
          name_hi: c.name_hi,
          category: 'Faculty',
          description: c.description,
          children: [
            { name: 'L3: Instructor', value: 45, level: 3 },
            { name: 'L4: Master Trainer', value: 85, level: 4 },
            { name: 'L5: Chief Calibrator', value: 30, level: 5 },
          ],
        })),
      },
    ],
  };
}

export function FracSunburstHierarchy() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<{
    name: string;
    category?: string;
    value?: number;
    description?: string;
  } | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 500;
    const height = 500;
    const radius = width / 6;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const data = buildFracHierarchyData();

    // Hierarchy & Partition layout
    const hierarchy = d3
      .hierarchy<SunburstNode>(data)
      .sum((d) => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const partition = d3.partition<SunburstNode>().size([2 * Math.PI, hierarchy.height + 1]);

    const root = partition(hierarchy) as unknown as PartitionNode;
    root.each((d) => {
      (d as PartitionNode).current = d as d3.HierarchyRectangularNode<SunburstNode>;
    });

    // Sovereign Color Scheme
    const colorScale = d3.scaleOrdinal<string>()
      .domain(['Field Operations Division (FOD)', 'Subordinate Statistical Service (SSS)', 'NSSTA Training Faculty'])
      .range(['#1C4CA1', '#FFA72F', '#1164BE']);

    // Arc generator — typed with SunburstCoords
    const arc = d3.arc<SunburstCoords>()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius * 1.5)
      .innerRadius((d) => d.y0 * radius)
      .outerRadius((d) => Math.max(d.y0 * radius, d.y1 * radius - 1));

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Create paths
    const path = g
      .append('g')
      .selectAll('path')
      .data((root.descendants().slice(1) as PartitionNode[]))
      .join('path')
      .attr('fill', (d) => {
        let cur: PartitionNode = d;
        while (cur.depth > 1) cur = cur.parent as PartitionNode;
        return colorScale(cur.data.name) || '#EDF0F7';
      })
      .attr('fill-opacity', (d) => (arcVisible(d.current) ? (d.children ? 0.85 : 0.6) : 0))
      .attr('pointer-events', (d) => (arcVisible(d.current) ? 'auto' : 'none'))
      .attr('d', (d) => arc(d.current) || '')
      .attr('cursor', 'pointer')
      .on('mouseenter', (_, d) => {
        setSelectedNode({
          name: d.data.name,
          category: d.data.category,
          value: d.value,
          description: d.data.description,
        });
      })
      .on('click', clicked);

    // Center interactive circle
    const centerCircle = g
      .append('circle')
      .datum(root)
      .attr('r', radius)
      .attr('fill', '#EDF0F7')
      .attr('stroke', '#1C4CA1')
      .attr('stroke-width', 1.5)
      .attr('pointer-events', 'all')
      .attr('cursor', 'pointer')
      .on('click', clicked);

    // Center icon text
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.2em')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .attr('fill', '#1C4CA1')
      .attr('pointer-events', 'none')
      .text('FRAC');

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.1em')
      .attr('font-size', '9px')
      .attr('fill', '#64748B')
      .attr('pointer-events', 'none')
      .text('Reset View');

    function clicked(event: unknown, p: unknown) {
      const pNode = p as PartitionNode;
      centerCircle.datum(pNode.parent || root);

      root.each((d) => {
        (d as PartitionNode).target = {
          ...d,
          x0: Math.max(0, Math.min(1, (d.x0 - pNode.x0) / (pNode.x1 - pNode.x0))) * 2 * Math.PI,
          x1: Math.max(0, Math.min(1, (d.x1 - pNode.x0) / (pNode.x1 - pNode.x0))) * 2 * Math.PI,
          y0: Math.max(0, d.y0 - pNode.depth),
          y1: Math.max(0, d.y1 - pNode.depth),
        };
      });

      const t = g.transition().duration(450);

      path
        .transition(t as never)
        .tween('data', (d) => {
          const node = d as PartitionNode;
          const i = d3.interpolate(node.current, node.target);
          return (time: number) => {
            node.current = i(time) as SunburstCoords;
          };
        })
        .filter(function (d) {
          const node = d as PartitionNode;
          return Boolean(this) && (arcVisible(node.target) || arcVisible(node.current));
        })
        .attr('fill-opacity', (d) => {
          const node = d as PartitionNode;
          return arcVisible(node.target) ? (node.children ? 0.85 : 0.6) : 0;
        })
        .attr('pointer-events', (d) => {
          const node = d as PartitionNode;
          return arcVisible(node.target) ? 'auto' : 'none';
        })
        .attrTween('d', (d) => {
          const node = d as PartitionNode;
          return () => (arc(node.current) || '') as string;
        });
    }

    function arcVisible(d: SunburstCoords) {
      return (d.y1 ?? 0) <= 3 && (d.y0 ?? 0) >= 1 && d.x1 > d.x0;
    }
  }, []);

  return (
    <div className="rounded-3xl bg-white border border-[#EDF0F7] p-6 shadow-sm flex flex-col items-center">
      <div className="w-full flex items-center justify-between border-b border-[#EDF0F7] pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#1C4CA1]" />
            <h3 className="text-base font-bold text-[#1F273A]">
              Mission Karmayogi FRAC Competency Sunburst
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Interactive multi-cadre hierarchy (FOD, SSS, NSSTA) • Click any segment to zoom in
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-[#EDF0F7] px-3 py-1 rounded-full">
          <ZoomIn className="h-3.5 w-3.5 text-[#1C4CA1]" />
          <span>Zoomable</span>
        </div>
      </div>

      <div className="relative flex justify-center items-center w-full max-w-125 aspect-square">
        <svg
          ref={svgRef}
          viewBox="0 0 500 500"
          className="w-full h-auto select-none overflow-visible"
        />
      </div>

      {/* Selected Node Details Card */}
      <div className="w-full mt-4 p-3.5 rounded-2xl bg-[#EDF0F7]/60 border border-[#EDF0F7] text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#1F273A]">
            {selectedNode ? selectedNode.name : 'Hover or click any segment to inspect details'}
          </span>
          {selectedNode?.value && (
            <span className="font-mono font-bold text-[#1C4CA1]">
              {selectedNode.value} Headcount
            </span>
          )}
        </div>
        {selectedNode?.description && (
          <p className="text-muted-foreground mt-1 text-[11px] leading-relaxed">
            {selectedNode.description}
          </p>
        )}
      </div>
    </div>
  );
}
