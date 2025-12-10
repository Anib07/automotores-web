const carousel = document.querySelector('.brands-carousel');
const track = document.querySelector('.brands-track');

let speed = 0.5; // px por frame
let pos = 0;
let animationId = null;

// Duplicar contenido solo una vez
if (!track.dataset.duplicated) {
  track.innerHTML += track.innerHTML;
  track.dataset.duplicated = 'true';
}

function animateMobileCarousel() {
  pos += speed;

  // Reiniciar al llegar a la mitad
  if (pos >= track.scrollWidth / 2) pos = 0;

  carousel.scrollLeft = pos;

  animationId = requestAnimationFrame(animateMobileCarousel);
}

// Activar solo en móviles
function checkMobileScroll() {
  // Cancelar animación previa si existía
  if (animationId) cancelAnimationFrame(animationId);

  if (window.innerWidth <= 768) {
    animateMobileCarousel();
  }
}

// Ejecutar al cargar
checkMobileScroll();

// Ejecutar al cambiar tamaño de pantalla
window.addEventListener('resize', checkMobileScroll);
