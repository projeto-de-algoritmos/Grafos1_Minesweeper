let gameEnd = false;
var FIELD_SIZE = 5;

const floodFill = (i, j, matrix) => {
  if (gameEnd) {
    return;
  }

  if (!isValid(i, j)) {
    return;
  }

  const element = document.getElementById(`${ i }${ j }`);
  const open = element.getAttribute('open');

  if (open) {
    return;
  }

  if (matrix[i][j] > 0 && matrix[i][j] !== -1) {
    element.innerHTML = matrix[i][j];
    element.setAttribute('open', true);

    const bombs = document.querySelectorAll('[value="-1"]');
    const opened = document.querySelectorAll('[open="true"]');
    if (bombs.length + opened.length === FIELD_SIZE * FIELD_SIZE) {
      const status = document.getElementById('status');
      status.innerHTML = 'Congratulations! you win!';
      status.hidden = false;
      gameEnd = true;
      const target = document.getElementById('start');
      target.hidden = false;

    }

    return;
  }

  if (matrix[i][j] === 0) {
    element.setAttribute('open', true);
    element.className = 'box zero';

    const bombs = document.querySelectorAll('[value="-1"]');
    const opened = document.querySelectorAll('[open="true"]');
    if (bombs.length + opened.length === FIELD_SIZE * FIELD_SIZE) {
      const status = document.getElementById('status');
      status.innerHTML = 'Congratulations! you win!';
      status.hidden = false;
      gameEnd = true;
      const target = document.getElementById('start');
      target.hidden = false;
    }

    floodFill(i, j - 1, matrix);
    floodFill(i, j + 1, matrix);
    floodFill(i - 1, j, matrix);
    floodFill(i + 1, j, matrix);
  }

  if (matrix[i][j] == -1) {
    element.innerHTML = '<img src=\"./image/bomb.png\"></img>';
    const target = document.getElementById('start');
    target.hidden = false;
 
    const status = document.getElementById('status');
    status.innerHTML = 'Game Over';
    status.hidden = false;
    gameEnd = true;
    return;
  }
}

function flag(event) {
    if (gameEnd) {
        return;
    }

    event.preventDefault();

    const { target } = event;
    target.innerHTML = '<img src=\"./assets/flag.png\"></img>';
    target.className = 'box';

    return false;
}

const onClick = (i, j) => {
  floodFill(parseInt(i), parseInt(j));
}

const random = (max) => Math.floor((Math.random() * 1000) + 1) % max;

const isValid = (x, y) => x >= 0 && x < FIELD_SIZE && y >=0 && y < FIELD_SIZE;

const hasBomb = (x, y, m) => isValid(x, y) && m[x][y] === -1;

const neighbors = (x, y, m) => {
  let n = 0;
  if (hasBomb(x - 1, y - 1, m)) {
    n++;
  }
  if (hasBomb(x, y - 1, m)) {
    n++;
  }
  if (hasBomb(x + 1, y - 1, m)) {
    n++;
  }
  if (hasBomb(x - 1, y, m)) {
    n++;
  }
  if (hasBomb(x + 1, y, m)) {
    n++;
  }
  if (hasBomb(x - 1, y + 1, m)) {
    n++;
  }
  if (hasBomb(x, y + 1, m)) {
    n++;
  }
  if (hasBomb(x + 1, y + 1, m)) {
    n++;
  }
  return n;
}

const field = (max) => {
  let n = 0;
  let m = [];
  for (let i = 0; i < FIELD_SIZE; i++) {
    m[i] = [];
    for (let j = 0; j < FIELD_SIZE; j++) {
      m[i][j] = 0;
    }
  }

  while (n < max) {
    const x = random(FIELD_SIZE);
    const y = random(FIELD_SIZE);

    m[x][y] = -1;
    n++;
  }

  for (let i = 0; i < FIELD_SIZE; i++) {
    for (let j = 0; j < FIELD_SIZE; j++) {
      if (m[i][j] !== -1) {
        m[i][j] = neighbors(i, j, m);
      }
    }
  }

  return m;
}

const start = ({ target }) => {
  gameEnd = false;


  target.hidden = true;
  document.getElementById('opcao').style.display = 'none';
  var radios = document.getElementsByName('nivel');
  var numberOfBombs = 0;
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
        if(radios[i].value == "iniciante"){
          FIELD_SIZE = 4
          numberOfBombs = 2
        }
        if(radios[i].value == "intermediario"){
          FIELD_SIZE = 6
          numberOfBombs = 5
        }
        if(radios[i].value == "experiente"){
          FIELD_SIZE = 8
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


  for (let i = 0; i < FIELD_SIZE; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < FIELD_SIZE; j++) {
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
