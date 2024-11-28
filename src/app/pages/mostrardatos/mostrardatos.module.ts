import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MostrardatosPageRoutingModule } from './mostrardatos-routing.module';

import { MostrardatosPage } from './mostrardatos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MostrardatosPageRoutingModule
  ],
  declarations: [MostrardatosPage]
})
export class MostrardatosPageModule {}
