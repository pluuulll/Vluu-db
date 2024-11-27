import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-recomendaciones',
  templateUrl: './recomendaciones.page.html',
  styleUrls: ['./recomendaciones.page.scss'],
})
export class RecomendacionesPage implements OnInit {
  recomendaciones: any[] = []; 
  previewUrl: string | null = null;
  audioPlayer: HTMLAudioElement | null = null;
  currentTrack: any | null = null;
  favoritos: any[] = [];

  constructor(private toastController: ToastController) { }

  ngOnInit() {
    // Cargar recomendaciones de ejemplo con más detalles
    this.recomendaciones = [
      {
        id: '1',
        name: 'Bohemian Rhapsody',
        artists: [{ name: 'Queen' }],
        preview_url: 'https://ejemplo.com/preview1.mp3',
        album: {
          name: 'A Night at the Opera',
          images: [{ 
            url: 'https://upload.wikimedia.org/wikipedia/en/9/9f/Queen_-_Bohemian_Rhapsody.png' 
          }]
        },
        duration_ms: 354000
      },
      {
        id: '2',
        name: 'Imagine',
        artists: [{ name: 'John Lennon' }],
        preview_url: 'https://ejemplo.com/preview2.mp3',
        album: {
          name: 'Imagine',
          images: [{ 
            url: 'https://upload.wikimedia.org/wikipedia/en/3/3f/John_Lennon_-_Imagine.jpg' 
          }]
        },
        duration_ms: 183000
      },
      {
        id: '3',
        name: 'Billie Jean',
        artists: [{ name: 'Michael Jackson' }],
        preview_url: 'https://ejemplo.com/preview3.mp3',
        album: {
          name: 'Thriller',
          images: [{ 
            url: 'https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.jpg' 
          }]
        },
        duration_ms: 294000
      }
    ];
  }

  recargarRecomendaciones(event?: any) {
    // Simular recarga de recomendaciones con nuevas canciones
    const nuevasRecomendaciones = [
      {
        id: '4',
        name: 'Sweet Child O\' Mine',
        artists: [{ name: 'Guns N\' Roses' }],
        preview_url: 'https://ejemplo.com/preview4.mp3',
        album: {
          name: 'Appetite for Destruction',
          images: [{ 
            url: 'https://upload.wikimedia.org/wikipedia/en/6/67/GunsnRosesAppetiteforDestructionalbumcover.jpg' 
          }]
        },
        duration_ms: 356000
      }
    ];

    if (event) {
      setTimeout(() => {
        this.recomendaciones = [...this.recomendaciones, ...nuevasRecomendaciones];
        event.target.complete();
        this.mostrarToast('Nuevas recomendaciones cargadas');
      }, 1000);
    }
  }

  playPreview(track: any) {
    // Detener reproducción actual si existe
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      
      // Si es la misma canción, detenemos completamente
      if (this.currentTrack === track) {
        this.audioPlayer = null;
        this.currentTrack = null;
        return;
      }
    }

    // Crear nuevo reproductor de audio
    this.audioPlayer = new Audio(track.preview_url);
    
    // Manejar errores de reproducción
    this.audioPlayer.onerror = () => {
      this.mostrarToast('Error al reproducir vista previa');
      this.currentTrack = null;
    };

    // Reproducir
    this.audioPlayer.play()
      .then(() => {
        this.currentTrack = track;
      })
      .catch(error => {
        console.error('Error al reproducir:', error);
        this.mostrarToast('No se puede reproducir la vista previa');
        this.currentTrack = null;
      });
  }

  closePreview() {
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer = null;
    }
    this.previewUrl = null;
    this.currentTrack = null;
  }

  agregarAFavoritos(track: any) {
    // Verificar si ya está en favoritos
    const esFavorito = this.favoritos.some(f => f.id === track.id);
    
    if (!esFavorito) {
      this.favoritos.push(track);
      this.mostrarToast(`${track.name} añadido a favoritos`);
    } else {
      this.mostrarToast(`${track.name} ya está en favoritos`);
    }
  }

  // Método para formatear duración de la canción
  formatearDuracion(duracionMs: number): string {
    const minutos = Math.floor(duracionMs / 60000);
    const segundos = ((duracionMs % 60000) / 1000).toFixed(0);
    return `${minutos}:${parseInt(segundos) < 10 ? '0' : ''}${segundos}`;
  }

  // Método para mostrar toast
  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  // Método para verificar si una canción está sonando
  isPlayingTrack(track: any): boolean {
    return this.currentTrack === track;
  }
}