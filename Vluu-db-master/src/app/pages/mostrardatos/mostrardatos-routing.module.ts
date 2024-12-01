import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MostrardatosPage } from './mostrardatos.page';

const routes: Routes = [
  {
    path: '',
    component: MostrardatosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MostrardatosPageRoutingModule {}
