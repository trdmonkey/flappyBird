/* * BOARD */

let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

/* #Bird */

let birdWidth = 34; // width/height radio = 408/228 = 17/12
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;    

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

// Vamos a cargar las tuberias
let pipeArray = [];
let pipeWidth = 64; // width/height radio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// fisica
let velocityX = -2;  // las tuberias se mueven a la ezquierda
let velocityY = 0;  // inicializar la velocidad de salto
let gravity = 0.4;   // agregamos gravedad a bird (positiva)

let gameOver = false;
let score = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); // lo usamos para dibujar en el lienzo

    // vamos a dibujar a flappy bird
    /* context.fillStyle = "green"; */
    /* context.fillRect(bird.x, bird.y, bird.width, bird.height); */

    // Ahora vamos a cargar la imagen de flappy bird
    birdImg = new Image();
    birdImg.src = "./h2.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src ="./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);  // pasan las tuberias cada 1.5 segundos
    document.addEventListener("keydown", moveBird);
    document.addEventListener("touchstart", moveBird); // opcion agregada para moviles TOUCH
}

function update () {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // bird
    velocityY += gravity;
    /* bird.y += velocityY; */
    bird.y = Math.max(bird.y + velocityY, 0);  // Vamos aplicar limite de altura actual al salto
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;  // 0.5 porque hay 2 tuberias de arriba y abajo, las 2 suman = 1
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    // clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();  // vamos a remover el primer elemento del arreglo
    }

    // SCORE
    context.fillStyle = "white";
    context.font = "20px sans-serif";
    /* context.fillText("Score: " + score, 10, 40); */
    context.fillText("Score: " + score, 10, 625);

    if (gameOver) {

        var texto = "GAME OVER";
        var fontSize = 24;

        context.font = fontSize + "px Arial";
        var textWidth = context.measureText(texto).width;

        var x = (board.width - textWidth) / 2;
        var y = board.height / 2;

        context.fillStyle = "white";
        context.fillText(texto, x, y);
    }
}

function placePipes () {
    if (gameOver) {
        return;
    }
    
    // (0-1) * pipeHeight / 2
    // 0 => -128 (pipeHeight/4)
    // 1 => -128 - 256 (pipeHeight/4 - pipeHeight/2) = -3/4 pipeHeight
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openigSpace = board.height/4;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openigSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX" || e.type == "touchstart" || e.code == "KeyS") {
        // Saltar
        velocityY = -6;

        // Reset Game
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return  a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}