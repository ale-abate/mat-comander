import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Configuration, PreferencesService} from '../../services/preferences.service';

@Component({
  selector: 'app-preferences-form',
  templateUrl: './preferences-form.component.html',
  styleUrls: ['./preferences-form.component.scss']
})
export class PreferencesFormComponent implements OnInit {
  preferencesForm = this.fb.group({
    leftFolder: [null, Validators.required],
    rightFolder: [null, Validators.required],
    rememberLastUsedFolders: [true],
  });
  private configuration: Configuration = {};


  constructor(private fb: FormBuilder, private preferencesService: PreferencesService) {
  }

  ngOnInit(): void {
    this.preferencesService.getPreferences().subscribe(p => this.readPreferences(p))
  }

  applyPreferences(): void {
    this.configuration = {...this.configuration, ...this.preferencesForm.value};
    this.preferencesService.savePreferences(this.configuration).subscribe( p => this.readPreferences(p))
  }

  private readPreferences(conf: Configuration) {
    this.configuration = conf
    console.log(conf)
    this.preferencesForm.setValue({
        leftFolder: conf.leftFolder,
        rightFolder: conf.rightFolder,
        rememberLastUsedFolders: conf.rememberLastUsedFolders,
      }
    )
  }
}
