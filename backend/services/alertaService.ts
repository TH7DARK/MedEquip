import { prisma } from '../index';
import { Alerta } from '@prisma/client';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Configurações das APIs
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY;

// Função para enviar alerta via Telegram
export const enviarAlertaTelegram = async (alerta: Alerta, chatId: string) => {
  try {
    if (!TELEGRAM_BOT_TOKEN) {
      console.error('Token do Telegram não configurado');
      return false;
    }

    // Buscar informações detalhadas do alerta
    const alertaDetalhado = await prisma.alerta.findUnique({
      where: { id: alerta.id },
      include: {
        equipamento: {
          include: {
            unidade: true
          }
        },
        manutencao: true
      }
    });

    if (!alertaDetalhado) {
      console.error('Alerta não encontrado');
      return false;
    }

    // Construir mensagem
    const mensagem = `🔔 *ALERTA DE MANUTENÇÃO* 🔔\n\n` +
      `*Equipamento:* ${alertaDetalhado.equipamento.nome}\n` +
      `*Modelo:* ${alertaDetalhado.equipamento.modelo}\n` +
      `*Unidade:* ${alertaDetalhado.equipamento.unidade.nome}\n` +
      `*Data Programada:* ${new Date(alertaDetalhado.dataAlerta).toLocaleDateString('pt-BR')}\n` +
      `*Mensagem:* ${alertaDetalhado.mensagem || 'Manutenção programada'}\n\n` +
      `Por favor, confirme o recebimento deste alerta.`;

    // Enviar mensagem via API do Telegram
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await axios.post(url, {
      chat_id: chatId,
      text: mensagem,
      parse_mode: 'Markdown'
    });

    if (response.data.ok) {
      console.log(`Alerta enviado com sucesso via Telegram para ${chatId}`);
      return true;
    } else {
      console.error('Erro ao enviar alerta via Telegram:', response.data);
      return false;
    }
  } catch (error) {
    console.error('Erro ao enviar alerta via Telegram:', error);
    return false;
  }
};

// Função para enviar alerta via WhatsApp
export const enviarAlertaWhatsApp = async (alerta: Alerta, telefone: string) => {
  try {
    if (!WHATSAPP_API_KEY) {
      console.error('API Key do WhatsApp não configurada');
      return false;
    }

    // Buscar informações detalhadas do alerta
    const alertaDetalhado = await prisma.alerta.findUnique({
      where: { id: alerta.id },
      include: {
        equipamento: {
          include: {
            unidade: true
          }
        },
        manutencao: true
      }
    });

    if (!alertaDetalhado) {
      console.error('Alerta não encontrado');
      return false;
    }

    // Construir mensagem
    const mensagem = `🔔 *ALERTA DE MANUTENÇÃO* 🔔\n\n` +
      `*Equipamento:* ${alertaDetalhado.equipamento.nome}\n` +
      `*Modelo:* ${alertaDetalhado.equipamento.modelo}\n` +
      `*Unidade:* ${alertaDetalhado.equipamento.unidade.nome}\n` +
      `*Data Programada:* ${new Date(alertaDetalhado.dataAlerta).toLocaleDateString('pt-BR')}\n` +
      `*Mensagem:* ${alertaDetalhado.mensagem || 'Manutenção programada'}\n\n` +
      `Por favor, confirme o recebimento deste alerta.`;

    // Enviar mensagem via API do WhatsApp (usando API fictícia como exemplo)
    // Na implementação real, seria utilizada a API oficial do WhatsApp Business
    const url = 'https://api.whatsapp.com/send';
    const response = await axios.post(url, {
      apiKey: WHATSAPP_API_KEY,
      phone: telefone,
      message: mensagem
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WHATSAPP_API_KEY}`
      }
    });

    if (response.status === 200) {
      console.log(`Alerta enviado com sucesso via WhatsApp para ${telefone}`);
      return true;
    } else {
      console.error('Erro ao enviar alerta via WhatsApp:', response.data);
      return false;
    }
  } catch (error) {
    console.error('Erro ao enviar alerta via WhatsApp:', error);
    return false;
  }
};

// Função para verificar e enviar alertas pendentes
export const verificarEEnviarAlertas = async () => {
  try {
    // Obter data atual
    const hoje = new Date();
    
    // Obter alertas pendentes para o dia seguinte
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    
    // Definir início e fim do dia para amanhã
    const inicioAmanha = new Date(amanha.setHours(0, 0, 0, 0));
    const fimAmanha = new Date(amanha.setHours(23, 59, 59, 999));
    
    const alertasPendentes = await prisma.alerta.findMany({
      where: {
        status: 'Pendente',
        dataAlerta: {
          gte: inicioAmanha,
          lte: fimAmanha
        }
      },
      include: {
        equipamento: {
          include: {
            unidade: true
          }
        }
      }
    });
    
    console.log(`Encontrados ${alertasPendentes.length} alertas pendentes para amanhã`);
    
    // Buscar destinatários dos alertas (em uma implementação real, isso viria do banco de dados)
    // Aqui estamos usando valores fictícios para exemplo
    const destinatarios = [
      { tipo: 'telegram', id: '123456789', nome: 'Técnico 1' },
      { tipo: 'whatsapp', id: '+5511987654321', nome: 'Técnico 2' }
    ];
    
    // Enviar alertas para cada destinatário
    for (const alerta of alertasPendentes) {
      for (const destinatario of destinatarios) {
        if (destinatario.tipo === 'telegram') {
          await enviarAlertaTelegram(alerta, destinatario.id);
        } else if (destinatario.tipo === 'whatsapp') {
          await enviarAlertaWhatsApp(alerta, destinatario.id);
        }
      }
      
      // Atualizar status do alerta para indicar que foi enviado
      await prisma.alerta.update({
        where: { id: alerta.id },
        data: {
          updatedAt: new Date()
        }
      });
    }
    
    return alertasPendentes.length;
  } catch (error) {
    console.error('Erro ao verificar e enviar alertas:', error);
    return 0;
  }
};
