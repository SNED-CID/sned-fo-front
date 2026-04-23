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
  private waveTime: number = 0;

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
    // Nuances de bleu uniquement, avec une variation douce dans le temps
    const progress = (Math.sin(this.colorTime / this.colorCycle * Math.PI * 2) + 1) / 2;
    const r = Math.round(12 + (44 - 12) * progress);
    const g = Math.round(118 + (182 - 118) * progress);
    const b = Math.round(189 + (235 - 189) * progress);

    return { r, g, b, opacity: 0.68 };
  }

  private drawCursorEffect(color: { r: number; g: number; b: number; opacity: number }): void {
    if (!this.ctx) return;

    const radius = 5 + Math.sin(this.waveTime * 7) * 1.2;
    const lightningCount = 0;

    // Dessiner le cercle central
    this.ctx.beginPath();
    this.ctx.arc(this.mouseX, this.mouseY, radius, 0, Math.PI * 2);
    this.ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.72)`;
    this.ctx.lineWidth = 2.2;
    this.ctx.stroke();

    // Anneaux d'onde pour renforcer l'interactivité visuelle
    const ringA = 22 + ((this.waveTime * 45) % 28);
    const ringB = 40 + ((this.waveTime * 52 + 14) % 34);

    this.ctx.beginPath();
    this.ctx.arc(this.mouseX, this.mouseY, ringA, 0, Math.PI * 2);
    this.ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.2)`;
    this.ctx.lineWidth = 1.2;
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(this.mouseX, this.mouseY, ringB, 0, Math.PI * 2);
    this.ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.14)`;
    this.ctx.lineWidth = 1;
    this.ctx.stroke();

    // Dessiner les éclairs autour du cercle
    for (let i = 0; i < lightningCount; i++) {
      const angle = (i / lightningCount) * Math.PI * 2;
      const startX = this.mouseX + Math.cos(angle) * radius;
      const startY = this.mouseY + Math.sin(angle) * radius;

      // Longueur et nombre de segments pour les éclairs
      const lightningLength = 20 + Math.sin(this.colorTime / 100 + i) * 10;
      const segmentCount = 4;

      let currentX = startX;
      let currentY = startY;

      this.ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`;
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY);

      for (let j = 0; j < segmentCount; j++) {
        const progress = (j + 1) / segmentCount;
        const targetX = this.mouseX + Math.cos(angle) * (radius + lightningLength * progress);
        const targetY = this.mouseY + Math.sin(angle) * (radius + lightningLength * progress);

        // Ajouter une légère déviation pour l'effet zigzag
        const deviation = (Math.random() - 0.5) * 8;
        const perpAngle = angle + Math.PI / 2;
        const deviatedX = targetX + Math.cos(perpAngle) * deviation;
        const deviatedY = targetY + Math.sin(perpAngle) * deviation;

        this.ctx.lineTo(deviatedX, deviatedY);
        currentX = deviatedX;
        currentY = deviatedY;
      }

      this.ctx.stroke();
    }

    // Ajouter un glow autour du curseur
    const gradient = this.ctx.createRadialGradient(
      this.mouseX, this.mouseY, 0,
      this.mouseX, this.mouseY, radius + 15
    );
    gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.4)`);
    gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, 0.1)`);
    gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(
      this.mouseX - (radius + 15),
      this.mouseY - (radius + 15),
      (radius + 15) * 2,
      (radius + 15) * 2
    );
  }

  private startAnimation(): void {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const animate = () => {
      if (!this.ctx || !this.canvas) return;

      // Mettre à jour le temps pour l'animation des couleurs
      this.colorTime += 16; // ~60 FPS
      this.waveTime += 0.018;

      // Effacer le canvas
      this.ctx.clearRect(0, 0, this.canvas!.width, this.canvas!.height);

      const color = this.getAnimatedColor();

      // Mettre à jour et dessiner les particules
      this.particles.forEach((particle, index) => {
        // Calculer la distance et direction vers la souris
        const dx = this.mouseX - particle.x;
        const dy = this.mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 220;

        // Retour permanent à la position d'origine + dérive douce type courant.
        const returnDx = particle.originalX - particle.x;
        const returnDy = particle.originalY - particle.y;
        const driftX = Math.sin(this.waveTime * 1.35 + particle.originalY * 0.013) * 0.09;
        const driftY = Math.cos(this.waveTime * 1.2 + particle.originalX * 0.013) * 0.09;

        particle.vx += returnDx * 0.032 + driftX;
        particle.vy += returnDy * 0.032 + driftY;

        if (distance < maxDistance && distance > 0) {
          // Interaction opposée: répulsion douce depuis le curseur.
          const nx = dx / distance;
          const ny = dy / distance;
          const proximity = 1 - distance / maxDistance;
          const influence = proximity * proximity * 1.55;
          const pulse = Math.sin(this.waveTime * 9 - distance * 0.06 + index * 0.05);

          particle.vx -= nx * influence * (1 + pulse * 0.24);
          particle.vy -= ny * influence * (1 + pulse * 0.24);
        }

        // Appliquer la friction
        particle.vx *= 0.9;
        particle.vy *= 0.9;

        // Limiter la vitesse maximale
        const maxSpeed = 2.2;
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

          if (lineDistance < 155) {
            // Autour du curseur, les liens se cassent pour éviter l'effet vortex/réseau.
            const distanceMouseA = Math.hypot(this.mouseX - particle.x, this.mouseY - particle.y);
            const distanceMouseB = Math.hypot(this.mouseX - other.x, this.mouseY - other.y);
            const disconnectRadius = 95;

            if (distanceMouseA < disconnectRadius || distanceMouseB < disconnectRadius) {
              continue;
            }

            const ratio = 1 - lineDistance / 155;
            const opacity = 0.08 + ratio * 0.32;
            const normalX = -lineDy / (lineDistance || 1);
            const normalY = lineDx / (lineDistance || 1);
            const midX = (particle.x + other.x) * 0.5;
            const midY = (particle.y + other.y) * 0.5;
            const midDistanceToMouse = Math.hypot(this.mouseX - midX, this.mouseY - midY);
            const mouseWarp = Math.max(0, 1 - midDistanceToMouse / 220);
            const curveOffset =
              Math.sin(this.waveTime * 2.15 + index * 0.35 + j * 0.14) *
              (6 + ratio * 10 + mouseWarp * 10);
            const controlX = midX + normalX * curveOffset;
            const controlY = midY + normalY * curveOffset;

            this.ctx!.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity + mouseWarp * 0.12})`;
            this.ctx!.lineWidth = 0.85 + ratio * 1.25;
            this.ctx!.shadowBlur = 6;
            this.ctx!.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.55})`;
            this.ctx!.beginPath();
            this.ctx!.moveTo(particle.x, particle.y);
            this.ctx!.quadraticCurveTo(controlX, controlY, other.x, other.y);
            this.ctx!.stroke();
            this.ctx!.shadowBlur = 0;
          }
        }
      });

      // Dessiner l'effet de rond avec éclairs autour du curseur
      if (this.mouseX > -1000 && this.mouseY > -1000) {
        this.drawCursorEffect(color);
      }

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
