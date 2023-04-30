let gameEnd = false;
var fieldSize = 1;

const start = ({ target }) => {
  gameEnd = false;

  target.hidden = true;
  document.getElementById('option').style.display = 'none';
  var radios = document.getElementsByName('level');
  var numberOfBombs = 0;
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
        if(radios[i].value == "beginner"){
          fieldSize = 4
          numberOfBombs = 2
        }
        if(radios[i].value == "intermediary"){
          fieldSize = 6
          numberOfBombs = 5
        }
        if(radios[i].value == "experient"){
          fieldSize = 8
          numberOfBombs = 10
        }  
    }  
  }


  const fieldElement = document.getElementById('field');
  fieldElement.innerHTML = '';
  const status = document.getElementById('status');
  status.innerHTML = '';
  status.hidden = true;
  const matrix = field(numberOfBombs);


  for (let i = 0; i < fieldSize; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < fieldSize; j++) {
      const cell = document.createElement('td');
      cell.onclick = () => floodFill(i, j, matrix);
      cell.oncontextmenu = (event) => flag(event);
      cell.setAttribute('id', `${ i }${ j }`);
      cell.setAttribute('value', matrix[i][j]);
      cell.className = 'box';
      row.appendChild(cell);
    }
    fieldElement.appendChild(row);
  }
};

const floodFill = (i, j, matrix) => {
 
  if (gameEnd || (!isValid(i, j))) {
    return;
  }

  const element = document.getElementById(`${ i }${ j }`);
  if (element.getAttribute('open')) {
    return;
  }

  const value = matrix[i][j];

  // Se a célula contém uma bomba, termine o jogo
  if (value == -1) {
    element.innerHTML = '<img src=\"./image/bomb.png\"></img>';
    const target = document.getElementById('start');
    target.hidden = false;
 
    const status = document.getElementById('status');
    status.innerHTML = 'Game Over';
    status.hidden = false;

    //botao de reload
    const reloadButton = document.getElementById('reloadButton');
    reloadButton.innerHTML = 'Reload';
    reloadButton.hidden = false;

    gameEnd = true;
    return;
  }

  // Abra a célula e atualize o número de células abertas
  element.setAttribute('open', true);
  const bombs = document.querySelectorAll('[value="-1"]');
  const opened = document.querySelectorAll('[open="true"]');
  if (bombs.length + opened.length === fieldSize * fieldSize) {
    const status = document.getElementById('status');
    status.innerHTML = 'Congratulations! you win!';
    status.hidden = false;

    //botao de reload
    const reloadButton = document.getElementById('reloadButton');
    reloadButton.innerHTML = 'Reload';
    reloadButton.hidden = false;

    gameEnd = true;
    target.hidden = false;
  }

  // Se a célula não contém uma bomba ou um número, abra as células adjacentes
  if (value === 0) {
    element.className = 'box zero';
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (const [di, dj] of directions) {
      floodFill(i + di, j + dj, matrix);
    }
  } else {
    element.innerHTML = value;
  }
};


function flag(event) {
    if (gameEnd) {
        return;
    }

    event.preventDefault();

    const { target } = event;
    target.innerHTML = '<img src=\"./image/flag.png\"></img>';
    target.className = 'box';

    return false;
}

const onClick = (i, j) => {
  floodFill(parseInt(i), parseInt(j));
}

const random = (max) => Math.floor((Math.random() * 1000) + 1) % max;

const isValid = (x, y) => x >= 0 && x < fieldSize && y >=0 && y < fieldSize;

const hasBomb = (x, y, m) => isValid(x, y) && m[x][y] === -1;

const neighbors = (x, y, m) => {
  let n = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (hasBomb(x + i, y + j, m)) {
        n++;
      }
    }
  }
  return n;
}

const field = (max) => {
  let n = 0;
  let m = [];
  for (let i = 0; i < fieldSize; i++) {
    m[i] = [];
    for (let j = 0; j < fieldSize; j++) {
      m[i][j] = 0;
    }
  }

  while (n < max) {
    const x = random(fieldSize);
    const y = random(fieldSize);

    m[x][y] = -1;
    n++;
  }

  for (let i = 0; i < fieldSize; i++) {
    for (let j = 0; j < fieldSize; j++) {
      if (m[i][j] !== -1) {
        m[i][j] = neighbors(i, j, m);
      }
    }
  }

  return m;
}

