import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouteReuseStrategy } from '@angular/router';

// Componentes principales
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Servicios de terceros
import { QRScanner } from '@ionic-native/qr-scanner/ngx';

@NgModule({
  declarations: [
    AppComponent, // Componente raíz de la aplicación
  ],
  imports: [
    BrowserModule, // Módulo principal del navegador
    IonicModule.forRoot(), // Inicialización de Ionic
    AppRoutingModule, // Módulo de enrutamiento
    HttpClientModule, // Para realizar solicitudes HTTP
    FormsModule, // Para formularios
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, // Estrategia de reutilización de rutas de Ionic
    QRScanner, // Plugin de QR Scanner
  ],
  bootstrap: [AppComponent], // Componente raíz que se inicia al cargar la app
})
export class AppModule {}
