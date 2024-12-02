import { Component, OnInit } from '@angular/core';
import { ItunesService } from '../../itunes.service';
import { ToastController } from '@ionic/angular';
import { SupabaseService } from '../../supabase.service'; // Importa el servicio de Supabase

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
    private toastController: ToastController,
    private supabaseService: SupabaseService // Inyecta el servicio Supabase
  ) {}

  ngOnInit() {
    this.loadFavoritos();
  }

  // *********************** MÉTODOS DE BÚSQUEDA Y FAVORITOS ****************************
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

  // *********************** MÉTODOS DE REPRODUCCIÓN ****************************
  playPreview(track: any) {
    // Pausar y resetear si es otra canción
    if (this.audioPlayer && this.currentTrack !== track) {
      this.audioPlayer.pause();
      this.audioPlayer.currentTime = 0;
    }

    // Si la canción ya está reproduciéndose, detenerla
    if (this.audioPlayer && !this.audioPlayer.paused && this.currentTrack === track) {
      this.audioPlayer.pause();
      return;
    }

    // Crear nuevo reproductor de audio
    this.audioPlayer = new Audio(track.previewUrl);
    this.audioPlayer.play()
      .then(() => {
        this.currentTrack = track;
      })
      .catch((error) => {
        console.error('Error al reproducir:', error);
        this.mostrarToast('No se puede reproducir la vista previa');
        this.currentTrack = null;
      });

    this.audioPlayer.onerror = () => {
      this.mostrarToast('Error al reproducir vista previa');
      this.currentTrack = null;
    };
  }

  // *********************** MÉTODOS DE FAVORITOS ****************************
  async agregarAFavoritos(track: any) {
    const esFavorito = this.favoritos.some((f) => f.trackId === track.trackId);

    if (!esFavorito) {
      // Preparar el objeto favorito para agregarlo
      const favorito = {
        user_id: 'usuario_id_aqui',  // Reemplaza esto con el ID del usuario autenticado
        track_name: track.trackName,
        artist_name: track.artistName,
        collection_name: track.collectionName,
        artwork_url: track.artworkUrl100,
        preview_url: track.previewUrl,
      };

      try {
        // Guardar en Supabase
        await this.supabaseService.addFavoritos(favorito);
        this.favoritos.push(favorito); // Actualiza la lista de favoritos local
        this.mostrarToast(`${track.trackName} añadido a favoritos`);
      } catch (error) {
        console.error('Error al agregar a favoritos:', error);
        this.mostrarToast('No se pudo agregar a favoritos');
      }
    } else {
      this.mostrarToast(`${track.trackName} ya está en favoritos`);
    }
  }

  // *********************** MÉTODO DE CARGAR FAVORITOS ****************************
  async loadFavoritos() {
    const usuario_id = 'usuario_id_aqui'; // Reemplaza esto con el ID del usuario autenticado
    try {
      this.favoritos = await this.supabaseService.getFavoritos(usuario_id);
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
      this.mostrarToast('Error al cargar tus favoritos');
    }
  }

  // *********************** MÉTODO DE MENSAJES DE TOAST ****************************
  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
}
