"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

// ============================================================
// 学习状态：本地存储为主，配置访问口令后自动与 Neon 云端同步
// ============================================================

export interface SRS {
  ease: number;
  interval: number; // 天
  due: number;      // 时间戳
  reps: number;
}

/** 错因标签 */
export type MistakeReason = "概念没懂" | "记错了" | "审题失误" | "不会操作" | "粗心";

/** 错题本条目：闭环学习的核心 —— 自动捕获、可复盘、可重测 */
export interface Mistake {
  qid: string;
  scoreId: string;       // 来源（章节/模拟考）
  chapterId?: string;
  question: string;
  options: string[];
  answer: number[];
  yourAnswer: number[];
  explanation: string;
  kind: "single" | "multi" | "tf";
  reason?: MistakeReason; // 复盘错因
  wrongCount: number;     // 累计错误次数
  streak: number;         // 重测连对次数
  due: number;            // 下次重测时间戳
  retired: boolean;       // 连对达标 → 已掌握毕业
  lastTs: number;
}

export interface UserState {
  completedChapters: Record<string, boolean>;
  quizScores: Record<string, { correct: number; total: number; ts: number }>;
  notes: Record<string, string>;
  flashcards: Record<string, SRS>;
  practiceDone: Record<string, boolean>;
  mistakes: Record<string, Mistake>;
  examResults: Record<string, { best: number; passed: boolean; lastTs: number }>;
  name: string;
  updatedAt: number;
}

const EMPTY: UserState = {
  completedChapters: {},
  quizScores: {},
  notes: {},
  flashcards: {},
  practiceDone: {},
  mistakes: {},
  examResults: {},
  name: "",
  updatedAt: 0,
};

const LS_KEY = "dc_state_v1";
const LS_PASS = "dc_passcode";

type SyncStatus = "off" | "syncing" | "synced" | "error" | "local";

interface StoreCtx {
  state: UserState;
  sync: SyncStatus;
  passcodeSet: boolean;
  toggleChapter: (id: string) => void;
  setQuizScore: (id: string, correct: number, total: number) => void;
  setNote: (key: string, text: string) => void;
  reviewCard: (id: string, quality: "again" | "good" | "easy") => void;
  recordMistakes: (items: Omit<Mistake, "wrongCount" | "streak" | "due" | "retired" | "lastTs">[]) => void;
  tagMistakeReason: (qid: string, reason: MistakeReason) => void;
  retestMistake: (qid: string, correct: boolean) => void;
  removeMistake: (qid: string) => void;
  setExamResult: (examId: string, pct: number, passed: boolean) => void;
  setPracticeDone: (id: string, done: boolean) => void;
  setName: (n: string) => void;
  configurePasscode: (code: string) => Promise<boolean>;
  clearPasscode: () => void;
  exportData: () => void;
  importData: (json: string) => boolean;
  resetAll: () => void;
}

const Ctx = createContext<StoreCtx | null>(null);

function load(): UserState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return EMPTY;
  }
}

function mergeStates(a: UserState, b: UserState): UserState {
  // 简单的"较新者优先"合并：以 updatedAt 较大的整体为准
  return a.updatedAt >= b.updatedAt ? a : b;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<UserState>(EMPTY);
  const [sync, setSync] = useState<SyncStatus>("off");
  const [passcodeSet, setPasscodeSet] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 初始化：读本地 + 若有口令则拉云端
  useEffect(() => {
    const local = load();
    setState(local);
    const code = localStorage.getItem(LS_PASS);
    setPasscodeSet(!!code);
    setHydrated(true);
    if (code) {
      setSync("syncing");
      fetch("/api/state", { headers: { "x-passcode": code } })
        .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
        .then((remote: { state?: UserState }) => {
          if (remote?.state) {
            const merged = mergeStates(local, remote.state);
            setState(merged);
          }
          setSync("synced");
        })
        .catch(() => setSync("local")); // 云端不可用，退回本地
    } else {
      setSync("off");
    }
  }, []);

  // 持久化（本地立即存，云端防抖上传）
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch {}
    const code = localStorage.getItem(LS_PASS);
    if (!code) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setSync("syncing");
      fetch("/api/state", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-passcode": code },
        body: JSON.stringify({ state }),
      })
        .then((r) => (r.ok ? setSync("synced") : setSync("error")))
        .catch(() => setSync("local"));
    }, 900);
  }, [state, hydrated]);

  const mutate = useCallback((fn: (s: UserState) => UserState) => {
    setState((prev) => ({ ...fn(prev), updatedAt: Date.now() }));
  }, []);

  const toggleChapter = useCallback((id: string) => {
    mutate((s) => ({
      ...s,
      completedChapters: { ...s.completedChapters, [id]: !s.completedChapters[id] },
    }));
  }, [mutate]);

  const setQuizScore = useCallback((id: string, correct: number, total: number) => {
    mutate((s) => ({
      ...s,
      quizScores: { ...s.quizScores, [id]: { correct, total, ts: Date.now() } },
    }));
  }, [mutate]);

  const setNote = useCallback((key: string, text: string) => {
    mutate((s) => ({ ...s, notes: { ...s.notes, [key]: text } }));
  }, [mutate]);

  const setPracticeDone = useCallback((id: string, done: boolean) => {
    mutate((s) => ({ ...s, practiceDone: { ...s.practiceDone, [id]: done } }));
  }, [mutate]);

  const setName = useCallback((n: string) => {
    mutate((s) => ({ ...s, name: n }));
  }, [mutate]);

  // 抽认卡：极简 SM-2 间隔复习
  const reviewCard = useCallback((id: string, quality: "again" | "good" | "easy") => {
    mutate((s) => {
      const prev: SRS = s.flashcards[id] ?? { ease: 2.3, interval: 0, due: 0, reps: 0 };
      let { ease, interval, reps } = prev;
      if (quality === "again") {
        interval = 0; reps = 0; ease = Math.max(1.3, ease - 0.2);
      } else {
        reps += 1;
        if (quality === "easy") ease += 0.15;
        if (reps === 1) interval = quality === "easy" ? 3 : 1;
        else if (reps === 2) interval = quality === "easy" ? 7 : 4;
        else interval = Math.round(interval * ease);
      }
      const due = Date.now() + interval * 86400000;
      return { ...s, flashcards: { ...s.flashcards, [id]: { ease, interval, due, reps } } };
    });
  }, [mutate]);

  // 错题本：做错自动归档（已掌握毕业的题再次做错会重新激活）
  const recordMistakes = useCallback((items: Omit<Mistake, "wrongCount" | "streak" | "due" | "retired" | "lastTs">[]) => {
    if (items.length === 0) return;
    mutate((s) => {
      const m = { ...s.mistakes };
      const now = Date.now();
      for (const it of items) {
        const prev = m[it.qid];
        m[it.qid] = {
          ...it,
          reason: prev?.reason,
          wrongCount: (prev?.wrongCount ?? 0) + 1,
          streak: 0,
          due: now,        // 立即进入重测队列
          retired: false,  // 再次做错 → 重新激活
          lastTs: now,
        };
      }
      return { ...s, mistakes: m };
    });
  }, [mutate]);

  const tagMistakeReason = useCallback((qid: string, reason: MistakeReason) => {
    mutate((s) => {
      const cur = s.mistakes[qid];
      if (!cur) return s;
      return { ...s, mistakes: { ...s.mistakes, [qid]: { ...cur, reason } } };
    });
  }, [mutate]);

  // 重测：连对 2 次 → 毕业(已掌握)；答错 → 连对清零、留在队列
  const retestMistake = useCallback((qid: string, correct: boolean) => {
    mutate((s) => {
      const cur = s.mistakes[qid];
      if (!cur) return s;
      const now = Date.now();
      let { streak, wrongCount, retired, due } = cur;
      if (correct) {
        streak += 1;
        if (streak >= 2) { retired = true; due = now + 7 * 86400000; }
        else { due = now + 1 * 86400000; }
      } else {
        streak = 0; wrongCount += 1; retired = false; due = now;
      }
      return { ...s, mistakes: { ...s.mistakes, [qid]: { ...cur, streak, wrongCount, retired, due, lastTs: now } } };
    });
  }, [mutate]);

  const removeMistake = useCallback((qid: string) => {
    mutate((s) => {
      const m = { ...s.mistakes };
      delete m[qid];
      return { ...s, mistakes: m };
    });
  }, [mutate]);

  const setExamResult = useCallback((examId: string, pct: number, passed: boolean) => {
    mutate((s) => {
      const prev = s.examResults[examId];
      return {
        ...s,
        examResults: {
          ...s.examResults,
          [examId]: {
            best: Math.max(prev?.best ?? 0, pct),
            passed: (prev?.passed ?? false) || passed,
            lastTs: Date.now(),
          },
        },
      };
    });
  }, [mutate]);

  const configurePasscode = useCallback(async (code: string) => {
    try {
      const r = await fetch("/api/state", { headers: { "x-passcode": code } });
      if (r.status === 401) return false;
      if (!r.ok && r.status !== 404) return false;
      localStorage.setItem(LS_PASS, code);
      setPasscodeSet(true);
      const remote = r.ok ? await r.json() : null;
      if (remote?.state) setState((local) => mergeStates(local, remote.state));
      setSync("synced");
      return true;
    } catch {
      return false;
    }
  }, []);

  const clearPasscode = useCallback(() => {
    localStorage.removeItem(LS_PASS);
    setPasscodeSet(false);
    setSync("off");
  }, []);

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `数据中心学习进度-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const importData = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json);
      setState({ ...EMPTY, ...parsed, updatedAt: Date.now() });
      return true;
    } catch {
      return false;
    }
  }, []);

  const resetAll = useCallback(() => {
    setState({ ...EMPTY, updatedAt: Date.now() });
  }, []);

  return (
    <Ctx.Provider value={{
      state, sync, passcodeSet,
      toggleChapter, setQuizScore, setNote, reviewCard, setPracticeDone, setName,
      recordMistakes, tagMistakeReason, retestMistake, removeMistake, setExamResult,
      configurePasscode, clearPasscode, exportData, importData, resetAll,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore must be used within StoreProvider");
  return c;
}
