import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { ServerApiInterceptor } from './interceptors/server-api.interceptor';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerApiInterceptor,
      multi: true,
    },
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
