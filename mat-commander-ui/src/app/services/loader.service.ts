import { Injectable } from '@angular/core';
import {BehaviorSubject, timer} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  public isLoading = new BehaviorSubject(false);
  constructor() { }

  show() {
    console.log('show')
    timer(10).subscribe(() => this.isLoading.next(true));
  }

  hide() {
    console.log('hide')
    timer(10).subscribe(() => this.isLoading.next(false));
  }

}
