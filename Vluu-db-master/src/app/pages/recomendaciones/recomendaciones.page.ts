import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ItunesService } from '../../itunes.service'; // Importa el servicio de iTunes

@Component({
  selector: 'app-recomendaciones',
  templateUrl: './recomendaciones.page.html',
  styleUrls: ['./recomendaciones.page.scss'],
})
export class RecomendacionesPage implements OnInit {
  recomendaciones: any[] = [];
  audioPlayer: HTMLAudioElement | null = null;
  currentTrack: any | null = null;
  favoritos: any[] = [];
  cargando: boolean = false;

  constructor(
    private toastController: ToastController,
    private itunesService: ItunesService // Inyectamos el servicio
  ) {}

  ngOnInit() {
    this.cargarRecomendaciones();
  }

  // Método para cargar recomendaciones desde la API de iTunes
  cargarRecomendaciones() {
    this.cargando = true;
    this.itunesService.obtenerRecomendaciones('rock').subscribe(
      (response) => {
        this.recomendaciones = response.results;
        this.cargando = false;
      },
      (error) => {
        console.error('Error al obtener recomendaciones:', error);
        this.cargando = false;
        this.mostrarToast('Error al cargar recomendaciones');
      }
    );
  }

  // Método para reproducir la vista previa de la canción
  playPreview(track: any) {
    if (this.audioPlayer) {
      // Detener la canción actual si se está reproduciendo
      if (this.currentTrack !== track) {
        this.audioPlayer.pause();
        this.audioPlayer.currentTime = 0;
      } else {
        // Si ya está sonando, hacer pausa
        if (!this.audioPlayer.paused) {
          this.audioPlayer.pause();
          return;
        }
      }
    }

    // Crear nuevo reproductor de audio
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

  // Método para cerrar la vista previa de la canción
  closePreview() {
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer = null;
    }
    this.currentTrack = null;
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
