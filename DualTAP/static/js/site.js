/**
 * Feature4X Project Website Script
 * Handles UI interactions, scroll behaviors, and dynamic content
 */

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const desktopNavLinks = document.querySelectorAll('#desktop-nav a');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-sidebar a');
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const mobileNavSidebar = document.getElementById('mobile-nav-sidebar');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  const copyBibtexBtn = document.getElementById('copy-bibtex');
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  // 立即执行深色模式功能初始化，禁用初始过渡动画
  document.documentElement.classList.add('theme-initializing');
  initThemeToggle();
  // 给一点时间让初始样式应用，然后移除初始化类
  setTimeout(() => {
    document.documentElement.classList.remove('theme-initializing');
  }, 300);
  
  // Add highlight-text class to all em tags
  document.querySelectorAll('em').forEach(el => {
    if (!el.classList.contains('highlight-text')) {
      el.classList.add('highlight-text');
    }
  });
  
  // 初始化其他功能
  initDesktopNavigation(desktopNavLinks);
  initMobileNavigation(mobileNavToggle, mobileNavSidebar, mobileNavOverlay, mobileNavLinks);
  initBibtexCopy(copyBibtexBtn);
  initScrollToTop(scrollToTopBtn);
  
  // Initialize page state
  window.addEventListener('scroll', debounce(function() {
    scrollFunction();
    updateReadingProgress();
    setActiveNavItem();
  }, 10));
  
  // Image lightbox functionality
  initializeLightbox();
  
  // Run initial functions
  scrollFunction();
  updateReadingProgress();
  setActiveNavItem();
  
  // Add escape key listener to close mobile nav and lightbox
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      // Close mobile nav if open
      if (mobileNavSidebar && mobileNavSidebar.classList.contains('active')) {
        mobileNavSidebar.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        const icon = mobileNavToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
      
      // Close lightbox if open
      const lightbox = document.getElementById('lightbox');
      if (lightbox && lightbox.style.display === 'flex') {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
      }
    }
  });
});

/**
 * 处理主题过渡的通用函数
 * @param {string} theme - 要设置的主题 ('dark' 或 'light')
 * @param {boolean} saveToStorage - 是否保存到localStorage
 * @param {number} transitionTime - 过渡完成的时间(毫秒)
 */
function handleThemeTransition(theme, saveToStorage = true, transitionTime = 1000) {
  // 添加过渡类
  document.documentElement.classList.add('theme-transition');
  
  // 立即应用样式到需要特殊处理的元素
  forceStylingForSpecificElements(theme);
  
  // 应用主题
  document.documentElement.setAttribute('data-theme', theme);
  
  // 更新主题切换按钮图标
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.innerHTML = theme === 'dark' 
      ? '<i class="fas fa-sun"></i>' 
      : '<i class="fas fa-moon"></i>';
  }
  
  // 保存到localStorage
  if (saveToStorage) {
    localStorage.setItem('theme', theme);
  }
  
  // 给过渡效果足够的时间完成
  setTimeout(() => {
    document.documentElement.classList.remove('theme-transition');
  }, transitionTime);
}

/**
 * 初始化深色模式切换功能
 */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;
  
  // 检查本地存储中的主题偏好
  const currentTheme = localStorage.getItem('theme') || 'light';
  
  // 应用已保存的主题
  handleThemeTransition(currentTheme, false);
  
  // 添加主题切换事件
  themeToggleBtn.addEventListener('click', function() {
    // 检查当前主题
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    // 切换到新主题
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // 应用主题过渡
    handleThemeTransition(newTheme);
  });
  
  // 检测系统深色模式偏好
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // 如果还没有设置主题且系统偏好深色模式，则启用深色模式
  if (!localStorage.getItem('theme') && prefersDarkScheme.matches) {
    handleThemeTransition('dark');
  }
  
  // 监听系统主题变化
  prefersDarkScheme.addEventListener('change', (e) => {
    // 如果用户没有明确选择主题，则跟随系统
    if (!localStorage.getItem('theme')) {
      handleThemeTransition(e.matches ? 'dark' : 'light', false);
    }
  });
}

/**
 * 立即应用样式到特定元素，不使用过渡
 */
function forceStylingForSpecificElements(theme) {
  // 确定文本颜色
  const textColor = theme === 'dark' ? '#f0f0f0' : '#333';
  
  // 获取所有需要处理的元素
  const elements = {
    authorsList: document.querySelector('.publication-authors:not(.affiliations)'),
    affiliations: document.querySelector('.publication-authors.affiliations'),
    cofirstAuthors: document.querySelector('.is-size-6.cofirst')
  };
  
  // 应用样式到作者列表及其所有子元素
  if (elements.authorsList) {
    applyColorToElementAndChildren(elements.authorsList, textColor);
  }
  
  // 应用样式到机构列表及其所有子元素
  if (elements.affiliations) {
    applyColorToElementAndChildren(elements.affiliations, textColor);
  }
  
  // 应用样式到co-first authors
  if (elements.cofirstAuthors) {
    elements.cofirstAuthors.style.color = textColor;
  }
}

/**
 * 辅助函数：递归应用颜色到元素及其所有子元素
 */
function applyColorToElementAndChildren(element, color) {
  // 设置元素自身的颜色
  element.style.color = color;
  
  // 处理子元素
  Array.from(element.children).forEach(child => {
    applyColorToElementAndChildren(child, color);
  });
}

/**
 * Helper function to debounce frequent events
 */
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      func.apply(context, args);
    }, wait);
  };
}

/**
 * Initialize image lightbox functionality
 */
function initializeLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const images = document.querySelectorAll('.img-container img');
  
  if (!lightbox || !lightboxImage || !lightboxCaption || !lightboxClose) return;
  
  let currentScale = 1;
  let startX, startY, moveX, moveY;
  let translateX = 0, translateY = 0;
  
  // Reset image position and scale
  function resetImagePosition() {
    currentScale = 1;
    translateX = 0;
    translateY = 0;
    updateImageTransform();
  }
  
  // Update image transform
  function updateImageTransform() {
    lightboxImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
  }
  
  // Open preview
  images.forEach(img => {
    img.addEventListener('click', function() {
      lightboxImage.src = this.src;
      lightboxCaption.textContent = this.alt || 'Image Preview';
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      
      // Reset zoom and position
      resetImagePosition();
    });
  });
  
  // Close preview
  lightboxClose.addEventListener('click', function() {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  });
  
  // Close preview when clicking background
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
  
  // Double-click to zoom
  lightboxImage.addEventListener('dblclick', function(e) {
    e.preventDefault();
    
    if (currentScale === 1) {
      currentScale = 2;
    } else {
      resetImagePosition();
    }
    
    updateImageTransform();
  });
  
  // Touch events - pinch zoom and drag
  lightboxImage.addEventListener('touchstart', function(e) {
    if (e.touches.length === 2) {
      // Two finger touch - prepare for scaling
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      this.dataset.initialDistance = distance;
      this.dataset.initialScale = currentScale;
    } else if (e.touches.length === 1) {
      // Single finger touch - prepare for dragging
      startX = e.touches[0].clientX - translateX;
      startY = e.touches[0].clientY - translateY;
    }
  });
  
  lightboxImage.addEventListener('touchmove', function(e) {
    e.preventDefault();
    
    if (e.touches.length === 2) {
      // Two finger move - scaling
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      const initialDistance = parseFloat(this.dataset.initialDistance);
      const initialScale = parseFloat(this.dataset.initialScale);
      
      if (initialDistance && initialScale) {
        currentScale = initialScale * (distance / initialDistance);
        currentScale = Math.min(Math.max(1, currentScale), 4); // Limit scale range
        
        updateImageTransform();
      }
    } else if (e.touches.length === 1 && currentScale > 1) {
      // Single finger move - dragging (only when zoomed in)
      moveX = e.touches[0].clientX - startX;
      moveY = e.touches[0].clientY - startY;
      
      // Limit drag range
      const maxX = (currentScale - 1) * lightboxImage.width / 2;
      const maxY = (currentScale - 1) * lightboxImage.height / 2;
      
      translateX = Math.min(Math.max(moveX, -maxX), maxX);
      translateY = Math.min(Math.max(moveY, -maxY), maxY);
      
      updateImageTransform();
    }
  });
  
  // Add touchend event for cleanup
  lightboxImage.addEventListener('touchend', function() {
    delete this.dataset.initialDistance;
    delete this.dataset.initialScale;
  });
}

/**
 * Set active navigation item based on scroll position
 */
function setActiveNavItem() {
  // Update desktop nav
  const desktopNavLinks = document.querySelectorAll('#desktop-nav a');
  if (desktopNavLinks && desktopNavLinks.length > 0) {
    desktopNavLinks.forEach(link => {
      link.classList.remove('active');
    });
    
    const scrollPos = window.scrollY + 100;
    
    document.querySelectorAll('section').forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.querySelector('.section-anchor')?.id;
      
      if(sectionId && scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        document.querySelector(`#desktop-nav a[href="#${sectionId}"]`)?.classList.add('active');
        
        // Also update mobile nav if it exists
        document.querySelector(`.mobile-nav-sidebar a[href="#${sectionId}"]`)?.classList.add('active');
      }
    });
  }
  
  // Update mobile nav
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-sidebar a');
  if (mobileNavLinks && mobileNavLinks.length > 0) {
    mobileNavLinks.forEach(link => {
      link.classList.remove('active');
    });
    
    const scrollPos = window.scrollY + 50;
    
    document.querySelectorAll('section').forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.querySelector('.section-anchor')?.id;
      
      if(sectionId && scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        document.querySelector(`.mobile-nav-sidebar a[href="#${sectionId}"]`)?.classList.add('active');
      }
    });
  }
}

/**
 * Update scroll-to-top button visibility
 */
function scrollFunction() {
  const scrollToTopBtn = document.getElementById("scroll-to-top");
  if (!scrollToTopBtn) return;
  
  if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
    scrollToTopBtn.style.display = "block";
    setTimeout(() => {
      scrollToTopBtn.style.opacity = "1";
    }, 50);
  } else {
    scrollToTopBtn.style.opacity = "0";
    setTimeout(() => {
      if (document.body.scrollTop <= 500 && document.documentElement.scrollTop <= 500) {
        scrollToTopBtn.style.display = "none";
      }
    }, 300);
  }
}

/**
 * Update reading progress indicator
 */
function updateReadingProgress() {
  const progressBar = document.getElementById("reading-progress");
  if (!progressBar) return;
  
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight - windowHeight;
  const scrolled = window.scrollY / documentHeight * 100;
  progressBar.style.width = scrolled + "%";
}

/**
 * 初始化桌面导航
 */
function initDesktopNavigation(desktopNavLinks) {
  if (!desktopNavLinks) return;
  
  desktopNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const offset = 80; // Consider fixed navigation height
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Initialize active navigation item
  setActiveNavItem();
  window.addEventListener('scroll', debounce(setActiveNavItem, 100));
}

/**
 * 初始化移动导航
 */
function initMobileNavigation(mobileNavToggle, mobileNavSidebar, mobileNavOverlay, mobileNavLinks) {
  if (!mobileNavToggle || !mobileNavSidebar || !mobileNavOverlay) return;
  
  // Toggle mobile sidebar
  mobileNavToggle.addEventListener('click', function() {
    mobileNavSidebar.classList.toggle('active');
    mobileNavOverlay.classList.toggle('active');
    
    // Toggle icon
    const icon = this.querySelector('i');
    if (icon) {
      if (mobileNavSidebar.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    }
    
    // Prevent body scrolling when menu is open
    if (mobileNavSidebar.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
  
  // Close sidebar when clicking overlay
  mobileNavOverlay.addEventListener('click', function() {
    mobileNavSidebar.classList.remove('active');
    mobileNavOverlay.classList.remove('active');
    document.body.style.overflow = '';
    
    const icon = mobileNavToggle.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });
  
  // Mobile navigation smooth scrolling
  if (mobileNavLinks) {
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const offset = 20;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Close mobile navigation
          mobileNavSidebar.classList.remove('active');
          mobileNavOverlay.classList.remove('active');
          document.body.style.overflow = '';
          
          const icon = mobileNavToggle.querySelector('i');
          if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
          }
        }
      });
    });
  }
  
  // Close mobile menu on screen resize if viewport becomes desktop size
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 769 && mobileNavSidebar.classList.contains('active')) {
      mobileNavSidebar.classList.remove('active');
      mobileNavOverlay.classList.remove('active');
      document.body.style.overflow = '';
      
      const icon = mobileNavToggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    }
  });
}

/**
 * 初始化Bibtex复制功能
 */
function initBibtexCopy(copyBibtexBtn) {
  if (!copyBibtexBtn) return;
  
  copyBibtexBtn.addEventListener('click', function() {
    const bibtexContent = document.getElementById('bibtex-content');
    if (!bibtexContent) return;
    
    navigator.clipboard.writeText(bibtexContent.textContent).then(function() {
      // Change button text
      const originalText = copyBibtexBtn.innerHTML;
      copyBibtexBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      
      // Add effect
      copyBibtexBtn.classList.add('copy-button-success');
      
      // Restore original state after 2 seconds
      setTimeout(function() {
        copyBibtexBtn.innerHTML = originalText;
        copyBibtexBtn.classList.remove('copy-button-success');
      }, 2000);
    }).catch(function(err) {
      console.error('Could not copy text: ', err);
      // Copy failed
      copyBibtexBtn.innerHTML = '<i class="fas fa-times"></i> Failed!';
      copyBibtexBtn.classList.add('copy-button-error');
      
      // Restore original state after 2 seconds
      setTimeout(function() {
        copyBibtexBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
        copyBibtexBtn.classList.remove('copy-button-error');
      }, 2000);
    });
  });
  
  // Add hover effects to copy button
  copyBibtexBtn.addEventListener('mouseover', function() {
    this.style.transform = "translateY(-2px)";
    this.style.boxShadow = "0 4px 10px rgba(106, 17, 203, 0.3)";
  });
  
  copyBibtexBtn.addEventListener('mouseout', function() {
    this.style.transform = "translateY(0)";
    this.style.boxShadow = "none";
  });
}

/**
 * 初始化滚动到顶部按钮
 */
function initScrollToTop(scrollToTopBtn) {
  if (!scrollToTopBtn) return;
  
  scrollToTopBtn.addEventListener("click", function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  scrollToTopBtn.addEventListener("mouseover", function() {
    this.classList.add('scroll-top-button-hover');
  });
  
  scrollToTopBtn.addEventListener("mouseout", function() {
    this.classList.remove('scroll-top-button-hover');
  });
} 