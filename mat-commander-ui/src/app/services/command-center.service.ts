import {Injectable} from '@angular/core';
import {DirectoryService, McFile, McRootFolder} from './directory-service';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Configuration, PreferencesService} from './preferences.service';
import {map} from 'rxjs/operators';


export interface AppStatus {
  currentName?: string;
  currentFolder?: McFile;
  currentLeftFolder? : McFile;
  currentRightFolder? : McFile;
  rootList:  McRootFolder[];
}



@Injectable({
  providedIn: 'root'
})
export class CommandCenterService {
  private appStatus : AppStatus | undefined = undefined;

  private directoryChanged  =  {
    "left" : new BehaviorSubject<McFile>(<McFile>this.appStatus?.currentLeftFolder),
    "right" : new BehaviorSubject<McFile>(<McFile>this.appStatus?.currentRightFolder),
  }
  private directoryContentChanged  =  {
    "left" : new Subject<McFile[]>(),
    "right" : new Subject<McFile[]>(),
  }
  private directoryFocusChanged  =  {
    "left" : new BehaviorSubject<boolean>(false),
    "right" : new BehaviorSubject<boolean>(false),
  }

  private rootListChanged = new BehaviorSubject<McRootFolder[]>([]);


  onDirectoryChanged(name: string) : Observable<McFile>   {
    return this.isLeft(name) ? this.directoryChanged.left.asObservable() : this.directoryChanged.right.asObservable();
  }

  OnContentDirectoryChanged(name: string) : Observable<McFile[]>   {
    return this.isLeft(name) ? this.directoryContentChanged.left.asObservable() : this.directoryContentChanged.right.asObservable();
  }

  OnDirectoryFocus(name: string) : Observable<boolean>   {
    return this.isLeft(name) ? this.directoryFocusChanged.left.asObservable() : this.directoryFocusChanged.right.asObservable();
  }

  get onRootListChanged() : Observable<McRootFolder[]>   {
    return this.rootListChanged.asObservable();
  }

  constructor( private directoryService : DirectoryService, private preferencesService: PreferencesService ) {
  }

  prepare()  : AppStatus | Observable<AppStatus>  {
    if(this.appStatus !== undefined)  return this.appStatus;

    return this.preferencesService.getPreferences().pipe(
        map(  p => this.prepareAppStatus(p) )
    );
  }

  private prepareAppStatus(conf: Configuration) :AppStatus {
    this.appStatus = {
      rootList: [],
      currentName: "left",
      currentLeftFolder: { name: conf.leftFolder as string},
      currentRightFolder: { name: conf.rightFolder as string}
    };

    this.appStatus.currentFolder = this.appStatus.currentLeftFolder;

    if (this.appStatus.currentLeftFolder) {
      this.directoryChanged.left.next(this.appStatus.currentLeftFolder);
    }
    if (this.appStatus.currentRightFolder) {
      this.directoryChanged.right.next(this.appStatus.currentRightFolder);
    }
    this.refreshRootList();

    this.requestFocus("left");

    return this.appStatus;
  }

  private refreshRootList() {
    this.directoryService.listRoot().subscribe(roots => {
      if( this.appStatus &&
        JSON.stringify(this.appStatus.rootList) != JSON.stringify(roots)) {
        this.appStatus.rootList=roots;
        this.rootListChanged.next(roots);
      }
    });
  }

  refreshDirectoryList(name: string) {

    const path = this.isLeft(name) ? this.appStatus?.currentLeftFolder?.name : this.appStatus?.currentRightFolder?.name;
    this.directoryService.listDir({path}).subscribe(
      content => {
        if (this.isLeft(name))
          this.directoryContentChanged.left.next(content);
        else
          this.directoryContentChanged.right.next(content);
      }
    );
  }

  private isLeft(name: string):boolean {
    return name == "left";
  }

  requestFocus(name: string) {
    const left =  this.isLeft(name) ;
    if(this.appStatus) {
      this.appStatus.currentName = name;
    }

    this.directoryFocusChanged.left.next(left);
    this.directoryFocusChanged.right.next(!left);
  }
}
