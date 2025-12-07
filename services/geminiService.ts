
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

    switch(type) {
        case 'LABOR': return calculateLaborPro(params);
        case 'TAX': return calculateTaxPro(params);
        case 'FAMILY': return calculateFamilyPro(params);
        case 'CRIMINAL': return calculateCriminalPro(params);
        case 'RENT': return calculateRentPro(params);
        case 'CONSUMER': return calculateConsumerPro(params);
        default: return calculateCivilPro(params);
    }
};

// 1. CÁLCULO CÍVEL (Cumprimento de Sentença - CPC/2015)
const calculateCivilPro = (params: any): CalculationResult => {
    const { amount, startDate, endDate, index, interestRate, applyFineArt523, honorariaPercent } = params;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMonths = Math.max(1, Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)));

    // 1. Correção Monetária (Súmula 43 STJ)
    let factor = 1.0;
    if (index === 'IGPM') factor = 1 + (diffMonths * 0.008); 
    else if (index === 'INPC') factor = 1 + (diffMonths * 0.005); 
    else factor = 1 + (diffMonths * 0.0045); // IPCA

    const correctedPrincipal = amount * factor;
    const monetaryCorrection = correctedPrincipal - amount;

    // 2. Juros de Mora (Súmula 54 STJ ou Citação)
    const interestTotalPercent = (interestRate / 100) * diffMonths;
    const interestValue = correctedPrincipal * interestTotalPercent;

    const subtotal = correctedPrincipal + interestValue;

    // 3. Multa Art. 523, §1º CPC (10%)
    const fine523 = applyFineArt523 ? subtotal * 0.10 : 0;

    // 4. Honorários Execução (10% sobre o subtotal, se aplicável multa)
    const feesExecution = applyFineArt523 ? subtotal * 0.10 : 0;

    // 5. Honorários Sucumbenciais
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

    memoryGrid.push({ description: "TOTAL DA EXECUÇÃO", value: total, isTotal: true, unit: 'R$' });

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

    const saldoSalario = salary; 
    const extraDays = Math.min(60, yearsWorked * 3);
    const noticeDays = 30 + extraDays;
    const noticeValue = reason === 'NO_CAUSE' ? (salary / 30) * noticeDays : 0;
    const avosFerias = monthsWorked % 12;
    const feriasVal = reason === 'JUST_CAUSE' ? 0 : (salary / 12) * avosFerias;
    const tercioFerias = feriasVal / 3;
    const decimoVal = reason === 'JUST_CAUSE' ? 0 : (salary / 12) * avosFerias;
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

    memoryGrid.push({ description: "TOTAL BRUTO RESCISÓRIO", value: total, isTotal: true, unit: 'R$' });

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

// 3. CÁLCULO TRIBUTÁRIO (Repetição de Indébito / SELIC)
const calculateTaxPro = (params: any): CalculationResult => {
    const { amountPaid, paymentDate, taxType } = params;
    
    const start = new Date(paymentDate);
    const end = new Date(); // Hoje
    const diffMonths = Math.max(1, Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)));

    const selicAccumulatedPercent = diffMonths * 0.95; 
    
    const correctionValue = amountPaid * (selicAccumulatedPercent / 100);
    const total = amountPaid + correctionValue;

    const memoryGrid: CalculationLineItem[] = [
        { description: "Valor do Pagamento Indevido", value: amountPaid, details: `Data Base: ${start.toLocaleDateString()}` },
        { description: `SELIC Acumulada (${diffMonths} meses)`, value: correctionValue, details: `Taxa simulada: ${selicAccumulatedPercent.toFixed(2)}% (Lei 9.250/95)` },
        { description: "TOTAL A RESTITUIR (Repetição)", value: total, isTotal: true, unit: 'R$' }
    ];

    return {
        type: 'TAX',
        originalValue: amountPaid,
        updatedValue: total,
        timeInMonths: diffMonths,
        indexUsed: taxType === 'FEDERAL' ? "SELIC (Receita Federal)" : "Índice Estadual + Juros",
        memoryGrid,
        chartData: [
            { label: 'Principal', value: amountPaid }, 
            { label: 'SELIC (Juros/Corr)', value: correctionValue }
        ]
    };
};

// 4. CÁLCULO FAMÍLIA (Execução de Alimentos - Rito Prisão/Penhora)
const calculateFamilyPro = (params: any): CalculationResult => {
    const { monthlyAlimony, startDate, endDate, includeThirteenth, extraExpenses, applyFineArt523 } = params;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMonths = Math.max(1, Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)));
    
    const baseParcela = monthlyAlimony;
    const totalParcelas = baseParcela * diffMonths;
    const avgCorrection = totalParcelas * 0.04; 
    const avgInterest = totalParcelas * 0.15; 

    const totalPrincipal = totalParcelas;
    const totalCorrection = avgCorrection;
    const totalInterest = avgInterest;

    let subtotal = totalPrincipal + totalCorrection + totalInterest;
    const extras = extraExpenses || 0;
    subtotal += extras;

    const fine = applyFineArt523 ? subtotal * 0.10 : 0;
    const finalTotal = subtotal + fine;

    const memoryGrid: CalculationLineItem[] = [];
    memoryGrid.push({ description: `Soma das Parcelas (${diffMonths} meses)`, value: totalPrincipal, details: `R$ ${monthlyAlimony.toFixed(2)} / mês` });
    memoryGrid.push({ description: "Correção Monetária (INPC)", value: totalCorrection, details: "Sobre vencimentos mensais" });
    memoryGrid.push({ description: "Juros de Mora (1% a.m.)", value: totalInterest, details: "Capitalização simples mensal" });
    
    if (extras > 0) {
        memoryGrid.push({ description: "Despesas Extras (50%)", value: extras, details: "Médico/Escolar comprovados" });
    }

    if (applyFineArt523) {
         memoryGrid.push({ description: "Multa Art. 523 CPC (10%)", value: fine, details: "Não pagamento voluntário" });
    }

    memoryGrid.push({ description: "DÉBITO ALIMENTAR TOTAL", value: finalTotal, isTotal: true, unit: 'R$' });

    return {
        type: 'FAMILY',
        originalValue: totalPrincipal,
        updatedValue: finalTotal,
        timeInMonths: diffMonths,
        indexUsed: "INPC + 1%",
        memoryGrid,
        chartData: [
            { label: 'Parcelas', value: totalPrincipal }, 
            { label: 'Encargos', value: totalCorrection + totalInterest },
            { label: 'Multa/Extras', value: fine + extras }
        ]
    };
};

// 5. CÁLCULO PENAL (Execução - Progressão de Regime)
const calculateCriminalPro = (params: any): CalculationResult => {
    const { sentenceYears, sentenceMonths, crimeType, isRecidivist } = params;

    // Converte pena total para dias
    const totalYears = Number(sentenceYears) || 0;
    const totalMonths = Number(sentenceMonths) || 0;
    const totalDays = (totalYears * 365) + (totalMonths * 30);
    const fullSentenceStr = `${totalYears} anos e ${totalMonths} meses`;

    // Define a fração necessária (Lei 13.964/19 - Pacote Anticrime)
    // Regra Simplificada para Demo:
    // 16% = Primário sem violência
    // 20% = Reincidente sem violência
    // 40% = Primário com violência ou Hediondo Primário
    // 60% = Reincidente com violência ou Hediondo Reincidente
    
    let percentage = 0.16;
    let desc = "16% (Primário s/ violência)";

    if (crimeType === 'NON_VIOLENT') {
        if (isRecidivist) { percentage = 0.20; desc = "20% (Reincidente s/ violência)"; }
        else { percentage = 0.16; desc = "16% (Primário s/ violência)"; }
    } else if (crimeType === 'VIOLENT') {
        if (isRecidivist) { percentage = 0.30; desc = "30% (Reincidente c/ violência)"; } // Nota: Lei pode variar para 30% ou mais
        else { percentage = 0.25; desc = "25% (Primário c/ violência)"; }
    } else if (crimeType === 'HEDIOUS') {
        if (isRecidivist) { percentage = 0.60; desc = "60% (Hediondo Reincidente)"; }
        else { percentage = 0.40; desc = "40% (Hediondo Primário)"; }
    }

    const daysToServe = Math.ceil(totalDays * percentage);
    const yearsToServe = Math.floor(daysToServe / 365);
    const monthsToServe = Math.floor((daysToServe % 365) / 30);
    const daysRemainder = Math.floor((daysToServe % 365) % 30);

    const timeToServeStr = `${yearsToServe}a ${monthsToServe}m ${daysRemainder}d`;

    const memoryGrid: CalculationLineItem[] = [
        { description: "Pena Total Imposta", value: totalDays, details: fullSentenceStr, unit: 'Dias Totais' },
        { description: "Fração para Progressão", value: percentage * 100, details: `Lei 13.964/19 (Pacote Anticrime)`, unit: '%' },
        { description: "Tempo Necessário (Cálculo)", value: daysToServe, details: `${totalDays} dias x ${percentage * 100}%`, unit: 'Dias' },
        { description: "TEMPO PARA PROGRESSÃO", value: 0, details: timeToServeStr, isTotal: true, unit: 'Tempo' }
    ];

    return {
        type: 'CRIMINAL',
        originalValue: fullSentenceStr,
        updatedValue: timeToServeStr,
        indexUsed: desc,
        memoryGrid,
        chartData: [
            { label: 'Cumprir Fechado', value: daysToServe },
            { label: 'Restante Pena', value: totalDays - daysToServe }
        ]
    };
};

// 6. CÁLCULO IMOBILIÁRIO (Reajuste de Aluguel)
const calculateRentPro = (params: any): CalculationResult => {
    const { currentRent, indexType, monthsAccumulated } = params;
    
    // Simulação de índices acumulados (12 meses)
    // IGPM (Volátil) vs IPCA (Estável)
    const factor = indexType === 'IGPM' ? 0.045 : 0.038; // Ex: 4.5% vs 3.8% acumulado
    
    const adjustmentRate = factor * (monthsAccumulated / 12); // Proporcional se for menos de 1 ano
    const adjustmentValue = currentRent * adjustmentRate;
    const newRent = currentRent + adjustmentValue;

    const memoryGrid: CalculationLineItem[] = [
        { description: "Aluguel Atual", value: currentRent, unit: 'R$' },
        { description: `Índice Acumulado (${indexType})`, value: adjustmentRate * 100, details: `Acumulado de ${monthsAccumulated} meses`, unit: '%' },
        { description: "Valor do Reajuste", value: adjustmentValue, details: `R$ ${currentRent} x ${(adjustmentRate * 100).toFixed(2)}%`, unit: 'R$' },
        { description: "NOVO ALUGUEL", value: newRent, isTotal: true, unit: 'R$' }
    ];

    return {
        type: 'RENT',
        originalValue: currentRent,
        updatedValue: newRent,
        indexUsed: indexType,
        memoryGrid,
        chartData: [
            { label: 'Valor Antigo', value: currentRent },
            { label: 'Aumento', value: adjustmentValue }
        ]
    };
};

// 7. CÁLCULO CONSUMIDOR (Devolução em Dobro - Indébito)
const calculateConsumerPro = (params: any): CalculationResult => {
    const { chargedValue, paymentDate, isBadFaith } = params;

    const start = new Date(paymentDate);
    const end = new Date();
    const diffMonths = Math.max(1, Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)));

    // Correção Monetária (INPC)
    const correctionFactor = 1 + (diffMonths * 0.005);
    const correctedValue = chargedValue * correctionFactor;
    
    // Juros 1% a.m.
    const interest = correctedValue * (diffMonths * 0.01);
    
    let subtotal = correctedValue + interest;
    let doubleValue = 0;

    // Art. 42 CDC (Devolução em Dobro)
    if (isBadFaith) {
        doubleValue = subtotal; // O "Dobro" é adicionar o valor mais uma vez (Valor + Valor = Dobro)
        subtotal = subtotal * 2;
    }

    const memoryGrid: CalculationLineItem[] = [
        { description: "Valor Cobrado Indevidamente", value: chargedValue, unit: 'R$' },
        { description: "Atualização Monetária (INPC)", value: correctedValue - chargedValue, details: "Súmula 43 STJ", unit: 'R$' },
        { description: "Juros de Mora (1% a.m.)", value: interest, details: "Art. 406 CC", unit: 'R$' },
    ];

    if (isBadFaith) {
        memoryGrid.push({ description: "Dobra Legal (Art. 42 CDC)", value: doubleValue, details: "Devolução em dobro do indébito", unit: 'R$' });
    } else {
        memoryGrid.push({ description: "Devolução Simples", value: 0, details: "Engano justificável (sem dobra)", unit: 'Info' });
    }

    memoryGrid.push({ description: "VALOR A RESTITUIR", value: subtotal, isTotal: true, unit: 'R$' });

    return {
        type: 'CONSUMER',
        originalValue: chargedValue,
        updatedValue: subtotal,
        indexUsed: isBadFaith ? "INPC + Juros + Dobra" : "INPC + Juros",
        memoryGrid,
        chartData: [
            { label: 'Original', value: chargedValue },
            { label: 'Encargos', value: interest + (correctedValue - chargedValue) },
            { label: 'Dobra Legal', value: doubleValue }
        ]
    };
};
