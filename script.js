/**
 * 초록우산 브랜드 페이지
 */

document.addEventListener('DOMContentLoaded', () => {
  initParallax();
  initBenefitScrollCarousel();
  initScrollReveal();
  initFanCarousel();
  initStoryCarousel();
});

/* ========== 패럴렉스 스크롤 ========== */
function initParallax() {
  const parallaxBgs = document.querySelectorAll('.parallax-bg');

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.pageYOffset;

        parallaxBgs.forEach(bg => {
          const speed = parseFloat(bg.dataset.speed) || 0.3;
          const section = bg.closest('section');
          if (!section) return;

          const rect = section.getBoundingClientRect();
          const sectionTop = rect.top + scrollY;
          const offset = (scrollY - sectionTop) * speed;

          bg.style.transform = `translateX(-50%) translateY(${offset}px)`;

          if (bg.closest('.story-bg')) {
            bg.style.transform = `translateY(${offset}px)`;
          }
          if (bg.closest('.cta-bg-wrapper')) {
            bg.style.transform = `translateY(${offset}px)`;
          }
        });

        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ========== 스크롤 기반 등장 애니메이션 ========== */
function initScrollReveal() {
  const sections = document.querySelectorAll('.section-hero, .section-story, .section-cta, .section-fan');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(section => observer.observe(section));

  const fadeElements = document.querySelectorAll('.parallax-fade');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.3 });

  fadeElements.forEach(el => fadeObserver.observe(el));
}

/* ========== Section 2: 스크롤 하이재킹 캐러셀 ========== */
function initBenefitScrollCarousel() {
  const wrapper = document.getElementById('section2Wrapper');
  const section = document.getElementById('section2');
  const slider = document.getElementById('benefitSlider');
  const dots = document.querySelectorAll('#benefitDots .dot');
  if (!wrapper || !section || !slider) return;

  const cards = slider.querySelectorAll('.benefit-card');
  const cardCount = cards.length;
  const gap = 10;
  const sliderArea = slider.closest('.benefit-slider-area');

  const dotsEl = document.getElementById('benefitDots');

  function updateSliderPadding() {
    const cardW = cards[0].offsetWidth;
    const viewW = window.innerWidth;
    const paddingLeft = (viewW - cardW) / 2;
    sliderArea.style.paddingLeft = Math.max(0, paddingLeft) + 'px';
    // 불릿 오른쪽 끝 = 카드 오른쪽 끝
    if (dotsEl) {
      dotsEl.style.paddingRight = Math.max(0, paddingLeft) + 'px';
    }
  }

  function getTotalSlide() {
    const cardW = cards[0].offsetWidth;
    return (cardCount - 1) * (cardW + gap);
  }

  function updateWrapperHeight() {
    const vh = window.innerHeight;
    const scrollNeeded = (cardCount - 1) * vh * 0.5;
    wrapper.style.height = (vh + scrollNeeded) + 'px';
  }

  function updateLayout() {
    updateSliderPadding();
    updateWrapperHeight();
  }

  updateLayout();
  window.addEventListener('resize', updateLayout);

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const wrapperTop = wrapper.offsetTop;
        const scrollY = window.pageYOffset;
        const vh = window.innerHeight;
        const maxScroll = wrapper.offsetHeight - vh;

        const scrollInWrapper = scrollY - wrapperTop;
        const progress = Math.max(0, Math.min(1, scrollInWrapper / maxScroll));

        const totalSlide = getTotalSlide();
        const translateX = -(progress * totalSlide);
        slider.style.transform = `translateX(${translateX}px)`;

        const currentIndex = Math.min(
          cardCount - 1,
          Math.round(progress * (cardCount - 1))
        );
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === currentIndex);
        });

        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ========== Section 3: 부채꼴 회전 카드 (무한 슬라이드) ========== */
function initFanCarousel() {
  const track = document.getElementById('fanTrack');
  if (!track) return;

  const cards = track.querySelectorAll('.fan-card');
  const cardCount = cards.length;

  const CARD_W = 248;
  const GAP = 20;
  const ARC_SPACING = CARD_W + GAP; // 268px 호 위 등간격
  // R = arcSpacing / θ(rad), θ = 15° = Math.PI/12
  const ANGLE_STEP = ARC_SPACING / (ARC_SPACING / (Math.PI / 12)); // = π/12 rad = 15°
  const ANGLE_STEP_DEG = 15; // 15도 등간격
  const TOTAL_SLOTS = cardCount; // 6장

  // 자동 회전 애니메이션
  let animOffset = 0;
  const speed = 0.003; // 슬롯 단위 속도

  function animate() {
    animOffset += speed;

    cards.forEach((card, i) => {
      // 각 카드의 논리적 슬롯 위치 → animOffset으로 순환
      let slot = i - animOffset;

      // 순환: -TOTAL_SLOTS/2 ~ +TOTAL_SLOTS/2
      slot = ((slot % TOTAL_SLOTS) + TOTAL_SLOTS) % TOTAL_SLOTS;
      if (slot > TOTAL_SLOTS / 2) slot -= TOTAL_SLOTS;

      // 원호 위에서 회전: 15도 × 슬롯 = 각도
      const angle = slot * ANGLE_STEP_DEG;

      // 중앙에 가까울수록 앞쪽
      const absSlot = Math.abs(slot);
      const zIndex = Math.round(100 - absSlot * 10);
      // 2.5슬롯 이상이면 서서히 투명
      const opacity = absSlot > 2.5 ? Math.max(0, 1 - (absSlot - 2.5) * 2) : 1;

      card.style.transform = `rotate(${angle}deg)`;
      card.style.zIndex = zIndex;
      card.style.opacity = opacity;
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

/* ========== Section 4: 좌우 버튼 캐러셀 ========== */
function initStoryCarousel() {
  const track = document.getElementById('storyTrack');
  const prevBtn = document.getElementById('storyPrev');
  const nextBtn = document.getElementById('storyNext');
  const wrap = document.querySelector('.story-carousel-wrap');
  if (!track || !prevBtn || !nextBtn || !wrap) return;

  const slides = track.querySelectorAll('.story-slide');
  const slideCount = slides.length;
  let currentIndex = 0;

  function getSlideWidth() {
    return slides[0].offsetWidth + 20; // width + gap
  }

  const navBtns = document.querySelector('.story-nav-buttons');

  const viewport = wrap.querySelector('.story-carousel-viewport');

  // 카드를 가운데 정렬: paddingLeft = (뷰포트 - 카드너비) / 2
  function updateCenterPadding() {
    const cardW = slides[0].offsetWidth;
    const viewW = window.innerWidth;
    const padLeft = Math.max(0, (viewW - cardW) / 2);
    wrap.style.paddingLeft = padLeft + 'px';
    // viewport에 CSS변수 전달 (좌측 확장용)
    if (viewport) {
      viewport.style.setProperty('--story-pad-left', padLeft + 'px');
    }
    // 네비 버튼도 카드 오른쪽 끝에 맞춤
    if (navBtns) {
      navBtns.style.paddingRight = padLeft + 'px';
    }
  }

  function updatePosition() {
    const slideW = getSlideWidth();
    track.style.transform = `translateX(-${currentIndex * slideW}px)`;
    updateButtons();
  }

  function updateButtons() {
    if (currentIndex === 0) {
      prevBtn.classList.add('disabled');
    } else {
      prevBtn.classList.remove('disabled');
    }

    if (currentIndex >= slideCount - 1) {
      nextBtn.classList.add('disabled');
    } else {
      nextBtn.classList.remove('disabled');
    }
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updatePosition();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < slideCount - 1) {
      currentIndex++;
      updatePosition();
    }
  });

  updateCenterPadding();
  updateButtons();
  window.addEventListener('resize', () => {
    updateCenterPadding();
    updatePosition();
  });
}
