
export interface GeminiPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

export interface GeminiHistoryItem {
  role: 'user' | 'model';
  parts: GeminiPart[];
}

// Gemini API has been proxy-migrated to the backend for security.
// Client now communicates via /api/chat.

export const getGeminiResponse = async (prompt: string, history: GeminiHistoryItem[] = [], image?: { data: string, mimeType: string }, temperature: number = 0.7) => {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, history, image, temperature })
    });

    if (!response.ok) throw new Error("Intelligence core failure");
    
    // Create a generator that mimics the structure expected by the frontend (stream.stream)
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    return {
      stream: (async function* () {
        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;
          const text = decoder.decode(value);
          // Mimic the object structure { text: () => string }
          yield { text: () => text };
        }
      })()
    };
  } catch (error) {
    console.error("Gemini Proxy Error:", error);
    throw error;
  }
};
