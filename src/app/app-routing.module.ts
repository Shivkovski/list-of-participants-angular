import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { ListOfParticipantsComponent } from './list-of-participants/list-of-participants.component';

const routes: Routes = [
  {path: "", pathMatch: "full", redirectTo: "registration_page"},
  {path: "registration_page", component: RegistrationPageComponent},
  {path: "list_of_participants", component: ListOfParticipantsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const RoutingComponents = [RegistrationPageComponent, ListOfParticipantsComponent]
