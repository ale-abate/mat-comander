import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

export interface Configuration {
  leftFolder?: string;
  rightFolder?: string;
  rememberLastUsedFolders?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class PreferencesService {

  constructor(private http: HttpClient) { }

  getPreferences() : Observable<Configuration> {
    return this.http.get<Configuration>('./api/config/preferences');
  }

  savePreferences(configuration: Configuration) : Observable<Configuration> {
    return this.http.post<Configuration>('./api/config/preferences', configuration);
  }
}
