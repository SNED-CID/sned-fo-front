import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Utilisé uniquement au prérendu (build) : le backend n'est pas joignable,
 * les appels API sont ignorés et les données sont chargées par le navigateur.
 */
@Injectable()
export class ServerApiInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.startsWith(environment.apiUrl)) {
      return EMPTY;
    }

    return next.handle(request);
  }
}
