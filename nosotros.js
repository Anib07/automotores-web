// Animación de bloques al hacer scroll
const aboutBlocks = document.querySelectorAll('.about-block');

function handleScrollAnimation() {
  const triggerBottom = window.innerHeight * 0.85;

  aboutBlocks.forEach(block => {
    const blockTop = block.getBoundingClientRect().top;
    if(blockTop < triggerBottom) {
      block.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', handleScrollAnimation);
window.addEventListener('load', handleScrollAnimation);
