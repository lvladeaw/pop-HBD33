const totalScenes = 7;
const scenes = Array.from(document.querySelectorAll(".scene"));
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const currentSceneNumber = document.getElementById("currentSceneNumber");
const sceneDrawer = document.getElementById("sceneDrawer");
const openDrawerButton = document.getElementById("openDrawerButton");
const closeDrawerButton = document.getElementById("closeDrawerButton");
const musicToggle = document.getElementById("musicToggle");
const musicToggleLabel = document.getElementById("musicToggleLabel");
const musicPanel = document.getElementById("musicPanel");
const musicPanelClose = document.getElementById("musicPanelClose");
const trackSelect = document.getElementById("trackSelect");
const volumeSlider = document.getElementById("volumeSlider");
const playPauseButton = document.getElementById("playPauseButton");
const nextTrackButton = document.getElementById("nextTrackButton");
const storyAudio = document.getElementById("storyAudio");
const galleryGrid = document.getElementById("galleryGrid");
const lightbox = document.getElementById("lightbox");
const lightboxBackdrop = document.getElementById("lightboxBackdrop");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const lightboxImage = document.getElementById("lightboxImage");
const drawerTabs = Array.from(document.querySelectorAll(".drawer-tab"));
const directSceneButtons = Array.from(document.querySelectorAll("[data-target-scene]"));

let activeScene = 1;
let touchStartX = 0;
let activeGalleryIndex = 0;
let isMusicPanelOpen = false;
let currentTrackIndex = 0;
let userHasInteractedWithAudio = false;

const playlist = [
  { src: "music/happy-birthday.mp3", label: "Happy Birthday" },
  { src: "music/best-gift.mp3", label: "Best Gift" }
];

function updateControls() {
  currentSceneNumber.textContent = String(activeScene);
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

function updateMusicButtonLabel() {
  const currentTrack = playlist[currentTrackIndex];
  const suffix = storyAudio.paused ? "Paused" : currentTrack.label;
  musicToggleLabel.textContent = suffix;
  playPauseButton.textContent = storyAudio.paused ? "Play" : "Pause";
}

function openMusicPanel() {
  isMusicPanelOpen = true;
  musicPanel.classList.add("is-open");
  musicPanel.setAttribute("aria-hidden", "false");
  musicToggle.setAttribute("aria-expanded", "true");
}

function closeMusicPanel() {
  isMusicPanelOpen = false;
  musicPanel.classList.remove("is-open");
  musicPanel.setAttribute("aria-hidden", "true");
  musicToggle.setAttribute("aria-expanded", "false");
}

function setTrack(index, shouldPlay = true) {
  const safeIndex = (index + playlist.length) % playlist.length;
  currentTrackIndex = safeIndex;
  storyAudio.src = playlist[safeIndex].src;
  trackSelect.value = String(safeIndex);
  storyAudio.volume = Number(volumeSlider.value);

  if (shouldPlay) {
    storyAudio.play().then(() => {
      updateMusicButtonLabel();
    }).catch(() => {
      updateMusicButtonLabel();
    });
    return;
  }

  updateMusicButtonLabel();
}

function togglePlayback() {
  userHasInteractedWithAudio = true;

  if (storyAudio.paused) {
    storyAudio.play().then(() => {
      updateMusicButtonLabel();
    }).catch(() => {
      updateMusicButtonLabel();
    });
    return;
  }

  storyAudio.pause();
  updateMusicButtonLabel();
}

function playNextTrack() {
  userHasInteractedWithAudio = true;
  setTrack(currentTrackIndex + 1, true);
}

function tryAutoplayDefaultTrack() {
  storyAudio.volume = Number(volumeSlider.value);
  setTrack(0, true);
}

function ensureAudioAfterInteraction() {
  if (userHasInteractedWithAudio || !storyAudio.paused) {
    return;
  }

  userHasInteractedWithAudio = true;
  storyAudio.play().then(() => {
    updateMusicButtonLabel();
  }).catch(() => {
    updateMusicButtonLabel();
  });
}

function renderGallery() {
  galleryGrid.innerHTML = "";

  galleryItems.forEach((item, index) => {
    const button = document.createElement("button");
    const image = document.createElement("img");

    image.src = item.src;
    image.alt = item.alt;
    image.loading = "lazy";

    button.type = "button";
    button.setAttribute("aria-label", `Open gallery image ${index + 1}`);
    button.addEventListener("click", () => openLightbox(index));
    button.appendChild(image);
    galleryGrid.appendChild(button);
  });
}

function showLightboxImage(index) {
  const safeIndex = (index + galleryItems.length) % galleryItems.length;
  activeGalleryIndex = safeIndex;
  lightboxImage.src = galleryItems[safeIndex].src;
  lightboxImage.alt = galleryItems[safeIndex].alt;
}

function openLightbox(index) {
  showLightboxImage(index);
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function showNextLightboxImage() {
  showLightboxImage(activeGalleryIndex + 1);
}

function showPreviousLightboxImage() {
  showLightboxImage(activeGalleryIndex - 1);
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
  if (isMusicPanelOpen) {
    closeMusicPanel();
    return;
  }

  openMusicPanel();
});

musicPanelClose.addEventListener("click", closeMusicPanel);
trackSelect.addEventListener("change", () => {
  userHasInteractedWithAudio = true;
  setTrack(Number(trackSelect.value), true);
});
volumeSlider.addEventListener("input", () => {
  storyAudio.volume = Number(volumeSlider.value);
});
playPauseButton.addEventListener("click", togglePlayback);
nextTrackButton.addEventListener("click", playNextTrack);
storyAudio.addEventListener("ended", () => {
  setTrack(currentTrackIndex + 1, true);
});

lightboxBackdrop.addEventListener("click", closeLightbox);
lightboxClose.addEventListener("click", closeLightbox);
lightboxNext.addEventListener("click", showNextLightboxImage);
lightboxPrev.addEventListener("click", showPreviousLightboxImage);

document.addEventListener("keydown", (event) => {
  if (lightbox.classList.contains("is-open")) {
    if (event.key === "ArrowRight") {
      showNextLightboxImage();
    }

    if (event.key === "ArrowLeft") {
      showPreviousLightboxImage();
    }

    if (event.key === "Escape") {
      closeLightbox();
    }

    return;
  }

  if (event.key === "ArrowRight") {
    goNext();
  }

  if (event.key === "ArrowLeft") {
    goPrevious();
  }

  if (event.key === "Escape") {
    closeMusicPanel();
    closeDrawer();
  }
});

document.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener("touchend", (event) => {
  if (lightbox.classList.contains("is-open")) {
    const touchEndX = event.changedTouches[0].screenX;
    const deltaX = touchEndX - touchStartX;

    if (Math.abs(deltaX) < 60) {
      return;
    }

    if (deltaX < 0) {
      showNextLightboxImage();
    } else {
      showPreviousLightboxImage();
    }

    return;
  }

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

document.addEventListener("pointerdown", ensureAudioAfterInteraction, { once: true });
document.addEventListener("keydown", ensureAudioAfterInteraction, { once: true });

window.addEventListener("hashchange", syncFromHash);

renderGallery();
setTrack(0, false);
tryAutoplayDefaultTrack();
syncFromHash();
