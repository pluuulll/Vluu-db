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
  user: Usuario | null = null; // Usuario autenticado
  username: string = ''; // Nombre de usuario a mostrar en el encabezado
  song: Cancion = this.createEmptySong(); // Canción temporal para agregar
  songs: Cancion[] = []; // Lista de canciones del usuario
  loading: boolean = true; // Indicador de carga

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;
    try {
      await this.supabaseService.restoreSession(); // Restaura la sesión
      await this.loadUserAndSongs(); // Carga usuario y canciones
    } catch (error) {
      this.handleError(error, 'Error durante la inicialización');
    } finally {
      this.loading = false; // Indicador de carga
    }
  }

  private async loadUserAndSongs(): Promise<void> {
    try {
      this.user = await this.supabaseService.getUser(); // Obtener el usuario autenticado
      if (!this.user) {
        this.redirectToLogin('No hay sesión activa. Redirigiendo al login.');
        return;
      }
      
      // Establecer el nombre de usuario para mostrar en el encabezado
      this.username = this.user.nombre || this.user.usuario;

      await this.loadSongs(); // Cargar las canciones
    } catch (error) {
      this.handleError(error, 'Error al cargar el usuario');
    }
  }

  private async loadSongs(): Promise<void> {
    if (!this.user?.id) {
      this.handleError(new Error('Usuario no autenticado'), 'Carga de canciones');
      return;
    }

    try {
      // Cargar las canciones asociadas al usuario
      this.songs = await this.supabaseService.getUserItems(this.user.id);
      console.log(`Canciones cargadas (${this.songs.length}):`, this.songs);
    } catch (error) {
      this.handleError(error, 'Error al cargar las canciones');
    }
  }

  // Agrega una nueva canción a la base de datos
  async addSong(): Promise<void> {
    if (!this.isSongValid(this.song)) {
      console.warn('Por favor, completa todos los campos obligatorios de la canción.');
      return;
    }

    try {
      const newSong: Cancion = this.createSongObject();
      await this.supabaseService.addSong(newSong);
      this.songs.unshift(newSong); // Actualizar la lista local
      this.resetSongForm();
      console.log('Canción agregada correctamente.');
    } catch (error) {
      this.handleError(error, 'Error al agregar la canción');
    }
  }

  // Verifica si los datos de la canción son válidos
  private isSongValid(song: Cancion): boolean {
    return !!song.nombre?.trim() && !!song.artista?.trim();
  }

  // Reinicia el formulario de la canción
  private resetSongForm(): void {
    this.song = this.createEmptySong();
  }

  // Crea un objeto vacío para la canción
  private createEmptySong(): Cancion {
    return {
      nombre: '',
      artista: '',
      duracion: '',
      album: '',
      ano: undefined,
      usuario_id: this.user?.id || '',
    };
  }

  // Crea un objeto canción con los datos del formulario
  private createSongObject(): Cancion {
    return {
      ...this.song,
      usuario_id: this.user?.id,
      creado_en: new Date().toISOString(),
    };
  }

  // Redirige al login si no hay sesión
  private redirectToLogin(message: string): void {
    console.warn(message);
    this.router.navigate(['/login']);
  }

  // Maneja errores y redirige si es necesario
  private handleError(error: any, context: string): void {
    console.error(`${context}:`, error);
    this.router.navigate(['/login']); // Redirigir al login si ocurre un error
  }
}
