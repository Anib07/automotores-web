const premiumBlocks = document.querySelectorAll('.premium-offer-block');

function animatePremiumScroll() {
  const triggerBottom = window.innerHeight * 0.85;

  premiumBlocks.forEach(block => {
    const blockTop = block.getBoundingClientRect().top;
    if(blockTop < triggerBottom){
      block.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', animatePremiumScroll);
animatePremiumScroll();
