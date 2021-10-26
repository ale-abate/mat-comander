import {Injectable, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {CommandCenterService} from '../command-center.service';
import {CopyCommandService} from './copy-command-service';

export interface CommandListener {
  canExecute(ccs: CommandCenterService): boolean;
  doExecuteCommand(ccs: CommandCenterService): boolean;
}



@Injectable({
  providedIn: 'root'
})
export class CommandListenerService implements OnDestroy {


  private commands: {[key: string] : CommandListener} = {
      'copy' : new CopyCommandService()
  }
  private subscriptions: Subscription[] =[];

  constructor() {
  }

  ngOnDestroy(): void {
  }

  canExecuteCommand( ccs: CommandCenterService, command: string): boolean {
    const cmd = this.commands[command];
    if(!cmd) {
      console.error('COMMAND ' + command + ' not found');
      return false;
    } else {
      return cmd.canExecute(ccs);
    }
  }

  doExecuteCommand(ccs: CommandCenterService,command: string) {
    if(this.canExecuteCommand(ccs,command)) {
      return this.commands[command].doExecuteCommand(ccs);
    } else {
      return false;
    }
  }
}
