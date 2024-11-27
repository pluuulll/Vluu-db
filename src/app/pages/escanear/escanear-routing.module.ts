import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EscanearPage } from './escanear.page';

const routes: Routes = [
  {
    path: '',
    component: EscanearPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EscanearPageRoutingModule {}
