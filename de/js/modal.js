document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("certificateModal");
  const modalImage = modal.querySelector(".modal__main-image");
  const thumbnailsContainer = modal.querySelector(".modal__thumbnails");
  const closeModal = modal.querySelector(".modal__close");

  let currentSectionImages = [];

  function getImageUrl(el) {
    const bg = el.style.backgroundImage;
    const match = bg.match(/url\(["']?(.*?)["']?\)/);
    return match ? match[1] : "";
  }

  function updateModalImage(index) {
    modalImage.src = currentSectionImages[index];
    modalImage.dataset.index = index;
  }

  function populateThumbnails(activeIndex) {
    thumbnailsContainer.innerHTML = "";
    currentSectionImages.forEach((src, idx) => {
      const thumb = document.createElement("img");
      thumb.src = src;
      thumb.classList.toggle("active", idx === activeIndex);
      thumb.addEventListener("click", () => {
        updateModalImage(idx);
        thumbnailsContainer.querySelectorAll("img").forEach(img => img.classList.remove("active"));
        thumb.classList.add("active");
      });
      thumbnailsContainer.appendChild(thumb);
    });
  }

  function openModal(index) {
    modal.style.display = "flex";
    updateModalImage(index);
    populateThumbnails(index);
  }

  function closeModalWindow() {
    modal.style.display = "none";
    thumbnailsContainer.innerHTML = "";
  }

  // Attach listeners per section
  document.querySelectorAll(".certificates-section").forEach(section => {
    const placeholders = section.querySelectorAll(".certificates-section__image-placeholder");
    const sectionImages = Array.from(placeholders).map(getImageUrl);

    placeholders.forEach((placeholder, index) => {
      placeholder.addEventListener("click", () => {
        currentSectionImages = sectionImages;
        openModal(index);
      });
    });
  });

  closeModal.addEventListener("click", closeModalWindow);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModalWindow();
  });
});
