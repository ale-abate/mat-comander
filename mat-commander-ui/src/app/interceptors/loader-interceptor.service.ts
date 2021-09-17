import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler, HttpHeaderResponse,
  HttpInterceptor, HttpProgressEvent,
  HttpRequest, HttpResponse,
  HttpSentEvent, HttpUserEvent
} from '@angular/common/http';
import {Observable, ObservableInput} from 'rxjs';
import {LoaderService} from '../services/loader.service';
import {catchError, finalize} from 'rxjs/operators';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(private loaderService: LoaderService) {
  }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    if (this.requests.length == 0) {
      this.loaderService.hide();
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.requests.push(req);
    this.loaderService.show();
    return next.handle(req).pipe(
      catchError(  (err , caught) =>  this.handleErrors( err, caught) ),
      finalize(() => {
        this.removeRequest(req)
      }),
    );
  }

  private handleErrors(err: any, caught: Observable<HttpSentEvent | HttpHeaderResponse | HttpResponse<any> | HttpProgressEvent | HttpUserEvent<any>>) : ObservableInput<any> {
    console.log(`Handle error   ${err.status} =  ${err.statusText} = ${err.message}`);
    throw caught;
  }
}
