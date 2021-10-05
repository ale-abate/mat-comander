import {Injectable} from '@angular/core';
import {DirectoryService, McDir, McFile, McRootFolder} from './directory-service';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Configuration, PreferencesService} from './preferences.service';
import {map} from 'rxjs/operators';


export interface AppStatus {
  currentName?: string;
  currentDir?: McDir;
  currentLeftDir?: McDir;
  currentRightDir?: McDir;
  rootList: McRootFolder[];
}

interface DirectoryEventSource {
  directoryChanged: Subject<McDir>;
  directoryContentChanged: Subject<McFile[]>,
  directoryFocusChanged: Subject<boolean>,
  directorySelectionChanged: Subject<McFile[]>,
}

export type FolderListName =  'left'| 'right';



@Injectable({
  providedIn: 'root'
})
export class CommandCenterService {
  private appStatus: AppStatus | undefined = undefined;

  private directoryEventSource: { [dirSource: string]: DirectoryEventSource } = {
    "left": {
      directoryChanged: new BehaviorSubject<McDir>(<McDir>this.appStatus?.currentLeftDir),
      directoryContentChanged: new Subject<McFile[]>(),
      directoryFocusChanged: new BehaviorSubject<boolean>(false),
      directorySelectionChanged: new Subject<McFile[]>(),
    },
    "right": {
      directoryChanged: new BehaviorSubject<McDir>(<McDir>this.appStatus?.currentLeftDir),
      directoryContentChanged: new Subject<McFile[]>(),
      directoryFocusChanged: new BehaviorSubject<boolean>(false),
      directorySelectionChanged: new Subject<McFile[]>(),
    },
  };

  private rootListChanged = new BehaviorSubject<McRootFolder[]>([]);


  onDirectoryChanged(name: FolderListName): Observable<McDir> {
    return this.directoryEventSource[name].directoryChanged.asObservable();
  }


  OnContentDirectoryChanged(name: FolderListName): Observable<McFile[]> {
    return this.directoryEventSource[name].directoryContentChanged.asObservable();
  }

  OnDirectoryFocus(name: FolderListName): Observable<boolean> {
    return this.directoryEventSource[name].directoryFocusChanged.asObservable();
  }

  OnDirectorySelectionChanged(name: FolderListName): Observable<McFile[]> {
    return this.directoryEventSource[name].directorySelectionChanged.asObservable();
  }

  get onRootListChanged(): Observable<McRootFolder[]> {
    return this.rootListChanged.asObservable();
  }



  constructor(private directoryService: DirectoryService, private preferencesService: PreferencesService) {
  }

  prepare(): AppStatus | Observable<AppStatus> {
    if (this.appStatus !== undefined) return this.appStatus;

    return this.preferencesService.getPreferences().pipe(
      map(p => this.prepareAppStatus(p))
    );
  }

  private prepareAppStatus(conf: Configuration): AppStatus {
    this.appStatus = {
      rootList: [],
      currentName: "left",
      currentLeftDir: conf.left_dir,
      currentRightDir: conf.right_dir,
    };

    this.appStatus.currentDir = this.appStatus.currentLeftDir;

    if (this.appStatus.currentLeftDir) {
      this.directoryEventSource.left.directoryChanged.next(this.appStatus.currentLeftDir);
    }
    if (this.appStatus.currentRightDir) {
      this.directoryEventSource.right.directoryChanged.next(this.appStatus.currentRightDir);
    }
    this.refreshRootList();

    this.requestFocus("left");

    return this.appStatus;
  }

  private refreshRootList() {
    this.directoryService.listRoot().subscribe(roots => {
      if (this.appStatus &&
        JSON.stringify(this.appStatus.rootList) != JSON.stringify(roots)) {
        this.appStatus.rootList = roots;
        this.rootListChanged.next(roots);
      }
    });
  }

  refreshDirectoryList(name: FolderListName) {

    const path = this.isLeft(name) ? this.appStatus?.currentLeftDir?.path : this.appStatus?.currentRightDir?.path;
    this.directoryService.listDir({path}).subscribe(
      content => {
        this.directoryEventSource[name].directoryContentChanged.next(content);
      }
    );
  }

  private isLeft(name: FolderListName): boolean {
    return name == "left";
  }

  requestFocus(name: FolderListName) {
    const left = this.isLeft(name);
    if (this.appStatus) {
      this.appStatus.currentName = name;
    }
    this.directoryEventSource.left.directoryFocusChanged.next(left);
    this.directoryEventSource.right.directoryFocusChanged.next(!left);
  }


  notifySelection(name: FolderListName, selectedFiles: McFile[]) {
    this.directoryEventSource[name].directorySelectionChanged.next(selectedFiles);
  }

  doAction(name: FolderListName, currentRootDir: McDir, row: McFile) {
    currentRootDir.path += '/' + row.name
    if(this.isLeft(name)) {
      // @ts-ignore
      this.appStatus.currentLeftDir  = currentRootDir;
    } else {
      // @ts-ignore
      this.appStatus.currentRightDir = currentRootDir;
    }
    alert(currentRootDir?.path)

    this.refreshDirectoryList(name);
  }
}
