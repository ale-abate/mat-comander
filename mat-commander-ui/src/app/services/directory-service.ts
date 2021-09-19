import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';


export interface McFile {
  name: string ;
  ext?:  string ;
  size?: number ;
  dir?:  boolean ;
  time?:  Date;
}


export interface  McDirFilter  {
  path?: string ;
}

export interface  McRootFolder   {
  name: string ;
  type:  string ;
}



@Injectable({
  providedIn: 'root'
})
export class DirectoryService {

  constructor(private http: HttpClient) { }

  listDir(filter : McDirFilter) : Observable<McFile[]> {
    // post because http rest client does not support body
    return this.http.post<McFile[]>('/api/dir', filter);
  }

  listRoot() : Observable<McRootFolder[]> {
    return this.http.get<McRootFolder[]>('/api/root');
  }
}
