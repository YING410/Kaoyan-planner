/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Priority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
}

export enum Difficulty {
  EASY = 1,
  NORMAL = 2,
  HARD = 3,
}

export interface StudyTask {
  id: string;
  name: string;
  description: string;
  priority: Priority;
  difficulty: Difficulty;
  startTime: string; // ISO string or "HH:mm"
  duration: number; // in minutes
  completed: boolean;
  date: string; // YYYY-MM-DD
}

export interface DayScore {
  date: string; // YYYY-MM-DD
  score: number;
  completedTasks: number;
  totalTasks: number;
}
