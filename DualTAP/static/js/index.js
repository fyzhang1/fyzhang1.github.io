/**
 * Feature4X Project Initialization Script
 * Main entry point for website initialization
 */

// Disable VideoJS help popup
window.HELP_IMPROVE_VIDEOJS = false;

// 注释掉不存在的资源引用，避免404错误
// var INTERP_BASE = "./static/interpolation/stacked";
// var NUM_INTERP_FRAMES = 240;

// var interp_images = [];
// function preloadInterpolationImages() {
//   for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
//     var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
//     interp_images[i] = new Image();
//     interp_images[i].src = path;
//   }
// }

// function setInterpolationImage(i) {
//   var image = interp_images[i];
//   image.ondragstart = function() { return false; };
//   image.oncontextmenu = function() { return false; };
//   $('#interpolation-image-wrapper').empty().append(image);
// }

/**
 * Initialize website functionality when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
  // Handle hamburger menu for any navbar if present
  const navbarBurgers = document.querySelectorAll('.navbar-burger');
  if (navbarBurgers.length > 0) {
    navbarBurgers.forEach(burger => {
      burger.addEventListener('click', () => {
        // Get the target from the "data-target" attribute
        const target = burger.dataset.target;
        const menu = document.getElementById(target);
        
        // Toggle the "is-active" class on both the burger and the menu
        burger.classList.toggle('is-active');
        if (menu) {
          menu.classList.toggle('is-active');
        }
      });
    });
  }
  
  // Fade in content sections on scroll
  const fadeElements = document.querySelectorAll('.fade-in');
  if (fadeElements.length > 0) {
    // Initial check for elements in viewport
    checkFadeElements();
    
    // Check elements on scroll
    window.addEventListener('scroll', checkFadeElements);
  }
  
  // Initialize any additional components if needed
});

/**
 * Check which elements should fade in based on viewport position
 */
function checkFadeElements() {
  const fadeElements = document.querySelectorAll('.fade-in');
  
  fadeElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150; // How much of the element needs to be visible
    
    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add('appear');
    }
  });
}
