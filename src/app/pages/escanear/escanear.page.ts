import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

@Component({
  selector: 'app-escanear',
  templateUrl: './escanear.page.html',
  styleUrls: ['./escanear.page.scss'],
})
export class EscanearPage {
  scannedText: string | undefined;

  constructor(private qrScanner: QRScanner, private platform: Platform) {}

  startScanning() {
    if (!this.platform.is('cordova') && !this.platform.is('capacitor')) {
      console.error('El escáner QR solo funciona en dispositivos reales.');
      alert('El escáner QR solo funciona en dispositivos reales.');
      return;
    }

    this.qrScanner
      .prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // Habilitar el escáner
          this.qrScanner.show();
          document.body.style.opacity = '0'; // Hace que la app sea transparente para ver la cámara

          const scanSub = this.qrScanner.scan().subscribe(
            (text: string) => {
              console.log('Código QR escaneado:', text);
              alert('Código QR escaneado: ' + text);
              this.scannedText = text;

              this.qrScanner.hide(); // Ocultar la cámara
              document.body.style.opacity = '1'; // Restaurar la visibilidad de la app
              scanSub.unsubscribe(); // Detener la suscripción
            },
            (err) => {
              console.error('Error al escanear el código QR:', err);
              alert('No se pudo escanear el QR. Intenta nuevamente.');
            }
          );
        } else if (status.denied) {
          alert(
            'Permiso denegado. Habilita el acceso a la cámara en la configuración.'
          );
          this.qrScanner.openSettings();
        } else {
          alert(
            'Permiso para usar la cámara no está disponible. Intenta nuevamente.'
          );
        }
      })
      .catch((e) => {
        console.error('Error al preparar el escáner:', e);
        alert('Hubo un problema al iniciar el escáner.');
      });
  }
}
