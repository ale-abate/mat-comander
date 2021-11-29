import {Injectable, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {CommandCenterService} from '../command-center.service';
import {CopyCommandService} from './copy-command-service';


export interface CommandListener {
  canExecute(ccs: CommandCenterService, command: string): boolean;
  doExecuteCommand(ccs: CommandCenterService, command: string): boolean;
}



@Injectable({
  providedIn: 'root'
})
export class CommandListenerService implements OnDestroy {

  private keyCommands: { [key: string]: string } ={};


  private commands: {[key: string] : CommandListener} = {
      'copy' : new CopyCommandService(),
  }
  private subscriptions: Subscription[] =[];
  private savedKeyCommands: { [p: string]: string } = {};

  constructor() {
  }

  ngOnDestroy(): void {
  }

  setKeyCommands(keyCommand: {[p: string]: string}) {
    this.keyCommands = keyCommand;
  }


  canExecuteCommand( ccs: CommandCenterService, command: string): boolean {
    const cmd = this.commands[command];
    if(!cmd) {
      console.error('COMMAND ' + command + ' not found');
      return false;
    } else {
      return cmd.canExecute(ccs, command);
    }
  }

  doExecuteCommand(ccs: CommandCenterService,command: string) {
    if(this.canExecuteCommand(ccs,command)) {
      return this.commands[command].doExecuteCommand(ccs,command);
    } else {
      return false;
    }
  }

  processKeyboardEvent( ccs: CommandCenterService, event: KeyboardEvent, supportedCommands: string[]) {
    console.log('Global KEY: ', event.key);

    if( this.keyCommands[event.key] )  {
      const commandName = this.keyCommands[event.key];
      if(  supportedCommands.includes(commandName)) {
        console.log('KEY: ', event.key, " Command: ", commandName);

        if (ccs.canExecuteCommand(commandName)) {
          ccs.doExecuteCommand(commandName);
          event.stopPropagation();
        }

        event.preventDefault();
      }
    }
  }

  processLocalKeyboardEvent(ccs: CommandCenterService, event: KeyboardEvent, supportedCommands: string[], listener: CommandListener) {
    console.log('LOCAL KEY: ', event.key);
    const commandName = this.keyCommands[event.key];
    if(  supportedCommands.includes(commandName)) {
      if (listener.canExecute(ccs,commandName)) {
        listener.doExecuteCommand(ccs,commandName);
        event.stopPropagation();
        event.preventDefault();
        return true;
      }
    }
    return false;
  }

  saveKeyCommands() {
    this.savedKeyCommands = this.keyCommands;
    this.keyCommands = {};
  }

  restoreKeyCommands() {
    this.keyCommands = this.savedKeyCommands;
  }


}
