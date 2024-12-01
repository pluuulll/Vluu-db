import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

@Component({
  selector: 'app-escanear',
  templateUrl: './escanear.page.html',
  styleUrls: ['./escanear.page.scss'],
})
export class EscanearPage {
  constructor(private qrScanner: QRScanner, private platform: Platform) {}

  startScanning() {
    if (!this.platform.is('cordova') && !this.platform.is('capacitor')) {
      console.error('El escáner QR solo está disponible en dispositivos reales.');
      alert('El escáner QR solo está disponible en dispositivos reales.');
      return;
    }

    this.qrScanner
      .prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // La cámara está autorizada y lista para usar
          this.qrScanner.show(); // Muestra la cámara
          const scanSub = this.qrScanner.scan().subscribe(
            (text: string) => {
              console.log('Código QR escaneado:', text);
              alert('Código QR escaneado: ' + text);
              this.qrScanner.hide(); // Oculta la cámara después de escanear
              scanSub.unsubscribe(); // Detén la suscripción para evitar llamadas múltiples
            },
            (error) => {
              console.error('Error al escanear el QR:', error);
              alert('Error al escanear el QR. Por favor, intenta de nuevo.');
            }
          );
        } else if (status.denied) {
          console.error('Permiso para usar la cámara denegado.');
          alert(
            'Permiso denegado. Por favor, activa los permisos para usar la cámara desde la configuración.'
          );
          this.qrScanner.openSettings(); // Abre configuración si es necesario
        } else {
          console.warn('Permiso para usar la cámara no está disponible.');
          alert(
            'No se puede acceder a la cámara. Verifica los permisos o el hardware.'
          );
        }
      })
      .catch((e) => {
        console.error('Error al preparar el escáner:', e);
        alert(
          'Ocurrió un error al iniciar el escáner. Verifica tu dispositivo o permisos.'
        );
      });
  }
}
