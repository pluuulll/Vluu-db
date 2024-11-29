import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuscadorapiPage } from './buscadorapi.page';

const routes: Routes = [
  {
    path: '',
    component: BuscadorapiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuscadorapiPageRoutingModule {}
