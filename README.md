# Testing Lab

**[➜ Ver rodando](https://testing-lab-seven.vercel.app/)**

Guia interativo de testes unitários no Angular com Jasmine. A ideia é simples: em vez de só ler sobre `describe`, `it` e `expect`, você roda os exemplos no próprio navegador e vê o resultado (verde ou vermelho) na hora.

O app traz um pequeno motor compatível com a API do Jasmine que executa as suítes ao vivo, então cada conceito vem com um exemplo de verdade rodando ao lado da explicação.

## Stack

* Angular 18 (standalone components, signals, rotas com lazy loading)
* TypeScript
* Jasmine e Karma para os testes de verdade (`ng test`)
* SCSS

## Como rodar

```bash
npm install
npm start
```

O app sobe em `http://localhost:4200`.

## Como rodar os testes

```bash
ng test
```

Roda os arquivos `.spec.ts` da pasta `src/app/examples` no Karma com Jasmine.

## O que tem no app

* **Início**: visão geral e a trilha sugerida.
* **Fundamentos**: estrutura de um teste, padrão Arrange/Act/Assert, hooks, código assíncrono e como pular ou focar testes.
* **Matchers**: dicionário de matchers (`toBe`, `toEqual`, `toContain`, `toThrow` e companhia), cada um com uma suíte que roda na hora.
* **Spies & Mocks**: como isolar dependências com `createSpy`, `spyOn` e mocks de serviço.
* **Testando Angular**: TestBed, ComponentFixture, `fakeAsync`/`tick` e HttpTestingController.
* **Playground**: editor onde você escreve a própria suíte e roda.
* **Cheatsheet**: consulta rápida de matchers, hooks e APIs do TestBed.

## Exemplos reais de teste

A pasta `src/app/examples` tem código com seus respectivos `.spec.ts` para rodar com `ng test`:

* `calculadora` : classe pura, sem Angular.
* `saudacao.service` : serviço obtido via `TestBed.inject()`.
* `contador.component` : componente testado com ComponentFixture.
* `tarefas` : um caso completo. Componente com loading, erro, retry, CRUD, validação, filtros, contadores derivados e busca com debounce, mais o serviço HTTP. Os testes cobrem o serviço com HttpTestingController e o componente com o serviço mockado.

## Estrutura

```
src/app/
  features/        páginas do app (uma pasta por seção)
  shared/
    components/    navbar, code-block e o test-runner
    lib/           mini-jasmine, o motor que roda as suítes no navegador
    data/          dicionário de matchers
    models/        tipos
  examples/        código + .spec.ts para rodar com ng test
```
