/* ================= SETTINGS ================= */
let chances = 10;
let JACKPOT_PROBABILITY = 0.1; // 🔧 EDIT THIS (0.01 = 1%, 0.1 = 10%)

/* STATE */
let spinning = false;
let gameOver = false;
let cooldown = false;

/* SOUND */
function playSound(id) {
    let sound = document.getElementById(id);
    sound.currentTime = 0;
    sound.play();
}

/* UI */
function updateUI() {
    document.getElementById("info").innerText = "Chances: " + chances;
}

/* RANDOM 1–7 */
function getRandomNumber() {
    let r = Math.random();

    if (r < 0.18) return 1;
    if (r < 0.35) return 2;
    if (r < 0.50) return 3;
    if (r < 0.65) return 4;
    if (r < 0.80) return 5;
    if (r < 0.92) return 6;
    return 7;
}

/* JACKPOT */
function forceJackpot() {
    let value = Math.floor(Math.random() * 7) + 1;
    return [value, value, value, value, value];
}

function maybeJackpot() {
    return Math.random() < JACKPOT_PROBABILITY;
}

/* SPIN */
function spinSlots() {
    let slots = [
        document.getElementById("s1"),
        document.getElementById("s2"),
        document.getElementById("s3"),
        document.getElementById("s4"),
        document.getElementById("s5")
    ];

    return new Promise(resolve => {

        slots.forEach(s => s.classList.add("spinning"));

        let interval = setInterval(() => {
            slots.forEach(s => {
                s.innerText = Math.floor(Math.random() * 7) + 1;
            });
        }, 70);

        setTimeout(() => {
            clearInterval(interval);

            let results = maybeJackpot()
                ? forceJackpot()
                : slots.map(() => getRandomNumber());

            slots.forEach((s, i) => {
                s.innerText = results[i];
                s.classList.remove("spinning");
            });

            resolve(results);
        }, 1500);
    });
}

/* RESULT */
function checkResult(res) {
    let counts = {};

    res.forEach(n => {
        counts[n] = (counts[n] || 0) + 1;
    });

    let maxSame = Math.max(...Object.values(counts));

    if (maxSame === 5) {
        document.getElementById("result").innerText = "💰 JACKPOT!!!";
        playSound("jackpotSound");
    }
    else if (maxSame >= 3) {
        document.getElementById("result").innerText = "🎉 YOU WIN!";
        playSound("winSound");
    }
    else {
        document.getElementById("result").innerText = "😐 No luck...";
        playSound("loseSound");
    }
}

/* LEVER + ANTI SPAM */
async function pullLever() {
    if (spinning || gameOver || cooldown) return;

    cooldown = true;

    if (chances <= 0) {
        document.getElementById("result").innerText = "❌ No chances left!";
        gameOver = true;
        cooldown = false;
        return;
    }

    let lever = document.getElementById("lever");

    playSound("leverSound");

    lever.classList.add("pull");
    setTimeout(() => lever.classList.remove("pull"), 250);

    spinning = true;
    chances--;
    updateUI();

    let results = await spinSlots();
    checkResult(results);

    spinning = false;

    if (chances <= 0) {
        gameOver = true;
        document.getElementById("result").innerText += " | GAME OVER";
    }

    setTimeout(() => {
        cooldown = false;
    }, 500);
}

/* KEY CONTROL */
document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "c") {
        pullLever();
    }
});

/* RESTART */
function restart() {
    chances = 10;
    spinning = false;
    gameOver = false;
    cooldown = false;

    updateUI();

    document.getElementById("result").innerText = "Game restarted 🔄";

    for (let i = 1; i <= 5; i++) {
        document.getElementById("s" + i).innerText = "❔";
    }
}