import { z } from "zod";

export const subjects = [
  { key: "portuguese", label: "Português", maxScore: 20 },
  { key: "mathematics", label: "Matemática", maxScore: 20 },
  { key: "physics", label: "Física", maxScore: 12 },
  { key: "chemistry", label: "Química", maxScore: 12 },
  { key: "history", label: "História", maxScore: 12 },
  { key: "geography", label: "Geografia", maxScore: 12 },
  { key: "english", label: "Inglês", maxScore: 12 },
] as const;

export type SubjectKey = (typeof subjects)[number]["key"];

export const calculatorSchema = z.object({
  portuguese: z.coerce.number().int().min(0, "Mínimo 0").max(20, "Máximo 20"),
  mathematics: z.coerce.number().int().min(0, "Mínimo 0").max(20, "Máximo 20"),
  physics: z.coerce.number().int().min(0, "Mínimo 0").max(12, "Máximo 12"),
  chemistry: z.coerce.number().int().min(0, "Mínimo 0").max(12, "Máximo 12"),
  history: z.coerce.number().int().min(0, "Mínimo 0").max(12, "Máximo 12"),
  geography: z.coerce.number().int().min(0, "Mínimo 0").max(12, "Máximo 12"),
  english: z.coerce.number().int().min(0, "Mínimo 0").max(12, "Máximo 12"),
  includeEssay: z.boolean().optional(),
  essay: z.coerce
    .number()
    .min(0, "Mínimo 0")
    .max(100, "Máximo 100")
    .optional()
    .nullable(),
});

export type CalculatorInput = {
  portuguese: number;
  mathematics: number;
  physics: number;
  chemistry: number;
  history: number;
  geography: number;
  english: number;
  includeEssay: boolean;
  essay: number | null | undefined;
};

export const calculatorResultSchema = z.object({
  type: z.enum(["NPEI", "NFEI"]),
  value: z.number(),
});

export type CalculatorResult = z.infer<typeof calculatorResultSchema>;
