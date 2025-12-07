
import { GoogleGenAI, Type } from "@google/genai";
import { StrategyAnalysis, CalculationResult, CalculatorType, CalculationLineItem } from "../types";

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

            Texto da Peça/Relato: "${text.substring(0, 8000)}"`, 
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
        return {
            weaknesses: ["Argumentação genérica.", "Falta de provas materiais."],
            counterArguments: ["Prescrição.", "Inépcia da inicial."],
            jurisprudence: [{ title: "Súmula 385 STJ", summary: "Dano moral." }],
            winProbability: "Média (50%)",
            winProbabilityValue: 50,
            recommendedFocus: "Focar na ausência de provas."
        };
    }
};

// --- MOTOR DE CÁLCULO JURÍDICO FORENSE (SENIOR LEVEL) ---

export const calculateLegalAdjustment = async (
    type: CalculatorType,
    params: any
): Promise<CalculationResult> => {
    
    // Delay simulado de processamento
    await new Promise(resolve => setTimeout(resolve, 600));

    if (type === 'LABOR') return calculateLaborPro(params);
    if (type === 'TAX') return calculateTaxPro(params);
    if (type === 'FAMILY') return calculateFamilyPro(params);
    return calculateCivilPro(params);
};

// 1. CÁLCULO CÍVEL (Cumprimento de Sentença - CPC/2015)
const calculateCivilPro = (params: any): CalculationResult => {
    const { amount, startDate, endDate, index, interestRate, applyFineArt523, honorariaPercent } = params;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMonths = Math.max(1, Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)));

    // 1. Correção Monetária (Súmula 43 STJ)
    // Simulação de Fator Acumulado (Ex: IGPM acumulado no período)
    let factor = 1.0;
    if (index === 'IGPM') factor = 1 + (diffMonths * 0.008); // Simulação 0.8% a.m
    else if (index === 'INPC') factor = 1 + (diffMonths * 0.005); // Simulação 0.5% a.m
    else factor = 1 + (diffMonths * 0.0045); // IPCA

    const correctedPrincipal = amount * factor;
    const monetaryCorrection = correctedPrincipal - amount;

    // 2. Juros de Mora (Súmula 54 STJ ou Citação)
    // Juros simples 1% a.m (Art. 406 CC/2002)
    const interestTotalPercent = (interestRate / 100) * diffMonths;
    const interestValue = correctedPrincipal * interestTotalPercent;

    const subtotal = correctedPrincipal + interestValue;

    // 3. Multa Art. 523, §1º CPC (10%)
    const fine523 = applyFineArt523 ? subtotal * 0.10 : 0;

    // 4. Honorários Execução (10% sobre o subtotal, se aplicável multa)
    const feesExecution = applyFineArt523 ? subtotal * 0.10 : 0;

    // 5. Honorários Sucumbenciais (Fase de Conhecimento)
    // Calculados sobre o valor atualizado + juros
    const feesSuccession = subtotal * (honorariaPercent / 100);

    const total = subtotal + fine523 + feesExecution + feesSuccession;

    // Grid de Memória de Cálculo
    const memoryGrid: CalculationLineItem[] = [
        { description: "Principal Histórico", value: amount, details: `Valor original em ${start.toLocaleDateString()}` },
        { description: `Correção Monetária (${index})`, value: monetaryCorrection, details: `Fator acumulado: ${factor.toFixed(4)}` },
        { description: "Principal Atualizado", value: correctedPrincipal, details: "Principal + Correção", isTotal: true },
        { description: `Juros Moratórios (${interestRate}% a.m.)`, value: interestValue, details: `${diffMonths} meses x ${interestRate}%` },
        { description: "Subtotal (Principal + Juros)", value: subtotal, isTotal: true },
    ];

    if (applyFineArt523) {
        memoryGrid.push({ description: "Multa Art. 523, §1º CPC (10%)", value: fine523, details: "Sobre o Subtotal" });
        memoryGrid.push({ description: "Honorários Execução (10%)", value: feesExecution, details: "Sobre o Subtotal (Art. 523)" });
    }

    if (honorariaPercent > 0) {
        memoryGrid.push({ description: `Honorários Sucumbenciais (${honorariaPercent}%)`, value: feesSuccession, details: "Fase de Conhecimento" });
    }

    memoryGrid.push({ description: "TOTAL DA EXECUÇÃO", value: total, isTotal: true });

    return {
        type: 'CIVIL',
        originalValue: amount,
        updatedValue: total,
        indexUsed: index,
        timeInMonths: diffMonths,
        memoryGrid,
        chartData: [
            { label: 'Principal', value: amount },
            { label: 'Correção', value: monetaryCorrection },
            { label: 'Juros', value: interestValue },
            { label: 'Multas/Hon.', value: fine523 + feesExecution + feesSuccession }
        ]
    };
};

// 2. CÁLCULO TRABALHISTA (Verbas Rescisórias CLT)
const calculateLaborPro = (params: any): CalculationResult => {
    const { salary, startDate, endDate, fgtsBalance, reason } = params;
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Tempo de casa
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    const yearsWorked = Math.floor(totalDays / 365);
    const monthsWorked = Math.floor(totalDays / 30);

    // 1. Saldo de Salário (Simulado: 30 dias cheios para simplificar demo)
    const saldoSalario = salary; 

    // 2. Aviso Prévio Proporcional (Lei 12.506/11)
    // 30 dias + 3 dias por ano completo, até max 90
    const extraDays = Math.min(60, yearsWorked * 3);
    const noticeDays = 30 + extraDays;
    const noticeValue = reason === 'NO_CAUSE' ? (salary / 30) * noticeDays : 0;

    // 3. Férias Proporcionais + 1/3
    // (Simulação simples: 1 avo por mes trabalhado no ano corrente)
    const avosFerias = monthsWorked % 12;
    const feriasVal = reason === 'JUST_CAUSE' ? 0 : (salary / 12) * avosFerias;
    const tercioFerias = feriasVal / 3;

    // 4. 13º Salário Proporcional
    const decimoVal = reason === 'JUST_CAUSE' ? 0 : (salary / 12) * avosFerias;

    // 5. Multa 40% FGTS
    // Base de cálculo = Saldo FGTS informado + depósitos do aviso prévio + 13º
    const fgtsPenalty = reason === 'NO_CAUSE' ? (fgtsBalance * 0.40) : 0;

    const total = saldoSalario + noticeValue + feriasVal + tercioFerias + decimoVal + fgtsPenalty;

    const memoryGrid: CalculationLineItem[] = [
        { description: "Último Salário", value: salary, details: `Base de Cálculo` },
        { description: "Saldo de Salário (Mês Rescisão)", value: saldoSalario },
    ];

    if (noticeValue > 0) {
        memoryGrid.push({ description: `Aviso Prévio Indenizado (${noticeDays} dias)`, value: noticeValue, details: `Lei 12.506/11 (30 + ${extraDays} dias)` });
    }

    if (reason !== 'JUST_CAUSE') {
        memoryGrid.push({ description: `Férias Proporcionais (${avosFerias}/12 avos)`, value: feriasVal });
        memoryGrid.push({ description: "Terço Constitucional de Férias", value: tercioFerias, details: "1/3 sobre férias" });
        memoryGrid.push({ description: `13º Salário Proporcional (${avosFerias}/12 avos)`, value: decimoVal });
        memoryGrid.push({ description: "Multa de 40% do FGTS", value: fgtsPenalty, details: `Sobre saldo R$ ${fgtsBalance}` });
    }

    memoryGrid.push({ description: "TOTAL BRUTO RESCISÓRIO", value: total, isTotal: true });

    return {
        type: 'LABOR',
        originalValue: salary,
        updatedValue: total,
        timeInMonths: monthsWorked,
        indexUsed: "CLT/TRCT",
        memoryGrid,
        chartData: [
            { label: 'Verbas Salariais', value: saldoSalario + decimoVal },
            { label: 'Indenizatórias', value: noticeValue + fgtsPenalty },
            { label: 'Férias', value: feriasVal + tercioFerias }
        ]
    };
};

// 3. CÁLCULO TRIBUTÁRIO (SELIC)
const calculateTaxPro = (params: any): CalculationResult => {
    const { amount, startDate, endDate } = params;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMonths = Math.max(1, Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)));

    // SELIC (Engloba juros e correção)
    const selicRate = diffMonths * 0.0095; // 0.95% média a.m
    const updatedValue = amount * (1 + selicRate);
    const selicValue = updatedValue - amount;

    const memoryGrid: CalculationLineItem[] = [
        { description: "Valor do Indébito", value: amount, details: `Data Base: ${start.toLocaleDateString()}` },
        { description: "Atualização SELIC (Acumulada)", value: selicValue, details: `Taxa aprox: ${(selicRate * 100).toFixed(2)}%` },
        { description: "TOTAL A RESTITUIR", value: updatedValue, isTotal: true }
    ];

    return {
        type: 'TAX',
        originalValue: amount,
        updatedValue: updatedValue,
        timeInMonths: diffMonths,
        indexUsed: "SELIC (Receita Federal)",
        memoryGrid,
        chartData: [{ label: 'Principal', value: amount }, { label: 'Juros SELIC', value: selicValue }]
    };
};

// 4. CÁLCULO FAMÍLIA (Pensão + 13º)
const calculateFamilyPro = (params: any): CalculationResult => {
    const { amount, startDate, endDate, includeThirteenth } = params;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMonths = Math.max(1, Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)));
    const years = Math.floor(diffMonths / 12);

    // Soma parcelas não pagas
    const baseTotal = amount * diffMonths;
    
    // Atualização monetária (INPC)
    const correction = baseTotal * 0.05; // 5% est.
    
    // Juros (1% a.m desde o vencimento de cada parcela - simplificado média)
    const interest = baseTotal * 0.10; 

    // 13º Salário sobre pensão (se acordado)
    const thirteenth = includeThirteenth ? (amount * years) : 0;

    const total = baseTotal + correction + interest + thirteenth;

    const memoryGrid: CalculationLineItem[] = [
        { description: `Parcelas Vencidas (${diffMonths} meses)`, value: baseTotal },
        { description: "Correção Monetária (INPC)", value: correction },
        { description: "Juros de Mora", value: interest },
    ];
    
    if (includeThirteenth) {
        memoryGrid.push({ description: "Reflexo em 13º Salário", value: thirteenth });
    }

    memoryGrid.push({ description: "TOTAL DÉBITO ALIMENTAR", value: total, isTotal: true });

    return {
        type: 'FAMILY',
        originalValue: amount,
        updatedValue: total,
        timeInMonths: diffMonths,
        indexUsed: "INPC",
        memoryGrid,
        chartData: [{ label: 'Principal', value: baseTotal }, { label: 'Encargos', value: correction + interest + thirteenth }]
    };
};
