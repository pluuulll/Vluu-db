import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { RecomendacionesPageRoutingModule } from './recomendaciones-routing.module';
import { RecomendacionesPage } from './recomendaciones.page';
import { ArtistListPipe } from './artist-list.pipe'; // Importa el nuevo pipe

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecomendacionesPageRoutingModule
  ],
  declarations: [
    RecomendacionesPage,
    ArtistListPipe // Añade el pipe a las declaraciones
  ]
})
export class RecomendacionesPageModule {}