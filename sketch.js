let tileSize = 32;
let maze = [];
let wallGroup, emptyGroup;
let player;
let playerImg, wallImg, pathImg, finishImg;
let startPos = { x: 0, y: 0 };
let finishPos = { x: 0, y: 0 };
let playerSize = tileSize * 0.8;
let moveSpeed = 2;
let gameWon = false;

function preload() {
  maze = loadStrings('maze.txt');
  
  wallImg = loadImage('assets/wall.png', img => img.resize(tileSize, tileSize));
  pathImg = loadImage('assets/path.png', img => img.resize(tileSize, tileSize));
  playerImg = loadImage('assets/player.png', img => img.resize(tileSize, tileSize));
  finishImg = loadImage('assets/finish.png', img => img.resize(tileSize, tileSize));
}

function setup() {
  let rows = maze.length;
  let cols = maze[0].length;
  createCanvas(cols * tileSize, rows * tileSize);

  wallGroup = new Group();
  emptyGroup = new Group();

  drawMaze();
}

function drawMaze() {
  let startRow, startCol;

  for (let row = 0; row < maze.length; row++) {
    for (let col = 0; col < maze[row].length; col++) {
      let x = col * tileSize + tileSize / 2;
      let y = row * tileSize + tileSize / 2;
      let val = parseInt(maze[row][col]);

      if (val === 1) {
        let wall = createSprite(x, y, tileSize, tileSize);
        wall.addImage(wallImg);
        wall.immovable = true;
        wallGroup.add(wall);
      } else {
        let tile = createSprite(x, y, tileSize, tileSize);
        tile.addImage(val === 3 ? finishImg : pathImg);
        emptyGroup.add(tile);
      }

      if (val === 2) {
        startPos = { x: x, y: y };
        startRow = row;
        startCol = col;
      }

      if (val === 3) {
        finishPos = { x: x, y: y };
      }
    }
  }

  player = createSprite(startPos.x, startPos.y, playerSize, playerSize);
  player.addImage(playerImg);
  player.scale = playerSize / tileSize;
  player.rotation = getInitialDirection(startRow, startCol);
}

function getInitialDirection(row, col) {
  if (col > 0 && (parseInt(maze[row][col - 1]) === 0 || parseInt(maze[row][col - 1]) === 3)) {
    return 270;
  } else if (col < maze[0].length - 1 && (parseInt(maze[row][col + 1]) === 0 || parseInt(maze[row][col + 1]) === 3)) {
    return 90;
  } else if (row > 0 && (parseInt(maze[row - 1][col]) === 0 || parseInt(maze[row - 1][col]) === 3)) {
    return 0;
  } else if (row < maze.length - 1 && (parseInt(maze[row + 1][col]) === 0 || parseInt(maze[row + 1][col]) === 3)) {
    return 180;
  }
  return 0;
}

function draw() {
  background(220);

  if (!gameWon) {
    handleMovement();
    handleCollision();
    checkWin();
  }

  drawSprites();
}

function handleMovement() {
  let velocity = { x: 0, y: 0 };

  if (keyIsDown(LEFT_ARROW)) {
    velocity.x = -moveSpeed;
    player.rotation = 270;
  } else if (keyIsDown(RIGHT_ARROW)) {
    velocity.x = moveSpeed;
    player.rotation = 90;
  } else if (keyIsDown(UP_ARROW)) {
    velocity.y = -moveSpeed;
    player.rotation = 0;
  } else if (keyIsDown(DOWN_ARROW)) {
    velocity.y = moveSpeed;
    player.rotation = 180;
  }

  player.velocity.x = velocity.x;
  player.velocity.y = velocity.y;
}

function handleCollision() {
  player.collide(wallGroup, () => {
    let tileX = Math.floor(player.position.x / tileSize) * tileSize + tileSize / 2;
    let tileY = Math.floor(player.position.y / tileSize) * tileSize + tileSize / 2;
    player.position.x = tileX;
    player.position.y = tileY;
    player.velocity.x = 0;
    player.velocity.y = 0;
  });
}

function checkWin() {
  if (dist(player.position.x, player.position.y, finishPos.x, finishPos.y) < tileSize / 2) {
    gameWon = true;
    player.velocity.x = 0;
    player.velocity.y = 0;
    noLoop();
    document.getElementById('winModal').style.display = 'flex';
  }
}

function restartGame() {
  document.getElementById('winModal').style.display = 'none';
  player.position.x = startPos.x;
  player.position.y = startPos.y;
  player.velocity.x = 0;
  player.velocity.y = 0;
  player.rotation = getInitialDirection(
    Math.floor(startPos.y / tileSize),
    Math.floor(startPos.x / tileSize)
  );
  gameWon = false;
  loop();
}

function closeModal() {
  document.getElementById('winModal').style.display = 'none';
}
