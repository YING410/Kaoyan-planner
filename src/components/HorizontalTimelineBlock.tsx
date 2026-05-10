/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { StudyTask, Priority } from '../types';
import { cn, timeToMinutes } from '../lib/utils';
import { Check, Clock, Trash2, Edit2 } from 'lucide-react';

interface HorizontalTimelineBlockProps {
  task: StudyTask;
  onUpdate: (id: string, updates: Partial<StudyTask>) => void;
  onDelete: (id: string) => void;
  onEdit?: (task: StudyTask) => void;
  containerWidth: number; // total width of the 24h container
  colorIndex?: number;
}

export function HorizontalTimelineBlock({ task, onUpdate, onDelete, onEdit, containerWidth, colorIndex = 0 }: HorizontalTimelineBlockProps) {
  // 1440 minutes in a day
  const pixelPerMinute = containerWidth / 1440;
  const left = (timeToMinutes(task.startTime) * pixelPerMinute);
  const width = task.duration * pixelPerMinute;

  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showAnim, setShowAnim] = useState(false);
  const startX = useRef(0);
  const startDuration = useRef(0);
  const startTimeVal = useRef(0);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    startX.current = e.clientX;
    startDuration.current = task.duration;
  };

  const handleDragStart = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    startX.current = e.clientX;
    startTimeVal.current = timeToMinutes(task.startTime);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const delta = (e.clientX - startX.current) / pixelPerMinute;
        const newDuration = Math.max(15, Math.round((startDuration.current + delta) / 15) * 15);
        onUpdate(task.id, { duration: newDuration });
      }
      if (isDragging) {
        const delta = (e.clientX - startX.current) / pixelPerMinute;
        const newStartTimeMinutes = Math.max(0, Math.min(23.75 * 60, Math.round((startTimeVal.current + delta) / 15) * 15));
        const hours = Math.floor(newStartTimeMinutes / 60);
        const mins = newStartTimeMinutes % 60;
        onUpdate(task.id, { startTime: `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}` });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setIsDragging(false);
    };

    if (isResizing || isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, isDragging, onUpdate, task.id, pixelPerMinute, task.duration, task.startTime]);

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!task.completed) {
      setShowAnim(true);
      setTimeout(() => setShowAnim(false), 600);
    }
    onUpdate(task.id, { completed: !task.completed });
  };

  const COLORS = [
    'bg-blue-100 border-blue-400 text-blue-900',
    'bg-purple-100 border-purple-400 text-purple-900',
    'bg-emerald-100 border-emerald-400 text-emerald-900',
    'bg-amber-100 border-amber-400 text-amber-900',
    'bg-rose-100 border-rose-400 text-rose-900',
    'bg-cyan-100 border-cyan-400 text-cyan-900',
  ];
  const colorClass = COLORS[colorIndex % COLORS.length];

  return (
    <div
      className={cn(
        "absolute top-2 bottom-2 rounded-md shadow-sm transition-all group select-none z-10 hover:z-40",
        task.completed && "opacity-70 grayscale border-slate-300 bg-slate-100 text-slate-500",
        !task.completed && colorClass,
        isDragging && "z-50 shadow-2xl cursor-grabbing scale-105",
        !isDragging && "cursor-grab"
      )}
      style={{
        left: `${left}px`,
        width: `${Math.max(width, 24)}px`,
      }}
      onMouseDown={handleDragStart}
    >
      <div className={cn(
        "absolute inset-0 rounded-md border-t-4 p-2 transition-all flex flex-col bg-inherit border-inherit text-inherit",
        "group-hover:min-w-[160px] group-hover:h-auto group-hover:-m-2 group-hover:p-4 group-hover:z-50 group-hover:shadow-xl"
      )}>
        <div className="flex items-start justify-between pointer-events-auto">
          <h4 className={cn("text-[11px] font-bold leading-tight group-hover:whitespace-normal", 
             task.completed ? "line-through opacity-50" : "",
             width < 60 ? "truncate" : "line-clamp-2"
          )}>
            {task.name}
          </h4>
        </div>
        
        <div className={cn(
          "mt-auto pt-1 items-center gap-1 text-[10px] opacity-80",
           width < 60 ? "hidden group-hover:flex" : "flex"
        )}>
          <Clock className="w-3 h-3 shrink-0" />
          <span className="whitespace-nowrap">{task.startTime} ({task.duration}m)</span>
        </div>

        {/* Hover Actions */}
        <div className="hidden group-hover:flex mt-3 pt-2 border-t border-black/10 items-center gap-2 pointer-events-auto justify-end">
           {onEdit && (
              <button 
                onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                className="p-1.5 bg-white rounded-full cursor-pointer text-blue-500 hover:bg-blue-50 transition-colors shadow-sm"
                title="编辑"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button 
              onClick={handleComplete}
              className={cn(
                "p-1.5 rounded-full cursor-pointer transition-all shadow-sm active:scale-90",
                task.completed ? "bg-emerald-500 text-white" : "bg-white text-emerald-500 hover:bg-emerald-50"
              )}
              title={task.completed ? "标为未完成" : "标为完成"}
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
              className="p-1.5 bg-white rounded-full cursor-pointer text-rose-400 hover:text-rose-500 hover:bg-rose-50 shadow-sm"
              title="删除"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
        </div>
      </div>

      {/* Resize Handle Right */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-3 cursor-ew-resize hover:bg-black/10 flex items-center justify-center group/resize pointer-events-auto z-50 rounded-r-md"
        onMouseDown={handleResizeStart}
      >
        <div className="h-4 w-1 bg-black/20 rounded-full group-hover/resize:bg-black/40" />
      </div>

      {/* Completion Animation Overlay */}
      {showAnim && (
         <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none animate-block-success rounded-md">
           <Check className="w-8 h-8 text-emerald-500 animate-checkmark-pop drop-shadow-lg" />
         </div>
      )}
    </div>
  );
}
