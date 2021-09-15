import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {DirectoryService} from '../directory-service';

@Component({
  selector: 'app-navigation-frame',
  templateUrl: './navigation-frame.component.html',
  styleUrls: ['./navigation-frame.component.css']
})
export class NavigationFrameComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private directoryService : DirectoryService ) {
  }

  public list : string[] = []

  test() {

    this.directoryService.listDir().subscribe( l => this.list=l)

  }
}
