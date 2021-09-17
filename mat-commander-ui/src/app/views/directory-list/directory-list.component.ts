import {AfterViewInit, Component, Input, OnDestroy, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {McFile} from '../../services/directory-service';
import {DirectoryListDataSource} from './directory-list-datasource';
import {CommandCenterService} from '../../services/command-center.service';
import {Observable, of} from 'rxjs';

@Component({
  selector: 'app-directory-list',
  templateUrl: './directory-list.component.html',
  styleUrls: ['./directory-list.component.scss']
})
export class DirectoryListComponent implements   AfterViewInit, OnDestroy {

  @Input('name') name: string = "";


  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<McFile>;
  dataSource: DirectoryListDataSource;

  displayedColumns = ['name', 'ext','time','size', ];
  active$: Observable<boolean> = of(false);

  constructor(private ccs: CommandCenterService) {

    this.dataSource = new DirectoryListDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.table.dataSource = this.dataSource;

    console.log('init list', this.name)


    this.ccs.onDirectoryChanged(this.name)
      .subscribe(
        f => {
          console.log('dir ');
          this.refresh()
        }
      );
    this.ccs.OnContentDirectoryChanged(this.name).subscribe(
      f => {
        console.log('dir content')
        this.dataSource.refresh(f)
      }
    );
    this.active$ = this.ccs.OnDirectoryFocus(this.name);
  }

  refresh() {
    this.ccs.refreshDirectoryList(this.name);
  }

  ngOnDestroy(): void {
  }

  focus() {
    console.log('focus ', this.name, new Date())
    this.ccs.requestFocus(this.name);
  }
}
