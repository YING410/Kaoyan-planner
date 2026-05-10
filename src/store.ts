/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { StudyTask, DayScore, Priority, Difficulty } from './types';
import { format, isSameDay } from 'date-fns';

export function useKaoYanStore() {
  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    const saved = localStorage.getItem('kaoyan_tasks');
    if (saved) return JSON.parse(saved);
    
    // Initial dummy data
    const today = format(new Date(), 'yyyy-MM-dd');
    return [
      {
        id: 'init-1',
        name: '英语真题阅读',
        description: '2020年第1篇，精读',
        priority: Priority.HIGH,
        difficulty: Difficulty.NORMAL,
        startTime: '08:00',
        duration: 90,
        completed: true,
        date: today,
      },
      {
        id: 'init-2',
        name: '数学强化课',
        description: '级数部分第3讲',
        priority: Priority.MEDIUM,
        difficulty: Difficulty.HARD,
        startTime: '10:00',
        duration: 120,
        completed: false,
        date: today,
      },
      {
        id: 'init-3',
        name: '专业课背诵',
        description: '第一章名词解释',
        priority: Priority.HIGH,
        difficulty: Difficulty.NORMAL,
        startTime: '14:30',
        duration: 60,
        completed: false,
        date: today,
      }
    ];
  });

  const [scores, setScores] = useState<DayScore[]>(() => {
    const saved = localStorage.getItem('kaoyan_scores');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('kaoyan_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('kaoyan_scores', JSON.stringify(scores));
  }, [scores]);

  const addTask = useCallback((task: Omit<StudyTask, 'id' | 'completed'>) => {
    const newTask: StudyTask = {
      ...task,
      id: crypto.randomUUID(),
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<StudyTask>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => (t.id !== id)));
  }, []);

  const calculateDailyScore = useCallback((date: string) => {
    const dayTasks = tasks.filter((t) => t.date === date);
    if (dayTasks.length === 0) return 0;

    let totalWeight = 0;
    let completedWeight = 0;

    dayTasks.forEach((t) => {
      const weight = t.priority * t.difficulty;
      totalWeight += weight;
      if (t.completed) {
        completedWeight += weight;
      }
    });

    const baseScore = (completedWeight / totalWeight) * 100;
    
    // Punishment factor: if high priority/difficulty tasks are missed, extra deduction
    const missedCritical = dayTasks.filter(t => !t.completed && (t.priority === Priority.HIGH || t.difficulty === Difficulty.HARD)).length;
    const finalScore = Math.max(0, Math.min(100, baseScore - (missedCritical * 5)));

    return Math.round(finalScore);
  }, [tasks]);

  const updateScores = useCallback(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const score = calculateDailyScore(today);
    const dayTasks = tasks.filter((t) => t.date === today);

    setScores((prev) => {
      const existingIdx = prev.findIndex(s => s.date === today);
      const newScore: DayScore = {
        date: today,
        score,
        completedTasks: dayTasks.filter(t => t.completed).length,
        totalTasks: dayTasks.length,
      };

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = newScore;
        return next;
      }
      return [...prev, newScore];
    });
  }, [calculateDailyScore, tasks]);

  // Update scores when tasks change (debounced or on complete)
  useEffect(() => {
    const timer = setTimeout(() => {
      updateScores();
    }, 1000);
    return () => clearTimeout(timer);
  }, [tasks, updateScores]);

  return {
    tasks,
    scores,
    addTask,
    updateTask,
    deleteTask,
    calculateDailyScore,
  };
}
