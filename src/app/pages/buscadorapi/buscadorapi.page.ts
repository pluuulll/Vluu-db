// buscadorapi.page.ts
import { Component, OnInit } from '@angular/core';
import { ItunesService } from '../../itunes.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-buscadorapi',
  templateUrl: './buscadorapi.page.html',
  styleUrls: ['./buscadorapi.page.scss'],
})
export class BuscadorapiPage implements OnInit {
  canciones: any[] = [];
  term: string = ''; // Término de búsqueda
  audioPlayer: HTMLAudioElement | null = null;
  currentTrack: any | null = null;
  favoritos: any[] = [];

  constructor(
    private itunesService: ItunesService,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  // Método para buscar canciones
  buscarCanciones() {
    if (this.term.trim()) {
      this.itunesService.buscarCanciones(this.term).subscribe(
        (response) => {
          this.canciones = response.results;
        },
        (error) => {
          console.error('Error al buscar canciones:', error);
          this.mostrarToast('Error al buscar canciones');
        }
      );
    }
  }

  // Método para reproducir la vista previa de la canción
  playPreview(track: any) {
    if (this.audioPlayer) {
      if (this.currentTrack !== track) {
        this.audioPlayer.pause();
        this.audioPlayer.currentTime = 0;
      } else {
        if (!this.audioPlayer.paused) {
          this.audioPlayer.pause();
          return;
        }
      }
    }

    this.audioPlayer = new Audio(track.previewUrl);

    this.audioPlayer.onerror = () => {
      this.mostrarToast('Error al reproducir vista previa');
      this.currentTrack = null;
    };

    this.audioPlayer.play()
      .then(() => {
        this.currentTrack = track;
      })
      .catch((error) => {
        console.error('Error al reproducir:', error);
        this.mostrarToast('No se puede reproducir la vista previa');
        this.currentTrack = null;
      });
  }

  // Método para agregar una canción a favoritos
  agregarAFavoritos(track: any) {
    const esFavorito = this.favoritos.some((f) => f.trackId === track.trackId);

    if (!esFavorito) {
      this.favoritos.push(track);
      this.mostrarToast(`${track.trackName} añadido a favoritos`);
    } else {
      this.mostrarToast(`${track.trackName} ya está en favoritos`);
    }
  }

  // Método para mostrar un mensaje tipo "toast"
  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
}
