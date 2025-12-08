
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

// 3. CÁLCULO TRIBUTÁRIO (Repetição de Indébito / SELIC)
const calculateTaxPro = (params: any): CalculationResult => {
    // Parâmetros específicos para Tributário
    const { amountPaid, paymentDate, taxType } = params;
    
    // SELIC (Sistema Especial de Liquidação e de Custódia)
    // Regra: A restituição de tributos federais é corrigida pela taxa SELIC acumulada a partir do mês seguinte ao pagamento indevido.
    // NÃO há juros de mora de 1% a.m. adicionais (Súmula 523 STJ a contrario sensu e Lei 9.250/95).
    
    const start = new Date(paymentDate);
    const end = new Date(); // Hoje
    const diffMonths = Math.max(1, Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)));

    // Simulação da SELIC Acumulada (aprox. 0.85% a 1.05% ao mês variando)
    // Em produção, isso viria de uma API do Banco Central (SGS).
    // Vamos simular uma média de 0.95% a.m.
    const selicAccumulatedPercent = diffMonths * 0.95; // Ex: 10 meses = 9.5%
    
    const correctionValue = amountPaid * (selicAccumulatedPercent / 100);
    const total = amountPaid + correctionValue;

    const memoryGrid: CalculationLineItem[] = [
        { description: "Valor do Pagamento Indevido", value: amountPaid, details: `Data Base: ${start.toLocaleDateString()}` },
        { description: `SELIC Acumulada (${diffMonths} meses)`, value: correctionValue, details: `Taxa simulada: ${selicAccumulatedPercent.toFixed(2)}% (Lei 9.250/95)` },
        { description: "TOTAL A RESTITUIR (Repetição)", value: total, isTotal: true }
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
    
    // Dívida de Trato Sucessivo: Cada mês vence uma parcela e juros correm individualmente.
    // Simulação simplificada (média ponderada) para demonstração:
    
    let totalPrincipal = 0;
    let totalCorrection = 0;
    let totalInterest = 0;
    const memoryGrid: CalculationLineItem[] = [];

    // Loop simulado (resumido)
    const baseParcela = monthlyAlimony;
    const totalParcelas = baseParcela * diffMonths;
    
    // Simulação de correção média (INPC)
    const avgCorrection = totalParcelas * 0.04; // 4% est.
    
    // Juros de 1% a.m. decrescentes (A primeira parcela tem mais juros, a última tem 0)
    // Soma de PA: (n * (n+1)) / 2 * juros
    // Média de juros acumulados sobre o montante:
    const avgInterest = totalParcelas * 0.15; // Est.

    totalPrincipal = totalParcelas;
    totalCorrection = avgCorrection;
    totalInterest = avgInterest;

    let subtotal = totalPrincipal + totalCorrection + totalInterest;

    // Extras (Farmácia, Escola - 50%)
    const extras = extraExpenses || 0;
    subtotal += extras;

    // Multa Art. 523 (se rito de penhora)
    const fine = applyFineArt523 ? subtotal * 0.10 : 0;
    const finalTotal = subtotal + fine;

    memoryGrid.push({ description: `Soma das Parcelas (${diffMonths} meses)`, value: totalPrincipal, details: `R$ ${monthlyAlimony.toFixed(2)} / mês` });
    memoryGrid.push({ description: "Correção Monetária (INPC)", value: totalCorrection, details: "Sobre vencimentos mensais" });
    memoryGrid.push({ description: "Juros de Mora (1% a.m.)", value: totalInterest, details: "Capitalização simples mensal" });
    
    if (extras > 0) {
        memoryGrid.push({ description: "Despesas Extras (50%)", value: extras, details: "Médico/Escolar comprovados" });
    }

    if (applyFineArt523) {
         memoryGrid.push({ description: "Multa Art. 523 CPC (10%)", value: fine, details: "Não pagamento voluntário" });
    }

    memoryGrid.push({ description: "DÉBITO ALIMENTAR TOTAL", value: finalTotal, isTotal: true });

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
