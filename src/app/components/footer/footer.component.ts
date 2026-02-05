import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LocaleService } from '../../services/locale.service';
import { LazyImageComponent } from '../shared/lazy-image/lazy-image.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    LazyImageComponent,
  ],
  template: `
    <footer
      class="bg-gradient-to-br from-slate-50 to-slate-100 border-t border-slate-200 mt-auto"
    >
      <!-- Main Footer Content -->
      <div class="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-6">
        <div
          class="flex flex-col lg:flex-row
             items-center lg:items-center
             justify-center lg:justify-between
             gap-6 lg:gap-10 text-center lg:text-left"
        >
          <!-- Logo + Nom -->
          <div class="flex flex-col items-center gap-2 flex-shrink-0">
            <a
              routerLink="/"
              class="inline-block hover:opacity-80 transition-opacity"
            >
              <app-lazy-image
                [src]="getLogoPath()"
                alt="SNED Logo"
                imageClass="h-10 w-auto"
                [priority]="true"
              ></app-lazy-image>
            </a>
          </div>

          <!-- Adresse -->
          <address class="not-italic text-xs text-slate-600 max-w-md">
            {{ 'footer.company.address' | translate }},
            {{ 'footer.company.city' | translate }},
            {{ 'footer.company.location' | translate }}
          </address>

          <!-- Contact -->
          <div
            class="flex flex-col sm:flex-row
               items-center gap-3 sm:gap-6
               text-xs text-slate-600"
          >
            <span class="flex items-center gap-1">
              <i class="fas fa-phone text-[var(--sned-orange)]"></i>
              {{ 'footer.company.phone' | translate }}
            </span>

            <span class="flex items-center gap-1">
              <i class="fas fa-envelope text-[var(--sned-orange)]"></i>
              <a
                href="mailto:contact@sned.ma"
                class="hover:text-[var(--sned-orange)] transition-colors whitespace-nowrap"
              >
                {{ 'footer.company.email' | translate }}
              </a>
            </span>
          </div>

          <!-- Liens -->
          <nav
            class="flex flex-wrap lg:flex-nowrap
         justify-center lg:justify-end
         items-center gap-4 lg:gap-6"
          >
            <a
              routerLink="/site-map"
              class="text-xs text-slate-600 hover:text-[var(--sned-orange)] transition-colors whitespace-nowrap"
            >
              {{ 'footer.links.siteMap' | translate }}
            </a>
            <a
              routerLink="/mentions-legales"
              class="text-xs text-slate-600 hover:text-[var(--sned-orange)] transition-colors whitespace-nowrap"
            >
              {{ 'footer.links.legalNotice' | translate }}
            </a>
            <a
              routerLink="/contact"
              class="text-xs text-slate-600 hover:text-[var(--sned-orange)] transition-colors whitespace-nowrap"
            >
              {{ 'footer.links.contact' | translate }}
            </a>
          </nav>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-slate-200 bg-white/50 backdrop-blur-sm">
        <div class="max-w-7xl mx-auto px-4 py-3">
          <p class="text-xs text-slate-600 text-center">
            {{ 'footer.legal.copyright' | translate : { year: currentYear() } }}
          </p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  private fb = inject(FormBuilder);
  private translate = inject(TranslateService);
  private localeService = inject(LocaleService);

  currentYear = computed(() => new Date().getFullYear().toString());
  isSubmitting = false;

  newsletterForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
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

      setTimeout(() => {
        this.isSubmitting = false;
        this.newsletterForm.reset();
      }, 1000);
    }
  }
}
