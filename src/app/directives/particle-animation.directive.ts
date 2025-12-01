import { Directive, ElementRef, OnInit, OnDestroy, HostListener } from '@angular/core';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  originalX: number;
  originalY: number;
  angle: number;
  speed: number;
}

@Directive({
  selector: 'img',
  standalone: true
})
export class ParticleAnimationDirective implements OnInit, OnDestroy {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private animationId: number | null = null;
  private mouseX: number = 0;
  private mouseY: number = 0;
  private canvasContainer: HTMLDivElement | null = null;
  private isAnimating = false;
  private colorTime: number = 0;
  private colorCycle: number = 4000; // 4 secondes pour un cycle complet

  constructor(private elementRef: ElementRef<HTMLImageElement>) {}

  ngOnInit(): void {
    const img = this.elementRef.nativeElement;

    img.onload = () => {
      this.initializeCanvas();
      this.startAnimation();
    };

    // Si l'image est déjà cachée, initialiser immédiatement
    if (img.complete) {
      this.initializeCanvas();
      this.startAnimation();
    }
  }

  private initializeCanvas(): void {
    const img = this.elementRef.nativeElement;
    const rect = img.getBoundingClientRect();

    // Créer un conteneur pour le canvas
    this.canvasContainer = document.createElement('div');
    this.canvasContainer.style.position = 'relative';
    this.canvasContainer.style.display = 'inline-block';
    this.canvasContainer.style.width = img.offsetWidth + 'px';
    this.canvasContainer.style.height = img.offsetHeight + 'px';

    // Créer le canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = img.offsetWidth;
    this.canvas.height = img.offsetHeight;
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '10';

    this.ctx = this.canvas.getContext('2d');

    // Remplacer l'image avec le conteneur
    img.parentNode?.insertBefore(this.canvasContainer, img);
    this.canvasContainer.appendChild(img);
    this.canvasContainer.appendChild(this.canvas);

    // Initialiser les particules
    this.initializeParticles();
  }

  private initializeParticles(): void {
    const img = this.elementRef.nativeElement;
    const particleCount = 80;
    const padding = 20;

    this.particles = [];

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * (img.offsetWidth - padding * 2) + padding;
      const y = Math.random() * (img.offsetHeight - padding * 2) + padding;

      this.particles.push({
        x,
        y,
        vx: 0,
        vy: 0,
        originalX: x,
        originalY: y,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.5 + 0.5
      });
    }
  }

  private getAnimatedColor(): { r: number; g: number; b: number; opacity: number } {
    // Alterner entre bleu (#139dcc) et orange (#f89851)
    const progress = (this.colorTime % this.colorCycle) / this.colorCycle;
    let r: number, g: number, b: number;

    if (progress < 0.5) {
      // Transition de bleu vers orange (0 à 0.5)
      const t = progress * 2;
      r = Math.round(19 + (248 - 19) * t);
      g = Math.round(157 + (152 - 157) * t);
      b = Math.round(204 + (81 - 204) * t);
    } else {
      // Transition d'orange vers bleu (0.5 à 1)
      const t = (progress - 0.5) * 2;
      r = Math.round(248 + (19 - 248) * t);
      g = Math.round(152 + (157 - 152) * t);
      b = Math.round(81 + (204 - 81) * t);
    }

    return { r, g, b, opacity: 0.8 };
  }

  private startAnimation(): void {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const animate = () => {
      if (!this.ctx || !this.canvas) return;

      // Mettre à jour le temps pour l'animation des couleurs
      this.colorTime += 16; // ~60 FPS

      // Effacer le canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      const color = this.getAnimatedColor();

      // Mettre à jour et dessiner les particules
      this.particles.forEach((particle, index) => {
        // Calculer la distance et direction vers la souris
        const dx = this.mouseX - particle.x;
        const dy = this.mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance) {
          // Attraction vers la souris
          const angle = Math.atan2(dy, dx);
          const force = (1 - distance / maxDistance) * 3;
          particle.vx += Math.cos(angle) * force;
          particle.vy += Math.sin(angle) * force;
        } else {
          // Retour à la position originale
          const returnDx = particle.originalX - particle.x;
          const returnDy = particle.originalY - particle.y;
          particle.vx += returnDx * 0.05;
          particle.vy += returnDy * 0.05;
        }

        // Appliquer la friction
        particle.vx *= 0.95;
        particle.vy *= 0.95;

        // Mettre à jour la position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Dessiner la particule
        this.ctx!.beginPath();
        this.ctx!.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
        this.ctx!.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.opacity})`;
        this.ctx!.fill();

        // Dessiner les lignes vers les particules voisines
        for (let j = index + 1; j < this.particles.length; j++) {
          const other = this.particles[j];
          const lineDx = other.x - particle.x;
          const lineDy = other.y - particle.y;
          const lineDistance = Math.sqrt(lineDx * lineDx + lineDy * lineDy);

          if (lineDistance < 100) {
            const opacity = 1 - lineDistance / 100;
            this.ctx!.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.5})`;
            this.ctx!.lineWidth = 1;
            this.ctx!.beginPath();
            this.ctx!.moveTo(particle.x, particle.y);
            this.ctx!.lineTo(other.x, other.y);
            this.ctx!.stroke();
          }
        }
      });

      this.animationId = requestAnimationFrame(animate);
    };

    animate();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const img = this.elementRef.nativeElement;
    const rect = img.getBoundingClientRect();
    this.mouseX = event.clientX - rect.left;
    this.mouseY = event.clientY - rect.top;
  }

  @HostListener('document:mouseleave')
  onMouseLeave(): void {
    this.mouseX = -1000;
    this.mouseY = -1000;
  }

  ngOnDestroy(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.canvas) {
      this.canvas.remove();
    }
    if (this.canvasContainer) {
      this.canvasContainer.remove();
    }
  }
}
