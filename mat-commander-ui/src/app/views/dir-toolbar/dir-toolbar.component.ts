import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatSelectChange} from '@angular/material/select';
import {Observable, Subscription} from 'rxjs';
import {DirectoryService, McDir, McDirFilter, McFile, McRootFolder} from '../../services/directory-service';
import {CommandCenterService, FolderListName} from '../../services/command-center.service';

@Component({
  selector: 'app-dir-toolbar',
  templateUrl: './dir-toolbar.component.html',
  styleUrls: ['./dir-toolbar.component.scss']
})
export class DirToolbarComponent implements OnInit, OnDestroy {
  @Input('name') name: FolderListName = "left";
  rootList$: Observable<McRootFolder[]>;
  public selectedRoot: McRootFolder = {name: '', type: '', separator: '/'};
  private dcSubscription: Subscription | null= null;

  public pathParts: string[] = [];
  subDirs: McFile[] = [] ;

  constructor(public ccs: CommandCenterService, private ds: DirectoryService) {
    this.rootList$ = this.ccs.onRootListChanged;

  }

  ngOnInit(): void {
    this.dcSubscription = this.ccs.onDirectoryChanged(this.name).subscribe(
      d => this.onDirectoryChanged(d)
    )
  }

  ngOnDestroy(): void {
    if(this.dcSubscription) {
      this.dcSubscription.unsubscribe();
    }
  }

  compareByName(o1: any, o2: any): boolean {
    return o1.name == o2.name;
  }

  doRootSelectionChange($event: MatSelectChange) {
    console.log('doRootSelectionChange', $event.value);
    this.selectedRoot = $event.value
  }


  private onDirectoryChanged(dir: McDir) {
    this.selectedRoot = dir.rootFolder;
    console.log('dc',this.name, dir.rootFolder.separator, JSON.stringify(dir));
    this.pathParts=   dir.path?.split(dir.rootFolder.separator) as string[];
  }

  private extractPathFilter(ix: number) {
    let newPath = "";
    let sep = "";
    this.pathParts.filter((p, arrIx) => arrIx <= ix).forEach((p, ix) => {
      newPath += sep + p;
      sep = this.selectedRoot.separator;
    });
    return newPath;

  }


  clickPathSeparatorPart(part: string, ix: number) {
    const newPath = this.extractPathFilter(ix);
    const filter: McDirFilter = {
      path: newPath,
      onlyDirs: true
    };

    this.subDirs = [];
    this.ds.listDir(filter).subscribe(
      d => this.subDirs = d
    );

  }



  changeFolder(subDir: McFile, ix: number) {
    const path = this.extractPathFilter(ix);
    let dir:McDir = {rootFolder: this.selectedRoot, path, file: subDir};
    this.ccs.doAction( this.name, dir, subDir);
  }

  changeFolderByPart(s: string, ix: number) {
    const subDir: McFile = {name: '',dir:true}
    this.changeFolder(subDir,ix);
  }
}
