/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useKaoYanStore } from './store';
import { HorizontalTimelineDay } from './components/HorizontalTimelineDay';
import { TaskDialog } from './components/TaskDialog';
import { MonthlyStats } from './components/MonthlyStats';
import { SettingsDialog } from './components/SettingsDialog';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { LayoutDashboard, Calendar, BarChart3, Plus, Settings, CheckCircle2, Trophy } from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { StudyTask } from './types';

type ViewMode = 'day' | 'week' | 'stats';

export default function App() {
  const { tasks, scores, addTask, updateTask, deleteTask } = useKaoYanStore();
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<StudyTask | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleOpenTaskDialog = (task?: StudyTask) => {
    setEditingTask(task || null);
    setIsTaskDialogOpen(true);
  };

  const handleTaskDialogSubmit = (taskData: Omit<StudyTask, 'id' | 'completed'>, editingId?: string) => {
    if (editingId) {
      updateTask(editingId, taskData);
    } else {
      addTask(taskData);
    }
  };

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');

  const startOfCurrentWeek = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));

  const navItems = [
    { id: 'day' as ViewMode, label: '今日详情', icon: LayoutDashboard },
    { id: 'week' as ViewMode, label: '周视图', icon: Calendar },
    { id: 'stats' as ViewMode, label: '进度报告', icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans p-6 gap-6 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm flex flex-col z-40 shrink-0">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">考研打卡</h1>
            <p className="text-xs text-slate-500 font-medium tracking-wider uppercase">Planner v1.0</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setViewMode(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
                viewMode === item.id 
                  ? "bg-blue-50 text-blue-600 shadow-sm" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0", viewMode === item.id ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 space-y-4">
           <div className="bg-gradient-to-br from-blue-600 to-blue-500 p-4 rounded-2xl text-white shadow-xl shadow-blue-200">
            <p className="text-[10px] uppercase font-bold opacity-75 mb-1">今日评分</p>
            <div className="text-2xl font-bold">
              {scores.find(s => s.date === todayStr)?.score || 0}
            </div>
            <div className="mt-2 text-[10px] opacity-90 leading-relaxed">
              {tasks.filter(t => t.date === todayStr && t.completed).length}/{tasks.filter(t => t.date === todayStr).length} 任务已完成
            </div>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-900 px-2 py-1 text-sm transition-colors w-full"
          >
            <Settings className="w-4 h-4" />
            <span>设置中心</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-6 relative overflow-hidden">
        {/* Header */}
        <header className="bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between p-4 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold">
              {viewMode === 'day' && "日程规划"}
              {viewMode === 'week' && "周进度总览"}
              {viewMode === 'stats' && "学习数据分析"}
            </h2>
            <div className="h-4 w-px bg-slate-200" />
            <span className="text-sm text-slate-500 font-medium">
              {format(selectedDate, 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleOpenTaskDialog()}
              className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-800 transition-all shadow-lg active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>新建日程</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto scroll-smooth">
          <AnimatePresence mode="wait">
            {viewMode === 'day' && (
              <motion.div 
                key="day"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto h-full flex flex-col pt-8"
              >
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-8 flex flex-col min-h-[300px]">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                       <CheckCircle2 className="w-6 h-6 text-blue-600" />
                       <h3 className="font-bold text-lg text-slate-900">今日学习任务时间轴</h3>
                    </div>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                      横向拖拽调节时刻 / 侧边缘拉伸时长
                    </span>
                  </div>
                  <div className="flex-1 relative">
                    <HorizontalTimelineDay 
                      tasks={tasks.filter(t => t.date === selectedDateStr)}
                      onUpdate={updateTask}
                      onDelete={deleteTask}
                      onEdit={handleOpenTaskDialog}
                      isToday={isSameDay(selectedDate, new Date())}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {viewMode === 'week' && (
              <motion.div 
                key="week"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="h-full flex flex-col pb-8"
              >
                <div className="flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm p-4 overflow-y-auto flex-1 gap-2 min-h-[500px]">
                  <div className="flex justify-between items-center mb-4 px-2">
                     <h3 className="font-bold text-lg text-slate-900">本周学习分布回顾</h3>
                  </div>
                  {weekDays.map((date) => (
                    <div key={date.toISOString()} className="flex items-stretch gap-4 bg-slate-50 border border-slate-100 rounded-2xl p-2 relative group hover:bg-slate-100/50 transition-colors">
                       <div className="w-20 shrink-0 flex flex-col items-center justify-center border-r border-slate-200/50 pr-4">
                          <span className={cn("text-xs font-bold uppercase", isSameDay(date, new Date()) ? "text-blue-600" : "text-slate-400")}>
                            {format(date, 'eee', { locale: zhCN })}
                          </span>
                          <span className={cn("text-lg font-black", isSameDay(date, new Date()) ? "text-blue-600" : "text-slate-700")}>
                            {format(date, 'dd')}
                          </span>
                       </div>
                       <div className="flex-1 min-w-0">
                         <HorizontalTimelineDay 
                           tasks={tasks.filter(t => t.date === format(date, 'yyyy-MM-dd'))}
                           onUpdate={updateTask}
                           onDelete={deleteTask}
                           onEdit={handleOpenTaskDialog}
                           isToday={isSameDay(date, new Date())}
                           compact={true}
                         />
                       </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {viewMode === 'stats' && (
              <motion.div 
                key="stats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-5xl mx-auto pb-8"
              >
                <MonthlyStats scores={scores} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <TaskDialog 
        isOpen={isTaskDialogOpen} 
        onClose={() => { setIsTaskDialogOpen(false); setEditingTask(null); }} 
        onSubmit={handleTaskDialogSubmit}
        initialDate={selectedDateStr}
        editingTask={editingTask}
      />

      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
