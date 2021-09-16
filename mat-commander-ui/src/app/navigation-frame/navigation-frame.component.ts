import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {DirectoryService} from '../services/directory-service';
import {LoaderService} from '../services/loader.service';

@Component({
  selector: 'app-navigation-frame',
  templateUrl: './navigation-frame.component.html',
  styleUrls: ['./navigation-frame.component.scss']
})
export class NavigationFrameComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  public showProgressBar$: Observable<Boolean>;

  constructor(private breakpointObserver: BreakpointObserver ,
             private  loaderService: LoaderService) {

      this.showProgressBar$ = loaderService.isLoading.asObservable();
  }



}
