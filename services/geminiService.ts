
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

// --- FERRAMENTAS PRO ---

export const analyzeOpposingStrategy = async (text: string): Promise<StrategyAnalysis> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Você é um advogado sênior e estrategista jurídico brasileiro. Analise o seguinte texto jurídico (que pode ser uma petição inicial, contestação ou relato de caso) da parte OPOSITORA.
            
            Seu objetivo é encontrar falhas e montar uma estratégia de defesa/ataque.
            
            Retorne um JSON com:
            1. 'weaknesses': Lista de 3 a 5 pontos fracos, falácias lógicas, falta de provas ou teses jurídicas frágeis no texto.
            2. 'counterArguments': Lista de 3 a 5 contra-argumentos fortes baseados na legislação brasileira (CF, CC, CPC, CLT, etc).
            3. 'jurisprudence': Lista de 2 sugestões de Súmulas ou entendimentos (STF/STJ) que poderiam ser usados.
            4. 'winProbabilityValue': Um número de 0 a 100 estimando a chance de VOCÊ (quem está analisando) vencer ou reverter a situação contra esse texto.
            5. 'winProbability': Uma string (ex: "Alta (80%)") descrevendo essa chance.
            6. 'recommendedFocus': Um parágrafo curto sobre onde focar a energia processual agora.

            Texto da Peça/Relato: "${text.substring(0, 8000)}"`, // Limite de caracteres para segurança
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                        counterArguments: { type: Type.ARRAY, items: { type: Type.STRING } },
                        jurisprudence: { 
                            type: Type.ARRAY, 
                            items: { 
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    summary: { type: Type.STRING }
                                }
                            } 
                        },
                        winProbabilityValue: { type: Type.NUMBER },
                        winProbability: { type: Type.STRING },
                        recommendedFocus: { type: Type.STRING }
                    },
                    required: ["weaknesses", "counterArguments", "winProbability", "winProbabilityValue", "recommendedFocus", "jurisprudence"]
                }
            }
        });

        const resultText = response.text;
        if (!resultText) throw new Error("No AI Response");
        return JSON.parse(resultText);

    } catch (error) {
        console.error("Erro no Opositor IA:", error);
        // Fallback simulado para caso de erro na API
        return {
            weaknesses: [
                "Argumentação genérica sem base probatória sólida no texto fornecido.",
                "Possível inépcia por falta de pedido determinado (análise preliminar).",
                "Ausência de nexo causal claro entre a conduta e o dano."
            ],
            counterArguments: [
                "Arguição de preliminar de mérito (prescrição ou decadência).",
                "Inversão do ônus da prova não aplicável ao caso.",
                "Impugnação específica dos valores cobrados."
            ],
            jurisprudence: [
                { title: "Súmula 385 STJ", summary: "Dano moral em caso de devedor contumaz." },
                { title: "Tema 940 STF", summary: "Responsabilidade civil em casos similares." }
            ],
            winProbability: "Média (50%) - Requer Análise Documental",
            winProbabilityValue: 50,
            recommendedFocus: "Focar na ausência de provas materiais anexadas à peça e explorar as contradições fáticas."
        };
    }
};

export const calculateLegalAdjustment = async (
    amount: number, 
    startDate: string, 
    endDate: string,
    index: string,
    interestRate: number, // % ao mês
    finePercent: number, // % multa
    feesPercent: number // % honorários
): Promise<CalculationResult> => {
    
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Diferença em meses
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30)); 
    
    // Simulação de Índices Acumulados (Fictício mas realista para demo)
    // IGPM mais volátil, IPCA mais estável
    let monthlyCorrectionAvg = 0;
    if (index === 'IGPM') monthlyCorrectionAvg = 0.008; // ~0.8% a.m
    else if (index === 'IPCA') monthlyCorrectionAvg = 0.0045; // ~0.45% a.m
    else if (index === 'INPC') monthlyCorrectionAvg = 0.005; // ~0.5% a.m
    else monthlyCorrectionAvg = 0.009; // SELIC (Simulada como correção simples alta)

    // Cálculo Composto da Correção Monetária
    const correctionFactor = Math.pow(1 + monthlyCorrectionAvg, diffMonths);
    const correctedPrincipal = amount * correctionFactor;
    const totalCorrection = correctedPrincipal - amount;

    // Cálculo de Juros (Simples, sobre o valor corrigido - praxe cível)
    // Se fosse SELIC, juros já estariam na correção, mas aqui separamos para visualização
    const totalInterest = correctedPrincipal * (interestRate / 100) * diffMonths;

    // Subtotal
    const subtotal = correctedPrincipal + totalInterest;

    // Multa (Sobre o subtotal)
    const totalFine = subtotal * (finePercent / 100);

    // Honorários (Sobre o total até aqui)
    const totalFees = (subtotal + totalFine) * (feesPercent / 100);

    const finalValue = subtotal + totalFine + totalFees;

    // Gerar dados para o gráfico (Points)
    // Vamos gerar até 12 pontos distribuídos no tempo
    const chartData = [];
    const step = Math.max(1, Math.floor(diffMonths / 12));
    
    for (let i = 0; i <= diffMonths; i += step) {
        const factorNow = Math.pow(1 + monthlyCorrectionAvg, i);
        const correctedNow = amount * factorNow;
        const interestNow = correctedNow * (interestRate / 100) * i;
        
        // Data label
        const pointDate = new Date(start);
        pointDate.setMonth(start.getMonth() + i);
        const label = pointDate.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });

        chartData.push({
            label,
            value: correctedNow + interestNow,
            principalPart: amount,
            interestPart: (correctedNow - amount) + interestNow // Correção + Juros combinados visualmente
        });
    }

    // Garante que o último ponto é o final exato (sem multa/honorarios no grafico de evolucao basica)
    const lastPoint = chartData[chartData.length -1];
    if (lastPoint.value !== (correctedPrincipal + totalInterest)) {
        chartData.push({
            label: 'Hoje',
            value: correctedPrincipal + totalInterest,
            principalPart: amount,
            interestPart: (correctedPrincipal - amount) + totalInterest
        });
    }

    return {
        originalValue: amount,
        updatedValue: finalValue,
        totalInterest,
        totalCorrection,
        totalFine,
        totalFees,
        indexUsed: index,
        timeInMonths: diffMonths,
        chartData
    };
};
