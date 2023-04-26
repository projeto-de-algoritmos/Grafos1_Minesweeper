// função que realiza o Flood Fill recursivo
function floodFill(campoMinado, x, y) {
    //debugger;
    if (campoMinado[x][y] === 0) {
      // preenche a célula com o número de minas adjacentes
      const numMinasAdjacentes = contarMinasAdjacentes(campoMinado, x, y);
      campoMinado[x][y] = numMinasAdjacentes;
  
      // chama a função recursivamente para as células vizinhas não minadas
      if (numMinasAdjacentes === 0) {
        for (let i = x - 1; i <= x + 1; i++) {
          for (let j = y - 1; j <= y + 1; j++) {
            if (i >= 0 && i < campoMinado.length &&
                j >= 0 && j < campoMinado[i].length &&
                campoMinado[i][j] === -1) {
              floodFill(campoMinado, i, j);
            }
          }
        }
      }
    }
  }
  
  // função que conta o número de minas adjacentes a uma célula
  function contarMinasAdjacentes(campoMinado, x, y) {
    let numMinas = 0;
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (i >= 0 && i < campoMinado.length &&
            j >= 0 && j < campoMinado[i].length &&
            campoMinado[i][j] === -2) {
          numMinas++;
        }
      }
    }
    return numMinas;
  }
  
  export default floodFill;
  