import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Target, RotateCcw, Calculator } from "lucide-react";

import brasaoAsset from "@/assets/brasao.png.asset.json";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { calculateResult, convertToHundred, subjects } from "@/lib/calculator";
import { calculatorSchema } from "@/lib/calculator.schema";
import type { CalculatorInput } from "@/lib/calculator.schema";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tiro Certo EsPCEx" },
      {
        name: "description",
        content:
          "Calcule sua média final para o concurso EsPCEx com base nos acertos por disciplina e na redação opcional.",
      },
      { property: "og:title", content: "Tiro Certo EsPCEx" },
      {
        property: "og:description",
        content:
          "Calcule sua média final para o concurso EsPCEx com base nos acertos por disciplina e na redação opcional.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const defaultValues: CalculatorInput = {
  portuguese: 0,
  mathematics: 0,
  physics: 0,
  chemistry: 0,
  history: 0,
  geography: 0,
  english: 0,
  includeEssay: false,
  essay: null,
};

function formatWeight(weight: number): string {
  return Number.isInteger(weight) ? String(weight) : weight.toString().replace(".", ",");
}

const subjectCodes: Record<string, string> = {
  portuguese: "NP",
  mathematics: "NM",
  physics: "NF",
  chemistry: "NQ",
  history: "NH",
  geography: "NG",
  english: "NI",
};

function Index() {
  const [values, setValues] = useState<CalculatorInput>(defaultValues);
  const [raw, setRaw] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof CalculatorInput, string>>>({});
  const [result, setResult] = useState<{ type: "NPEI" | "NFEI"; value: number } | null>(null);

  const handleChange = (field: keyof CalculatorInput, value: number | boolean | null) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };


  const handleCalculate = () => {
    const parsed = calculatorSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof CalculatorInput, string>> = {};
      parsed.error.errors.forEach((err) => {
        const path = err.path[0] as keyof CalculatorInput;
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setResult(calculateResult(parsed.data));
  };

  const handleReset = () => {
    setValues(defaultValues);
    setErrors({});
    setResult(null);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-4 py-8 sm:py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[image:var(--gradient-hero)]"
      />
      <div className="relative mx-auto w-full max-w-4xl">
        {/* Header */}
        <header className="mb-8 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-4">
            <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-card/80 shadow-[var(--shadow-soft)] ring-1 ring-border/60 backdrop-blur">
              <img
                src={brasaoAsset.url}
                alt="Brasão EsPCEx"
                className="h-14 w-auto drop-shadow-sm"
                width={56}
                height={56}
                loading="eager"
              />
            </span>
            <div className="text-left">
              <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                Tiro Certo EsPCEx
              </h1>
              <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Calcule sua média EsPCEx
              </p>
            </div>
          </div>
        </header>

        {/* Form Card */}
        <Card className="overflow-hidden rounded-2xl border border-border/60 bg-card/90 shadow-[var(--shadow-elevated)] backdrop-blur">
          <CardHeader className="border-b border-border/60 bg-[image:var(--gradient-panel)]">
            <CardTitle className="flex items-center gap-2 text-base font-bold uppercase tracking-[0.12em] text-foreground">
              <Target className="h-5 w-5 text-accent" />
              Notas por disciplina
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            {/* Subject grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject) => (
                <div
                  key={subject.key}
                  className="group rounded-xl border border-border/60 bg-card p-4 shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 focus-within:border-ring/60 focus-within:ring-2 focus-within:ring-ring/25"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <Label htmlFor={subject.key} className="font-semibold text-foreground">
                      {subject.label}
                    </Label>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                      Peso {formatWeight(subject.weight)}
                    </span>
                  </div>
                  <Input
                    id={subject.key}
                    type="number"
                    min={0}
                    max={subject.maxScore}
                    inputMode="numeric"
                    placeholder="0"
                    value={values[subject.key]}
                    onChange={(e) =>
                      handleChange(
                        subject.key,
                        e.target.value === "" ? 0 : e.target.valueAsNumber,
                      )
                    }
                    className="h-12 rounded-lg border-border/60 bg-secondary/20 text-center text-xl font-bold tabular-nums"
                  />
                  {errors[subject.key] && (
                    <p className="mt-2 text-xs font-medium text-destructive">
                      {errors[subject.key]}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2 text-xs">
                    <span className="text-muted-foreground">0 a {subject.maxScore} questões</span>
                    <span className="rounded-md bg-accent/15 px-2 py-0.5 font-bold tabular-nums text-foreground">
                      {subjectCodes[subject.key]}{" "}
                      {Number.isFinite(values[subject.key] as number)
                        ? convertToHundred(Number(values[subject.key]) || 0, subject.key).toFixed(2)
                        : "0.00"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Essay toggle */}
            <div className="rounded-xl border border-border/60 bg-secondary/20 p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <Label htmlFor="essay-toggle" className="text-base font-semibold text-foreground">
                    Incluir redação
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Ative para informar a nota da redação (0 a 100). Peso 1.
                  </p>
                </div>
                <Switch
                  id="essay-toggle"
                  checked={values.includeEssay}
                  onCheckedChange={(checked) => handleChange("includeEssay", checked)}
                />
              </div>

              {values.includeEssay && (
                <div className="mt-4">
                  <Label htmlFor="essay">Nota da redação</Label>
                  <Input
                    id="essay"
                    type="number"
                    min={0}
                    max={100}
                    step={0.01}
                    inputMode="decimal"
                    placeholder="0"
                    value={values.essay ?? ""}
                    onChange={(e) =>
                      handleChange(
                        "essay",
                        e.target.value === "" ? null : e.target.valueAsNumber,
                      )
                    }
                    className="mt-2 h-11 text-lg font-semibold tabular-nums"
                  />
                  {errors.essay && (
                    <p className="mt-2 text-xs font-medium text-destructive">{errors.essay}</p>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={handleCalculate}
                className="h-13 flex-1 gap-2 rounded-xl bg-[image:var(--gradient-accent)] text-lg font-bold uppercase tracking-wide text-accent-foreground shadow-[var(--shadow-soft)] transition-transform hover:brightness-105 active:scale-[0.99]"
              >
                <Calculator className="h-5 w-5" />
                Calcular média
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="h-13 gap-2 rounded-xl border-border/70 bg-card text-base font-semibold"
              >
                <RotateCcw className="h-5 w-5" />
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        {result !== null && (
          <div className="mt-6 rounded-2xl border border-accent/30 bg-[image:var(--gradient-panel)] p-8 text-center shadow-[var(--shadow-elevated)]">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">
              Resultado final
            </p>
            <p className="mt-3 text-6xl font-black tracking-tight text-foreground tabular-nums sm:text-7xl">
              {result.value.toFixed(2)}
            </p>
            <span className="mt-3 inline-block rounded-full bg-accent/20 px-4 py-1 text-lg font-bold tracking-wide text-foreground">
              {result.type}
            </span>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              {result.type === "NPEI"
                ? "Média final sem redação"
                : "Média final incluindo redação"}
            </p>
          </div>
        )}

        <p className="mt-6 text-center text-xs font-medium text-muted-foreground">
          As notas são convertidas para base 100 e aplicadas conforme os pesos do edital.
        </p>
      </div>
    </div>
  );
}
