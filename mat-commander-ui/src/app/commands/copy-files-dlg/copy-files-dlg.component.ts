import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {McFile} from '../../services/directory-service';
import {FolderListName} from '../../services/command-center.service';

export interface CopyFilesPars {
  selection: McFile[];
  side: FolderListName;


}


@Component({
  selector: 'app-copy-files-dlg',
  templateUrl: './copy-files-dlg.component.html',
  styleUrls: ['./copy-files-dlg.component.scss']
})
export class CopyFilesDlgComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: CopyFilesPars) { }

  ngOnInit(): void {
  }

}
