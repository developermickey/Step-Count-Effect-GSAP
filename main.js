document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis(); // Ensure Lenis is correctly imported or defined

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000); // Convert time to milliseconds
  });

  gsap.ticker.lagSmoothing(0); // Disables lag smoothing

  const stickySection = document.querySelector(".steps");
  const stickyHeight = window.innerHeight * 7;

  const cards = document.querySelectorAll(".card");
  const countContainer = document.querySelector(".count-container");

  const totolCards = cards.length;

  ScrollTrigger.create({
    trigger: stickySection,
    start: "top top",
    end: `+=${stickyHeight}`,
    pin: true,
    pinSpacing: true,
    onUpdate: (self) => {
      positionCards(self.progress);
    },
  });

  const getRadius = () => {
    return window.innerWidth < 900
      ? window.innerWidth * 7.5
      : window.innerWidth * 2.5;
  };

  const arcAngle = Math.PI * 0.4;

  const startAngle = Math.PI / 2 - arcAngle / 2;

  function positionCards(progress = 0) {
    const radius = getRadius();
    const totalTravel = 1 + totolCards / 7.5;
    const adjustedProgress = (progress * totalTravel - 1) * 0.75;

    cards.forEach((card, i) => {
      const normalizedProgress = (totolCards - 1 - i) / totolCards;
      const cardProgress = normalizedProgress + adjustedProgress;
      const angle = startAngle + arcAngle * cardProgress;

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      const rotation = (angle - Math.PI / 2) * (180 / Math.PI);

      gsap.set(card, {
        x: x,
        y: -y + radius,
        rotation: -rotation,
        transformOrigin: "center center",
      });
    });
  }
  positionCards(0);

  let curruntCardIndex = 0;

  const options = {
    root: null,
    rootMargin: "0% 0%",
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        lastScrollY = window.scrollY;

        let cardIndex = Array.from(cards).indexOf(entry.target);
        curruntCardIndex = cardIndex;

        const targetY = 150 - curruntCardIndex * 150;

        gsap.to(countContainer, {
          y: targetY,
          duration: 0.3,
          ease: "power1.out",
          overwrite: true,
        });
      }
    });
  }, options);

  cards.forEach((card) => {
    observer.observe(card);
  });

  window.addEventListener("scroll", () => {
    positionCards(0);
  });
});
