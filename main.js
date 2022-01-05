const cnv = document.querySelector('canvas');
const ctx = cnv.getContext('2d');

const start = document.querySelector('#start');
const pause = document.querySelector('#pause');
const clear = document.querySelector('#clear');
const random = document.querySelector('#random');

const N = 100;
const GRID_SIZE = 500;
const CELL_SIZE = GRID_SIZE / N;

let paused = false;

cnv.width = GRID_SIZE;
cnv.height = GRID_SIZE;

const grid = new NArray(new Vector(N, N));
grid.fill(0);

function init() {
  grid.fill(0);

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (Math.random() < 0.5) {
        grid.set([x, y], 1);
      }
    }
  }

  drawGrid();
}

function drawGrid() {
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const b = grid.get([x, y]) * 255;

      ctx.fillStyle = rgb(b);      
      ctx.fillRect(
        x * CELL_SIZE,
        y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }
}

function updateGrid() {
  if (paused === true) return;

  setTimeout(() => requestAnimationFrame(updateGrid), 100);

  const buffer = grid.clone();

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const self = grid.get([x, y]);
      const neighbors = grid.getNeighbors([x, y]);
      const alive = neighbors.filter((cell) => cell === 1).length;

      if (self === 0 && alive === 3) {
        buffer.set([x, y], 1);
        continue;
      }

      if (!(self === 1 && (alive === 2 || alive === 3))) {
        buffer.set([x, y], 0);
      }
    }
  }

  grid.setAll(buffer.getRaw());
  drawGrid();
}

function handleClick(e) {
  const position = new Vector(
    e.offsetX,
    e.offsetY
  );

  const location = position
    .div(CELL_SIZE)
    .floor();

  const currentValue = grid.get(location);
  grid.set(location, Number(!currentValue));

  drawGrid();
}

function clearGrid() {
  grid.fill(0);
  drawGrid();
}

cnv.addEventListener('click', handleClick);
clear.addEventListener('click', clearGrid);
random.addEventListener('click', init);
pause.addEventListener('click', () => paused = true);
start.addEventListener('click', () => {
  paused = false;
  updateGrid();
});

init();
