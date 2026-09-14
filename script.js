const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const portfolioTrack = document.querySelector(".portfolio-track");
const portfolioSlides = document.querySelectorAll(".project-card");
const prevButton = document.querySelector(".slider-btn.prev");
const nextButton = document.querySelector(".slider-btn.next");

if (portfolioTrack && portfolioSlides.length) {
  const firstClone = portfolioSlides[0].cloneNode(true);
  const lastClone = portfolioSlides[portfolioSlides.length - 1].cloneNode(true);

  portfolioTrack.appendChild(firstClone);
  portfolioTrack.insertBefore(lastClone, portfolioTrack.firstChild);

  const allSlides = [...portfolioTrack.children];
  let currentIndex = 1;
  let isAnimating = false;
  let isReady = false;

  const updateSlider = (index, immediate = false) => {
    portfolioTrack.style.transition = immediate
      ? "none"
      : "transform 0.45s ease";
    portfolioTrack.style.transform = `translateX(-${index * 100}%)`;
  };

  const preloadImage = (img) => {
    if (!img || !img.src) return Promise.resolve();

    if (img.complete) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
      if (img.decode) {
        img.decode().then(resolve).catch(resolve);
      }
    });
  };

  const preloadAllImages = () => {
    const imagePromises = Array.from(
      document.querySelectorAll(".project-card img"),
    ).map((img) => preloadImage(img));
    return Promise.all(imagePromises);
  };

  const resetToRealSlide = () => {
    if (currentIndex === 0) {
      isAnimating = true;
      currentIndex = allSlides.length - 2;
      updateSlider(currentIndex, true);
      requestAnimationFrame(() => {
        isAnimating = false;
      });
    }

    if (currentIndex === allSlides.length - 1) {
      isAnimating = true;
      currentIndex = 1;
      updateSlider(currentIndex, true);
      requestAnimationFrame(() => {
        isAnimating = false;
      });
    }
  };

  const preloadAdjacentImages = () => {
    const currentRealIndex =
      (currentIndex - 1 + portfolioSlides.length) % portfolioSlides.length;
    const nextRealIndex = (currentRealIndex + 1) % portfolioSlides.length;
    const previousRealIndex =
      (currentRealIndex - 1 + portfolioSlides.length) % portfolioSlides.length;

    const nextImg = portfolioSlides[nextRealIndex]?.querySelector("img");
    const prevImg = portfolioSlides[previousRealIndex]?.querySelector("img");

    preloadImage(nextImg);
    preloadImage(prevImg);
  };

  const goToSlide = (index) => {
    if (!isReady || isAnimating) return;

    currentIndex = index;
    isAnimating = true;
    preloadAdjacentImages();
    updateSlider(currentIndex);
  };

  prevButton?.addEventListener("click", () => {
    goToSlide(currentIndex - 1);
  });

  nextButton?.addEventListener("click", () => {
    goToSlide(currentIndex + 1);
  });

  portfolioTrack.addEventListener("transitionend", () => {
    isAnimating = false;
    preloadAdjacentImages();
    resetToRealSlide();
  });

  preloadAllImages().then(() => {
    isReady = true;
    updateSlider(currentIndex, true);
  });
}

const yearElement = document.querySelector("#year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
