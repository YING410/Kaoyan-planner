/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DayScore } from '../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';

interface MonthlyStatsProps {
  scores: DayScore[];
}

export function MonthlyStats({ scores }: MonthlyStatsProps) {
  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  const daysInMonth = eachDayOfInterval({ start, end });

  const chartData = daysInMonth.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const scoreData = scores.find(s => s.date === dateStr);
    return {
      date: format(day, 'MM-dd'),
      fullDate: dateStr,
      score: scoreData ? scoreData.score : 0,
      completed: scoreData ? scoreData.completedTasks : 0,
    };
  });

  const averageScore = scores.length > 0 
    ? Math.round(scores.reduce((acc, curr) => acc + curr.score, 0) / scores.length) 
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-center">
          <h4 className="text-slate-500 text-sm font-medium mb-1">本月平均评分</h4>
          <div className="text-3xl font-bold text-slate-900">{averageScore} <span className="text-sm font-normal text-slate-400">/ 100</span></div>
          <div className="mt-4 h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${averageScore}%` }} />
          </div>
        </div>
        
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-center">
          <h4 className="text-slate-500 text-sm font-medium mb-1">今日任务</h4>
          <div className="text-3xl font-bold text-slate-900">
            {scores.find(s => s.date === format(today, 'yyyy-MM-dd'))?.totalTasks || 0}
          </div>
          <p className="text-xs text-slate-400 mt-2">点击右侧按钮添加任务</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-center">
          <h4 className="text-slate-500 text-sm font-medium mb-1">学习评价</h4>
          <div className="text-xl font-bold text-blue-600">
            {averageScore >= 90 ? '卓越' : averageScore >= 80 ? '优秀' : averageScore >= 60 ? '良好' : '继续努力'}
          </div>
          <p className="text-xs text-slate-400 mt-2">评分基于任务权重与完成度</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm h-[350px]">
        <h4 className="text-slate-900 font-bold mb-6 flex items-center justify-between">
          <span>月度学习评分表</span>
          <span className="text-xs font-normal text-slate-400">{format(today, 'yyyy年MM月')}</span>
        </h4>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              interval={4}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#scoreGradient)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
