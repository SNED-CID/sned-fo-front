import { Directive, ElementRef, OnInit, OnDestroy, HostListener } from '@angular/core';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  originalX: number;
  originalY: number;
  radius: number;
  speed: number;
}

@Directive({
  selector: '[appBackgroundParticleAnimation]',
  standalone: true
})
export class BackgroundParticleAnimationDirective implements OnInit, OnDestroy {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private animationId: number | null = null;
  private mouseX: number = -1000;
  private mouseY: number = -1000;
  private isAnimating = false;
  private colorTime: number = 0;
  private colorCycle: number = 4000; // 4 secondes pour un cycle complet

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.initializeCanvas();
    this.startAnimation();
  }

  private initializeCanvas(): void {
    const element = this.elementRef.nativeElement;
    const rect = element.getBoundingClientRect();

    // Créer le canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = element.offsetWidth;
    this.canvas.height = element.offsetHeight;
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '15';

    this.ctx = this.canvas.getContext('2d');

    // Ajouter le canvas à l'élément
    element.style.position = 'relative';
    element.appendChild(this.canvas);

    // Initialiser les particules
    this.initializeParticles();

    // Écouter le redimensionnement
    window.addEventListener('resize', () => this.handleResize());
  }

  private initializeParticles(): void {
    if (!this.canvas) return;

    const particleCount = 100;
    const padding = 40;

    this.particles = [];

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * (this.canvas.width - padding * 2) + padding;
      const y = Math.random() * (this.canvas.height - padding * 2) + padding;

      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        originalX: x,
        originalY: y,
        radius: Math.random() * 2 + 1,
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

    return { r, g, b, opacity: 0.6 };
  }

  private startAnimation(): void {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const animate = () => {
      if (!this.ctx || !this.canvas) return;

      // Mettre à jour le temps pour l'animation des couleurs
      this.colorTime += 16; // ~60 FPS

      // Effacer le canvas
      this.ctx.clearRect(0, 0, this.canvas!.width, this.canvas!.height);

      const color = this.getAnimatedColor();

      // Mettre à jour et dessiner les particules
      this.particles.forEach((particle, index) => {
        // Calculer la distance et direction vers la souris
        const dx = this.mouseX - particle.x;
        const dy = this.mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;

        if (distance < maxDistance && distance > 0) {
          // Attraction vers la souris
          const angle = Math.atan2(dy, dx);
          const force = (1 - distance / maxDistance) * 4;
          particle.vx += Math.cos(angle) * force;
          particle.vy += Math.sin(angle) * force;
        } else {
          // Retour à la position originale avec oscillation
          const returnDx = particle.originalX - particle.x;
          const returnDy = particle.originalY - particle.y;
          particle.vx += returnDx * 0.03;
          particle.vy += returnDy * 0.03;
        }

        // Appliquer la friction
        particle.vx *= 0.94;
        particle.vy *= 0.94;

        // Limiter la vitesse maximale
        const maxSpeed = 5;
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (speed > maxSpeed) {
          particle.vx = (particle.vx / speed) * maxSpeed;
          particle.vy = (particle.vy / speed) * maxSpeed;
        }

        // Mettre à jour la position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Rebondir sur les bords
        if (particle.x - particle.radius < 0 || particle.x + particle.radius > this.canvas!.width) {
          particle.vx *= -0.9;
          particle.x = Math.max(particle.radius, Math.min(this.canvas!.width - particle.radius, particle.x));
        }
        if (particle.y - particle.radius < 0 || particle.y + particle.radius > this.canvas!.height) {
          particle.vy *= -0.9;
          particle.y = Math.max(particle.radius, Math.min(this.canvas!.height - particle.radius, particle.y));
        }

        // Dessiner la particule
        this.ctx!.beginPath();
        this.ctx!.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx!.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.opacity})`;
        this.ctx!.fill();

        // Dessiner les lignes vers les particules voisines
        for (let j = index + 1; j < this.particles.length; j++) {
          const other = this.particles[j];
          const lineDx = other.x - particle.x;
          const lineDy = other.y - particle.y;
          const lineDistance = Math.sqrt(lineDx * lineDx + lineDy * lineDy);

          if (lineDistance < 120) {
            const opacity = (1 - lineDistance / 120) * 0.4;
            this.ctx!.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
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
    const element = this.elementRef.nativeElement;
    const rect = element.getBoundingClientRect();
    this.mouseX = event.clientX - rect.left;
    this.mouseY = event.clientY - rect.top;
  }

  @HostListener('document:mouseleave')
  onMouseLeave(): void {
    this.mouseX = -1000;
    this.mouseY = -1000;
  }

  private handleResize(): void {
    const element = this.elementRef.nativeElement;
    if (this.canvas) {
      this.canvas.width = element.offsetWidth;
      this.canvas.height = element.offsetHeight;
      this.initializeParticles();
    }
  }

  ngOnDestroy(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.canvas) {
      this.canvas.remove();
    }
  }
}
