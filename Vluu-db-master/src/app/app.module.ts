import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // Asegúrate de importar CUSTOM_ELEMENTS_SCHEMA
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; // Módulo principal de Ionic
import { RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy } from '@ionic/angular';

// Componentes principales
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Servicios personalizados
import { ItunesService } from './itunes.service'; // Importa el servicio para interactuar con la API de iTunes

// Servicios de terceros
import { QRScanner } from '@ionic-native/qr-scanner/ngx'; // Plugin QR Scanner de Ionic Native

@NgModule({
  declarations: [
    AppComponent, // Componente raíz de la aplicación
  ],
  imports: [
    BrowserModule, // Módulo principal para la aplicación Angular
    IonicModule.forRoot(), // Inicialización de Ionic (se importa solo una vez en la app)
    AppRoutingModule, // Módulo de enrutamiento para manejar las rutas de la aplicación
    HttpClientModule, // Módulo para realizar solicitudes HTTP
    FormsModule, // Módulo para trabajar con formularios
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Añadir esta línea para evitar errores con Web Components personalizados como ion-button, ion-icon, etc.
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, // Usar la estrategia de reutilización de rutas de Ionic
    QRScanner, // Asegúrate de que este plugin esté instalado si lo vas a usar
    ItunesService, // Añade el servicio de iTunes para poder inyectarlo en otros componentes
  ],
  bootstrap: [AppComponent], // Componente raíz que se inicia al cargar la aplicación
})
export class AppModule {}
