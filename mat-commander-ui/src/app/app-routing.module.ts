import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OtroExampleComponent} from './otro-example/otro-example.component';
import {PreferencesFormComponent} from './config/preferences-form/preferences-form.component';
import {ToolsComponent} from './config/tools/tools.component';
import {TwoListsComponent} from './views/two-lists/two-lists.component';
import {AppStatusResolver} from './services/app-status.resolver';

const routes: Routes = [
  {path: '', component: TwoListsComponent, resolve: { "appStatus" : AppStatusResolver}},
  {path: 'home', component: TwoListsComponent, resolve: { "appStatus" : AppStatusResolver}},
  {path: 'otro', component: OtroExampleComponent},
  {path: 'config/tools', component: ToolsComponent},
  {path: 'config/preferences', component: PreferencesFormComponent, resolve: { "appStatus" : AppStatusResolver}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
