import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { PreviewTokenService } from '../services/preview-token.service';

@Injectable()
export class PreviewTokenInterceptor implements HttpInterceptor {

  constructor(private previewTokenService: PreviewTokenService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('/preview')) {
      const token = this.previewTokenService.getToken();

      if (token) {
        const clonedRequest = request.clone({
          setHeaders: {
            'X-Preview-Token': token
          }
        });
        return next.handle(clonedRequest);
      }
    }

    // For non-preview requests or requests without a token, proceed normally
    return next.handle(request);
  }
}
