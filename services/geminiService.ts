import { GoogleGenAI, Type } from "@google/genai";

export const analyzeCaseDescription = async (description: string): Promise<{ area: string; title: string; summary: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze this legal case description and extract: 1. The most likely legal area (e.g., Civil, Family, Criminal, Labor, Tax, Corporate). 2. A professional short title (max 5 words). 3. A one-sentence professional summary. 
      
      Description: "${description}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            area: { type: Type.STRING },
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
          },
          required: ["area", "title", "summary"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini AI Error:", error);
    // Fallback if AI fails or key is missing
    return {
      area: "Direito Geral",
      title: "Nova Demanda Jurídica",
      summary: description.substring(0, 100) + "...",
    };
  }
};