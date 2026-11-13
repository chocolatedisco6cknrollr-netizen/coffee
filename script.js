const playButton = document.getElementById("play-button");
const titleButton = document.getElementById("title-button");
const menuToggle = document.getElementById("menu-toggle");
const sideMenu = document.getElementById("side-menu");
const titleScreen = document.getElementById("title-screen");
const gameScreen = document.getElementById("game-screen");
const dialogueBox = document.getElementById("dialogue-box");
const speakerName = document.getElementById("speaker-name");
const dialogueText = document.getElementById("dialogue-text");
const startScreen = document.getElementById("start-screen");
const stageScreen = document.getElementById("stage-screen");
const stageButtons = document.querySelectorAll(".stage-button");
const sceneText = document.querySelector(".scene");
const serveButton = document.getElementById("serve-button");
const comicPanel = document.getElementById("comic-panel");
const comicStage = document.getElementById("comic-stage");

const dialogueLines = [
  { speaker: "ナレーション", text: "お客さんがやってきた。" },
  { speaker: "お客さん", text: "「ブラックコーヒーをお願いします」" },
  { speaker: "バリスタ", text: "「かしこまりました」" },
  { speaker: "お客さん", text: "「今日は少し、話を聞いてほしくて……」" }
];

let currentLine = 0;

function showDialogue() {
  speakerName.textContent = dialogueLines[currentLine].speaker;
  dialogueText.textContent = dialogueLines[currentLine].text;
}

function advanceDialogue() {
  // バリスタの「かしこまりました」の後に提供ボタンを表示
  if (currentLine === 2) {
    serveButton.hidden = false;
    return;
  }

  serveButton.hidden = true;

  if (currentLine < dialogueLines.length - 1) {
    currentLine++;
    showDialogue();
  } else {
    dialogueText.textContent = "お客さんは、静かにコーヒーを飲んだ。";
  }
}

function showTitleScreen() {
  startScreen.hidden = true;
  titleScreen.hidden = false;

  titleScreen.classList.remove("is-entering");
  void titleScreen.offsetWidth; // アニメーションを最初から再生
  titleScreen.classList.add("is-entering");
}

startScreen.addEventListener("click", showTitleScreen);

startScreen.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    showTitleScreen();
  }
});

playButton.addEventListener("click", () => {
  titleScreen.hidden = true;
  stageScreen.hidden = false;
});

stageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    sceneText.textContent = button.dataset.stage;
    stageScreen.hidden = true;
    gameScreen.hidden = false;

    gameScreen.classList.remove("is-entering");
    dialogueBox.classList.remove("is-entering");
    dialogueBox.hidden = true;

    currentLine = 0;
    serveButton.hidden = true;
    showDialogue();

    requestAnimationFrame(() => {
      gameScreen.classList.add("is-entering");

      setTimeout(() => {
        dialogueBox.hidden = false;
        dialogueBox.classList.add("is-entering");
      }, 1000);
    });
  });
});

dialogueBox.addEventListener("click", advanceDialogue);

dialogueBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    advanceDialogue();
  }
});

menuToggle.addEventListener("click", () => {
  const isOpen = sideMenu.classList.toggle("is-open");

  menuToggle.setAttribute("aria-expanded", isOpen);
  sideMenu.setAttribute("aria-hidden", !isOpen);
});

titleButton.addEventListener("click", () => {
  sideMenu.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  sideMenu.setAttribute("aria-hidden", "true");

  gameScreen.hidden = true;
  titleScreen.hidden = false;

  titleScreen.classList.remove("is-entering");
  requestAnimationFrame(() => {
    titleScreen.classList.add("is-entering");
  });
});

const stageList = document.querySelector(".stage-list");

function updateCenteredStage() {
  const items = stageList.querySelectorAll(".stage-button, .coming-soon");
  const listCenter = stageList.getBoundingClientRect().top
    + stageList.clientHeight / 2;

  let closestItem = null;
  let closestDistance = Infinity;

  items.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.top + rect.height / 2;
    const distance = Math.abs(listCenter - itemCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestItem = item;
    }

    item.classList.remove("is-centered");
  });

  closestItem?.classList.add("is-centered");
}

stageList.addEventListener("scroll", updateCenteredStage);
updateCenteredStage();

const comicImages = [
  "media/一コマ.png",
  "media/二コマ.png",
  "media/三コマ.png"
];

let comicIndex = 0;

function showComic() {
  serveButton.hidden = true;
  dialogueBox.hidden = true;
  comicPanel.hidden = false;

  comicStage.replaceChildren();
  comicIndex = 0;
  addNextComicPanel();
}

function addNextComicPanel() {
  const image = document.createElement("img");
  image.src = comicImages[comicIndex];
  image.alt = `${comicIndex + 1}コマ目`;
  image.className = "comic-layer";

  comicStage.appendChild(image);

  requestAnimationFrame(() => {
    image.classList.add("is-visible");
  });
}

comicPanel.addEventListener("click", () => {
  if (comicIndex < comicImages.length - 1) {
    comicIndex++;
    addNextComicPanel();
  }
});

serveButton.addEventListener("click", (event) => {
  event.stopPropagation();
  showComic();
});