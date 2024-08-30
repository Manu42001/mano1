import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PasswordComponent } from './password/password.component';
import { MetricsComponent } from './metrics/metrics.component';
import { RfpComponent } from './rfp/rfp.component';
import { SdlcComponent } from './sdlc/sdlc.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { MsgComponent } from './msg/msg.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ContactusComponent } from './contactus/contactus.component';
import { forgetComponent } from './forget/forget.component';
import { InlineComponent } from './inline/inline.component';
import { SetupComponent } from './setup/setup.component';
import { DataComponent } from './data/data.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { AllocationComponent } from './allocation/allocation.component';
import { PivotComponent } from './pivot/pivot.component';
import { SummaryComponent } from './summary/summary.component';
const routes: Routes = [
  { path: '', component: SigninComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'password', component: PasswordComponent },
  { path: 'setup', component: SetupComponent},
  { path: 'aboutus', component: AboutusComponent },
  { path: 'effortEstimation', component: InlineComponent },
  { path: 'contactus', component: ContactusComponent },
  { path: 'metrics', component: MetricsComponent },
  { path: 'msg', component: MsgComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'rfp', component: RfpComponent },
  { path: 'sdlc', component: SdlcComponent },
  { path: 'dashboard', component: DashboardComponent },
  {path:'forget',component:forgetComponent},
  {path:'data',component:DataComponent},
  {path:'confirm',component:ConfirmDialogComponent},
  {path:'alloc',component:AllocationComponent},
  {path:'pivot',component:PivotComponent},
  {path:'summary',component:SummaryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
