import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Configuration, PreferencesService} from '../../services/preferences.service';
import {Observable} from 'rxjs';
import {McRootFolder} from '../../services/directory-service';
import {CommandCenterService} from '../../services/command-center.service';

@Component({
  selector: 'app-preferences-form',
  templateUrl: './preferences-form.component.html',
  styleUrls: ['./preferences-form.component.scss']
})
export class PreferencesFormComponent implements OnInit {
  preferencesForm = this.fb.group({
    leftFolder: [null, Validators.required],
    leftRootFolder: [null, Validators.required],
    rightFolder: [null, Validators.required],
    rightRootFolder: [null, Validators.required],
    rememberLastUsedFolders: [true],
  });

  private configuration: Configuration = {
    left_dir: {rootFolder:{name:"",type:"", separator: "/"}} ,
    right_dir: {rootFolder:{name:"",type:"", separator: "/"}},
    keyCommand: {}
  };

  rootList$: Observable<McRootFolder[]>;

  constructor(private fb: FormBuilder, private preferencesService: PreferencesService, private ccs: CommandCenterService) {
    this.rootList$ = this.ccs.onRootListChanged;
  }

  ngOnInit(): void {
    this.preferencesService.getPreferences().subscribe(p => this.readPreferences(p))
  }

  applyPreferences(): void {
    this.configuration = {...this.configuration, ...this.preferencesForm.value};

    this.configuration.left_dir.rootFolder=this.preferencesForm.value.leftRootFolder;
    this.configuration.left_dir.path=this.preferencesForm.value.leftFolder;
    this.configuration.right_dir.rootFolder=this.preferencesForm.value.rightRootFolder;
    this.configuration.right_dir.path=this.preferencesForm.value.rightFolder;

    this.preferencesService.savePreferences(this.configuration).subscribe(p => this.readPreferences(p))
  }

  private readPreferences(conf: Configuration) {
    this.configuration = conf
    this.preferencesForm.setValue({
        leftFolder: conf.left_dir.path,
        leftRootFolder: conf.left_dir.rootFolder,
        rightFolder: conf.right_dir.path,
        rightRootFolder: conf.right_dir.rootFolder,
        rememberLastUsedFolders: conf.rememberLastUsedFolders,
      }
    )

    this.ccs.notifyPreferencesChanges(conf);
  }

  compareByName(o1: any, o2: any): boolean {
    return o1.name == o2.name;
  }

}
