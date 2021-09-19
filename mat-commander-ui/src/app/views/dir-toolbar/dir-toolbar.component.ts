import {Component, Input, OnInit} from '@angular/core';
import {MatSelectChange} from '@angular/material/select';
import {Observable} from 'rxjs';
import {McRootFolder} from '../../services/directory-service';
import {CommandCenterService} from '../../services/command-center.service';

@Component({
  selector: 'app-dir-toolbar',
  templateUrl: './dir-toolbar.component.html',
  styleUrls: ['./dir-toolbar.component.scss']
})
export class DirToolbarComponent implements OnInit {
  @Input('name') name: string = "";
  rootList$: Observable<McRootFolder[]>;
  public selectedRoot: McRootFolder  = { name: '', type: ''};

  constructor(public ccs: CommandCenterService) {
    this.rootList$ = this.ccs.onRootListChanged;

  }
  ngOnInit(): void {
  }
  compareByName( o1 : any, o2: any): boolean {
    return o1.name==o2.name;
  }

  doRootSelectionChange($event: MatSelectChange) {
    console.log('doRootSelectionChange', $event.value);
    this.selectedRoot = $event.value
  }
}
