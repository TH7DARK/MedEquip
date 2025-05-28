import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Configuração da API OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

/**
 * Busca soluções para problemas de equipamentos médicos usando a OpenAI API
 * @param equipamento Informações sobre o equipamento (marca, modelo)
 * @param problema Descrição do problema relatado
 * @returns Objeto com soluções sugeridas e informações adicionais
 */
export const buscarSolucoes = async (equipamento: { marca: string; modelo: string }, problema: string) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('API Key da OpenAI não configurada');
    }

    // Construir o prompt para a API
    const prompt = `
    Você é um especialista em equipamentos médicos, especialmente da marca ${equipamento.marca}, modelo ${equipamento.modelo}.
    
    Por favor, forneça soluções detalhadas para o seguinte problema:
    
    "${problema}"
    
    Sua resposta deve incluir:
    1. Possíveis causas do problema
    2. Soluções passo a passo para resolver o problema
    3. Peças que podem precisar de substituição
    4. Medidas preventivas para evitar que o problema ocorra novamente
    5. Se é necessário contatar o suporte técnico do fabricante
    
    Forneça sua resposta em formato estruturado.
    `;

    // Fazer a chamada para a API da OpenAI
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // Processar a resposta
    const solucao = response.data.choices[0]?.text?.trim() || 'Não foi possível encontrar soluções para este problema.';

    // Estruturar a resposta
    return {
      equipamento: {
        marca: equipamento.marca,
        modelo: equipamento.modelo
      },
      problema,
      solucao,
      dataConsulta: new Date().toISOString()
    };
  } catch (error) {
    console.error('Erro ao buscar soluções com IA:', error);
    throw new Error('Erro ao buscar soluções para o problema. Por favor, tente novamente mais tarde.');
  }
};

/**
 * Busca informações sobre um equipamento médico usando a OpenAI API
 * @param marca Marca do equipamento
 * @param modelo Modelo do equipamento
 * @returns Objeto com informações sobre o equipamento
 */
export const buscarInformacoesEquipamento = async (marca: string, modelo: string) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('API Key da OpenAI não configurada');
    }

    // Construir o prompt para a API
    const prompt = `
    Forneça informações detalhadas sobre o equipamento médico da marca ${marca}, modelo ${modelo}.
    
    Inclua:
    1. Descrição geral do equipamento
    2. Especificações técnicas
    3. Principais funcionalidades
    4. Manutenções preventivas recomendadas
    5. URL de uma imagem representativa do equipamento (se disponível)
    6. URL do manual do usuário (se disponível)
    
    Forneça sua resposta em formato JSON com os seguintes campos:
    {
      "descricao": "descrição detalhada",
      "especificacoes": "especificações técnicas",
      "funcionalidades": "principais funcionalidades",
      "manutencoesPreventivasRecomendadas": "recomendações de manutenção",
      "urlImagem": "url da imagem ou null",
      "urlManual": "url do manual ou null"
    }
    `;

    // Fazer a chamada para a API da OpenAI
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // Processar a resposta
    const textoResposta = response.data.choices[0]?.text?.trim() || '{}';
    
    // Tentar extrair o JSON da resposta
    let jsonMatch = textoResposta.match(/\{[\s\S]*\}/);
    let informacoes = {};
    
    if (jsonMatch) {
      try {
        informacoes = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error('Erro ao fazer parse do JSON:', e);
        // Criar um objeto com os dados disponíveis em formato de texto
        informacoes = {
          descricao: textoResposta,
          especificacoes: "",
          funcionalidades: "",
          manutencoesPreventivasRecomendadas: "",
          urlImagem: null,
          urlManual: null
        };
      }
    } else {
      // Se não conseguir extrair JSON, usar o texto completo como descrição
      informacoes = {
        descricao: textoResposta,
        especificacoes: "",
        funcionalidades: "",
        manutencoesPreventivasRecomendadas: "",
        urlImagem: null,
        urlManual: null
      };
    }

    // Estruturar a resposta
    return {
      marca,
      modelo,
      ...informacoes,
      dataConsulta: new Date().toISOString()
    };
  } catch (error) {
    console.error('Erro ao buscar informações do equipamento com IA:', error);
    throw new Error('Erro ao buscar informações do equipamento. Por favor, tente novamente mais tarde.');
  }
};
