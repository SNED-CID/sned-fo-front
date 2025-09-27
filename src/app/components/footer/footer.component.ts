import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocaleService } from '../../services/locale.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, FormsModule, ReactiveFormsModule],
  template: `
    <footer class="bg-gradient-to-br from-slate-50 to-slate-100 border-t border-slate-200 mt-auto">
      <!-- Main Footer Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          <!-- Company Info -->
          <div class="lg:col-span-1">
            <div class="mb-6">
              <a routerLink="/" class="inline-block hover:opacity-80 transition-opacity">
                <img [src]="getLogoPath()" alt="SNED Logo" class="h-12 sm:h-16 w-auto"/>
              </a>
            </div>
            <div class="space-y-3 text-sm text-slate-600">
              <p class="font-medium text-slate-800">{{ 'footer.company.name' | translate }}</p>
              <address class="not-italic leading-relaxed">
                {{ 'footer.company.address' | translate }}<br>
                {{ 'footer.company.city' | translate }}<br>
                {{ 'footer.company.location' | translate }}
              </address>
              <div class="space-y-2">
                <p class="flex items-center gap-2">
                  <i class="fas fa-phone text-[var(--sned-orange)] text-xs"></i>
                  {{ 'footer.company.phone' | translate }}
                </p>
                <p class="flex items-center gap-2">
                  <i class="fas fa-envelope text-[var(--sned-orange)] text-xs"></i>
                  <a href="mailto:contact@sned.ma" class="hover:text-[var(--sned-orange)] transition-colors">
                    {{ 'footer.company.email' | translate }}
                  </a>
                </p>
              </div>
            </div>
          </div>

          <!-- Navigation Links -->
          <div class="">
            <h3 class="text-lg font-semibold text-slate-800 mb-4">{{ 'footer.navigation.title' | translate }}</h3>
            <nav class="space-y-2">
              <a routerLink="/" class="block text-sm text-slate-600 hover:text-[var(--sned-orange)] transition-colors py-1">
                {{ 'footer.navigation.home' | translate }}
              </a>
              <a routerLink="/about" class="block text-sm text-slate-600 hover:text-[var(--sned-orange)] transition-colors py-1">
                {{ 'footer.navigation.about' | translate }}
              </a>
              <a routerLink="/project" class="block text-sm text-slate-600 hover:text-[var(--sned-orange)] transition-colors py-1">
                {{ 'footer.navigation.project' | translate }}
              </a>
              <a routerLink="/news" class="block text-sm text-slate-600 hover:text-[var(--sned-orange)] transition-colors py-1">
                {{ 'footer.navigation.news' | translate }}
              </a>
              <a routerLink="/contact" class="block text-sm text-slate-600 hover:text-[var(--sned-orange)] transition-colors py-1">
                {{ 'footer.navigation.contact' | translate }}
              </a>
              <a routerLink="/documents" class="block text-sm text-slate-600 hover:text-[var(--sned-orange)] transition-colors py-1">
                {{ 'footer.navigation.documents' | translate }}
              </a>
            </nav>
          </div>

          <!-- Project Links -->
          <div class="">
            <h3 class="text-lg font-semibold text-slate-800 mb-4">{{ 'footer.project.title' | translate }}</h3>
            <nav class="space-y-2">
              <a routerLink="/project/overview" class="block text-sm text-slate-600 hover:text-[var(--sned-orange)] transition-colors py-1">
                {{ 'footer.project.overview' | translate }}
              </a>
              <a routerLink="/project/technical" class="block text-sm text-slate-600 hover:text-[var(--sned-orange)] transition-colors py-1">
                {{ 'footer.project.technical' | translate }}
              </a>
              <a routerLink="/project/environmental" class="block text-sm text-slate-600 hover:text-[var(--sned-orange)] transition-colors py-1">
                {{ 'footer.project.environmental' | translate }}
              </a>
              <a routerLink="/project/economic" class="block text-sm text-slate-600 hover:text-[var(--sned-orange)] transition-colors py-1">
                {{ 'footer.project.economic' | translate }}
              </a>
              <a routerLink="/project/timeline" class="block text-sm text-slate-600 hover:text-[var(--sned-orange)] transition-colors py-1">
                {{ 'footer.project.timeline' | translate }}
              </a>
            </nav>
          </div>

          <!-- Newsletter & Social -->
          <div class="">
            <h3 class="text-lg font-semibold text-slate-800 mb-4">{{ 'footer.newsletter.title' | translate }}</h3>
            <p class="text-sm text-slate-600 mb-4 leading-relaxed">
              {{ 'footer.newsletter.description' | translate }}
            </p>

            <!-- Newsletter Form -->
            <form [formGroup]="newsletterForm" (ngSubmit)="onNewsletterSubmit()" class="mb-6">
              <div class="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  formControlName="email"
                  [placeholder]="'footer.newsletter.placeholder' | translate"
                  class="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--sned-orange)] focus:border-transparent outline-none transition-all"
                  [class.border-red-300]="newsletterForm.get('email')?.invalid && newsletterForm.get('email')?.touched"
                >
                <button
                  type="submit"
                  [disabled]="newsletterForm.invalid || isSubmitting"
                  class="px-4 py-2 bg-[var(--sned-orange)] text-white text-sm font-medium rounded-lg hover:bg-[var(--sned-orange-dark)] focus:ring-2 focus:ring-[var(--sned-orange)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap"
                >
                  <span *ngIf="!isSubmitting">{{ 'footer.newsletter.subscribe' | translate }}</span>
                  <span *ngIf="isSubmitting" class="flex items-center gap-2">
                    <i class="fas fa-spinner fa-spin"></i>
                    <span class="hidden sm:inline">{{ 'footer.newsletter.subscribe' | translate }}</span>
                  </span>
                </button>
              </div>
              <p *ngIf="newsletterForm.get('email')?.invalid && newsletterForm.get('email')?.touched"
                 class="text-red-500 text-xs mt-1">
                Veuillez entrer une adresse email valide
              </p>
              <p class="text-xs text-slate-500 mt-2">
                {{ 'footer.newsletter.privacy' | translate }}
              </p>
            </form>

            <!-- Social Media -->
            <div>
              <h4 class="text-sm font-semibold text-slate-800 mb-3">{{ 'footer.social.title' | translate }}</h4>
              <div class="flex space-x-3">
                <a href="#" [attr.aria-label]="'footer.social.facebook' | translate"
                   class="w-9 h-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-all duration-200">
                  <i class="fab fa-facebook-f text-sm"></i>
                </a>
                <a href="#" [attr.aria-label]="'footer.social.twitter' | translate"
                   class="w-9 h-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 hover:text-sky-500 hover:border-sky-500 hover:bg-sky-50 transition-all duration-200">
                  <i class="fab fa-twitter text-sm"></i>
                </a>
                <a href="#" [attr.aria-label]="'footer.social.linkedin' | translate"
                   class="w-9 h-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 hover:text-blue-700 hover:border-blue-700 hover:bg-blue-50 transition-all duration-200">
                  <i class="fab fa-linkedin-in text-sm"></i>
                </a>
                <a href="#" [attr.aria-label]="'footer.social.youtube' | translate"
                   class="w-9 h-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-600 hover:border-red-600 hover:bg-red-50 transition-all duration-200">
                  <i class="fab fa-youtube text-sm"></i>
                </a>
                <a href="#" [attr.aria-label]="'footer.social.instagram' | translate"
                   class="w-9 h-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 hover:text-pink-600 hover:border-pink-600 hover:bg-pink-50 transition-all duration-200">
                  <i class="fab fa-instagram text-sm"></i>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-slate-200 bg-white/50 backdrop-blur-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <p class="text-sm text-slate-600 text-center md:text-left">
              {{ 'footer.legal.copyright' | translate : {year: currentYear} }}
            </p>
            <nav class="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 text-sm">
              <a href="/legal" class="text-slate-500 hover:text-[var(--sned-orange)] transition-colors">
                {{ 'footer.legal.legal' | translate }}
              </a>
              <a href="/privacy" class="text-slate-500 hover:text-[var(--sned-orange)] transition-colors">
                {{ 'footer.legal.privacy' | translate }}
              </a>
              <a href="/terms" class="text-slate-500 hover:text-[var(--sned-orange)] transition-colors">
                {{ 'footer.legal.terms' | translate }}
              </a>
              <a href="/cookies" class="text-slate-500 hover:text-[var(--sned-orange)] transition-colors">
                {{ 'footer.legal.cookies' | translate }}
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  private fb = inject(FormBuilder);
  private translate = inject(TranslateService);
  private localeService = inject(LocaleService);

  currentYear = new Date().getFullYear();
  isSubmitting = false;

  newsletterForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  getLogoPath(): string {
    const currentLang = this.localeService.getCurrentLocaleId();
    const isArabic = currentLang === 'ar';

    // Pour le footer, on utilise toujours les logos sur fond sombre
    return isArabic ? 'assets/logos/arstdr.png' : 'assets/logos/frstdr.png';
  }

  onNewsletterSubmit() {
    if (this.newsletterForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const email = this.newsletterForm.get('email')?.value;

      console.log('Newsletter subscription:', email);

      setTimeout(() => {
        this.isSubmitting = false;
        this.newsletterForm.reset();
      }, 1000);
    }
  }
}
