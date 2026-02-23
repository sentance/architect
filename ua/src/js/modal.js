document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("certificateModal");
  const modalImage = modal.querySelector(".modal__main-image");
  const thumbnailsContainer = modal.querySelector(".modal__thumbnails");
  const closeModal = modal.querySelector(".modal__close");

  const imagePlaceholders = document.querySelectorAll(".certificates-section__image-placeholder");

  const images = Array.from(imagePlaceholders).map((el) => {
    const backgroundImage = el.style.backgroundImage; // e.g. url("/src/assets/images/pdf/sert1.jpg")
    const urlMatch = backgroundImage.match(/url\(["']?(.*?)["']?\)/);
    return urlMatch ? urlMatch[1] : "";
  });

  console.log(images)

  function openModal(index) {
    modal.style.display = "flex";
    updateModalImage(index);
    populateThumbnails(index);
  }

  function closeModalWindow() {
    modal.style.display = "none";
    thumbnailsContainer.innerHTML = "";
  }

  function updateModalImage(index) {
    modalImage.src = images[index];
    modalImage.dataset.index = index;
  }

  function populateThumbnails(activeIndex) {
    thumbnailsContainer.innerHTML = "";
    images.forEach((src, idx) => {
      const thumb = document.createElement("img");
      thumb.src = src;
      thumb.classList.toggle("active", idx === activeIndex);
      thumb.addEventListener("click", () => {
        updateModalImage(idx);
        document.querySelectorAll(".modal__thumbnails img").forEach(img => img.classList.remove("active"));
        thumb.classList.add("active");
      });
      thumbnailsContainer.appendChild(thumb);
    });
  }

  imagePlaceholders.forEach((el, index) => {
    el.addEventListener("click", () => openModal(index));
  });

  closeModal.addEventListener("click", closeModalWindow);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModalWindow();
  });
});
