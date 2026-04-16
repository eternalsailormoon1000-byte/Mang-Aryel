const cardImages = [
    "IMAGES/1.png",
    "IMAGES/2.png",
    "IMAGES/3.png",
    "IMAGES/4.png",
    "IMAGES/5.png",
    "IMAGES/6.png",
    "IMAGES/7.png",
    "IMAGES/8.png",
    "IMAGES/9.png",
    "IMAGES/10.png",
];
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;
let moves = 0;
let timer = null;
let seconds = 0;
let minutes = 0;
let maxTimeSeconds = 0;
let currentRows = 0;
let currentCols = 0;


function shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}


function animateShuffle($board, values, callback) {
    const $cards = $board.find('td');
    $cards.find('.inner').css('transform', 'rotateY(180deg)');
    let steps = 0;
    const maxSteps = 5;
    const interval = setInterval(() => {
        shuffle(values);
        $cards.each(function (index) {
            const $card = $(this);
            const value = values[index];
            $card.data('value', value);
            $card.find('.back img').attr('src', encodeURI(value));
        });
        steps += 1;
        if (steps >= maxSteps) {
            clearInterval(interval);
            setTimeout(() => {
                $cards.find('.inner').css('transform', 'rotateY(0deg)');
                if (callback) callback();
            }, 500);
        }
    }, 180);
}


function showOverlay(html) {
    $("#ol").html(html).fadeIn(100);
}


function hideOverlay() {
    $("#ol").fadeOut(300);
}


function formatTime(min, sec) {
    const mm = min.toString().padStart(2, "0");
    const ss = sec.toString().padStart(2, "0");
    return `Time: ${mm}:${ss}`;
}


function updateStatus() {
    const elapsedSeconds = minutes * 60 + seconds;
    if (maxTimeSeconds > 0) {
        const remainingSeconds = Math.max(maxTimeSeconds - elapsedSeconds, 0);
        const remainingMinutes = Math.floor(remainingSeconds / 60);
        const remainingSecs = remainingSeconds % 60;
        $("#time").text(`Time left: ${formatTime(remainingMinutes, remainingSecs)}`);
    } else {
        $("#time").text(formatTime(minutes, seconds));
    }
    $("#moves").text(`Moves: ${moves}`);
}


function getMaxTime(rows, cols) {
    if (rows === 3 && cols === 4) return 25;
    if (rows === 4 && cols === 4) return 30;
    if (rows === 4 && cols === 5) return 40;
    if (rows === 5 && cols === 6) return 50;
    if (rows === 6 && cols === 6) return 60;
    return 60;
}


function failGame() {
    clearInterval(timer);
    lockBoard = true;
    showOverlay(`
        <center>
            <div id="iol">
                <h2>Time's up!</h2>
                <p>You ran out of time and did not win.</p>
                <button onclick="startGame(${currentRows}, ${currentCols})">Retry ${currentRows} x ${currentCols}</button>
                <button onclick="showIntro()">Back to menu</button>
            </div>
        </center>
    `);
}


function startGame(rows, cols) {
    clearInterval(timer);
    currentRows = rows;
    currentCols = cols;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    matches = 0;
    moves = 0;
    seconds = 0;
    minutes = 0;
    updateStatus();


    maxTimeSeconds = getMaxTime(rows, cols);
    const totalCards = rows * cols;
    const pairCount = totalCards / 2;
    const selectedImages = [];
    while (selectedImages.length < pairCount) {
        selectedImages.push(...cardImages);
    }
    selectedImages.length = pairCount;
    const tileValues = shuffle([...selectedImages, ...selectedImages]);


    const $board = $("#game-board");
    $board.empty();


    let index = 0;
    for (let row = 0; row < rows; row++) {
        const $tr = $("<tr>");
        for (let col = 0; col < cols; col++) {
            const value = tileValues[index];
            const imageSrc = encodeURI(value);
            const $td = $(
                `<td class="card" data-value="${value}" data-matched="false">
                    <div class="inner">
                        <div class="front"></div>
                        <div class="back"><img src="${imageSrc}" alt="card image"></div>
                    </div>
                </td>`
            );
            $tr.append($td);
            index += 1;
        }
        $board.append($tr);
    }


    hideOverlay();
    lockBoard = true;
    animateShuffle($board, tileValues, () => {
        lockBoard = false;
        timer = setInterval(() => {
            seconds += 1;
            if (seconds === 60) {
                minutes += 1;
                seconds = 0;
            }
            updateStatus();
            const elapsedSeconds = minutes * 60 + seconds;
            if (elapsedSeconds >= maxTimeSeconds) {
                failGame();
            }
        }, 1000);
    });
}


function flipCard($card) {
    if (lockBoard || $card.data("matched") === true || $card.is(firstCard)) {
        return;
    }


    $card.find(".inner").css("transform", "rotateY(180deg)");


    if (!firstCard) {
        firstCard = $card;
        return;
    }


    secondCard = $card;
    lockBoard = true;
    moves += 1;
    updateStatus();


    const firstValue = firstCard.data("value");
    const secondValue = secondCard.data("value");


    if (firstValue === secondValue) {
        firstCard.data("matched", true);
        secondCard.data("matched", true);
        matches += 1;
        resetBoard();
        if (matches === (parseInt($("#game-board td").length, 10) / 2)) {
            endGame();
        }
    } else {
        setTimeout(() => {
            firstCard.find(".inner").css("transform", "rotateY(0deg)");
            secondCard.find(".inner").css("transform", "rotateY(0deg)");
            resetBoard();
        }, 900);
    }
}


function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}


function endGame() {
    clearInterval(timer);
    const elapsed = minutes === 0 ? `${seconds} seconds` : `${minutes} minute(s) and ${seconds} second(s)`;
    showOverlay(`
        <center>
            <div id="iol">
                <h2>Congratulations!</h2>
                <p>You finished in ${elapsed} with ${moves} moves.</p>
                <button onclick="startGame(4, 4)">Play 4 x 4</button>
                <button onclick="showIntro()">Back to menu</button>
            </div>
        </center>
    `);
}


function showIntro() {
    showOverlay(`
        <center>
            <div id="inst">
                <h3 style="font-weight: bold;">Welcome!</h3>
                <p style="font-weight: bold;">Instructions for the game:</p>
                <ul style="padding-left: 50px;">
                    <li style="font-weight: bold;">Flip two cards to find a matching pair.</li>
                    <li style="font-weight: bold;">If they do not match, they will flip back.</li>
                    <li style="font-weight: bold;">Try to match all pairs in the fewest moves.</li>
                </ul>
                <p style="font-size:18px; font-weight: bold;">Choose a mode:</p>
                <button onclick="startGame(3, 4)">3 x 4</button>
                <button onclick="startGame(4, 4)">4 x 4</button>
                <button onclick="startGame(4, 5)">4 x 5</button>
                <button onclick="startGame(5, 6)">5 x 6</button>
                <button onclick="startGame(6, 6)">6 x 6</button>
            </div>
        </center>
    `);
}


$(document).ready(function () {
    showIntro();
    cards = $("#game-board td");
    $(document).on("click", "#game-board td", function () {
        flipCard($(this));
    });
});
