import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private responses: { [key: string]: string } = {
    '¿Qué géneros recomiendas?': 'El género que recomiendo es el rap.',
    '¿Cuál es tu canción favorita?': 'Una de mis canciones favoritas es "Lose Yourself" de Eminem.',
    '¿Qué es la música?': 'La música es un arte que utiliza los sonidos y los silencios organizados en el tiempo.',
    '¿Quién es el mejor rapero?': 'Hay muchos grandes raperos, pero Eminem es uno de los más influyentes y talentosos.',
  };

  getResponse(userInput: string): string {
    // Normaliza la entrada del usuario para que la búsqueda sea más flexible
    const normalizedInput = userInput.toLowerCase().trim();
    for (const key in this.responses) {
      if (normalizedInput.includes(key.toLowerCase())) {
        return this.responses[key];
      }
    }
    return 'Lo siento, no entiendo esa pregunta. ¿Puedes preguntar algo más sobre música?';
  }
}
