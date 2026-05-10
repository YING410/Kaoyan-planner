/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Priority, Difficulty, StudyTask } from '../types';
import { X } from 'lucide-react';
import { format } from 'date-fns';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<StudyTask, 'id' | 'completed'>, editingId?: string) => void;
  initialDate?: string;
  editingTask?: StudyTask | null;
}

export function TaskDialog({ isOpen, onClose, onSubmit, initialDate, editingTask }: TaskDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: Priority.MEDIUM,
    difficulty: Difficulty.NORMAL,
    startTime: '09:00',
    duration: 60,
    date: initialDate || format(new Date(), 'yyyy-MM-dd'),
  });

  useEffect(() => {
    if (isOpen) {
      if (editingTask) {
        setFormData({
          name: editingTask.name,
          description: editingTask.description,
          priority: editingTask.priority,
          difficulty: editingTask.difficulty,
          startTime: editingTask.startTime,
          duration: editingTask.duration,
          date: editingTask.date,
        });
      } else {
        setFormData({
          name: '',
          description: '',
          priority: Priority.MEDIUM,
          difficulty: Difficulty.NORMAL,
          startTime: '09:00',
          duration: 60,
          date: initialDate || format(new Date(), 'yyyy-MM-dd'),
        });
      }
    }
  }, [isOpen, editingTask, initialDate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[95dvh] flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0">
          <h3 className="text-lg font-semibold text-slate-900">{editingTask ? '编辑任务' : '创建新任务'}</h3>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form className="p-4 space-y-4 overflow-y-auto min-h-0" onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData, editingTask?.id);
          onClose();
        }}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">任务名称</label>
            <input 
              required
              type="text" 
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="例如：数学全真模拟卷"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">任务简介</label>
            <textarea 
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[80px]"
              placeholder="详细描述计划完成的内容..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">轻重缓急</label>
              <select 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: Number(e.target.value) as Priority }))}
              >
                <option value={Priority.LOW}>低</option>
                <option value={Priority.MEDIUM}>中</option>
                <option value={Priority.HIGH}>高</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">难度等级</label>
              <select 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: Number(e.target.value) as Difficulty }))}
              >
                <option value={Difficulty.EASY}>简单</option>
                <option value={Difficulty.NORMAL}>一般</option>
                <option value={Difficulty.HARD}>困难</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">日期</label>
              <input 
                type="date" 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">开始时间</label>
              <input 
                type="time" 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">预计时长 (分钟)</label>
            <input 
              type="number" 
              step="15"
              min="15"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
            >
              取消
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-200"
            >
              {editingTask ? '保存修改' : '保存任务'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
