import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { InicioPageRoutingModule } from './inicio-routing.module'; // Ruta de la página
import { InicioPage } from './inicio.page'; // Componente de la página

@NgModule({
  imports: [
    CommonModule,
    FormsModule, // Para trabajar con formularios y ngModel
    IonicModule, // Componentes de Ionic
    InicioPageRoutingModule, // Configuración de rutas
  ],
  declarations: [InicioPage], // Declaración del componente
})
export class InicioPageModule {}
