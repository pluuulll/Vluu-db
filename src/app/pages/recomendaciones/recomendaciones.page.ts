import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ItunesService } from '../../itunes.service'; // Importa el servicio de iTunes
import { SupabaseService } from '../../supabase.service'; // Importamos el servicio de Supabase

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
    private itunesService: ItunesService, // Inyectamos el servicio de iTunes
    private supabaseService: SupabaseService // Inyectamos el servicio de Supabase
  ) { }

  ngOnInit() {
    this.cargarRecomendaciones();
    this.cargarFavoritos(); // Cargamos los favoritos cuando se inicia el componente
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

  // Método para cargar los favoritos del usuario desde Supabase
  cargarFavoritos() {
    this.supabaseService.getUser().then((user) => {
      if (user && user.id) {
        const userId = user.id; // Obtener el ID del usuario autenticado
        this.supabaseService.getFavoritos(userId).then((favoritos) => {
          this.favoritos = favoritos;
        }).catch((error) => {
          console.error('Error al cargar favoritos:', error);
        });
      } else {
        console.error('No hay usuario autenticado o userId es undefined');
      }
    }).catch((error) => {
      console.error('Error al obtener el usuario autenticado:', error);
    });
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

  // Método para mostrar un mensaje tipo "toast"
  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
  agregarAFavoritos(track: any) {
    this.supabaseService.getUser().then((user) => {
      if (user && user.id) {
        const userId = user.id;
  
        // Verificar si el track ya está en favoritos
        const esFavorito = this.favoritos.some((f) => f.track_name === track.trackName);
  
        if (!esFavorito) {
          // Crear objeto favorito
          const favorito = {
            user_id: userId,
            track_name: track.trackName,
            artist_name: track.artistName,
            collection_name: track.collectionName,
            artwork_url: track.artworkUrl100 || 'assets/default-album.jpg',
            preview_url: track.previewUrl,
            created_at: new Date().toISOString(),
          };
  
          // Añadir localmente
          this.favoritos.push(favorito);
          this.mostrarToast(`${track.trackName} añadido a favoritos`);
  
          // Guardar en Supabase
          this.supabaseService.addFavoritos(favorito)
            .then(() => console.log('Favorito agregado correctamente en la base de datos'))
            .catch((error) => {
              console.error('Error al guardar en la base de datos:', error);
              this.mostrarToast('Error al guardar en la base de datos');
            });
  
          // Actualizar localStorage
          const favoritosLocal = JSON.parse(localStorage.getItem('favoritos') || '[]');
          favoritosLocal.push(favorito);
          localStorage.setItem('favoritos', JSON.stringify(favoritosLocal));
        } else {
          this.mostrarToast(`${track.trackName} ya está en favoritos`);
        }
      } else {
        console.error('No hay usuario autenticado o userId es undefined');
      }
    }).catch((error) => {
      console.error('Error al obtener el usuario autenticado:', error);
      this.mostrarToast('Error al autenticar al usuario');
    });
  }
  
  

}
