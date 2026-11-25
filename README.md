# Sete Vidas Corretora · site

Site institucional one-page da Sete Vidas Corretora (planos de saúde e seguros de vida).

HTML, CSS e JavaScript puros, sem build. Para ver localmente:

```
python3 -m http.server 8000
```

e abra http://localhost:8000.

## Estrutura

- `index.html` · página
- `styles.css` · estilos (tokens da marca no topo)
- `main.js` · menu, animações, formulário que abre o WhatsApp
- `assets/img` · fotos (versão grande e `-sm`)
- `assets/logos` · logo, símbolo e logos das operadoras

## Para trocar

- Número do WhatsApp: `WA` no topo de `main.js` e os links `wa.me` em `index.html`.
- Cores e fontes: variáveis em `:root` no topo de `styles.css`.
