let rocket = document.getElementById("rocket");
let score = 0;
let combo = 0;
let posX = window.innerWidth/2;
let posY = window.innerHeight - 100;
let message = document.getElementById("message");
let scoreDisplay = document.getElementById("score");
let questionDisplay = document.getElementById("question");

let gameStarted = false;
let isPaused = false;

const questions = [
    {q:"Which planet is known as the Red Planet?", options:["Mars","Earth","Jupiter","Venus"], answer:0},
    {q:"Earth's atmosphere is mostly composed of?", options:["Nitrogen","Oxygen","Carbon Dioxide","Hydrogen"], answer:0},
    {q:"The largest planet in our solar system?", options:["Saturn","Jupiter","Neptune","Earth"], answer:1},
    {q:"Which planet has a prominent ring system?", options:["Saturn","Uranus","Mars","Mercury"], answer:0},
    {q:"Earth completes one rotation in?", options:["24 hours","30 days","1 year","12 hours"], answer:0},
    {q:"The Sun is a type of?", options:["Star","Planet","Moon","Asteroid"], answer:0},
    {q:"Which planet is closest to the Sun?", options:["Mercury","Venus","Earth","Mars"], answer:0},
    {q:"The distance light travels in one year is called?", options:["Light-year","Parsec","Astronomical unit","Photon"], answer:0},
    {q:"Moon orbits around?", options:["Earth","Mars","Sun","Venus"], answer:0},
    {q:"Which planet is called the Morning Star?", options:["Venus","Mars","Jupiter","Mercury"], answer:0},
    {q:"The planet with the fastest rotation?", options:["Jupiter","Saturn","Earth","Neptune"], answer:0},
    {q:"The closest star to Earth?", options:["Sun","Proxima Centauri","Sirius","Alpha Centauri"], answer:0},
    {q:"Earth is approximately how old?", options:["4.5 billion years","6 billion years","2 billion years","10 billion years"], answer:0},
    {q:"Which planet has the Great Red Spot?", options:["Jupiter","Mars","Saturn","Neptune"], answer:0},
    {q:"Which planet is known for extreme winds?", options:["Neptune","Mercury","Venus","Mars"], answer:0},
    {q:"The hottest planet in the Solar System?", options:["Venus","Mercury","Mars","Jupiter"], answer:0},
    {q:"Which planet has water ice at its poles?", options:["Mars","Venus","Earth","Mercury"], answer:0},
    {q:"The second largest planet?", options:["Saturn","Jupiter","Neptune","Earth"], answer:0},
    {q:"Moon phase when completely dark?", options:["New Moon","Full Moon","Crescent","Gibbous"], answer:0},
    {q:"Earth's satellite is called?", options:["Moon","Phobos","Deimos","Titan"], answer:0},
    {q:"Which planet spins backward?", options:["Venus","Earth","Mars","Jupiter"], answer:0},
    {q:"Smallest planet in Solar System?", options:["Mercury","Mars","Venus","Earth"], answer:0},
    {q:"Which planet has methane giving it blue color?", options:["Neptune","Earth","Jupiter","Mars"], answer:0},
    {q:"Largest moon of Saturn?", options:["Titan","Europa","Ganymede","Callisto"], answer:0},
    {q:"Red spot on Jupiter is caused by?", options:["Storm","Volcano","Impact","Crater"], answer:0},
    {q:"Planet known for strong magnetic field?", options:["Jupiter","Earth","Mars","Venus"], answer:0},
    {q:"Distance from Earth to Sun?", options:["1 AU","10 AU","0.1 AU","100 AU"], answer:0},
    {q:"Light takes how long from Sun to Earth?", options:["8 minutes","1 hour","1 day","1 second"], answer:0},
    {q:"Which planet has highest mountain?", options:["Mars","Earth","Venus","Jupiter"], answer:0},
    {q:"Which planet has rings besides Saturn?", options:["Uranus","Jupiter","Mars","Earth"], answer:0}
];

let currentQuestion;
let optionsFalling = [];

function startGame() {
    document.getElementById("menu").style.display = "none";
    gameStarted = true;
    newQuestion();
    animateOptions();
    updatePosition();
}

/* 🔥 PAUSE FUNCTION */
function togglePause() {
    if(!gameStarted) return;

    isPaused = !isPaused;
    document.getElementById("pauseBtn").innerText = isPaused ? "▶ Resume" : "⏸ Pause";
}

function newQuestion() {
    currentQuestion = questions[Math.floor(Math.random()*questions.length)];
    questionDisplay.innerText = currentQuestion.q;
    document.querySelectorAll(".option").forEach(o=>o.remove());
    optionsFalling = [];

    const areaWidth = window.innerWidth / 4;
    for(let i=0;i<4;i++){
        let opt = document.createElement("div");
        opt.classList.add("option");
        opt.innerText = currentQuestion.options[i];

        let minX = areaWidth * i + 20;
        let maxX = areaWidth * (i+1) - 120;
        let randX = Math.random() * (maxX - minX) + minX;

        let randY = -50 - Math.random()*200;
        opt.style.left = randX + "px";
        opt.style.top = randY + "px";
        opt.dataset.index = i;

        document.getElementById("game").appendChild(opt);
        optionsFalling.push({el:opt, x:randX, y:randY, speed:2 + Math.random()*2});
    }
}

function updatePosition() {
    rocket.style.left = posX + "px";
    rocket.style.top = posY + "px";
}

function showMessage(text) {
    message.innerText = text;
    setTimeout(()=>message.innerText="",1000);
}

function createExplosion(x,y){
    let boom = document.createElement("div");
    boom.classList.add("explosion");
    boom.innerText="💥";
    boom.style.left = x + "px";
    boom.style.top = y + "px";
    document.getElementById("game").appendChild(boom);
    setTimeout(()=>boom.remove(),500);
}

function checkCollision(optObj){
    if(isPaused) return;

    const rocketRect = rocket.getBoundingClientRect();
    const rect = optObj.el.getBoundingClientRect();

    if(!(rocketRect.right < rect.left || rocketRect.left > rect.right || rocketRect.bottom < rect.top || rocketRect.top > rect.bottom)){
        createExplosion(rect.left,rect.top);

        if(parseInt(optObj.el.dataset.index)===currentQuestion.answer){
            combo++;
            score += 10 + combo*2;
            showMessage("✅ Correct! Combo x"+combo);
        } else {
            combo = 0;
            score -=5;
            showMessage("❌ Wrong!");
        }

        scoreDisplay.innerText = "Score: "+score+" | Combo: x"+combo;
        newQuestion();
    }
}

document.addEventListener("keydown",(e)=>{
    if(!gameStarted || isPaused) return;

    if(e.key==="ArrowLeft") posX -= 40;
    if(e.key==="ArrowRight") posX += 40;
    if(e.key==="ArrowUp") posY -= 40;
    if(e.key==="ArrowDown") posY += 40;

    posX = Math.max(20,Math.min(window.innerWidth-20,posX));
    posY = Math.max(20,Math.min(window.innerHeight-80,posY));
    updatePosition();
});

function animateOptions(){
    if(!isPaused){
        optionsFalling.forEach(opt=>{
            opt.y += opt.speed;
            if(opt.y > window.innerHeight){
                opt.y = -50;
            }
            opt.el.style.top = opt.y + "px";
            checkCollision(opt);
        });
    }
    requestAnimationFrame(animateOptions);
}
