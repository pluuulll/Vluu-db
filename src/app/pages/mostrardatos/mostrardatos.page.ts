import { Component, OnInit } from '@angular/core';
import { SupabaseService, Cancion } from '../../supabase.service';

@Component({
  selector: 'app-mostrardatos',
  templateUrl: './mostrardatos.page.html',
  styleUrls: ['./mostrardatos.page.scss'],
})
export class MostrardatosPage implements OnInit {
  canciones: Cancion[] = [];
  cargando: boolean = false; // Estado para mostrar un indicador de carga
  mensajeError: string | null = null; // Para mostrar errores si ocurren

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    await this.cargarCanciones();
  }

  // Método para cargar canciones desde la base de datos
  async cargarCanciones() {
    this.cargando = true;
    this.mensajeError = null; // Reiniciar mensaje de error

    try {
      this.canciones = await this.supabaseService.getSongs();
    } catch (error) {
      console.error('Error al cargar canciones:', error);
      this.mensajeError = 'No se pudieron cargar las canciones. Intenta nuevamente.';
    } finally {
      this.cargando = false;
    }
  }

  // Método para modificar una canción
  async modificarCancion(id: string, cambios: Partial<Cancion>) {
    if (!id || Object.keys(cambios).length === 0) {
      console.warn('Parámetros inválidos para modificar la canción.');
      return;
    }

    try {
      this.cargando = true;
      const { error } = await this.supabaseService.updateSong(id, cambios);

      if (error) {
        console.error('Error al modificar la canción:', error.message);
        this.mensajeError = 'No se pudo modificar la canción. Intenta nuevamente.';
      } else {
        console.log('Canción modificada con éxito');
        await this.cargarCanciones();
      }
    } catch (error) {
      console.error('Error inesperado al modificar la canción:', error);
      this.mensajeError = 'Ocurrió un error inesperado al modificar la canción.';
    } finally {
      this.cargando = false;
    }
  }

  // Método para eliminar una canción
  async eliminarCancion(id: string) {
    if (!id) {
      console.warn('ID inválido para eliminar la canción.');
      return;
    }

    try {
      this.cargando = true;
      const { error } = await this.supabaseService.deleteSong(id);

      if (error) {
        console.error('Error al eliminar la canción:', error.message);
        this.mensajeError = 'No se pudo eliminar la canción. Intenta nuevamente.';
      } else {
        console.log('Canción eliminada con éxito');
        await this.cargarCanciones();
      }
    } catch (error) {
      console.error('Error inesperado al eliminar la canción:', error);
      this.mensajeError = 'Ocurrió un error inesperado al eliminar la canción.';
    } finally {
      this.cargando = false;
    }
  }
}
