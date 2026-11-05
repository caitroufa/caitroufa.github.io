/* Shared behavior for the static GitHub Pages site. */
(function () {
  "use strict";

  if (!document.body.id) document.body.id = "top";

  // Keep the user's preferred always-visible footer, with a back-to-top
  // control above it rather than hidden behind it.
  const backToTop = document.createElement("a");
  backToTop.className = "site-back-to-top is-hidden";
  backToTop.href = "#top";
  backToTop.setAttribute("aria-label", "Back to top");
  backToTop.textContent = "↑ Back to Top";
  document.body.appendChild(backToTop);

  function updateBackToTop() {
    backToTop.classList.toggle("is-hidden", window.scrollY < 250);
  }

  window.addEventListener("scroll", updateBackToTop, { passive: true });
  window.addEventListener("pageshow", updateBackToTop);
  updateBackToTop();

  // Make photos and project figures expand to nearly the full browser width.
  // The source image remains untouched; the dialog is only a viewing aid.
  const pictures = document.querySelectorAll(
    ".bio-photo img, .profile-picture, .contact-photo, .results-gallery img, " +
    "main figure img, .case-image img, .photo-row img, " +
    "img.small-image, img.medium-image, img.large-image"
  );

  if (!pictures.length || typeof HTMLDialogElement === "undefined") return;

  const dialog = document.createElement("dialog");
  dialog.className = "site-lightbox";
  dialog.setAttribute("aria-labelledby", "site-lightbox-title");
  dialog.innerHTML =
    '<div class="site-lightbox-header">' +
      '<span id="site-lightbox-title" class="site-lightbox-title"></span>' +
      '<button type="button" class="site-lightbox-close" aria-label="Close enlarged image">Close ×</button>' +
    '</div>' +
    '<img class="site-lightbox-image" alt="">' +
    '<div class="site-lightbox-footer">' +
      '<span>Press Esc or click outside to close.</span>' +
      '<a class="site-lightbox-original" target="_blank" rel="noopener noreferrer">View original image</a>' +
    '</div>';
  document.body.appendChild(dialog);

  const expandedImage = dialog.querySelector(".site-lightbox-image");
  const expandedTitle = dialog.querySelector(".site-lightbox-title");
  const originalLink = dialog.querySelector(".site-lightbox-original");
  const closeButton = dialog.querySelector(".site-lightbox-close");
  let previousFocus = null;

  function openImage(picture) {
    const caption = picture.closest("figure")?.querySelector("figcaption");
    const description = caption?.textContent?.trim() || picture.alt || "Photo";
    previousFocus = picture;
    expandedImage.src = picture.currentSrc || picture.src;
    expandedImage.alt = picture.alt || description;
    expandedTitle.textContent = description;
    originalLink.href = picture.currentSrc || picture.src;
    dialog.showModal();
    closeButton.focus();
  }

  pictures.forEach(function (picture) {
    // A linked thumbnail already has a destination; keep that interaction.
    if (picture.closest("a")) return;
    picture.classList.add("site-zoomable");
    picture.setAttribute("tabindex", "0");
    picture.setAttribute("role", "button");
    picture.setAttribute("aria-label", "Enlarge: " + (picture.alt || "image"));
    picture.addEventListener("click", function () { openImage(picture); });
    picture.addEventListener("keydown", function (event) {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openImage(picture);
    });
  });

  closeButton.addEventListener("click", function () { dialog.close(); });
  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", function () {
    expandedImage.removeAttribute("src");
    if (previousFocus) previousFocus.focus({ preventScroll: true });
  });
})();
