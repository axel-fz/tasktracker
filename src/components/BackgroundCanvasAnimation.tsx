"use client";

import React, { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
}

export default function BackgroundCanvasAnimation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Monitor documentElement dark class for live theme reactivity
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset scale
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Animation variables
    let startTime = performance.now();
    const particles: Particle[] = [];

    // State machine definition:
    // 4 items on the checklist.
    // Each item takes 1.6s:
    //  - 0.0s - 0.7s: Fly to checkbox (penZ: 1 -> 0)
    //  - 0.7s - 0.95s: Draw down-stroke
    //  - 0.95s - 1.25s: Draw up-stroke
    //  - 1.25s - 1.6s: Lift pen & flourish (penZ: 0 -> 1)
    // Total 4 items = 6.4s
    // Hold completed state: 2.2s (6.4s - 8.6s)
    // Fade / reset state: 1.0s (8.6s - 9.6s)
    // Loop cycle = 9.6s
    const ITEM_DURATION = 1.6;
    const TOTAL_ITEMS = 4;
    const ITEMS_TIME = ITEM_DURATION * TOTAL_ITEMS; // 6.4s
    const HOLD_TIME = 2.2;
    const RESET_TIME = 1.0;
    const CYCLE_DURATION = ITEMS_TIME + HOLD_TIME + RESET_TIME; // 9.6s

    // Helper functions for smooth easing
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

    // Spawn subtle ink dust when a checkmark flicks complete
    const spawnParticles = (x: number, y: number, color: string) => {
      for (let i = 0; i < 5; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.4 + Math.random() * 0.9;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.3,
          alpha: 0.8,
          color,
          size: 1 + Math.random() * 1.5,
        });
      }
    };

    let prevCycleIndex = -1;

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const cycleTime = elapsed % CYCLE_DURATION;

      // Theme-dependent colors
      const isDark = document.documentElement.classList.contains("dark");

      // Palette definition
      const bookBg = isDark ? "#141c0e" : "#ffffff";
      const bookCover = isDark ? "#1f2c15" : "#e8efe1";
      const pageBorder = isDark ? "#2d3e21" : "#dbe4ce";
      const ruledLine = isDark ? "rgba(148, 168, 136, 0.16)" : "rgba(96, 124, 60, 0.18)";
      const boxBorder = isDark ? "#486235" : "#a8bd97";
      const inkColor = isDark ? "#b5e550" : "#607c3c";
      const inkGlow = isDark ? "rgba(181, 229, 80, 0.45)" : "rgba(96, 124, 60, 0.25)";
      const penBody = isDark ? "#212f17" : "#3b4a2d";
      const penAccent = isDark ? "#abc32f" : "#809c13";
      const penNib = isDark ? "#cbd5e1" : "#64748b";
      const shadowColor = isDark ? "rgba(0, 0, 0, 0.4)" : "rgba(24, 34, 15, 0.12)";

      ctx.clearRect(0, 0, width, height);

      // Book positioning (Responsive: centered on mobile, right-anchored ambient on desktop)
      const isMobile = width < 768;
      const bookScale = isMobile ? Math.min(width / 440, 0.85) : 1;
      const bookW = 340 * bookScale;
      const bookH = 260 * bookScale;

      // Anchor in lower right quadrant with plenty of breathing room
      const bookX = isMobile
        ? width * 0.5 - bookW * 0.5
        : Math.max(width * 0.62, width - bookW - 70);
      const bookY = isMobile
        ? height * 0.55 - bookH * 0.5
        : Math.max(height * 0.48, height - bookH - 80);

      // Gentle ambient floating wave
      const floatY = Math.sin(elapsed * 0.8) * 4;
      const floatRot = Math.sin(elapsed * 0.5) * 0.008 - 0.05; // slight -3 deg tilt

      ctx.save();
      ctx.translate(bookX + bookW * 0.5, bookY + bookH * 0.5 + floatY);
      ctx.rotate(floatRot);
      ctx.translate(-bookW * 0.5, -bookH * 0.5);

      // 1. Book Drop Shadow
      ctx.fillStyle = shadowColor;
      ctx.beginPath();
      ctx.roundRect(4 * bookScale, 10 * bookScale, bookW, bookH, 12 * bookScale);
      ctx.fill();

      // 2. Leather Cover / Backing
      ctx.fillStyle = bookCover;
      ctx.strokeStyle = pageBorder;
      ctx.lineWidth = 1.5 * bookScale;
      ctx.beginPath();
      ctx.roundRect(0, 0, bookW, bookH, 10 * bookScale);
      ctx.fill();
      ctx.stroke();

      // 3. Open Book Pages (Left & Right Pages with Spine Fold)
      const spineX = bookW * 0.48;
      const pageMargin = 8 * bookScale;

      // Left Page
      ctx.fillStyle = bookBg;
      ctx.beginPath();
      ctx.roundRect(
        pageMargin,
        pageMargin,
        spineX - pageMargin - 2,
        bookH - pageMargin * 2,
        [6 * bookScale, 2 * bookScale, 2 * bookScale, 6 * bookScale]
      );
      ctx.fill();
      ctx.stroke();

      // Right Page
      ctx.beginPath();
      ctx.roundRect(
        spineX + 2,
        pageMargin,
        bookW - spineX - pageMargin - 2,
        bookH - pageMargin * 2,
        [2 * bookScale, 6 * bookScale, 6 * bookScale, 2 * bookScale]
      );
      ctx.fill();
      ctx.stroke();

      // Spine Shadow Crease
      const spineGrad = ctx.createLinearGradient(spineX - 10, 0, spineX + 10, 0);
      spineGrad.addColorStop(0, "rgba(0, 0, 0, 0.0)");
      spineGrad.addColorStop(0.5, shadowColor);
      spineGrad.addColorStop(1, "rgba(0, 0, 0, 0.0)");
      ctx.fillStyle = spineGrad;
      ctx.fillRect(spineX - 8, pageMargin, 16, bookH - pageMargin * 2);

      // Bookmark Ribbon Hanging from Spine
      ctx.fillStyle = isDark ? "#809c13" : "#abc32f";
      ctx.beginPath();
      ctx.moveTo(spineX - 3, pageMargin);
      ctx.lineTo(spineX + 3, pageMargin);
      ctx.lineTo(spineX + 4, bookH + 16 * bookScale);
      ctx.lineTo(spineX, bookH + 10 * bookScale);
      ctx.lineTo(spineX - 4, bookH + 16 * bookScale);
      ctx.closePath();
      ctx.fill();

      // 4. Left Page Subtle Notes / Header
      ctx.fillStyle = ruledLine;
      const leftPageStartX = pageMargin + 14 * bookScale;
      const leftPageW = spineX - leftPageStartX - 14 * bookScale;

      // Header line
      ctx.fillRect(leftPageStartX, pageMargin + 20 * bookScale, leftPageW * 0.6, 3 * bookScale);

      // Notes ruled lines
      for (let i = 0; i < 6; i++) {
        const lineY = pageMargin + 48 * bookScale + i * 28 * bookScale;
        ctx.fillRect(leftPageStartX, lineY, leftPageW * (0.75 + (i % 3) * 0.1), 1.5 * bookScale);
      }

      // 5. Right Page Checklist Setup
      const rightPageStartX = spineX + 16 * bookScale;
      const rightPageW = bookW - rightPageStartX - pageMargin - 12 * bookScale;

      // Header on Right Page
      ctx.fillStyle = ruledLine;
      ctx.fillRect(
        rightPageStartX,
        pageMargin + 18 * bookScale,
        rightPageW * 0.45,
        3 * bookScale
      );

      // Checklist Items Geometry
      const itemRowHeight = 44 * bookScale;
      const startItemY = pageMargin + 44 * bookScale;
      const boxSize = 13 * bookScale;

      // Coordinates for each checkbox and checkmark
      interface CheckItem {
        boxX: number;
        boxY: number;
        checkP1: { x: number; y: number };
        checkP2: { x: number; y: number };
        checkP3: { x: number; y: number };
      }

      const checkItems: CheckItem[] = [];
      for (let i = 0; i < TOTAL_ITEMS; i++) {
        const rowY = startItemY + i * itemRowHeight;
        const bX = rightPageStartX;
        const bY = rowY;
        checkItems.push({
          boxX: bX,
          boxY: bY,
          checkP1: { x: bX + 2.5 * bookScale, y: bY + 6.5 * bookScale },
          checkP2: { x: bX + 5.5 * bookScale, y: bY + 10.5 * bookScale },
          checkP3: { x: bX + 11.5 * bookScale, y: bY + 3.0 * bookScale },
        });

        // Draw Row Checkbox
        ctx.strokeStyle = boxBorder;
        ctx.lineWidth = 1.2 * bookScale;
        ctx.beginPath();
        ctx.roundRect(bX, bY, boxSize, boxSize, 3 * bookScale);
        ctx.stroke();

        // Draw Row Text Representation Lines (Task Title + Sub-bar)
        ctx.fillStyle = ruledLine;
        ctx.fillRect(
          bX + boxSize + 10 * bookScale,
          bY + 3 * bookScale,
          rightPageW - boxSize - 18 * bookScale,
          2 * bookScale
        );
        ctx.fillRect(
          bX + boxSize + 10 * bookScale,
          bY + 9 * bookScale,
          (rightPageW - boxSize - 18 * bookScale) * 0.65,
          1.5 * bookScale
        );
      }

      // 6. State Calculation: Which item is currently being checked?
      let currentItemIndex = -1;
      let itemProgress = 0;
      let isHolding = false;
      let fadeAlpha = 1;

      if (cycleTime < ITEMS_TIME) {
        currentItemIndex = Math.floor(cycleTime / ITEM_DURATION);
        itemProgress = (cycleTime % ITEM_DURATION) / ITEM_DURATION;
      } else if (cycleTime < ITEMS_TIME + HOLD_TIME) {
        currentItemIndex = TOTAL_ITEMS;
        isHolding = true;
      } else {
        // Fade out / reset
        currentItemIndex = TOTAL_ITEMS;
        const resetProgress = (cycleTime - (ITEMS_TIME + HOLD_TIME)) / RESET_TIME;
        fadeAlpha = Math.max(0, 1 - resetProgress);
      }

      // 7. Draw completed / in-progress checkmarks
      for (let i = 0; i < TOTAL_ITEMS; i++) {
        const item = checkItems[i];
        let p1 = item.checkP1;
        let p2 = item.checkP2;
        let p3 = item.checkP3;

        ctx.save();
        ctx.strokeStyle = inkColor;
        ctx.lineWidth = 2 * bookScale;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.shadowColor = inkGlow;
        ctx.shadowBlur = 4 * bookScale;

        if (i < currentItemIndex) {
          // Completely checked
          ctx.globalAlpha = fadeAlpha;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.stroke();

          // Subtle strike-through line on the task
          ctx.strokeStyle = ruledLine;
          ctx.lineWidth = 1 * bookScale;
          ctx.beginPath();
          ctx.moveTo(item.boxX + boxSize + 8 * bookScale, item.boxY + 4 * bookScale);
          ctx.lineTo(
            item.boxX + rightPageW - 10 * bookScale,
            item.boxY + 4 * bookScale
          );
          ctx.stroke();
        } else if (i === currentItemIndex && !isHolding) {
          // Actively being checked
          ctx.globalAlpha = 1;
          const stroke1Start = 0.44;
          const stroke1End = 0.62;
          const stroke2Start = 0.62;
          const stroke2End = 0.85;

          if (itemProgress >= stroke1Start) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);

            if (itemProgress < stroke1End) {
              const t = (itemProgress - stroke1Start) / (stroke1End - stroke1Start);
              const curX = p1.x + (p2.x - p1.x) * t;
              const curY = p1.y + (p2.y - p1.y) * t;
              ctx.lineTo(curX, curY);
            } else {
              ctx.lineTo(p2.x, p2.y);
              if (itemProgress >= stroke2Start) {
                const t2 = Math.min(
                  1,
                  (itemProgress - stroke2Start) / (stroke2End - stroke2Start)
                );
                const curX2 = p2.x + (p3.x - p2.x) * easeOutQuad(t2);
                const curY2 = p2.y + (p3.y - p2.y) * easeOutQuad(t2);
                ctx.lineTo(curX2, curY2);

                // Spawn particle burst at check completion
                if (t2 >= 0.95 && prevCycleIndex !== i) {
                  spawnParticles(curX2, curY2, inkColor);
                  prevCycleIndex = i;
                }
              }
            }
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      // 8. Pen Position, Height (Z), and Angle Kinematics
      let penX = rightPageStartX + boxSize * 0.5;
      let penY = startItemY;
      let penZ = 1.0; // 0 = touching paper, 1 = airborne

      if (!isHolding && currentItemIndex >= 0 && currentItemIndex < TOTAL_ITEMS) {
        const item = checkItems[currentItemIndex];
        const p1 = item.checkP1;
        const p2 = item.checkP2;
        const p3 = item.checkP3;

        // Previous position for smooth flight
        const prevItem =
          currentItemIndex > 0
            ? checkItems[currentItemIndex - 1]
            : { checkP3: { x: p1.x - 20 * bookScale, y: p1.y - 30 * bookScale } };
        const fromPos = prevItem.checkP3;

        if (itemProgress < 0.44) {
          // Approach flight: From previous tip to start of current checkmark
          const t = easeInOutCubic(itemProgress / 0.44);
          penX = fromPos.x + (p1.x - fromPos.x) * t;
          penY = fromPos.y + (p1.y - fromPos.y) * t;
          // Arcs up then lands
          penZ = Math.sin(t * Math.PI) * 0.8 + (1 - t) * 0.2;
        } else if (itemProgress < 0.62) {
          // Stroke 1 down
          const t = (itemProgress - 0.44) / 0.18;
          penX = p1.x + (p2.x - p1.x) * t;
          penY = p1.y + (p2.y - p1.y) * t;
          penZ = 0.0;
        } else if (itemProgress < 0.85) {
          // Stroke 2 up-flick
          const t = (itemProgress - 0.62) / 0.23;
          penX = p2.x + (p3.x - p2.x) * easeOutQuad(t);
          penY = p2.y + (p3.y - p2.y) * easeOutQuad(t);
          penZ = 0.0;
        } else {
          // Lift pen & flourish
          const t = (itemProgress - 0.85) / 0.15;
          penX = p3.x + 4 * bookScale * t;
          penY = p3.y - 6 * bookScale * t;
          penZ = easeOutQuad(t);
        }
      } else {
        // Holding / Reset state: Pen rests gracefully near bottom right
        const lastItem = checkItems[TOTAL_ITEMS - 1];
        penX = lastItem.checkP3.x + 22 * bookScale;
        penY = lastItem.checkP3.y + 14 * bookScale + Math.sin(elapsed * 1.5) * 3;
        penZ = 0.9;
        if (cycleTime < 0.2) prevCycleIndex = -1;
      }

      // 9. Draw Pen Cast Shadow (Offsets dynamically with height Z)
      const shadowOffsetX = 8 * bookScale + penZ * 12 * bookScale;
      const shadowOffsetY = 6 * bookScale + penZ * 10 * bookScale;
      const shadowAlpha = 0.28 * (1 - penZ * 0.5);

      ctx.save();
      ctx.translate(penX + shadowOffsetX, penY + shadowOffsetY);
      ctx.rotate(0.78); // ~45 deg
      ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
      ctx.beginPath();
      // Elliptical cast shadow of the pen barrel
      ctx.ellipse(
        -30 * bookScale,
        0,
        35 * bookScale,
        (4 + penZ * 3) * bookScale,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.restore();

      // 10. Draw Architectural Fountain Pen
      ctx.save();
      ctx.translate(penX, penY);
      // Pen angle: tilted ~48 degrees, subtle wobble on writing
      const penAngle = 0.82 + (penZ === 0 ? Math.sin(elapsed * 40) * 0.015 : 0);
      ctx.rotate(penAngle);

      // Fountain Pen Nib (Silver steel with breather slit)
      ctx.fillStyle = penNib;
      ctx.beginPath();
      ctx.moveTo(0, 0); // Nib point
      ctx.lineTo(-4 * bookScale, -14 * bookScale);
      ctx.lineTo(4 * bookScale, -14 * bookScale);
      ctx.closePath();
      ctx.fill();

      // Slit & breather hole
      ctx.strokeStyle = shadowColor;
      ctx.lineWidth = 0.8 * bookScale;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -9 * bookScale);
      ctx.stroke();
      ctx.fillStyle = shadowColor;
      ctx.beginPath();
      ctx.arc(0, -9 * bookScale, 1 * bookScale, 0, Math.PI * 2);
      ctx.fill();

      // Gold / Citron Accent Ring
      ctx.fillStyle = penAccent;
      ctx.fillRect(-4.5 * bookScale, -17 * bookScale, 9 * bookScale, 3 * bookScale);

      // Grip section
      ctx.fillStyle = penBody;
      ctx.beginPath();
      ctx.roundRect(-4 * bookScale, -32 * bookScale, 8 * bookScale, 15 * bookScale, 1);
      ctx.fill();

      // Secondary Brass Band
      ctx.fillStyle = penAccent;
      ctx.fillRect(-5 * bookScale, -35 * bookScale, 10 * bookScale, 3 * bookScale);

      // Main Pen Barrel
      const barrelGrad = ctx.createLinearGradient(
        -5 * bookScale,
        0,
        5 * bookScale,
        0
      );
      barrelGrad.addColorStop(0, penBody);
      barrelGrad.addColorStop(0.4, isDark ? "#2d3e1f" : "#4e613b");
      barrelGrad.addColorStop(1, isDark ? "#162010" : "#2a3620");

      ctx.fillStyle = barrelGrad;
      ctx.beginPath();
      ctx.roundRect(-5 * bookScale, -85 * bookScale, 10 * bookScale, 50 * bookScale, [
        4 * bookScale,
        4 * bookScale,
        1 * bookScale,
        1 * bookScale,
      ]);
      ctx.fill();

      // Top Finial
      ctx.fillStyle = penAccent;
      ctx.beginPath();
      ctx.roundRect(-4 * bookScale, -90 * bookScale, 8 * bookScale, 5 * bookScale, 2);
      ctx.fill();

      // Nib ink contact glow when writing
      if (penZ === 0) {
        ctx.fillStyle = inkGlow;
        ctx.beginPath();
        ctx.arc(0, 0, 4 * bookScale, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore(); // Pen restore

      // 11. Render & Update Particle Sparks
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * bookScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore(); // Book transform restore

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-opacity duration-700"
      style={{
        // "not too visible but visible as an animation engineer on the background"
        opacity: isDarkMode ? 0.22 : 0.16,
      }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

