const player = document.getElementById("player");

const scoreText = document.getElementById("score");
const ecoText = document.getElementById("eco");
const energyText = document.getElementById("energy");
const moneyText = document.getElementById("money");
const levelText = document.getElementById("level");

const weatherText = document.getElementById("weather");

const message = document.getElementById("message");

const dayNight = document.getElementById("dayNight");

let playerX = 120;

let score = 0;
let eco = 100;
let energy = 100;
let money = 0;
let level = 1;

let speed = 5;

let gameStarted = false;

/* itens */
const goodItems = [
  "🌱","☀️","💧","🤖","🚁","🌾","🔋"
];

const badItems = [
  "☠️","🔥","🛢️","💨","🧪"
];

/* iniciar */
document.getElementById("startBtn").onclick = ()=>{

  gameStarted = true;

  document.getElementById("startScreen")
    .style.display = "none";

  setInterval(createItem,700);

  gameLoop();

  weatherLoop();

  dayNightLoop();
};

/* mover */
document.addEventListener("keydown",(e)=>{

  if(!gameStarted) return;

  if(e.key === "ArrowLeft"){
    playerX -= 45;
  }

  if(e.key === "ArrowRight"){
    playerX += 45;
  }

  if(playerX < 0){
    playerX = 0;
  }

  if(playerX > window.innerWidth - 100){
    playerX = window.innerWidth - 100;
  }

  player.style.left = playerX + "px";
});

/* criar itens */
function createItem(){

  const item = document.createElement("div");

  item.classList.add("item");

  const good = Math.random() > 0.3;

  if(good){

    item.innerHTML =
      goodItems[Math.floor(Math.random()*goodItems.length)];

    item.dataset.type = "good";

  }else{

    item.innerHTML =
      badItems[Math.floor(Math.random()*badItems.length)];

    item.dataset.type = "bad";
  }

  item.style.left =
    Math.random() * (window.innerWidth - 50) + "px";

  item.style.animationDuration =
    speed + "s";

  document.getElementById("game")
    .appendChild(item);

  detectCollision(item);
}

/* colisão */
function detectCollision(item){

  const timer = setInterval(()=>{

    const itemRect = item.getBoundingClientRect();

    const playerRect =
      player.getBoundingClientRect();

    if(
      itemRect.left < playerRect.right &&
      itemRect.right > playerRect.left &&
      itemRect.top < playerRect.bottom &&
      itemRect.bottom > playerRect.top
    ){

      if(item.dataset.type === "good"){

        score += 10;
        eco += 2;
        energy += 1;
        money += 5;

        showMessage("Tecnologia sustentável +10 🌱");

        player.classList.add("glow");

        setTimeout(()=>{
          player.classList.remove("glow");
        },300);

      }else{

        eco -= 12;
        energy -= 10;

        showMessage("Poluição atingiu a fazenda ☠️");
      }

      updateHUD();

      levelSystem();

      item.remove();

      clearInterval(timer);
    }

    if(itemRect.top > window.innerHeight){

      item.remove();

      clearInterval(timer);
    }

  },30);
}

/* atualizar hud */
function updateHUD(){

  if(eco > 100) eco = 100;
  if(energy > 100) energy = 100;

  scoreText.innerText = score;
  ecoText.innerText = eco;
  energyText.innerText = energy;
  moneyText.innerText = money;
  levelText.innerText = level;
}

/* níveis */
function levelSystem(){

  if(score >= 100 && level == 1){

    level = 2;
    speed = 4;

    showMessage("🚀 Nível 2 desbloqueado");
  }

  if(score >= 250 && level == 2){

    level = 3;
    speed = 3;

    showMessage("🤖 Agro Inteligente");
  }

  if(score >= 500 && level == 3){

    level = 4;
    speed = 2;

    showMessage("🌎 Futuro Sustentável");
  }

  if(score >= 900){

    victory();
  }
}

/* clima */
function weatherLoop(){

  setInterval(()=>{

    const weather = Math.floor(Math.random()*3);

    if(weather == 0){

      weatherText.innerHTML =
        "☀️ ENSOLARADO";

      energy += 5;
    }

    if(weather == 1){

      weatherText.innerHTML =
        "🌧️ CHUVOSO";

      createRain();
    }

    if(weather == 2){

      weatherText.innerHTML =
        "🌪️ TEMPESTADE";

      eco -= 5;
    }

    updateHUD();

  },10000);
}

/* chuva */
function createRain(){

  for(let i=0;i<80;i++){

    const rain = document.createElement("div");

    rain.classList.add("rain");

    rain.style.left =
      Math.random()*window.innerWidth + "px";

    rain.style.animationDuration =
      (0.5 + Math.random()) + "s";

    document.getElementById("game")
      .appendChild(rain);

    setTimeout(()=>{
      rain.remove();
    },1500);
  }
}

/* dia/noite */
function dayNightLoop(){

  let day = true;

  setInterval(()=>{

    if(day){

      dayNight.style.background =
        "linear-gradient(to bottom,#06163a,#0d245e)";

    }else{

      dayNight.style.background =
        "linear-gradient(to bottom,#6ec6ff,#dff7ff)";
    }

    day = !day;

  },15000);
}

/* loja */
function buyDrone(){

  if(money >= 50){

    money -= 50;

    score += 60;

    showMessage("🚁 Drone ativado");

    updateHUD();

  }else{

    showMessage("💰 Créditos insuficientes");
  }
}

function buySolar(){

  if(money >= 80){

    money -= 80;

    energy += 40;

    showMessage("☀️ Energia solar instalada");

    updateHUD();

  }else{

    showMessage("💰 Créditos insuficientes");
  }
}

function buyForest(){

  if(money >= 60){

    money -= 60;

    eco += 30;

    showMessage("🌳 Área reflorestada");

    updateHUD();

  }else{

    showMessage("💰 Créditos insuficientes");
  }
}

function buyRobot(){

  if(money >= 120){

    money -= 120;

    score += 120;

    showMessage("🤖 Robô agrícola online");

    updateHUD();

  }else{

    showMessage("💰 Créditos insuficientes");
  }
}

/* loop principal */
function gameLoop(){

  setInterval(()=>{

    energy -= 1;

    if(eco <= 0 || energy <= 0){

      gameOver();
    }

    updateHUD();

  },2000);
}

/* mensagens */
function showMessage(text){

  message.innerHTML = text;

  message.style.display = "block";

  setTimeout(()=>{
    message.style.display = "none";
  },1600);
}

/* derrota */
function gameOver(){

  alert(`
☠️ FIM DE JOGO

A fazenda entrou em colapso.

Pontuação: ${score}
  `);

  location.reload();
}

/* vitória */
function victory(){

  alert(`
🏆 VOCÊ SALVOU O FUTURO!

✔ produção sustentável
✔ preservação ambiental
✔ tecnologia inteligente
✔ agro forte

Pontuação final: ${score}
  `);

  location.reload();
}