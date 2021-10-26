import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {McDir, McFile} from '../../services/directory-service';
import {DirectoryListDataSource} from './directory-list-datasource';
import {CommandCenterService, FolderListName} from '../../services/command-center.service';
import {Observable, of} from 'rxjs';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-directory-list',
  templateUrl: './directory-list.component.html',
  styleUrls: ['./directory-list.component.scss']
})
export class DirectoryListComponent implements   AfterViewInit, OnDestroy , OnInit{

  @Input('name') name: FolderListName = "left";


  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<McFile>;
  dataSource: DirectoryListDataSource;

  displayedColumns = ['name', 'ext','time','size', ];


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
    setTimeout(()=>{
      if (this.watchDouble === 1) {
        this.doSelection(row, ix, $event.ctrlKey);
      } else if (this.watchDouble === 2) {
        this.doAction(row, ix);
      }
      this.watchDouble = 0
    },200);
  }


  private doAction(row: McFile, ix: number) {
    if(this.currentRootDir) {
      this.ccs.doAction(this.name, this.currentRootDir, row);
    }
  }

  private doSelection(row: McFile, ix: number, multiple: boolean) {
    if(multiple) {
      this.selection.toggle(row);
      this.focusedRow.select(row)
    } else {
      this.focusedRow.select(row)
      this.selection.clear();
      this.selection.select(row);
    }

    console.log(this.selection.selected);

    if(this.selection.isEmpty()){
      if(this.focusedRow.isEmpty()){
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
}
