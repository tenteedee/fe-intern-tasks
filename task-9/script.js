// Select elements
const slides = document.querySelector('.slides');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

let currentSlide = 0;
const totalSlides = document.querySelectorAll('.slides > div').length;

// Update slide position
function updateSlidePosition() {
  slides.style.transform = `translateX(-${currentSlide * 100}vw)`;
}

// Go to the previous slide
function goToPrevSlide() {
  if (currentSlide > 0) {
    currentSlide--;
    updateSlidePosition();
  }
  updateButtons();
}

// Go to the next slide
function goToNextSlide() {
  if (currentSlide < totalSlides - 1) {
    currentSlide++;
    updateSlidePosition();
  }
  updateButtons();
}

// Update button states (enable/disable)
function updateButtons() {
  prevButton.disabled = currentSlide === 0;
  nextButton.disabled = currentSlide === totalSlides - 1;
}

// Add event listeners
prevButton.addEventListener('click', goToPrevSlide);
nextButton.addEventListener('click', goToNextSlide);

// Initialize
updateButtons();
