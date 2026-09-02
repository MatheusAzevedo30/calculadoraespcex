# Plano: Calculadora de Média para Concurso

## Visão geral
Construir uma aplicação web simples, minimalista e responsiva para calcular a média final de candidatos em um concurso, com base nos acertos por disciplina e na redação opcional.

## O que será entregue
- Página única (`/`) substituindo o placeholder atual.
- Formulário com campos numéricos para cada disciplina, com limites máximos.
- Toggle/checkbox para habilitar a nota de redação (0 a 100).
- Botão de calcular com resultado destacado.
- Cálculo de NPEI (sem redação) ou NFEI (com redação), conforme as fórmulas fornecidas.
- Validação client-side e server-side (para segurança).
- Layout responsivo, limpo e moderno, usando Tailwind CSS e os componentes shadcn já disponíveis no projeto.

## Dados de entrada
| Disciplina | Máximo de questões | Base de conversão |
|------------|---------------------:|------------------:|
| Português  | 20                   | 100               |
| Matemática | 20                   | 100               |
| Física     | 12                   | 100               |
| Química    | 12                   | 100               |
| História   | 12                   | 100               |
| Geografia  | 12                   | 100               |
| Inglês     | 12                   | 100               |
| Redação    | 100 (nota direta)    | 100 (opcional)    |

## Regras de negócio
- Cada acerto é convertido para nota de 0 a 100.
- Se a redação NÃO for habilitada, calcular e exibir **NPEI**:
  - `NPEI = (1.5 × NF + NQ + NG + NH + 2 × NM + 2 × NP + 1.5 × NI) / 10`
- Se a redação FOR habilitada, calcular e exibir **NFEI**:
  - `NFEI = (1.5 × NF + NQ + NG + NH + 2 × NM + 2 × NP + 1.5 × NI + NR) / 11`
- O resultado deve ser arredondado para duas casas decimais.
- Botão "Limpar" para resetar todos os campos.

## Estrutura de arquivos
- `src/routes/index.tsx` — página principal com o formulário e cálculo.
- `src/lib/calculator.ts` — funções puras de conversão e cálculo (reutilizáveis e testáveis).
- `src/lib/calculator.schema.ts` — schema Zod para validação dos inputs.
- Ajuste de metadados em `src/routes/index.tsx` (head) para SEO.

## Design e UX
- Layout centralizado em card com fundo suave e sombra sutil.
- Agrupamento visual das disciplinas de 12 questões e das de 20 questões para melhor escaneabilidade.
- Campo de redação desabilitado por padrão; só habilitado via toggle.
- Resultado exibido em destaque com transição suave ao calcular.
- Cores semânticas do design system já configurado (Tailwind v4 + oklch), sem cores hardcoded.
- Formulário responsivo: uma coluna em mobile, grid em desktop.
- Estados de erro claros abaixo de cada campo inválido.

## Validação
- Cliente: Zod + React Hook Form (já disponível no projeto).
  - Mínimo 0, máximo conforme a disciplina.
  - Valores numéricos inteiros para acertos.
  - Redação, quando habilitada, entre 0 e 100.
- Servidor: revalidação na server function para evitar bypass.

## SEO / Head
- Title: "Calculadora de Média de Concurso".
- Meta description explicando a ferramenta.
- Open Graph e Twitter Card básicos.
- Sem `og:image` específico; hospedagem injeta preview automaticamente.

## Verificação
- Build do projeto deve passar (`bun run build`).
- Testar manualmente valores conhecidos para validar as fórmulas.
- Verificar responsividade em viewport mobile e desktop.
