import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; 
import { BrowserModule } from '@angular/platform-browser'; // Módulo principal de Angular para el navegador
import { HttpClientModule } from '@angular/common/http'; // Módulo para hacer solicitudes HTTP
import { FormsModule } from '@angular/forms'; // Módulo para trabajar con formularios
import { IonicModule } from '@ionic/angular'; // Módulo principal de Ionic
import { RouteReuseStrategy } from '@angular/router'; // Para manejar la reutilización de rutas
import { IonicRouteStrategy } from '@ionic/angular'; // Estrategia de enrutamiento personalizada de Ionic

// Componentes principales de la aplicación
import { AppComponent } from './app.component'; 
import { AppRoutingModule } from './app-routing.module'; // Módulo de rutas para gestionar las rutas de la app

// Servicios personalizados de la aplicación
import { ItunesService } from './itunes.service'; // Servicio para interactuar con la API de iTunes

// Plugins de Ionic Native
import { QRScanner } from '@ionic-native/qr-scanner/ngx'; // Plugin para escanear códigos QR con Ionic Native

@NgModule({
  declarations: [
    AppComponent, // Componente raíz de la aplicación, donde se inicia la app
  ],
  imports: [
    BrowserModule, // Necesario para que Angular funcione en el navegador
    IonicModule.forRoot(), // Inicializa Ionic y debe ser incluido una sola vez en la app
    AppRoutingModule, // Configura las rutas y la navegación de la aplicación
    HttpClientModule, // Permite realizar solicitudes HTTP a servicios externos
    FormsModule, // Permite trabajar con formularios de tipo template-driven
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Permite usar Web Components como los de Ionic (ion-button, ion-icon, etc.)
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, // Define la estrategia de reutilización de rutas de Ionic
    QRScanner, // Asegura que el plugin QRScanner esté disponible en la app
    ItunesService, // Registra el servicio personalizado para uso en toda la aplicación
  ],
  bootstrap: [AppComponent], // Inicia la app con el componente raíz (AppComponent)
})
export class AppModule {}
