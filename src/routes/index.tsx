import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Calculator, RotateCcw, GraduationCap, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { calculateResult, subjects } from "@/lib/calculator";
import { calculatorSchema, type CalculatorInput } from "@/lib/calculator.schema";

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
  const [result, setResult] = useState<{ type: "NPEI" | "NFEI"; value: number } | null>(null);

  const form = useForm<CalculatorInput>({
    resolver: zodResolver(calculatorSchema),
    defaultValues,
  });

  const includeEssay = useWatch({ control: form.control, name: "includeEssay" });

  function onSubmit(data: CalculatorInput) {
    console.log("form submitted", data);
    setResult(calculateResult(data));
  }

  function onReset() {
    form.reset(defaultValues);
    setResult(null);
  }

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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {subjects.map((subject) => (
                    <FormField
                      key={subject.key}
                      control={form.control}
                      name={subject.key}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{subject.label}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              max={subject.maxScore}
                              inputMode="numeric"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground">
                            0 a {subject.maxScore} questões
                          </p>
                        </FormItem>
                      )}
                    />
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
                      checked={includeEssay}
                      onCheckedChange={(checked) => form.setValue("includeEssay", checked)}
                    />
                  </div>

                  {includeEssay && (
                    <div className="mt-4">
                      <FormField
                        control={form.control}
                        name="essay"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nota da redação</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                max={100}
                                step={0.01}
                                inputMode="decimal"
                                placeholder="0"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value === "" ? null : e.target.valueAsNumber,
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button type="submit" className="flex-1 gap-2">
                    <Calculator className="h-4 w-4" />
                    Calcular média
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onReset}
                    className="gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Limpar
                  </Button>
                </div>
              </form>
            </Form>

            {result && (
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
