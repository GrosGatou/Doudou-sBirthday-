const screens = {
  home: document.getElementById("screen-home"),
  menu: document.getElementById("screen-menu"),
  game1: document.getElementById("screen-game1"),
  game2: document.getElementById("screen-game2"),
  game3: document.getElementById("screen-game3"),
  final: document.getElementById("screen-final"),
};

const startBtn = document.getElementById("start-btn");
const cardGame1 = document.getElementById("card-game1");
const cardGame2 = document.getElementById("card-game2");
const cardGame3 = document.getElementById("card-game3");
const progressFill = document.getElementById("global-progress-fill");
const progressBar = document.getElementById("global-progress");

const popup = document.getElementById("popup");
const popupContent = document.getElementById("popup-content");

let completedGames = 0;
let game1Done = false;
let game2Done = false;
let game3Done = false;

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
}

function openPopup(html) {
  popupContent.innerHTML = html;
  popup.classList.remove("hidden");
}

function closePopup() {
  popup.classList.add("hidden");
}

popup.addEventListener("click", (e) => {
  if (e.target === popup) closePopup();
});

function updateProgress() {
  const percent = (completedGames / 3) * 100;
  progressFill.style.width = `${percent}%`;
  if (completedGames === 3) {
    progressBar.classList.add("ready");
  } else {
    progressBar.classList.remove("ready");
  }
}

function markGameComplete(gameNum) {
  if (gameNum === 1 && !game1Done) {
    game1Done = true;
    cardGame1.classList.add("unlocked");
    completedGames++;
  }
  if (gameNum === 2 && !game2Done) {
    game2Done = true;
    cardGame2.classList.add("unlocked");
    completedGames++;
  }
  if (gameNum === 3 && !game3Done) {
    game3Done = true;
    cardGame3.classList.add("unlocked");
    completedGames++;
  }
  updateProgress();
}

startBtn.addEventListener("click", () => {
  showScreen("menu");
});

cardGame1.addEventListener("click", () => {
  showScreen("game1");
  setupGame1();
});

cardGame2.addEventListener("click", () => {
  showScreen("game2");
  setupGame2();
});

cardGame3.addEventListener("click", () => {
  showScreen("game3");
  setupGame3();
});

progressBar.addEventListener("click", () => {
  if (completedGames === 3) {
    showScreen("final");
  }
});

/* GAME 1 */
let game1Running = false;
let game1Score = 0;
let game1Malus = 0;
let game1Timer = 10;
let game1Interval = null;
let game1Spawner = null;
let game1GridBuilt = false;

const scoreEl = document.getElementById("score");
const malusEl = document.getElementById("malus");
const timerEl = document.getElementById("timer");
const gridEl = document.getElementById("game1-grid");
const minusAnim = document.getElementById("minus-anim");
const startGame1Btn = document.getElementById("start-game1");

function clearGame1() {
  gridEl.innerHTML = "";
  for (let i = 0; i < 25; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    gridEl.appendChild(cell);
  }
  game1GridBuilt = true;
}

function randomItem() {
  return Math.random() < 0.65 ? "vache" : "courgette";
}

function spawnGame1Item() {
  const cells = [...document.querySelectorAll("#game1-grid .cell")];
  cells.forEach(c => c.innerHTML = "");
  const index = Math.floor(Math.random() * cells.length);
  const type = randomItem();
  const img = document.createElement("img");
  img.src = type === "vache" ? "vache.png" : "courgette.png";
  img.alt = type;

  img.addEventListener("click", () => {
    if (!game1Running) return;

    if (type === "vache") {
      game1Score += 1;
      scoreEl.textContent = game1Score;
    } else {
      game1Score -= 1;
      game1Malus += 1;
      scoreEl.textContent = game1Score;
      malusEl.textContent = game1Malus;

      minusAnim.classList.add("show");
      const rect = img.getBoundingClientRect();
      minusAnim.style.left = `${rect.left + rect.width / 2}px`;
      minusAnim.style.top = `${rect.top + rect.height / 2}px`;
      setTimeout(() => minusAnim.classList.remove("show"), 350);
    }

    if (game1Score >= 6) {
      endGame1(true);
    }
  });

  cells[index].appendChild(img);
}

function endGame1(success) {
  game1Running = false;
  clearInterval(game1Interval);
  clearInterval(game1Spawner);

  if (success) {
    openPopup(`
      <img src="steack.png" alt="Steack">
      <h3>Bravo, voilà ton steack !</h3>
      <p>Alors lui tu l’as pas volé !</p>
      <button id="back-menu-1">Retour aux mini-jeux</button>
    `);

    document.getElementById("back-menu-1").addEventListener("click", () => {
      closePopup();
      showScreen("menu");
      markGameComplete(1);
    });
  } else {
    openPopup(`
      <h3>Tu mérites pas ton steack</h3>
      <button id="retry-game-1">Recommencer</button>
    `);

    document.getElementById("retry-game-1").addEventListener("click", () => {
      closePopup();
      showScreen("game1");
      setupGame1();
    });
  }
}

function setupGame1() {
  if (!game1GridBuilt) clearGame1();

  game1Running = false;
  game1Score = 0;
  game1Malus = 0;
  game1Timer = 10;

  scoreEl.textContent = "0";
  malusEl.textContent = "0";
  timerEl.textContent = "10";

  clearInterval(game1Interval);
  clearInterval(game1Spawner);
  [...document.querySelectorAll("#game1-grid .cell")].forEach(c => c.innerHTML = "");

  startGame1Btn.onclick = () => {
    if (game1Running) return;

    game1Running = true;
    game1Score = 0;
    game1Malus = 0;
    game1Timer = 10;
    scoreEl.textContent = "0";
    malusEl.textContent = "0";
    timerEl.textContent = "10";

    spawnGame1Item();
    game1Spawner = setInterval(spawnGame1Item, 900);

    game1Interval = setInterval(() => {
      game1Timer -= 1;
      timerEl.textContent = game1Timer;

      if (game1Timer <= 0) {
        if (game1Score >= 6) {
          endGame1(true);
        } else {
          endGame1(false);
        }
      }
    }, 1000);
  };
}

/* GAME 2 */
const heart = document.getElementById("heart");
let heartClicks = 0;

function setupGame2() {
  heartClicks = game2Done ? 10 : 0;
  heart.style.left = "50%";
  heart.style.top = "45%";
  heart.style.transform = "translate(-50%, -50%) scale(1)";
}

heart.addEventListener("click", () => {
  if (!screens.game2.classList.contains("active")) return;

  if (heartClicks >= 10) return;

  heartClicks += 1;
  const scale = 1 + heartClicks * 0.08;
  const maxX = window.innerWidth - 120;
  const maxY = window.innerHeight - 140;
  const x = 60 + Math.random() * maxX;
  const y = 120 + Math.random() * maxY;

  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.style.transform = `translate(-50%, -50%) scale(${scale})`;

  if (heartClicks >= 10) {
    openPopup(`
      <img src="cadenas.png" alt="Cadenas">
      <h3>Tiens mon cœur, fais-en bon usage</h3>
      <button id="back-menu-2">Retour aux mini-jeux</button>
    `);

    document.getElementById("back-menu-2").addEventListener("click", () => {
      closePopup();
      showScreen("menu");
      markGameComplete(2);
    });
  }
});

/* GAME 3 */
const kingPiece = document.getElementById("king-piece");
const bedZone = document.getElementById("bed-zone");
let kingDropped = false;

function setupGame3() {
  kingDropped = false;
  kingPiece.style.left = "10%";
  kingPiece.style.top = "20%";
}

kingPiece.addEventListener("dragstart", (e) => {
  if (kingDropped) return;
  e.dataTransfer.setData("text/plain", "king");
});

bedZone.addEventListener("dragover", (e) => {
  e.preventDefault();
});

bedZone.addEventListener("drop", (e) => {
  e.preventDefault();
  if (kingDropped) return;

  kingDropped = true;
  openPopup(`
    <img src="RoiCouetteCouette.png" alt="Roi Couette-Couette">
    <h3>Le seul et unique Roi Couette-Couette</h3>
    <button id="back-menu-3">Retour aux mini-jeux</button>
  `);

  document.getElementById("back-menu-3").addEventListener("click", () => {
    closePopup();
    showScreen("menu");
    markGameComplete(3);
  });
});

/* FINAL GIFT */
const gift = document.getElementById("gift");
const giftMessage = document.getElementById("gift-message");
const confettis = document.getElementById("confettis");
let giftClicks = 0;
let giftOpened = false;

gift.addEventListener("click", () => {
  if (!screens.final.classList.contains("active")) return;
  if (giftOpened) return;

  giftClicks += 1;
  gift.classList.add("shake");

  if (giftClicks >= 5) {
    giftOpened = true;
    gift.classList.remove("shake");
    gift.style.transform = "scale(0.95)";
    confettis.classList.remove("hidden");
    giftMessage.classList.remove("hidden");

    setTimeout(() => {
      gift.style.transform = "scale(1)";
    }, 120);
  }
});

updateProgress();
clearGame1();
