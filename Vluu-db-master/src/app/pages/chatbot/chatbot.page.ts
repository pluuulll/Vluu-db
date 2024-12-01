import { Component } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.page.html',
  styleUrls: ['./chatbot.page.scss'],
})
export class ChatbotPage {
  userInput: string = '';
  messages: { text: string, isUser: boolean }[] = [];
  showErrorMessage: boolean = false;  // Control para mostrar el mensaje de error

  // Respuestas predefinidas del bot
  responses: { [key: string]: string } = {
    'géneros': 'El género que recomiendo es el rap.',
    'recomienda música': 'Claro, te recomiendo escuchar un poco de rap, es genial para empezar.',
    'hola': '¡Hola! ¿Cómo estás? ¿Qué tipo de música te gusta?',
    'adiós': '¡Adiós! Espero que disfrutes de la música.',
  };

  sendMessage() {
    // Validar si el campo de entrada está vacío
    if (this.userInput.trim() === '') {
      this.showErrorMessage = true;  // Mostrar mensaje de error
      return;
    }

    // Agregar mensaje del usuario
    this.messages.push({ text: this.userInput, isUser: true });

    // Generar respuesta del bot
    this.generateResponse(this.userInput);

    // Limpiar el campo de entrada y ocultar mensaje de error
    this.userInput = '';
    this.showErrorMessage = false;
  }

  generateResponse(userMessage: string) {
    const lowerMessage = userMessage.toLowerCase();
    const response = this.responses[lowerMessage] || 'Lo siento, no entiendo eso. ¿Puedes intentar otra cosa?';
    this.messages.push({ text: response, isUser: false });
  }
}
