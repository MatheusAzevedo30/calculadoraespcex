import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Target, RotateCcw, Calculator, Palette } from "lucide-react";

import brasaoAsset from "@/assets/brasao.png.asset.json";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { calculateResult, subjects } from "@/lib/calculator";
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

function Index() {
  const [values, setValues] = useState<CalculatorInput>(defaultValues);
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
    <div className="min-h-screen bg-background px-4 py-6 sm:py-10">
      <div className="mx-auto w-full max-w-4xl">
        {/* Header */}
        <header className="mb-6 flex flex-col items-center gap-3 text-center sm:mb-8">
          <div className="flex items-center gap-3">
            <img
              src={brasaoAsset.url}
              alt="Brasão EsPCEx"
              className="h-16 w-auto drop-shadow-sm"
              width={64}
              height={64}
              loading="eager"
            />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Tiro Certo EsPCEx
              </h1>
              <p className="text-sm font-medium text-muted-foreground">
                Calcule sua média EsPCEx
              </p>
            </div>
          </div>
        </header>

        {/* Form Card */}
        <Card className="border-2 border-border/50 shadow-sm">
          <CardHeader className="border-b border-border/50 bg-secondary/30">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
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
                  className="rounded-lg border border-border/60 bg-card p-4 transition-colors focus-within:border-ring/50 focus-within:ring-1 focus-within:ring-ring/30"
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
                    className="h-11 text-center text-lg font-semibold tabular-nums"
                  />
                  {errors[subject.key] && (
                    <p className="mt-2 text-xs font-medium text-destructive">
                      {errors[subject.key]}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    0 a {subject.maxScore} questões (contribuição máxima: 100 pts)
                  </p>
                </div>
              ))}
            </div>

            {/* Essay toggle */}
            <div className="rounded-lg border border-border/60 bg-card p-4">
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
                className="h-12 flex-1 gap-2 bg-accent text-lg font-bold text-accent-foreground hover:bg-accent/90"
              >
                <Calculator className="h-5 w-5" />
                Calcular média
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="h-12 gap-2 text-base font-semibold"
              >
                <RotateCcw className="h-5 w-5" />
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        {result !== null && (
          <div className="mt-6 rounded-xl border-2 border-accent/40 bg-card p-6 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Resultado final
            </p>
            <p className="mt-2 text-6xl font-extrabold tracking-tight text-foreground tabular-nums">
              {result.value.toFixed(2)}
            </p>
            <p className="mt-2 text-2xl font-bold text-accent">{result.type}</p>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
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
