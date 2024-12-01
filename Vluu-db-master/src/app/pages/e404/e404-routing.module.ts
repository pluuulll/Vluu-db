import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { E404Page } from './e404.page';

const routes: Routes = [
  {
    path: '',
    component: E404Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class E404PageRoutingModule {}
