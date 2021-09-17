import {AfterViewInit, Component, Input, OnDestroy, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {DirectoryService, McFile} from '../../services/directory-service';
import {DirectoryListDataSource} from './directory-list-datasource';
import {CommandCenterService} from '../../services/command-center.service';

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

  displayedColumns = ['name', 'size'];

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


  }

  refresh() {
    this.ccs.refreshDirectoryList(this.name);
  }

  ngOnDestroy(): void {
  }
}
