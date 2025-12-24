
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

export class GeminiService {
  private getClient() {
    // Создаем новый экземпляр для каждого вызова, чтобы всегда использовать актуальный ключ
    return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async *streamChat(history: Message[], prompt: string, model: string = 'gemini-3-flash-preview') {
    const ai = this.getClient();
    const contents = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
    
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    try {
      const responseStream = await ai.models.generateContentStream({
        model: model,
        contents: contents as any,
        config: {
          temperature: 0.7,
          systemInstruction: "Вы — продвинутый ИИ-ассистент Visionary. Вы общаетесь с Разработчиком. Вы помогаете создавать контент и изображения. Если пользователь просит создать изображение, напомните ему использовать кнопку генерации в интерфейсе.",
          thinkingConfig: { thinkingBudget: 0 }
        }
      });

      for await (const chunk of responseStream) {
        yield chunk.text || "";
      }
    } catch (error) {
      console.error("Gemini API Text Error:", error);
      yield "Ошибка: проверьте API ключ или интернет-соединение.";
    }
  }

  async generateImage(prompt: string, aspectRatio: string = "1:1"): Promise<string | null> {
    const ai = this.getClient();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
          }
        }
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const mimeType = part.inlineData.mimeType || 'image/png';
            const base64Data = part.inlineData.data;
            return `data:${mimeType};base64,${base64Data}`;
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Gemini API Image Error:", error);
      return null;
    }
  }
}

export const gemini = new GeminiService();
