import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {OtroExampleComponent} from './otro-example/otro-example.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NavigationFrameComponent} from './navigation-frame/navigation-frame.component';
import {LayoutModule} from '@angular/cdk/layout';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {PreferencesFormComponent} from './config/preferences-form/preferences-form.component';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ToolsComponent} from './config/tools/tools.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatMenuModule} from '@angular/material/menu';
import {TwoListsComponent} from './views/two-lists/two-lists.component';
import {DirectoryListComponent} from './views/directory-list/directory-list.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {LoaderInterceptor} from './interceptors/loader-interceptor.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import {NgxFilesizeModule} from 'ngx-filesize';
import {DirToolbarComponent} from './views/dir-toolbar/dir-toolbar.component';
import {CopyFilesDlgComponent} from './commands/copy-files-dlg/copy-files-dlg.component';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    OtroExampleComponent,
    NavigationFrameComponent,
    PreferencesFormComponent,
    ToolsComponent,
    TwoListsComponent,
    DirectoryListComponent,
    DirToolbarComponent,
    CopyFilesDlgComponent
  ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        LayoutModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MatInputModule,
        MatSelectModule,
        MatRadioModule,
        MatCardModule,
        ReactiveFormsModule,
        MatGridListModule,
        MatMenuModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatCheckboxModule,
        MatProgressBarModule,
        MatDialogModule,
        NgxFilesizeModule,
        FormsModule,
    ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
