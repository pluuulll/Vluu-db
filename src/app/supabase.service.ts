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

  // Obtener la contraseña de un usuario por su nombre de usuario
  async get(usuario: string): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('contrasena')
      .eq('usuario', usuario)
      .single();

    if (error) {
      console.error('Error al obtener la contraseña:', error);
      return null;
    }

    return data?.contrasena || null;
  }

  // Verificar si un usuario ya existe
  async doesUserExist(usuario: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('usuario')
      .eq('usuario', usuario);

    if (error) {
      console.error('Error al verificar el usuario:', error);
      return false;
    }

    return data.length > 0;
  }

  // Registrar un nuevo usuario (sin cifrado de contraseña)
  async registerUser(usuario: string, contrasena: string) {
    const { error } = await this.supabase
      .from('usuarios')
      .insert([{ usuario, contrasena }]);

    if (error) {
      console.error('Error al registrar el usuario:', error);
      throw error;
    }
  }

  // Actualizar la contraseña de un usuario (sin cifrado)
  async updatePassword(usuario: string, nuevaContrasena: string) {
    const { data, error } = await this.supabase
      .from('usuarios')
      .update({ contrasena: nuevaContrasena })
      .eq('usuario', usuario); // Filtramos por el usuario

    if (error) {
      console.error('Error al actualizar la contraseña:', error);
      return { error };
    }

    return { data };
  }

  // Verificar la contraseña durante el inicio de sesión (sin cifrado)
  async verifyPassword(usuario: string, contrasena: string): Promise<boolean> {
    const storedPassword = await this.get(usuario);

    if (!storedPassword) {
      console.error('Usuario no encontrado o contraseña incorrecta');
      return false;
    }

    // Compara la contraseña ingresada con la almacenada (en texto plano)
    return contrasena === storedPassword;
  }
}
