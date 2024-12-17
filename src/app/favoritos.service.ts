import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoritosService {
  private favoritos: any[] = []; // Aquí puedes definir el tipo según tu modelo

  constructor() {}

  // Agregar un favorito
  agregarFavorito(item: any): void {
    this.favoritos.push(item);
    console.log('Favorito agregado:', item);
  }

  // Eliminar un favorito por ID o índice
  eliminarFavorito(id: number): void {
    this.favoritos = this.favoritos.filter(favorito => favorito.id !== id);
    console.log('Favorito eliminado con ID:', id);
  }

  // Obtener todos los favoritos
  obtenerFavoritos(): any[] {
    return this.favoritos;
  }

  // Verificar si un ítem ya es favorito
  esFavorito(id: number): boolean {
    return this.favoritos.some(favorito => favorito.id === id);
  }
}
