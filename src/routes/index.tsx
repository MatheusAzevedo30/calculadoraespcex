import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Calculator, RotateCcw, GraduationCap, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { calculateResult, subjects } from "@/lib/calculator";
import { calculatorSchema } from "@/lib/calculator.schema";
import type { CalculatorInput } from "@/lib/calculator.schema";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Calculadora de Média de Concurso" },
      {
        name: "description",
        content:
          "Calcule a média final de candidatos em concursos com base nos acertos por disciplina e na redação opcional.",
      },
      { property: "og:title", content: "Calculadora de Média de Concurso" },
      {
        property: "og:description",
        content:
          "Calcule a média final de candidatos em concursos com base nos acertos por disciplina e na redação opcional.",
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

  const isValid = useMemo(() => {
    const parsed = calculatorSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof CalculatorInput, string>> = {};
      parsed.error.errors.forEach((err) => {
        const path = err.path[0] as keyof CalculatorInput;
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  }, [values]);

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
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <div className="w-full max-w-3xl">
        <div className="mb-6 text-center">
          <div className="mb-3 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Calculadora de Média
          </h1>
          <p className="mt-2 text-muted-foreground">
            Preencha os acertos por disciplina para calcular a média final do concurso.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BookOpen className="h-5 w-5" />
              Dados do candidato
            </CardTitle>
            <CardDescription>
              Os valores são convertidos automaticamente para uma base de 100 pontos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {subjects.map((subject) => (
                  <div key={subject.key} className="space-y-2">
                    <Label htmlFor={subject.key}>{subject.label}</Label>
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
                    />
                    {errors[subject.key] && (
                      <p className="text-xs font-medium text-destructive">{errors[subject.key]}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      0 a {subject.maxScore} questões
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="essay-toggle" className="text-base font-medium">
                      Incluir redação
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Ative para informar a nota da redação (0 a 100).
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
                      className="mt-2"
                    />
                    {errors.essay && (
                      <p className="mt-2 text-xs font-medium text-destructive">{errors.essay}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="button" onClick={handleCalculate} className="flex-1 gap-2">
                  <Calculator className="h-4 w-4" />
                  Calcular média
                </Button>
                <Button type="button" variant="outline" onClick={handleReset} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Limpar
                </Button>
              </div>
            </div>

            {result !== null && (
              <div className="mt-8 rounded-xl border bg-primary/5 p-6 text-center transition-all">
                <p className="text-sm font-medium text-muted-foreground">Resultado</p>
                <p className="mt-1 text-5xl font-bold tracking-tight text-foreground">
                  {result.value.toFixed(2)}
                </p>
                <p className="mt-2 text-lg font-semibold text-primary">{result.type}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {result.type === "NPEI"
                    ? "Média sem redação"
                    : "Média final incluindo redação"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          As notas são convertidas para base 100 e aplicadas conforme os pesos do edital.
        </p>
      </div>
    </div>
  );
}
