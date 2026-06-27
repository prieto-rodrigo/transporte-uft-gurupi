# Painel de Gestão do Transporte — UFT Gurupi

Dashboard institucional para acompanhar os gastos de combustível, manutenção e uso da frota do Campus de Gurupi da Universidade Federal do Tocantins.

## Estrutura

```
/
├── index.html          # Estrutura do dashboard
└── assets/
    ├── style.css       # Design system e estilos
    └── app.js          # Lógica, dados e gráficos (Chart.js)
```

## Como atualizar os dados

Abra `assets/app.js` e edite o objeto `gastos` no topo do arquivo:

```js
const gastos = {
  combustivel2025: 131395.50,
  manutencao2025:  137799.32,
  combustivel2026: 66735.49,
  manutencao2026:  52655.70,
  // ...
};
```

Para atualizar viagens, edite `viagensFinalidade.valores`.  
Para atualizar o ranking de veículos, edite o array `frota2025`.

Após salvar, faça `git add . && git commit -m "Atualização de dados" && git push` — o GitHub Pages publica automaticamente.

## Tecnologias

- HTML semântico + CSS custom properties (light/dark mode)
- [Chart.js 4](https://www.chartjs.org/) via CDN
- [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) via Google Fonts
- Hospedagem: [GitHub Pages](https://pages.github.com/)

## Período dos dados

- 2025: 01/01/2025 a 31/12/2025 — dados completos
- 2026: 01/01/2026 a 30/06/2026 — 1.º semestre

---

Desenvolvido para a Diretoria de Gestão do Campus de Gurupi — UFT.
