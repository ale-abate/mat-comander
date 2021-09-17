import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';


export interface McFile {
  name: string ;
  ext:  string ;
  size: number ;
  dir:  boolean ;
  time?:  Date;
}

export interface  McDirFilter  {
  path?: string ;
}




@Injectable({
  providedIn: 'root'
})
export class DirectoryService {

  constructor(private http: HttpClient) { }

  listDir(filter : McDirFilter) : Observable<McFile[]> {
    return this.http.post<McFile[]>('/api/dir', filter);
  }

}
