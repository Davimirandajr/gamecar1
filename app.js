const score = document.querySelector(".score");
const scoreVal = document.getElementById("scoreVal");
const playerNameDisplay = document.getElementById("playerName");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");
const gameOverText = document.querySelector(".gameOver");
const nameInput = document.getElementById("nameInput");
const carAudio = document.getElementById("carAudio");
const explosionAudio = document.getElementById("explosionAudio");

let player = {
    speed: 5,
    score: 0,
    name: "",
    start: false,
    x: 0,
    y: 0,
};

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
};

function keyDown(e) {
    if (player.start) {
        e.preventDefault();
        if (keys.hasOwnProperty(e.key)) {
            keys[e.key] = true;
        }
    }
}

function keyUp(e) {
    if (player.start) {
        e.preventDefault();
        if (keys.hasOwnProperty(e.key)) {
            keys[e.key] = false;
        }
    }
}

function gamePlay() {
    let car = document.querySelector(".car");
    if (!car) {
       
        endGame();
        return;
    }

    let road = gameArea.getBoundingClientRect();

    if (player.start) {
        moveLines();
        moveEnemyCar(car);

        if (keys.ArrowUp && player.y > road.top + 150) player.y -= player.speed;
        if (keys.ArrowDown && player.y < road.bottom - 80) player.y += player.speed;
        if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
        if (keys.ArrowRight && player.x < road.width - 70) player.x += player.speed;

        car.style.top = player.y + "px";
        car.style.left = player.x + "px";

        window.requestAnimationFrame(gamePlay);

        player.score++;
        scoreVal.textContent = player.score;

        if (player.score % 500 === 0) {
            player.speed++;
            changeBackground();
        }
    }
}

function moveLines() {
    let lines = document.querySelectorAll(".line");
    lines.forEach(line => {
        if (line.y >= 700) line.y -= 750;
        line.y += player.speed;
        line.style.top = line.y + "px";
    });
}

function isCollide(car, enemyCar) {
    let carRect = car.getBoundingClientRect();
    let enemyCarRect = enemyCar.getBoundingClientRect();

    return !(
        carRect.top > enemyCarRect.bottom ||
        carRect.left > enemyCarRect.right ||
        carRect.right < enemyCarRect.left ||
        carRect.bottom < enemyCarRect.top
    );
}

function moveEnemyCar(car) {
    let enemyCars = document.querySelectorAll(".enemyCar");
    enemyCars.forEach(enemyCar => {
        if (isCollide(car, enemyCar)) {
            car.classList.add("crashed");
            endGame();
        }
        if (enemyCar.y >= 750) {
            enemyCar.y = -300;
            enemyCar.style.left = Math.floor(Math.random() * 350) + "px";
        }
        enemyCar.y += player.speed;
        enemyCar.style.top = enemyCar.y + "px";
    });
}

function startGame() {
    const name = nameInput.value.trim();
    if (!name) {
        alert("Digite seu nome para começar.");
        return;
    }

    player.name = name;
    playerNameDisplay.textContent = name;

    score.classList.remove("hide");
    startScreen.classList.add("hide");
    gameOverText.classList.add("hide");
    gameArea.classList.remove("hide");  
    gameArea.innerHTML = "";

    player.start = true;
    player.score = 0;
    player.speed = 5;
       carAudio.loop = true;
    carAudio.play();

    for (let i = 0; i < 5; i++) {
        let roadLine = document.createElement("div");
        roadLine.setAttribute("class", "line");
        roadLine.y = i * 150;
        roadLine.style.top = roadLine.y + "px";
        gameArea.appendChild(roadLine);
    }

    let car = document.createElement("div");
    car.setAttribute("class", "car");
    gameArea.appendChild(car);

    
    player.x = car.offsetLeft || gameArea.offsetWidth / 2 - 35;
    player.y = car.offsetTop || gameArea.offsetHeight - 150;
    car.style.left = player.x + "px";
    car.style.top = player.y + "px";

    for (let i = 0; i < 3; i++) {
        let enemyCar = document.createElement("div");
        enemyCar.setAttribute("class", "enemyCar");
        enemyCar.y = (i + 1) * 350 * -1;
        enemyCar.style.top = enemyCar.y + "px";
        enemyCar.style.left = Math.floor(Math.random() * 350) + "px";
        enemyCar.style.backgroundImage = `url("./images/car${i + 1}.png")`; 
        gameArea.appendChild(enemyCar);
    }

    window.requestAnimationFrame(gamePlay);
}

function endGame() {
    player.start = false;
    gameOverText.classList.remove("hide");   
    gameArea.classList.add("hide");          
    score.classList.add("hide");             
    startScreen.classList.add("hide");       
     carAudio.pause();
    carAudio.currentTime = 0;


        explosionAudio.play();
    gameOverText.addEventListener('click', showStartScreenOnce);
    
}

function showStartScreenOnce() {
    gameOverText.classList.add("hide");      
    startScreen.classList.remove("hide");   

    
    gameOverText.removeEventListener('click', showStartScreenOnce);
}


function changeBackground() {

    const colors = ["#444", "#555", "#666", "#777", "#888"];
    let idx = Math.floor(player.speed / 2) % colors.length;
    gameArea.style.backgroundColor = colors[idx];
}
