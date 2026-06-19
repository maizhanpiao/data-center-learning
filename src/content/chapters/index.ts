import { Chapter, Flashcard, QuizQuestion } from "@/lib/types";
import { PART0 } from "./part0";
import { PART1 } from "./part1";
import { PART2 } from "./part2";
import { PART3 } from "./part3";
import { PART4 } from "./part4";
import { PART5 } from "./part5";
import { PART6 } from "./part6";
import { PART7 } from "./part7";

export const CHAPTERS: Chapter[] = [
  ...PART0, ...PART1, ...PART2, ...PART3, ...PART4, ...PART5, ...PART6, ...PART7,
];

export function chapterById(id: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.id === id);
}

export function chaptersByPart(part: number): Chapter[] {
  return CHAPTERS.filter((c) => c.part === part);
}

export function chaptersByTier(tier: number): Chapter[] {
  return CHAPTERS.filter((c) => c.tier === tier);
}

export function adjacentChapters(id: string): { prev?: Chapter; next?: Chapter } {
  const i = CHAPTERS.findIndex((c) => c.id === id);
  return {
    prev: i > 0 ? CHAPTERS[i - 1] : undefined,
    next: i >= 0 && i < CHAPTERS.length - 1 ? CHAPTERS[i + 1] : undefined,
  };
}

/** 是否为"已编写"章节（有正文且不止占位） */
export function isAuthored(c: Chapter): boolean {
  return c.quiz.length > 0 || c.blocks.length > 1;
}

export const ALL_FLASHCARDS: Flashcard[] = CHAPTERS.flatMap((c) => c.flashcards);

export function allQuizByPart(part: number): { chapter: Chapter; quiz: QuizQuestion[] }[] {
  return chaptersByPart(part)
    .filter((c) => c.quiz.length > 0)
    .map((c) => ({ chapter: c, quiz: c.quiz }));
}
