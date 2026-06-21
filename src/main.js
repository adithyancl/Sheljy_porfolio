import './style.css';
import './form.js';

document.addEventListener('DOMContentLoaded', () => {
  
  // --- Mobile Navigation Menu ---
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      
      // Prevent body scrolling when menu is open on mobile
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : 'auto';
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = 'auto';
      });
    });
  }

  // --- Header Scrolled Effect ---
  const header = document.querySelector('.main-header');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger immediately in case page loads scrolled down

  // --- Intersection Observer for Scroll Reveals ---
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null,
    threshold: 0.12, // Trigger when 12% of the element is visible
    rootMargin: '0px 0px -50px 0px' // Slightly offset bottom margin
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Stats Counter Animation ---
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsSection = document.querySelector('.stats-banner');

  const animateCounters = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const isPercent = stat.innerText.includes('%');
      const isPlus = stat.innerText.includes('+');
      
      let count = 0;
      const duration = 2000; // 2 seconds
      const interval = 30; // ms
      const step = target / (duration / interval);
      
      const counter = setInterval(() => {
        count += step;
        if (count >= target) {
          clearInterval(counter);
          stat.innerText = target + (isPercent ? '%' : '') + (isPlus ? '+' : '');
        } else {
          stat.innerText = Math.floor(count) + (isPercent ? '%' : '') + (isPlus ? '+' : '');
        }
      }, interval);
    });
  };

  // Observe stats section to start animation when it enters the viewport
  if (statsSection && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target); // Run only once
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  // --- Navigation Active Links Highlighting on Scroll ---
  const sections = document.querySelectorAll('section[id]');
  
  const highlightNavigation = () => {
    const scrollPosition = window.scrollY + 100; // Offset for header height
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNavigation);

  // --- Consultation Form Submission ---
  const bookingForm = document.getElementById('consultation-form');
  const successOverlay = document.getElementById('form-success');
  const successClose = document.getElementById('success-close');

  if (bookingForm && successOverlay) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Perform simple form field check
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      
      if (name && email) {
        // Show success animation overlay
        successOverlay.classList.add('active');
        // Reset form inputs
        bookingForm.reset();
      }
    });

    if (successClose) {
      successClose.addEventListener('click', () => {
        successOverlay.classList.remove('active');
      });
    }
  }

  // --- Training videos: play 10s segment from middle, muted, looped ---
  const initTrainingVideos = () => {
    const videos = document.querySelectorAll('.video-container video');
    videos.forEach(video => {
      // Ensure muted and inline playback (helps autoplay on mobile when muted)
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');

      const SEG_LEN = 10; // seconds

      const setupSegment = () => {
        const dur = video.duration || 0;
        if (!dur || isNaN(dur) || dur <= 0.1) return;
        const start = Math.max(0, dur / 2 - SEG_LEN / 2);
        const end = Math.min(dur, start + SEG_LEN);

        // Jump to start of the 10s segment
        try {
          video.currentTime = start;
        } catch (e) {
          // some browsers disallow setting currentTime before user gesture
        }

        // On timeupdate, loop the segment
        const onTime = () => {
          if (video.currentTime >= end - 0.15) {
            video.currentTime = start;
            // continue playing
            video.play().catch(()=>{});
          }
        };

        video.removeEventListener('timeupdate', onTime);
        video.addEventListener('timeupdate', onTime);

        // Try to autoplay the segment (muted helps)
        video.play().catch(()=>{});
      };

      // If metadata already loaded
      if (video.readyState >= 1) {
        setupSegment();
      } else {
        video.addEventListener('loadedmetadata', setupSegment);
      }
    });
  };

  initTrainingVideos();
});
