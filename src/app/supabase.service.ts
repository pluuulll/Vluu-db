import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, PostgrestError } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

// Interfaces para tipar las tablas
export interface Cancion {
  id?: string;
  nombre: string;
  artista: string;
  duracion?: string; 
  album?: string;
  ano?: number;
  usuario_id?: string;
  creado_en?: string;
}

export interface Usuario {
  id?: string;
  usuario: string;
  contrasena: string;
  nombre?: string;
  descripcion?: string;
  photoURL?: string;
}

interface Mensaje {
  id?: string;
  emisor_id: string;
  receptor_id: string;
  mensaje: string;
  timestamp?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // *********************** MANEJO DE ERRORES ****************************
  private handleError(error: PostgrestError | null, operation: string): void {
    if (error) {
      console.error(`Error en la operación "${operation}": ${error.message}`);
      throw new Error(`Operación fallida (${operation}): ${error.message}`);
    }
  }

  private async handleSessionError(sessionError: any): Promise<void> {
    if (sessionError) {
      console.warn('No hay sesión activa. Redirigiendo al login...');
      await this.supabase.auth.signOut();
    }
  }

  // *********************** USUARIOS ****************************
  private async checkSession(): Promise<Usuario | null> {
    const { data: sessionData, error: sessionError } = await this.supabase.auth.getSession();
    await this.handleSessionError(sessionError);
    if (!sessionData?.session) return null;

    return this.getUser(); // Si hay sesión, devuelve el usuario actual
  }

  private async getUserDataById(userId: string): Promise<Usuario | null> {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .single();
    this.handleError(error, 'obtener usuario');
    return data ?? null;
  }

  async getPassword(usuario: string): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('contrasena')
      .eq('usuario', usuario)
      .single();
    this.handleError(error, 'obtener contraseña');
    return data?.contrasena ?? null;
  }

  async doesUserExist(usuario: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('usuario')
      .eq('usuario', usuario)
      .single();
    this.handleError(error, 'verificar existencia de usuario');
    return !!data;
  }

  async registerUser(usuario: Usuario): Promise<void> {
    const { error } = await this.supabase.from('usuarios').insert([usuario]);
    this.handleError(error, 'registrar usuario');
  }

  async updatePassword(usuario: string, nuevaContrasena: string): Promise<void> {
    const { error } = await this.supabase
      .from('usuarios')
      .update({ contrasena: nuevaContrasena })
      .eq('usuario', usuario);
    this.handleError(error, 'actualizar contraseña');
  }

  async verifyPassword(usuario: string, contrasena: string): Promise<boolean> {
    const storedPassword = await this.getPassword(usuario);
    return storedPassword === contrasena;
  }

  // *********************** CANCIONES ****************************
  async addSong(song: Cancion): Promise<void> {
    const { data, error } = await this.supabase.from('canciones').insert([song]);
    this.handleError(error, 'agregar canción');
    if (data) {
      console.log('Canción añadida:', data);
    }
  }

  async getSongs(): Promise<Cancion[]> {
    const { data, error } = await this.supabase
      .from('canciones')
      .select('*')
      .order('creado_en', { ascending: false });
    this.handleError(error, 'obtener canciones');
    return data ?? [];
  }

  async updateSong(id: string, cambios: Partial<Cancion>): Promise<{ error: PostgrestError | null }> {
    const { error } = await this.supabase
      .from('canciones')
      .update(cambios)
      .eq('id', id);
    return { error };
  }

  async deleteSong(id: string): Promise<{ error: PostgrestError | null }> {
    const { error } = await this.supabase
      .from('canciones')
      .delete()
      .eq('id', id);
    return { error };
  }

  // *********************** PERFIL ****************************
  async getProfile(): Promise<Usuario | null> {
    return this.getUser(); 
  }

  async updateProfile(profile: Partial<Usuario>): Promise<void> {
    const user = await this.getUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const { error } = await this.supabase
      .from('usuarios')
      .update(profile)
      .eq('id', user.id);
    this.handleError(error, 'actualizar perfil');
  }

  // *********************** AMIGOS ****************************
  async searchUsers(query: string): Promise<Pick<Usuario, 'usuario'>[]> {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('usuario')
      .ilike('usuario', `%${query}%`);
    this.handleError(error, 'buscar usuarios');
    return data ?? [];
  }

  async addFriend(usuario_id: string, amigo_id: string): Promise<void> {
    const { error } = await this.supabase.from('amigos').insert([{ usuario_id, amigo_id }]);
    this.handleError(error, 'agregar amigo');
  }

  async getFriends(usuario_id: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('amigos')
      .select('amigo_id, usuarios (usuario)')
      .eq('usuario_id', usuario_id);
    this.handleError(error, 'obtener amigos');
    return data ?? [];
  }

  // *********************** MENSAJES ****************************
  async sendMessage(mensaje: Mensaje): Promise<void> {
    const { error } = await this.supabase.from('mensajes').insert([mensaje]);
    this.handleError(error, 'enviar mensaje');
  }

  async getMessages(emisor_id: string, receptor_id: string): Promise<Mensaje[]> {
    const { data, error } = await this.supabase
      .from('mensajes')
      .select('*')
      .or(`emisor_id.eq.${emisor_id},receptor_id.eq.${receptor_id}`)
      .order('timestamp', { ascending: true });
    this.handleError(error, 'obtener mensajes');
    return data ?? [];
  }

  // *********************** ITEMS DEL USUARIO (CANCIONES) ****************************
  async getUserItems(usuario_id: string): Promise<Cancion[]> {
    const { data, error } = await this.supabase
      .from('canciones')
      .select('*')
      .eq('usuario_id', usuario_id);
    this.handleError(error, 'obtener items del usuario');
    return data ?? [];
  }

  // *********************** FAVORITOS ****************************
  async getFavoritos(userId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('favoritos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    this.handleError(error, 'obtener favoritos');
    return data ?? [];
  }

  async addFavoritos(favorito: any): Promise<void> {
    const { error } = await this.supabase
      .from('favoritos')
      .insert([favorito]);
    this.handleError(error, 'agregar favorito');
  }

  // *********************** SESIONES ****************************
  async restoreSession(): Promise<void> {
    const { data, error } = await this.supabase.auth.getSession();
    if (error || !data.session) {
      throw new Error('No hay sesión activa');
    }
    console.log('Sesión restaurada:', data.session);
  }

  async getUser(): Promise<Usuario | null> {
    const { data: sessionData, error: sessionError } = await this.supabase.auth.getSession();
    await this.handleSessionError(sessionError);
    if (!sessionData?.session) return null;

    const { user } = sessionData.session;
    return this.getUserDataById(user.id); 
  }

  async handleExpiredSession(): Promise<void> {
    await this.supabase.auth.signOut();
    console.warn('La sesión ha caducado. Redirigiendo al inicio de sesión.');
  }
}
