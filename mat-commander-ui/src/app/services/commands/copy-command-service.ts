import {CommandListener} from './command-listener';
import {CommandCenterService, FolderListName} from '../command-center.service';
import {CopyFilesDlgComponent, CopyFilesPars} from '../../commands/copy-files-dlg/copy-files-dlg.component';
import {McFile} from '../directory-service';


export class CopyCommandService implements CommandListener {


  constructor() {
  }

  canExecute(ccs: CommandCenterService, command: string): boolean {
    return true;
  }

  doExecuteCommand(ccs: CommandCenterService, command: string): boolean {
    console.log('COPY CMD');
    const pars: CopyFilesPars = {side: <FolderListName>ccs.AppStatus.currentName, selection:[]};

    const selection = ccs.getCurrentSelection(pars.side)
    this.confirmCopy(ccs,
      pars, selection)
    return true;
  }

  confirmCopy(ccs: CommandCenterService, pars: CopyFilesPars, selection: McFile[]) {
    pars.selection = selection;
    ccs.openDialog(CopyFilesDlgComponent, pars);
  }


}
