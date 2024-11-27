import { Component } from '@angular/core';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';

@Component({
  selector: 'app-escanear',
  templateUrl: './escanear.page.html',
  styleUrls: ['./escanear.page.scss'],
})
export class EscanearPage {
  constructor(private qrScanner: QRScanner) {}

  startScanning() {
    this.qrScanner.prepare().then((status) => {
      if (status.authorized) {
        // Muestra la cámara para escanear el QR
        this.qrScanner.show();
        this.qrScanner.scan().subscribe((text: string) => {
          console.log('QR code scanned:', text);
          alert('Código QR escaneado: ' + text);
        });
      } else if (status.denied) {
        console.error('Permiso denegado o escáner no autorizado');
      }
    }).catch((e) => console.error('Error al preparar el escáner', e));
  }
}
