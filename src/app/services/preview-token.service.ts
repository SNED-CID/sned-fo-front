import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreviewTokenService {
  private readonly PREVIEW_TOKEN_KEY = 'preview_token';
  private readonly PREVIEW_TOKEN_TIMEOUT_KEY = 'preview_token_timeout';
  private readonly PREVIEW_SESSION_DURATION = 15 * 60 * 1000;
  private previewTokenSubject = new BehaviorSubject<string | null>(this.getStoredToken());
  private tokenTimeoutHandle: any;
  private isBrowser: boolean;


  constructor() {
    this.isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    if (this.isBrowser) {
      this.initializeTokenFromUrl();
      this.checkAndCleanExpiredToken();
    }
  }

  private initializeTokenFromUrl(): void {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('preview_token');

    if (urlToken) {
      this.setToken(urlToken);
      // Clean up URL by removing the token parameter
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    } else {
      // No token in URL = user accessed page directly (not from preview link)
      // Clear any stored token to show public content
      this.clearToken();
    }
  }

  /**
   * Check if stored token has expired
   */
  private checkAndCleanExpiredToken(): void {
    if (!this.isBrowser) return;

    const storedTimeout = localStorage.getItem(this.PREVIEW_TOKEN_TIMEOUT_KEY);
    if (storedTimeout) {
      const expiresAt = parseInt(storedTimeout, 10);
      if (Date.now() >= expiresAt) {
        this.clearToken();
      } else {
        this.scheduleTokenCleanup(expiresAt - Date.now());
      }
    }
  }

  /**
   * Schedule token cleanup after a certain duration
   */
  private scheduleTokenCleanup(duration: number): void {
    if (this.tokenTimeoutHandle) {
      clearTimeout(this.tokenTimeoutHandle);
    }
    this.tokenTimeoutHandle = setTimeout(() => {
      console.log('Preview token expired, clearing...');
      this.clearToken();
    }, duration);
  }

  /**
   * Get the preview token from storage
   */
  getToken(): string | null {
    return this.previewTokenSubject.value;
  }

  /**
   * Store the preview token with expiration timeout
   */
  setToken(token: string): void {
    if (!this.isBrowser) return;

    localStorage.setItem(this.PREVIEW_TOKEN_KEY, token);

    // Calculate expiration time (30 minutes from now)
    const expiresAt = Date.now() + this.PREVIEW_SESSION_DURATION;
    localStorage.setItem(this.PREVIEW_TOKEN_TIMEOUT_KEY, expiresAt.toString());

    // Schedule cleanup when token expires
    this.scheduleTokenCleanup(this.PREVIEW_SESSION_DURATION);

    this.previewTokenSubject.next(token);
  }

  /**
   * Clear the preview token
   */
  clearToken(): void {
    if (!this.isBrowser) return;

    localStorage.removeItem(this.PREVIEW_TOKEN_KEY);
    localStorage.removeItem(this.PREVIEW_TOKEN_TIMEOUT_KEY);

    if (this.tokenTimeoutHandle) {
      clearTimeout(this.tokenTimeoutHandle);
    }

    this.previewTokenSubject.next(null);
  }

  /**
   * Check if preview token is present
   */
  hasToken(): boolean {
    return !!this.getToken();
  }

  /**
   * Get stored token from localStorage
   */
  private getStoredToken(): string | null {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) {
      return null;
    }
    return localStorage.getItem(this.PREVIEW_TOKEN_KEY);
  }
}
