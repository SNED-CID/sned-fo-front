import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { inject, OnInit, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contact-us',
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {

  contactForm: FormGroup;
  private translateService: TranslateService = inject(TranslateService);

  constructor(private fb: FormBuilder) {
    // Définition du formulaire réactif
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Form Submitted:', this.contactForm.value);
      alert('Merci pour votre message ! (Formulaire statique)');
      this.contactForm.reset();
    } else {
      this.contactForm.markAllAsTouched(); // Affiche les erreurs
    }
  }

  // Fonction utilitaire pour vérifier si un contrôle est invalide
  isInvalid(controlName: string) {
    const control = this.contactForm.get(controlName);
    return control?.invalid && (control?.touched || control?.dirty);
  }

}
