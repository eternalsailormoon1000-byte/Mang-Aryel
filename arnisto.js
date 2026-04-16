let score = 0;
let combo = 0;
let playerHP = 100;
let enemyHP = 100;
let gameRunning = false;
let canInput = false;
let loopRunning = false;

const scoreEl = document.getElementById("score");
const comboEl = document.getElementById("combo");
const messageEl = document.getElementById("message");

const leftStick = document.getElementById("leftStick");
const rightStick = document.getElementById("rightStick");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

// New prompt elements
const gamePrompt = document.getElementById("gamePrompt");
const promptButtons = document.getElementById("promptButtons");
const playBtn = document.getElementById("playBtn");
const exitBtn = document.getElementById("exitBtn");

const playerHPBar = document.getElementById("playerHP");
const enemyHPBar = document.getElementById("enemyHP");

const bgArtImg = document.getElementById("bgArtImg");
const enemyStick = document.getElementById("enemyStick");

/* BIGGER BACKGROUND */
const defaultBG = {
  file: "IMAGES/IMG_1329.PNG",
  width: "1000px"
};

const commands = [
  {
    text: "HIGH STRIKE",
    key: "w",
    anim: "block-up",
    enemyAnim: "enemy-right",
    file: "IMAGES/IMG_1330.PNG",
    width: "1000px"
  },
  {
    text: "LOW STRIKE",
    key: "s",
    anim: "block-down",
    enemyAnim: "enemy-left",
    file: "IMAGES/IMG_1331.PNG",
    width: "1000px"
  },
  {
    text: "LEFT STRIKE",
    key: "a",
    anim: "strike-left",
    enemyAnim: "enemy-left",
    file: "IMAGES/IMG_1332.PNG",
    width: "1000px"
  },
  {
    text: "RIGHT STRIKE",
    key: "d",
    anim: "strike-right",
    enemyAnim: "enemy-right",
    file: "IMAGES/IMG_1336.PNG",
    width: "1000px"
  }
];

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function setBG(config) {
  bgArtImg.src = config.file;
  bgArtImg.style.width = config.width;
}

function updateHP() {
  playerHP = Math.max(0, playerHP);
  enemyHP = Math.max(0, enemyHP);

  playerHPBar.style.width = playerHP + "%";
  enemyHPBar.style.width = enemyHP + "%";
}

function resetPlayer() {
  leftStick.className = "stick";
  rightStick.className = "stick";
}

function playPlayer(anim) {
  resetPlayer();

  void leftStick.offsetWidth;
  void rightStick.offsetWidth;

  leftStick.classList.add(anim);
  rightStick.classList.add(anim);
}

function playEnemy(anim) {
  enemyStick.classList.remove("enemy-left", "enemy-right");

  void enemyStick.offsetWidth;

  enemyStick.classList.add(anim);
}

function resetGameState() {
  score = 0;
  combo = 0;
  playerHP = 100;
  enemyHP = 100;

  gameRunning = false;
  canInput = false;

  scoreEl.textContent = score;
  comboEl.textContent = combo;
  messageEl.textContent = "";

  updateHP();
  resetPlayer();
  setBG(defaultBG);
}

async function gameLoop() {
  if (loopRunning) return;

  loopRunning = true;
  gameRunning = true;

  restartBtn.style.display = "none";

  while (gameRunning) {
    const cmd = commands[Math.floor(Math.random() * commands.length)];

    /* PREP PHASE */
    messageEl.textContent = "Enemy preparing...";
    setBG(defaultBG);

    await wait(700);

    /* ATTACK PHASE */
    messageEl.textContent = "Enemy: " + cmd.text;
    setBG(cmd);

    playEnemy(cmd.enemyAnim);

    canInput = true;
    let success = false;

    const keyHandler = function (e) {
      if (!canInput) return;

      if (e.key.toLowerCase() === cmd.key) {
        success = true;
        canInput = false;

        playPlayer(cmd.anim);
      }
    };

    document.addEventListener("keydown", keyHandler);

    const startTime = Date.now();
    const reactionTime = 900;

    while (Date.now() - startTime < reactionTime) {
      if (success) break;
      await wait(10);
    }

    document.removeEventListener("keydown", keyHandler);
    canInput = false;

    /* RESULT */
    if (success) {
      score += 10;
      combo += 1;
      enemyHP -= 10;
      messageEl.textContent = "✔ Hit!";
    } else {
      combo = 0;
      playerHP -= 10;
      messageEl.textContent = "✖ Miss!";
    }

    updateHP();
    scoreEl.textContent = score;
    comboEl.textContent = combo;

    await wait(700);

    /* RESET VISUAL */
    setBG(defaultBG);
    resetPlayer();

    /* END CONDITIONS */
    if (playerHP <= 0) {
      messageEl.textContent = "💀 You lost";
      gameRunning = false;
      break;
    }

    if (enemyHP <= 0) {
      messageEl.textContent = "🏆 You win!";
      gameRunning = false;
      break;
    }
  }

  loopRunning = false;
  restartBtn.style.display = "inline-block";
}

/* BUTTONS */
startBtn.onclick = () => {
  startBtn.style.display = "none";
  resetGameState();
  gameLoop();
};

restartBtn.onclick = () => {
  resetGameState();
  gameLoop();
};

// NEW PROMPT FUNCTIONS
function startGame() {
  // Check if prompt elements exist before trying to hide them
  const gamePrompt = document.getElementById("gamePrompt");
  const promptButtons = document.getElementById("promptButtons");
  
  if (gamePrompt) gamePrompt.style.display = "none";
  if (promptButtons) promptButtons.style.display = "none";
  
  startBtn.style.display = "inline-block";
  resetGameState();
  gameLoop();
}

function exitToStore() {
  window.location.href = 'index.html?view=store';
}

/* INIT */
updateHP();
setBG(defaultBG);
