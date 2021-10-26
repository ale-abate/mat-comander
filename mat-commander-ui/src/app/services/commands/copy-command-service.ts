import {CommandListener} from './command-listener';
import {CommandCenterService} from '../command-center.service';


export class CopyCommandService implements CommandListener {


  constructor() { }

  canExecute(ccs: CommandCenterService): boolean {
    return true;
  }

  doExecuteCommand(ccs: CommandCenterService): boolean {
    console.log( 'COPY CMD');



    return true;
  }




}
