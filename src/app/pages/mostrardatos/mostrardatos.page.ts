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

  constructor(private supabaseService: SupabaseService) { }

  ngOnInit() {
    this.cargarCanciones();
  }

  // Método para cargar canciones desde la base de datos
  private async cargarCanciones() {
    this.toggleLoadingState(true);
    this.mensajeError = null; // Reiniciar mensaje de error

    try {
      this.canciones = await this.supabaseService.getSongs();
    } catch (error) {
      this.handleError('No se pudieron cargar las canciones. Intenta nuevamente.', error);
    } finally {
      this.toggleLoadingState(false);
    }
  }

  // Método para modificar una canción
  async modificarCancion(id: string, cambios: Partial<Cancion>) {
    if (this.isInvalidId(id) || this.isInvalidChanges(cambios)) {
      console.warn('Parámetros inválidos para modificar la canción.');
      return;
    }

    this.toggleLoadingState(true);

    try {
      const { error } = await this.supabaseService.updateSong(id, cambios); // Obtener el error del objeto retornado

      if (error) {
        this.handleError('No se pudo modificar la canción. Intenta nuevamente.', error);
      } else {
        console.log('Canción modificada con éxito');
        await this.cargarCanciones(); // Recargar la lista de canciones después de modificar
      }
    } catch (error) {
      this.handleError('Ocurrió un error inesperado al modificar la canción.', error);
    } finally {
      this.toggleLoadingState(false);
    }
  }

  // Método para eliminar una canción
  async eliminarCancion(id: string) {
    if (this.isInvalidId(id)) {
      console.warn('ID inválido para eliminar la canción.');
      return;
    }

    this.toggleLoadingState(true);

    try {
      const {error} = await this.supabaseService.deleteSong(id); // Obtener el error del objeto retornado

      if (error) {
        this.handleError('No se pudo eliminar la canción. Intenta nuevamente.', error);
      } else {
        console.log('Canción eliminada con éxito');
        await this.cargarCanciones(); // Recargar la lista de canciones después de eliminar
      }
    } catch (error) {
      this.handleError('Ocurrió un error inesperado al eliminar la canción.', error);
    } finally {
      this.toggleLoadingState(false);
    }
  }


  // *********** Métodos auxiliares ***********

  // Maneja el estado de carga
  private toggleLoadingState(state: boolean) {
    this.cargando = state;
  }

  // Maneja los errores de manera centralizada
  private handleError(message: string, error: any) {
    console.error(message, error);
    this.mensajeError = message;
  }

  // Verifica si el ID es válido
  private isInvalidId(id: string): boolean {
    return !id || id.trim() === '';
  }

  // Verifica si los cambios son inválidos
  private isInvalidChanges(changes: Partial<Cancion>): boolean {
    return Object.keys(changes).length === 0;
  }
}
