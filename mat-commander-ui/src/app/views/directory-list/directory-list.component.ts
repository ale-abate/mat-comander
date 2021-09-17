import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import {DirectoryService, McFile} from '../../services/directory-service';
import {DirectoryListDataSource} from './directory-list-datasource';
import {Observable, of} from 'rxjs';

@Component({
  selector: 'app-directory-list',
  templateUrl: './directory-list.component.html',
  styleUrls: ['./directory-list.component.scss']
})
export class DirectoryListComponent implements AfterViewInit {

  @Input('name') name: string = "";


  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<McFile>;
  dataSource: DirectoryListDataSource;

  displayedColumns = ['name', 'size'];

  constructor(private directoryService: DirectoryService) {

      this.dataSource = new DirectoryListDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.table.dataSource = this.dataSource;
  }

  refresh() {
    this.directoryService.listDir( {}).subscribe( f => this.dataSource.refresh(f) );
  }
}
