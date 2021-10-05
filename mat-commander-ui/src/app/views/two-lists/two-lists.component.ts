import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommandCenterService, FolderListName} from '../../services/command-center.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {McFile} from '../../services/directory-service';


@Component({
  selector: 'app-two-lists',
  templateUrl: './two-lists.component.html',
  styleUrls: ['./two-lists.component.scss']
})
export class TwoListsComponent implements OnInit, OnDestroy {
  focused?: FolderListName = undefined;

  files:  { [dirSource: string]: McFile[] } = {
      "right" : [],
      "left" : []
  };

  private subscriptions: Subscription[] =[];


  constructor(private route: ActivatedRoute,
    public ccs: CommandCenterService) {

    this.subscriptions.push(this.ccs.OnDirectoryFocus('right').subscribe(  active =>
      this.focused = active ? 'right' : 'left'
    ));

    this.subscriptions.push(this.ccs.OnDirectorySelectionChanged('right').subscribe(  files =>
      this.files['right'] = files
    ));
    this.subscriptions.push(this.ccs.OnDirectorySelectionChanged('left').subscribe(  files =>
      this.files['left'] = files
    ));


  }

  ngOnInit(): void {
    this.route.data.subscribe(
      data =>
          console.log('two-list ready', data.appStatus)
    )

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }


}
