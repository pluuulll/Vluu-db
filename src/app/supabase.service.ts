import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  // Método para obtener la contraseña de un usuario
  async get(usuario: string) {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('contrasena')
      .eq('usuario', usuario);
    
    if (error) {
      throw error;
    }

    return data![0].contrasena;
  }

  // Método para registrar un nuevo usuario
  async registerUser(usuario: string, contrasena: string) {
    // Insertar el nuevo usuario en la tabla "usuarios"
    const { data, error } = await this.supabase
      .from('usuarios')
      .insert([
        { usuario, contrasena }
      ]);

    if (error) {
      throw error; // Lanza el error si ocurre uno durante la inserción
    }

    return data; // Retorna los datos insertados
  }
}
