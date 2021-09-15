import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OtroExampleComponent} from './otro-example/otro-example.component';
import {PreferencesFormComponent} from './config/preferences-form/preferences-form.component';
import {ToolsComponent} from './config/tools/tools.component';
import {TwoListsComponent} from './views/two-lists/two-lists.component';

const routes: Routes = [
  {path: '', component: TwoListsComponent},
  {path: 'home', component: TwoListsComponent},
  {path: 'otro', component: OtroExampleComponent},
  {path: 'config/tools', component: ToolsComponent},
  {path: 'config/preferences', component: PreferencesFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
