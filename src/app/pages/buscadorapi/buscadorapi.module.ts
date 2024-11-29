import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuscadorapiPageRoutingModule } from './buscadorapi-routing.module';

import { BuscadorapiPage } from './buscadorapi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuscadorapiPageRoutingModule
  ],
  declarations: [BuscadorapiPage]
})
export class BuscadorapiPageModule {}
