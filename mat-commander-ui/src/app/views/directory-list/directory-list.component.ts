import {AfterViewInit, Component, HostListener, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {McDir, McFile} from '../../services/directory-service';
import {DirectoryListDataSource} from './directory-list-datasource';
import {CommandCenterService, FolderListName} from '../../services/command-center.service';
import {Observable, of} from 'rxjs';
import {SelectionModel} from '@angular/cdk/collections';
import {CommandListener} from '../../services/commands/command-listener';

@Component({
  selector: 'app-directory-list',
  templateUrl: './directory-list.component.html',
  styleUrls: ['./directory-list.component.scss']
})
export class DirectoryListComponent implements AfterViewInit, OnDestroy, OnInit, CommandListener {

  private supportedLocalCommands: string[] = ["toggle_selection", "select_up", "select_down", "up", "down", "action"];
  private supportedGlobalCommands: string[] = [];

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    const currentPanel = this.ccs.AppStatus.currentName === this.name;


    if (currentPanel && !this.ccs.processLocalKeyboardEvent(event, this.supportedLocalCommands, this)) {
      this.ccs.processKeyboardEvent(event, this.supportedGlobalCommands);
    }

  }

  @Input('name') name: FolderListName = "left";
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<McFile>;
  dataSource: DirectoryListDataSource;

  displayedColumns = ['name', 'ext', 'time', 'size',];


  active$: Observable<boolean> = of(false);
  selection: SelectionModel<McFile> = new SelectionModel<McFile>(true, []);
  focusedRow: SelectionModel<McFile> = new SelectionModel<McFile>(false, []);

  private currentRootDir?: McDir = undefined;

  constructor(private ccs: CommandCenterService) {
    this.dataSource = new DirectoryListDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.table.dataSource = this.dataSource;

    this.ccs.onDirectoryChanged(this.name)
      .subscribe(
        dir => {
          this.refresh()
          this.ccs.notifySelection(this.name, []);
          this.currentRootDir = dir;
        }
      );
    this.ccs.OnContentDirectoryChanged(this.name).subscribe(
      f => {
        this.dataSource.refresh(f);
        this.clearSelection();
      }
    );

  }

  ngOnInit(): void {
    this.active$ = this.ccs.OnDirectoryFocus(this.name);
  }


  refresh() {
    this.ccs.refreshDirectoryList(this.name);
    this.clearSelection();
  }

  ngOnDestroy(): void {
  }

  focus() {
    this.ccs.requestFocus(this.name);
  }


  private watchDouble: number = 0;

  selectRow($event: MouseEvent, row: McFile, ix: number) {
    this.watchDouble += 1;
    setTimeout(() => {
      if (this.watchDouble === 1) {
        this.doSelection(row, ix, $event.ctrlKey);
      } else if (this.watchDouble === 2) {
        this.doAction(row, ix);
      }
      this.watchDouble = 0
    }, 200);
  }


  private doAction(row: McFile, ix: number) {
    if (this.currentRootDir) {
      this.ccs.doAction(this.name, this.currentRootDir, row);
    }
  }

  private doSelection(row: McFile, ix: number, multiple: boolean) {
    if (multiple) {
      this.selection.toggle(row);
      this.focusedRow.select(row)
    } else {
      this.focusedRow.select(row)
      this.selection.clear();
      this.selection.select(row);
    }

    console.log(this.selection.selected);

    if (this.selection.isEmpty()) {
      if (this.focusedRow.isEmpty()) {
        this.ccs.notifySelection(this.name, []);
      } else {
        this.ccs.notifySelection(this.name, this.focusedRow.selected);
      }
    } else {
      this.ccs.notifySelection(this.name, this.selection.selected);
    }
  }

  isFileSelected(row: McFile, ix: number) {
    return this.selection.isSelected(row);
  }

  isRowSelected(row: McFile, ix: number) {
    return this.focusedRow.isSelected(row);
  }

  private clearSelection() {
    this.focusedRow.clear();
    this.selection.clear();
    this.ccs.notifySelection(this.name, []);
  }


  canExecute(ccs: CommandCenterService, command: string): boolean {
    return true;
  }

  doExecuteCommand(ccs: CommandCenterService, command: string): boolean {
    if (command == 'toggle_selection') {
      return this.doToggleSelectionCommand();
    }
    if (command == 'up' || command == 'down') {
      return this.doUpDown(command);
    }
    if (command == 'action' ) {
      return this.doActionByKey();
    }


    return false;
  }


  private doToggleSelectionCommand(): boolean {
    const current = this.focusedRow.selected;
    if (current && current.length > 0) {

      if (this.selection.selected.length != 1 || !this.compareFiles(current[0], this.selection.selected[0])) {
        this.selection.toggle(current[0]);
      }

      this.ccs.notifySelection(this.name, this.selection.selected);

      const currentList = this.dataSource.getCurrentData();
      const index = currentList.findIndex(data => this.compareFiles(current[0], data));
      if (index >= 0) {
        if (index < currentList.length - 1) {
          this.focusedRow.select(currentList[index + 1]);
        }
      }

    }
    return true;
  }

  private compareFiles(file1: McFile, file2: McFile) {
    return file1.name + file1.ext == file2.name + file2.ext;
  }

  private doUpDown(command: string): boolean {
    const currentList = this.dataSource.getCurrentData();
    if(currentList.length==0) return true;


    const current = this.focusedRow.selected;
    if (current && current.length > 0) {
      let index = currentList.findIndex(data => current[0].name + current[0].ext == data.name + data.ext);
      if(index>=1 && command=='up') index --;
      if(index<currentList.length-1 && command=='down') index ++;

      if (this.selection.selected.length != 1 || !this.compareFiles(current[0], this.selection.selected[0])) {
        this.focusedRow.select(currentList[index]);
      } else {
        this.doSelection(currentList[index], index ,false);
      }

    } else {
      this.doSelection(currentList[0], 0 ,false);
    }

    return true;
  }

  private doActionByKey(): boolean {
    const current = this.focusedRow.selected;
    const currentList = this.dataSource.getCurrentData();
    const index = currentList.findIndex(data => current[0].name + current[0].ext == data.name + data.ext);

    console.log('action',current,index)


    if(index!= -1 && current && current[0])
        this.doAction(current[0],index);

    return true;
  }
}
