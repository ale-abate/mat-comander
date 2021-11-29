import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {CommandCenterService, FolderListName} from '../../services/command-center.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {McFile} from '../../services/directory-service';
import {CommandListener, CommandListenerService} from '../../services/commands/command-listener';


@Component({
  selector: 'app-two-lists',
  templateUrl: './two-lists.component.html',
  styleUrls: ['./two-lists.component.scss']
})
export class TwoListsComponent implements OnInit, OnDestroy , CommandListener{
  focused?: FolderListName = undefined;

  private supportedLocalCommands: string[] = ["switch_panel"];
  private supportedGlobalCommands: string[] = ["copy"];


  files:  { [dirSource: string]: McFile[] } = {
      "right" : [],
      "left" : []
  };

  private subscriptions: Subscription[] =[];


  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if(!this.ccs.processLocalKeyboardEvent(event,this.supportedLocalCommands, this)) {
      this.ccs.processKeyboardEvent(event,this.supportedGlobalCommands);
    }
  }


  constructor(private route: ActivatedRoute,
    public ccs: CommandCenterService, private commandListener: CommandListenerService) {

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

  canExecute(ccs: CommandCenterService, command: string): boolean {
    return true;
  }

  doExecuteCommand(ccs: CommandCenterService, command: string): boolean {
    if( command=='switch_panel') {
      const panel = ccs.AppStatus.currentName === 'right' ? 'left' : 'right'
      this.ccs.requestFocus(panel);
    }
    return true;
  }


}
