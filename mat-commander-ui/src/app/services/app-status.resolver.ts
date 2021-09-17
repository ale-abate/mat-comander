import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {AppStatus, CommandCenterService} from './command-center.service';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class AppStatusResolver implements Resolve<AppStatus>{

  constructor(private ccs: CommandCenterService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AppStatus> | Promise<AppStatus> | AppStatus {
    return this.ccs.prepare();
  }


}
