import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecomendacionesPage } from './recomendaciones.page';

const routes: Routes = [
  {
    path: '',
    component: RecomendacionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecomendacionesPageRoutingModule {}
