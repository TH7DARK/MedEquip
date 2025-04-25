import { CronJob } from 'cron';
import { verificarEEnviarAlertas } from './services/alertaService';

// Agendador para verificar e enviar alertas todos os dias às 9h da manhã
export const iniciarAgendadorAlertas = () => {
  // Executa todos os dias às 9h da manhã
  const job = new CronJob('0 9 * * *', async () => {
    console.log('Executando verificação automática de alertas...');
    try {
      const alertasEnviados = await verificarEEnviarAlertas();
      console.log(`${alertasEnviados} alertas verificados e enviados com sucesso`);
    } catch (error) {
      console.error('Erro na verificação automática de alertas:', error);
    }
  });

  // Inicia o agendador
  job.start();
  console.log('Agendador de alertas iniciado com sucesso');
  
  return job;
};
