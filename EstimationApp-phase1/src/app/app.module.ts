import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './signin/signin.component';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from "@angular/material/button";
import { FlexLayoutModule } from "@angular/flex-layout";
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import { forgetComponent } from './forget/forget.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDividerModule} from '@angular/material/divider';
import { SignupComponent } from './signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { PasswordComponent } from './password/password.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { InputTextModule } from 'primeng/inputtext';
import {MatStepperModule} from '@angular/material/stepper';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { MetricsComponent } from './metrics/metrics.component';
import { ApiService } from './service/api.service';
import { RfpComponent } from './rfp/rfp.component';
import { HeaderComponent } from './header/header.component';
import { SdlcComponent } from './sdlc/sdlc.component';
import {AsyncPipe} from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { ContactusComponent } from './contactus/contactus.component';
import { MsgComponent } from './msg/msg.component';
import { PrivacyComponent } from './privacy/privacy.component';
import {MatListModule} from '@angular/material/list';
import { ToastrModule } from 'ngx-toastr';
import { InlineComponent } from './inline/inline.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SetupComponent } from './setup/setup.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import { DataComponent } from './data/data.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { EditcompComponent } from './editcomp/editcomp.component';
import { PivotComponent } from './pivot/pivot.component';
import { AllocationComponent } from './allocation/allocation.component';
import { MatSelectModule } from '@angular/material/select';
import { SummaryComponent } from './summary/summary.component';
import { ResourceloadComponent } from './resourceload/resourceload.component';
import { AuthkeyInterceptor } from './interceptor/authkey.interceptor';
import { SetAllocationComponent } from './set-allocation/set-allocation.component';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    PasswordComponent,
    MetricsComponent,
    RfpComponent,
    HeaderComponent,
    SdlcComponent,
    ContactusComponent,
    MsgComponent,
    PrivacyComponent,
    DashboardComponent,
    forgetComponent,
    InlineComponent,
    SetupComponent,
    DataComponent,
    ConfirmDialogComponent,
    EditcompComponent,
    PivotComponent,
    AllocationComponent,
    SummaryComponent,
    ResourceloadComponent,
    SetAllocationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatCheckboxModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatToolbarModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    MatTableModule,
    MatTabsModule,
    MatMenuModule,
    MatPaginatorModule,
    DropdownModule,
    MatTooltipModule,
    ButtonModule,
    MessagesModule,
    PasswordModule,
    MessageModule,
    CalendarModule,
    ProgressSpinnerModule,
    InputTextModule,
    MatProgressBarModule,
    MatListModule,
    InputTextModule,
    MatStepperModule,
    AsyncPipe,
    ToastrModule.forRoot(),
    MatAutocompleteModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatSelectModule
  ],
  providers: [ ApiService,MessageService,RfpComponent,{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthkeyInterceptor,
    multi: true ,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
