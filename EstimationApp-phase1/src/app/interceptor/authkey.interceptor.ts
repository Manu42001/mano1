import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthkeyInterceptor implements HttpInterceptor {

  API_KEY : string = "dLHKam2r7n2wHj3YAxeWraO0SSsdfPnSa08NHTPx";

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
console.log("Inside Interceptor", request)
    const authReq = request.clone({
      headers: request.headers.set('Content-Type', 'application/json')
          .set('x-api-key',this.API_KEY )
  });

    return next.handle(authReq);
  }
}
