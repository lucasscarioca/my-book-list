# TODO GRAFO

## Funcionalidades

- Usuário seleciona categoria desejada -> busca na api 25 livros da categoria;
- Lista livros para escolha/avaliação -> algoritmo faz o mapeamento do grafo de livros;
- Usuário seleciona um livro -> abre modal para avaliação e visualizar livros parecidos/recomendados;
- Visualização do grafo -> modal? para visualização do estado atual do grafo (livros avaliados/selecionados e pesos das arestas)
- Lista livros selecionados;
- Lista livros recomendados;

## Algoritmo

- Vertice: Livros;
- Arestas: Relação entre os livros (palavras-chaves no título, avaliação, autor, categoria, nº de pag);
- Algoritmo: Bfs. Recomandação dos livros conectados aos selecionados baseado no peso das arestas, dando prioridade para pesos maiores.
