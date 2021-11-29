import {Injectable} from '@angular/core';
import {DirectoryService, McDir, McFile, McRootFolder} from './directory-service';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Configuration, PreferencesService} from './preferences.service';
import {map} from 'rxjs/operators';
import {CommandListener, CommandListenerService} from './commands/command-listener';
import {MatDialog} from '@angular/material/dialog';
import {ComponentType} from '@angular/cdk/portal';


export interface AppStatus {
  currentName?: 'left'| 'right';
  currentDir?: McDir;
  currentLeftDir?: McDir;
  currentRightDir?: McDir;
  rootList: McRootFolder[];
}

interface DirectoryEventSource {
  directoryChanged: Subject<McDir>;
  directoryContentChanged: Subject<McFile[]>,
  directoryFocusChanged: Subject<boolean>,
  directorySelectionChanged: BehaviorSubject<McFile[]>,
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
      directorySelectionChanged: new BehaviorSubject<McFile[]>([]),
    },
    "right": {
      directoryChanged: new BehaviorSubject<McDir>(<McDir>this.appStatus?.currentLeftDir),
      directoryContentChanged: new Subject<McFile[]>(),
      directoryFocusChanged: new BehaviorSubject<boolean>(false),
      directorySelectionChanged: new BehaviorSubject<McFile[]>([]),
    },
  };

  private rootListChanged = new BehaviorSubject<McRootFolder[]>([]);
  private keyCommandListChanges = new BehaviorSubject<{ [key: string]: string }>({});

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

  get OnKeyCommandListChanged(): Observable<{ [key: string]: string }> {
    return this.keyCommandListChanges.asObservable();
  }


  constructor(private directoryService: DirectoryService, private preferencesService: PreferencesService, private commandListenerService: CommandListenerService,
              public dialog: MatDialog) {
  }

  prepare(): AppStatus | Observable<AppStatus> {
    if (this.appStatus !== undefined) return this.appStatus;

    return this.preferencesService.getPreferences().pipe(
      map(p => this.prepareAppStatus(p)),
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

    this.notifyPreferencesChanges(conf);

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

  get AppStatus(): AppStatus {
    return <AppStatus>this.appStatus;
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

  doAction(name: FolderListName, currentRootDir: McDir, dirFile: McFile) {
    if(dirFile.dir) {
      this.doActionChangeDir(currentRootDir, dirFile, name);
    }
  }

  private doActionChangeDir(currentRootDir: McDir, row: McFile, name: "left" | "right") {
    if(row.name=='..') {
      const ix = currentRootDir.path?.lastIndexOf(currentRootDir.rootFolder.separator);
      if(ix) {
        currentRootDir.path = currentRootDir.path?.substring(0,ix);
      }
    } else {
      currentRootDir.path += currentRootDir.rootFolder.separator + row.name
    }

    console.log("DIR-changed to : " , currentRootDir.path);

    if (this.isLeft(name)) {
      // @ts-ignore
      this.appStatus.currentLeftDir = currentRootDir;
    } else {
      // @ts-ignore
      this.appStatus.currentRightDir = currentRootDir;
    }
    this.refreshDirectoryList(name);
    this.directoryEventSource[name].directoryChanged.next(currentRootDir);
  }

  notifyPreferencesChanges(conf: Configuration) {
    this.commandListenerService.setKeyCommands(conf.keyCommand);
    this.keyCommandListChanges.next(conf.keyCommand);
  }

  canExecuteCommand(command: string) {
    return this.commandListenerService.canExecuteCommand(this,command);
  }

  doExecuteCommand(command: string) {

    return this.commandListenerService.doExecuteCommand(this,command);
  }

  getCurrentSelection(name : FolderListName) {
    return this.directoryEventSource[name].directorySelectionChanged.value;
  }

  public openDialog<T>(component : ComponentType<T>, data: any) {

    this.commandListenerService.saveKeyCommands();

    const ref =  this.dialog.open(component, {restoreFocus: true, data});
    ref.afterClosed().subscribe(
        res=> this.commandListenerService.restoreKeyCommands()
    )

  }

  processKeyboardEvent(event: KeyboardEvent, supportedCommands: string[]) {
    this.commandListenerService.processKeyboardEvent(this,event, supportedCommands);
  }

  processLocalKeyboardEvent(event: KeyboardEvent, supportedCommands: string[], listener: CommandListener):boolean {
    return this.commandListenerService.processLocalKeyboardEvent(this,event, supportedCommands, listener);
  }
}
