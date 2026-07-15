const totalScenes = 7;
const scenes = Array.from(document.querySelectorAll(".scene"));
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const currentSceneNumber = document.getElementById("currentSceneNumber");
const currentSceneLabel = document.getElementById("currentSceneLabel");
const sceneDrawer = document.getElementById("sceneDrawer");
const openDrawerButton = document.getElementById("openDrawerButton");
const closeDrawerButton = document.getElementById("closeDrawerButton");
const musicToggle = document.getElementById("musicToggle");
const musicToggleLabel = document.getElementById("musicToggleLabel");
const galleryGrid = document.getElementById("galleryGrid");
const drawerTabs = Array.from(document.querySelectorAll(".drawer-tab"));
const directSceneButtons = Array.from(document.querySelectorAll("[data-target-scene]"));

let activeScene = 1;
let isMusicEnabled = false;
let touchStartX = 0;

function updateControls() {
  currentSceneNumber.textContent = String(activeScene);
  currentSceneLabel.textContent = `ฉากที่ ${activeScene}`;
  prevButton.disabled = activeScene === 1;

  drawerTabs.forEach((tab) => {
    tab.classList.toggle("is-active", Number(tab.dataset.targetScene) === activeScene);
  });

  window.location.hash = `scene-${activeScene}`;
}

function goToScene(sceneNumber) {
  const nextScene = Math.max(1, Math.min(totalScenes, sceneNumber));

  scenes.forEach((scene) => {
    scene.classList.toggle("scene--active", Number(scene.dataset.scene) === nextScene);
  });

  activeScene = nextScene;
  updateControls();
  closeDrawer();
}

function goNext() {
  if (activeScene < totalScenes) {
    goToScene(activeScene + 1);
    return;
  }

  goToScene(totalScenes);
}

function goPrevious() {
  if (activeScene > 1) {
    goToScene(activeScene - 1);
  }
}

function openDrawer() {
  sceneDrawer.classList.add("is-open");
  sceneDrawer.setAttribute("aria-hidden", "false");
}

function closeDrawer() {
  sceneDrawer.classList.remove("is-open");
  sceneDrawer.setAttribute("aria-hidden", "true");
}

function renderGallery() {
  galleryGrid.innerHTML = "";

  galleryItems.forEach((item) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    const caption = document.createElement("figcaption");

    image.src = item.src;
    image.alt = item.title;
    image.loading = "lazy";
    caption.textContent = item.title;

    figure.append(image, caption);
    galleryGrid.appendChild(figure);
  });
}

function syncFromHash() {
  const match = window.location.hash.match(/scene-(\d+)/);

  if (!match) {
    updateControls();
    return;
  }

  goToScene(Number(match[1]));
}

prevButton.addEventListener("click", goPrevious);
nextButton.addEventListener("click", goNext);
openDrawerButton.addEventListener("click", openDrawer);
closeDrawerButton.addEventListener("click", closeDrawer);
sceneDrawer.addEventListener("click", (event) => {
  if (event.target === sceneDrawer) {
    closeDrawer();
  }
});

directSceneButtons.forEach((button) => {
  button.addEventListener("click", () => {
    goToScene(Number(button.dataset.targetScene));
  });
});

musicToggle.addEventListener("click", () => {
  isMusicEnabled = !isMusicEnabled;
  musicToggleLabel.textContent = isMusicEnabled ? "ปิดเพลง" : "เปิดเพลง";
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    goNext();
  }

  if (event.key === "ArrowLeft") {
    goPrevious();
  }

  if (event.key === "Escape") {
    closeDrawer();
  }
});

document.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener("touchend", (event) => {
  const touchEndX = event.changedTouches[0].screenX;
  const deltaX = touchEndX - touchStartX;

  if (Math.abs(deltaX) < 60) {
    return;
  }

  if (deltaX < 0) {
    goNext();
  } else {
    goPrevious();
  }
}, { passive: true });

window.addEventListener("hashchange", syncFromHash);

renderGallery();
syncFromHash();
