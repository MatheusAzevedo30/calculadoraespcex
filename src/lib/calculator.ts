import {
  calculatorSchema,
  type CalculatorInput,
  type CalculatorResult,
  subjects,
  type SubjectKey,
} from "./calculator.schema";

const weights: Record<SubjectKey, number> = {
  portuguese: 2,
  mathematics: 2,
  physics: 1.5,
  chemistry: 1,
  history: 1,
  geography: 1,
  english: 1.5,
};

const maxScores: Record<SubjectKey, number> = {
  portuguese: 20,
  mathematics: 20,
  physics: 12,
  chemistry: 12,
  history: 12,
  geography: 12,
  english: 12,
};

export function convertToHundred(score: number, subject: SubjectKey): number {
  return (score / maxScores[subject]) * 100;
}

export function calculateResult(input: CalculatorInput): CalculatorResult {
  const validated = calculatorSchema.parse(input);

  const nf = convertToHundred(validated.physics, "physics");
  const nq = convertToHundred(validated.chemistry, "chemistry");
  const ng = convertToHundred(validated.geography, "geography");
  const nh = convertToHundred(validated.history, "history");
  const nm = convertToHundred(validated.mathematics, "mathematics");
  const np = convertToHundred(validated.portuguese, "portuguese");
  const ni = convertToHundred(validated.english, "english");

  const weightedSum =
    weights.physics * nf +
    weights.chemistry * nq +
    weights.geography * ng +
    weights.history * nh +
    weights.mathematics * nm +
    weights.portuguese * np +
    weights.english * ni;

  if (validated.includeEssay && validated.essay != null) {
    const value = (weightedSum + validated.essay) / 11;
    return {
      type: "NFEI",
      value: Math.round(value * 100) / 100,
    };
  }

  const value = weightedSum / 10;
  return {
    type: "NPEI",
    value: Math.round(value * 100) / 100,
  };
}

export { subjects };
export type { SubjectKey };
