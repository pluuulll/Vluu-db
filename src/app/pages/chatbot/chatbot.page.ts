import { Component } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.page.html',
  styleUrls: ['./chatbot.page.scss'],
})
export class ChatbotPage {
  userInput: string = '';
  messages: { text: string, isUser: boolean }[] = [];

  // Respuestas predefinidas del bot
  responses: { [key: string]: string } = {
    'géneros': 'El género que recomiendo es el rap.',
    'recomienda música': 'Claro, te recomiendo escuchar un poco de rap, es genial para empezar.',
    'hola': '¡Hola! ¿Cómo estás? ¿Qué tipo de música te gusta?',
    'adiós': '¡Adiós! Espero que disfrutes de la música.',
  };

  sendMessage() {
    if (this.userInput.trim()) {
      this.messages.push({ text: this.userInput, isUser: true });
      this.generateResponse(this.userInput);
      this.userInput = '';
    }
  }

  generateResponse(userMessage: string) {
    const lowerMessage = userMessage.toLowerCase();
    const response = this.responses[lowerMessage] || 'Lo siento, no entiendo eso. ¿Puedes intentar otra cosa?';
    this.messages.push({ text: response, isUser: false });
  }
}
