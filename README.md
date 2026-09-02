# Concurso Inteligente

Atue como um desenvolvedor web e UX/UI designer sênior. Sua tarefa é criar uma aplicação web (HTML, CSS e JavaScript) para calcular a média de candidatos em um concurso.

Design:

A interface deve ser minimalista, moderna, responsiva e muito simples de usar.

Entradas de Dados (Inputs):

Crie campos numéricos para o usuário inserir a quantidade de acertos em cada disciplina. Para evitar erros, limite os valores máximos nos campos de acordo com o total de questões:

Português (0 a 20)

Matemática (0 a 20)

Física (0 a 12)

Química (0 a 12)

História (0 a 12)

Geografia (0 a 12)

Inglês (0 a 12)

Redação (Adicione uma chave ou checkbox para habilitar este campo opcional. A nota deve ir de 0 a 100).

Regras de Negócio:

Ao clicar em calcular, converta a quantidade de acertos de cada disciplina para uma base de 100 pontos:

$NF = (\text{Acertos em Física} / 12) \times 100$

$NQ = (\text{Acertos em Química} / 12) \times 100$

$NG = (\text{Acertos em Geografia} / 12) \times 100$

$NH = (\text{Acertos em História} / 12) \times 100$

$NM = (\text{Acertos em Matemática} / 20) \times 100$

$NP = (\text{Acertos em Português} / 20) \times 100$

$NI = (\text{Acertos em Inglês} / 12) \times 100$

Cálculo Final:

Se a nota de Redação NÃO for inserida, exiba o resultado como NPEI, usando a fórmula:

$NPEI = \frac{1.5 \times NF + NQ + NG + NH + 2 \times NM + 2 \times NP + 1.5 \times NI}{10}$

Se a nota de Redação FOR inserida (variável $NR$), exiba o resultado como NFEI, usando a fórmula:

$NFEI = \frac{1.5 \times NF + NQ + NG + NH + 2 \times NM + 2 \times NP + 1.5 \times NI + NR}{11}$

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://calculadoraespcex.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/18a77d55-17ff-476a-a482-b5e4546a02aa).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
