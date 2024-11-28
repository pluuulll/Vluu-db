import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, PostgrestError } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

// Interfaces para tipar las tablas
interface Cancion {
  id?: string;
  nombre: string;
  artista: string;
  duracion?: string; // Formato "hh:mm:ss"
  album?: string;
  ano?: number;
  usuario_id?: string; // Relacionado con el usuario
  creado_en?: string;
}

interface Usuario {
  id?: string;
  usuario: string;
  contrasena: string;
  nombre?: string;
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
      console.error(`Error en la operación ${operation}: ${error.message}`);
      throw new Error(`Operación fallida (${operation}): ${error.message}`);
    }
  }

  // *********************** USUARIOS ****************************

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
    try {
      const storedPassword = await this.getPassword(usuario);
      return storedPassword === contrasena;
    } catch (error) {
      console.error('Error al verificar la contraseña:', error);
      return false;
    }
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

  // *********************** PERFIL ****************************

  async getUserProfile(usuario: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('perfiles')
      .select('*')
      .eq('usuario', usuario)
      .single();
    this.handleError(error, 'obtener perfil');
    return data;
  }

  async updateUserProfile(usuario: string, data: any): Promise<void> {
    const { error } = await this.supabase.from('perfiles').update(data).eq('usuario', usuario);
    this.handleError(error, 'actualizar perfil');
  }

  // *********************** AMIGOS ****************************

  async searchUsers(query: string): Promise<Pick<Usuario, 'usuario'>[]> { // Devuelve solo la propiedad 'usuario' de la interfaz Usuario
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('usuario') // Solo selecciona el campo 'usuario'
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
}
