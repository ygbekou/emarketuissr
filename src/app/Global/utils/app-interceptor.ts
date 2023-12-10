import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // console.log(`Request for ${req.urlWithParams} started...`);

    let modifiedReq = req.clone();

    // console.log('Reuest URL  ******** ' + req.url);

    // if (req.url.indexOf('/products/dtl') !== -1) {
    //   console.log('Changing the user-agent');
    //   modifiedReq = req.clone({
    //     setHeaders: {
    //       'user-agent': 'Your Custom User Agent Here',
    //     },
    //   });
    // } else {
    //   console.log('Modifying anyway');
    //   modifiedReq = req.clone({
    //     setHeaders: {
    //       'user-agent': 'Your Custom User Agent Here',
    //     },
    //   });
    // }



    return next.handle(modifiedReq).pipe(map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // console.log(`Request for ${req.urlWithParams} completed...`);
      }
      return event;
    }),
      catchError((error: HttpErrorResponse) => {
        const started = Date.now();
        const elapsed = Date.now() - started;
        console.log(`Request for ${req.urlWithParams} failed after ${elapsed} ms.`);
        // debugger;
        return throwError(error);
      })
    );

  }
}
