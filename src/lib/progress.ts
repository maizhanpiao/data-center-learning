import { CHAPTERS } from "@/content/chapters";
import { TIERS, tierByLevel } from "@/content/tiers";
import { UserState } from "./store";

export function chapterDone(state: UserState, id: string) {
  return !!state.completedChapters[id];
}

export function overallProgress(state: UserState) {
  const total = CHAPTERS.length;
  const done = CHAPTERS.filter((c) => chapterDone(state, c.id)).length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

export function partProgress(state: UserState, part: number) {
  const chs = CHAPTERS.filter((c) => c.part === part);
  const done = chs.filter((c) => chapterDone(state, c.id)).length;
  return { done, total: chs.length, pct: chs.length ? Math.round((done / chs.length) * 100) : 0 };
}

export interface TierStatus {
  level: number;
  done: number;
  total: number;
  pct: number;
  completed: boolean;
  unlocked: boolean;
}

export function tierStatus(state: UserState, level: number): TierStatus {
  const parts = tierByLevel(level)?.parts ?? [];
  const chs = CHAPTERS.filter((c) => parts.includes(c.part));
  const done = chs.filter((c) => chapterDone(state, c.id)).length;
  const total = chs.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const completed = total > 0 && done === total;
  // 解锁条件：第一段始终解锁；其余段需前一段完成
  const prevCompleted = level === 1 ? true : tierStatus(state, level - 1).completed;
  return { level, done, total, pct, completed, unlocked: prevCompleted };
}

/** 当前所处段位：最低的“未完成”段；全部完成则停在最高段 */
export function currentTier(state: UserState) {
  for (const t of TIERS) {
    if (!tierStatus(state, t.level).completed) return t.level;
  }
  return TIERS[TIERS.length - 1].level;
}

/** 平均自测正确率（仅统计做过的测验） */
export function avgQuizScore(state: UserState) {
  const scores = Object.values(state.quizScores);
  if (scores.length === 0) return null;
  const totalC = scores.reduce((a, s) => a + s.correct, 0);
  const totalT = scores.reduce((a, s) => a + s.total, 0);
  return totalT ? Math.round((totalC / totalT) * 100) : null;
}

/** 今日待复习的抽认卡数量 */
export function dueFlashcards(state: UserState, allIds: string[]) {
  const now = Date.now();
  return allIds.filter((id) => {
    const srs = state.flashcards[id];
    return !srs || srs.due <= now; // 没学过的 + 到期的
  }).length;
}

// ===== 闭环学习：错题本与掌握度 =====

/** 仍需攻克的错题（未毕业） */
export function activeMistakes(state: UserState) {
  return Object.values(state.mistakes).filter((m) => !m.retired);
}

/** 今日到期、需要重测的错题 */
export function dueMistakes(state: UserState) {
  const now = Date.now();
  return activeMistakes(state).filter((m) => m.due <= now);
}

/** 已攻克（连对达标毕业）的错题数 */
export function masteredMistakes(state: UserState) {
  return Object.values(state.mistakes).filter((m) => m.retired).length;
}

/** 弱项章节：有未毕业错题的章节，按错题数从多到少 */
export function weakChapters(state: UserState) {
  const counts: Record<string, number> = {};
  for (const m of activeMistakes(state)) {
    if (m.chapterId) counts[m.chapterId] = (counts[m.chapterId] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([chapterId, count]) => ({ chapterId, count }))
    .sort((a, b) => b.count - a.count);
}
