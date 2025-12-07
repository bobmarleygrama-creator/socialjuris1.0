import { GoogleGenAI, Type } from "@google/genai";
import { StrategyAnalysis, CalculationResult } from "../types";

export const analyzeCaseDescription = async (description: string): Promise<{ area: string; title: string; summary: string; complexity: 'Baixa' | 'Média' | 'Alta' }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze this legal case description and extract: 
      1. The most likely legal area (e.g., Civil, Family, Criminal, Labor, Tax, Corporate). 
      2. A professional short title (max 5 words). 
      3. A one-sentence professional summary. 
      4. The complexity level (Baixa, Média, Alta) based on the description details.
      
      Description: "${description}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            area: { type: Type.STRING },
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            complexity: { type: Type.STRING, enum: ["Baixa", "Média", "Alta"] }
          },
          required: ["area", "title", "summary", "complexity"],
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
      complexity: "Média"
    };
  }
};

export const calculateCasePrice = (complexity: string): number => {
    switch (complexity) {
        case 'Baixa': return 2.00;
        case 'Média': return 4.00;
        case 'Alta': return 6.00;
        default: return 4.00;
    }
};

// --- FERRAMENTAS PRO (Simulação Avançada) ---

export const analyzeOpposingStrategy = async (text: string): Promise<StrategyAnalysis> => {
    // Simulating AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return {
        weaknesses: [
            "Ausência de prova material sobre o dano alegado.",
            "Citação de jurisprudência revogada em 2023.",
            "Falha no nexo causal entre a ação do réu e o resultado."
        ],
        counterArguments: [
            "Invocar a Súmula 385 do STJ para descaracterizar dano moral.",
            "Apresentar prints que comprovam a ciência prévia do autor.",
            "Arguir a prescrição trienal baseada no Art. 206 do Código Civil."
        ],
        winProbability: "Alta (75%)",
        recommendedFocus: "Focar na preliminar de ilegitimidade passiva e na falta de provas documentais."
    };
};

export const calculateLegalAdjustment = async (amount: number, date: string, index: string): Promise<CalculationResult> => {
    // Simulate API calculation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const years = (new Date().getFullYear() - new Date(date).getFullYear());
    const interestRate = 0.01 * 12 * Math.max(1, years); // 1% ao mês simples
    const correctionFactor = 1 + (years * 0.05); // Simulação de inflação

    const correctedValue = amount * correctionFactor;
    const interestValue = correctedValue * interestRate;
    const total = correctedValue + interestValue;

    return {
        originalValue: amount,
        updatedValue: total,
        interest: interestValue,
        indexUsed: index,
        breakdown: [
            { month: 'Principal', value: amount },
            { month: 'Correção', value: correctedValue - amount },
            { month: 'Juros', value: interestValue }
        ]
    };
};