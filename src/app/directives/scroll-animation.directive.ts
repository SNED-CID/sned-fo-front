import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appScrollAnimation]',
  standalone: true
})
export class ScrollAnimationDirective implements OnInit {
  @Input() animationDelay: number = 0; // délai en ms
  @Input() animationType: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' = 'fadeUp';

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const element = this.el.nativeElement;

    // Ajouter les classes initiales
    element.classList.add('scroll-animated');
    element.classList.add(`animation-${this.animationType}`);
    element.style.animationDelay = `${this.animationDelay}ms`;

    // Créer l'Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // L'élément est visible dans le viewport
            element.classList.add('visible');
            // Arrêter d'observer après que l'animation soit déclenchée
            observer.unobserve(element);
          }
        });
      },
      {
        threshold: 0.1, // Déclenche quand 10% de l'élément est visible
        rootMargin: '0px 0px -50px 0px' // Décale le point de déclenchement
      }
    );

    observer.observe(element);
  }
}
