import { Component } from '@angular/core';
import { SupabaseService } from '../../supabase.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage {
  messages: any[] = [];
  activeChatId: string | null = null;
  newMessage: string = '';
  usuario_id: string | null = null; // Variable para almacenar el usuario_id

  constructor(private supabase: SupabaseService) {
    // Cargar usuario_id desde localStorage al crear la página
    this.usuario_id = localStorage.getItem('usuario_id');
  }

  async openChat(friendId: string) {
    if (this.usuario_id) {
      this.activeChatId = friendId;
      this.messages = await this.supabase.getMessages(this.usuario_id, friendId);
    }
  }

  async sendMessage() {
    if (this.newMessage.trim() !== '' && this.activeChatId && this.usuario_id) {
      const mensaje = {
        emisor_id: this.usuario_id,
        receptor_id: this.activeChatId,
        mensaje: this.newMessage,
      };

      await this.supabase.sendMessage(mensaje); // Llamar al método con el objeto
      this.messages.push({ emisor_id: this.usuario_id, mensaje: this.newMessage });
      this.newMessage = '';
    }
  }
}
