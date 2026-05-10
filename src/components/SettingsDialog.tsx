/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[95dvh] flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-slate-100 shrink-0">
          <h3 className="text-base md:text-lg font-bold text-slate-900">设置中心与评分规则</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-6 overflow-y-auto min-h-0">
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-wider">
              <CheckCircle className="w-4 h-4" />
              <span>月度评分规则 (0 - 100分)</span>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3 text-sm text-slate-700">
              <p>系统会根据每日任务的<strong>权重乘积（优先级 × 难度）</strong>来计算您的基础自律得分：</p>
              
              <ul className="list-disc list-inside space-y-2 ml-1">
                <li><span className="font-semibold text-slate-900">基础分计算：</span>完成任务的权重 / 计划总任务的权重 × 100</li>
                <li><span className="font-semibold text-slate-900">惩罚机制：</span>若当天未完成<strong className="text-rose-500 px-1">优先级高(High)</strong>或<strong className="text-rose-500 px-1">难度困难(Hard)</strong>的核心任务，每个未完成的核心任务将从总分中<strong className="text-rose-600">额外扣除5分</strong>。</li>
              </ul>
              
              <div className="mt-4 pt-4 border-t border-slate-200 flex items-start gap-2 text-xs text-slate-500">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <p><strong>评价标准：</strong> 90分以上为「卓越」，80分以上为「优秀」，60分以上为「良好」，低于60分为需要「继续努力」。积极完成核心困难任务是提高评分的关键所在。</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>打卡记录说明</span>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 text-sm text-amber-900">
              <p>所有的任务和评分记录安全地存储在您的本地浏览器中 (LocalStorage)。清除浏览器缓存可能会导致数据丢失。未来版本即将支持云端同步功能。</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
