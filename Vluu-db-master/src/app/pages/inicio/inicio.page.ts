import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../supabase.service';
import { Router } from '@angular/router';
import { Usuario, Cancion } from '../../supabase.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  user: Usuario | null | undefined; // Usuario autenticado
  song: Cancion = this.initializeSong(); // Canción temporal para agregar
  songs: Cancion[] = []; // Lista de canciones cargadas

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  /**
   * Inicializa la página cargando al usuario y las canciones.
   */
  async ngOnInit() {
    await this.fetchUser();
    await this.loadSongs();
  }

  /**
   * Intenta obtener el usuario autenticado.
   * Si no está autenticado, se puede redirigir a la página de inicio de sesión.
   */
  private async fetchUser() {
    try {
      this.user = await this.supabaseService.getUser();
      if (!this.user) {
        console.warn('Usuario no autenticado');
        // Redirigir a la página de inicio de sesión si es necesario
        // this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      // Manejo adicional según la lógica del sistema
    }
  }

  /**
   * Agrega una nueva canción si los datos son válidos.
   */
  async addSong() {
    if (!this.isSongValid(this.song)) {
      console.warn('Por favor, completa todos los campos obligatorios de la canción.');
      return;
    }

    try {
      const newSong: Cancion = {
        ...this.song,
        ano: this.song.ano ?? 0, // Establecer año predeterminado si no está definido
      };

      // Guardar canción en el servicio
      await this.supabaseService.addSong(newSong);

      // Mostrarla inmediatamente en la lista
      this.songs.unshift({
        ...newSong,
        creado_en: new Date().toISOString(),
      });

      this.resetSongForm();
      console.log('Canción agregada correctamente');
    } catch (error) {
      console.error('Error al agregar la canción:', error);
    }
  }

  /**
   * Verifica que los campos obligatorios de la canción no estén vacíos.
   */
  private isSongValid(song: Cancion): boolean {
    return song.nombre.trim() !== '' && song.artista.trim() !== '';
  }

  /**
   * Reinicia el formulario de la canción.
   */
  private resetSongForm(): void {
    this.song = this.initializeSong();
  }

  /**
   * Carga las canciones desde el servicio.
   */
  async loadSongs() {
    try {
      const songs = await this.supabaseService.getSongs();
      this.songs = songs || [];
      if (this.songs.length === 0) {
        console.log('No se encontraron canciones.');
      } else {
        console.log(`Canciones cargadas (${this.songs.length}):`, this.songs);
      }
    } catch (error) {
      console.error('Error al cargar las canciones:', error);
    }
  }

  /**
   * Inicializa un objeto canción con valores predeterminados.
   */
  private initializeSong(): Cancion {
    return {
      nombre: '',
      artista: '',
      duracion: '', // Formato esperado: "hh:mm:ss"
      album: '',
      ano: undefined, // Usar undefined en lugar de null
    };
  }
}
