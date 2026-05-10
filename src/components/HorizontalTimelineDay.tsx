/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { StudyTask } from '../types';
import { HorizontalTimelineBlock } from './HorizontalTimelineBlock';
import { cn, timeToMinutes } from '../lib/utils';
import { format } from 'date-fns';

interface HorizontalTimelineDayProps {
  tasks: StudyTask[];
  onUpdate: (id: string, updates: Partial<StudyTask>) => void;
  onDelete: (id: string) => void;
  onEdit?: (task: StudyTask) => void;
  isToday?: boolean;
  compact?: boolean;
}

export function HorizontalTimelineDay({ 
  tasks, 
  onUpdate, 
  onDelete, 
  onEdit,
  isToday = false,
  compact = false
}: HorizontalTimelineDayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setContainerWidth(entries[0].contentRect.width);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
      setContainerWidth(containerRef.current.getBoundingClientRect().width);
    }

    return () => observer.disconnect();
  }, []);

  // Use 24 hours
  const hours = Array.from({ length: 24 }, (_, i) => i);
  // We can group hours by 4 for labels to avoid clutter on mobile, or 3 for desktop
  const labelInterval = typeof window !== 'undefined' && window.innerWidth < 640 ? 4 : 3;
  const labeledHours = hours.filter(h => h % labelInterval === 0);

  const sortedTasks = [...tasks].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  return (
    <div className="flex flex-col w-full h-full justify-center min-w-0">
      <div 
        ref={containerRef}
        className={cn(
          "relative flex-1 w-full rounded-xl md:rounded-2xl flex items-center overflow-visible",
          compact ? "min-h-[50px] md:min-h-[80px]" : "min-h-[120px] md:min-h-[160px]",
          isToday && !compact ? "bg-blue-50/30 border border-blue-100" : (compact ? "bg-white/50" : "bg-slate-50 border border-slate-100")
        )}
      >
        {/* Background Grid Lines rendering every 3/4 hours */}
        <div className="absolute inset-0 flex">
          {hours.map((h) => (
             <div 
              key={h} 
              className={cn("h-full border-l flex-1 pointer-events-none", h % 3 === 0 ? "border-slate-300/30" : "border-slate-200/10")} 
            />
          ))}
        </div>

        {/* Tasks Layer */}
        {containerWidth > 0 && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            {sortedTasks.map((task, index) => (
              <div className="pointer-events-auto block" key={task.id}>
                <HorizontalTimelineBlock 
                  task={task} 
                  onUpdate={onUpdate} 
                  onDelete={onDelete} 
                  onEdit={onEdit}
                  containerWidth={containerWidth}
                  colorIndex={index}
                />
              </div>
            ))}
          </div>
        )}

        {/* Current Time Indicator for Today */}
        {isToday && containerWidth > 0 && (
          <div 
            className="absolute top-0 bottom-0 z-20 pointer-events-none"
            style={{ 
              left: `${((new Date().getHours() * 60 + new Date().getMinutes()) / 1440) * containerWidth}px` 
            }}
          >
            <div className="w-px h-full bg-rose-500 relative">
              <div className="absolute -top-1 -translate-x-1/2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
            </div>
          </div>
        )}
      </div>

      {/* Time axis text labels */}
      {!compact && (
        <>
          <div className="flex justify-between mt-2 px-1 text-[10px] font-mono text-slate-400">
             {labeledHours.map(h => (
               <span key={h} className="relative" style={{ left: `${(h / 24) * 100}%`, transform: 'translateX(-50%)', position: 'absolute' }}>
                 {h.toString().padStart(2, '0')}:00
               </span>
             ))}
             {/* Add 24:00 label at the end */}
             <span className="relative" style={{ left: '100%', transform: 'translateX(-50%)', position: 'absolute' }}>24:00</span>
          </div>
          <div className="h-4" /> {/* Padding for absolute positioned labels */}
        </>
      )}
    </div>
  );
}
