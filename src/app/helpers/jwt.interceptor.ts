import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

//HttpInterceptor: Intercepta y maneja una HttpRequest o HttpResponse
//HttpEvent: Maneja todos los estados posibles de los eventos asociados a la respuesta
//HttpHandler: Transforma una HttpRequest en una secuencia de HttpEvents, una de las cuales probablemente será una HttpResponse.
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private router: Router) { }
  //Identifica y maneja una solicitud HTTP dada.
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZTQ4ODgzZTAxYWE5NjNjZThkOGE2ZDkwMDVkYjE1MSIsInN1YiI6IjVkNWQ0ZjQ4YTNkMDI3MDAxNDBiZDkzZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.w4iJG7DNBvihwHWQI4wiCPmuE-7vao2FBV9hnNRtFxg';
    req = req.clone({ //clona los encabezados del request
      setHeaders: {
        Authorization: `${token}`
      }
    });

    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // console.log(event);
        }
      }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.router.navigate(['/auth']);
          }
        }
      })
    );
  }
}
