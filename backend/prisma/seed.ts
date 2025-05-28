import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Configuração das variáveis de ambiente
dotenv.config();

// Inicialização do Prisma Client
const prisma = new PrismaClient();

async function main() {
  try {
    // Criar usuário administrador
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@medequip.com' }
    });

    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      await prisma.user.create({
        data: {
          name: 'Administrador',
          email: 'admin@medequip.com',
          password: hashedPassword,
          role: 'admin'
        }
      });

      console.log('Usuário administrador criado com sucesso');
    }

    // Criar usuário técnico
    const techExists = await prisma.user.findUnique({
      where: { email: 'tecnico@medequip.com' }
    });

    if (!techExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('tecnico123', salt);

      await prisma.user.create({
        data: {
          name: 'Técnico',
          email: 'tecnico@medequip.com',
          password: hashedPassword,
          role: 'technician'
        }
      });

      console.log('Usuário técnico criado com sucesso');
    }

    // Criar equipamentos de exemplo
    const equipmentCount = await prisma.equipment.count();

    if (equipmentCount === 0) {
      const admin = await prisma.user.findUnique({
        where: { email: 'admin@medequip.com' }
      });

      if (admin) {
        // Equipamento 1
        const equipment1 = await prisma.equipment.create({
          data: {
            serialNumber: 'SN12345678',
            invoiceNumber: 'NF987654',
            brand: 'Philips',
            model: 'IntelliVue MX40',
            unit: 'Hospital Santa Maria',
            city: 'São Paulo',
            supportPhone: '11 3456-7890',
            status: 'active',
            acquisitionDate: new Date('2023-01-15'),
            warrantyUntil: new Date('2025-01-15'),
            imageUrl: 'https://example.com/images/mx40.jpg',
            description: 'Monitor de paciente portátil com ECG, SpO2 e pressão não invasiva',
            createdBy: admin.id
          }
        });

        // Equipamento 2
        const equipment2 = await prisma.equipment.create({
          data: {
            serialNumber: 'SN87654321',
            invoiceNumber: 'NF123456',
            brand: 'GE Healthcare',
            model: 'Logiq P9',
            unit: 'Clínica São Lucas',
            city: 'Rio de Janeiro',
            supportPhone: '21 2345-6789',
            status: 'maintenance',
            acquisitionDate: new Date('2022-06-10'),
            warrantyUntil: new Date('2024-06-10'),
            imageUrl: 'https://example.com/images/logiq-p9.jpg',
            description: 'Ultrassom de alta resolução para exames gerais',
            createdBy: admin.id
          }
        });

        // Equipamento 3
        const equipment3 = await prisma.equipment.create({
          data: {
            serialNumber: 'SN11223344',
            invoiceNumber: 'NF112233',
            brand: 'Siemens',
            model: 'MAGNETOM Aera',
            unit: 'Hospital Regional',
            city: 'Belo Horizonte',
            supportPhone: '31 3456-7890',
            status: 'active',
            acquisitionDate: new Date('2021-11-20'),
            warrantyUntil: new Date('2024-11-20'),
            imageUrl: 'https://example.com/images/magnetom.jpg',
            description: 'Ressonância magnética de 1.5T com tecnologia TIM 4G',
            createdBy: admin.id
          }
        });

        console.log('Equipamentos de exemplo criados com sucesso');

        // Criar manutenções de exemplo
        const tech = await prisma.user.findUnique({
          where: { email: 'tecnico@medequip.com' }
        });

        if (tech) {
          // Manutenção 1
          const maintenance1 = await prisma.maintenance.create({
            data: {
              equipmentId: equipment1.id,
              type: 'preventive',
              status: 'completed',
              executionDate: new Date('2023-07-15'),
              nextMaintenanceDate: new Date('2024-01-15'),
              technician: 'Carlos Silva',
              serviceTime: 120,
              cost: 500.00,
              replacedParts: 'Bateria, cabo de ECG',
              serviceDescription: 'Manutenção preventiva semestral. Substituição da bateria e cabo de ECG.',
              additionalNotes: 'Equipamento em bom estado geral.',
              createdBy: tech.id
            }
          });

          // Criar alerta para próxima manutenção
          await prisma.alert.create({
            data: {
              equipmentId: equipment1.id,
              maintenanceId: maintenance1.id,
              type: 'maintenance',
              status: 'pending',
              dueDate: new Date('2024-01-15'),
              message: `Manutenção preventiva programada para o equipamento Philips IntelliVue MX40 (SN12345678).`
            }
          });

          // Manutenção 2
          const maintenance2 = await prisma.maintenance.create({
            data: {
              equipmentId: equipment2.id,
              type: 'corrective',
              status: 'in_progress',
              executionDate: new Date('2023-12-05'),
              technician: 'Roberto Almeida',
              serviceTime: 240,
              cost: 1200.00,
              replacedParts: 'Placa principal, fonte de alimentação',
              serviceDescription: 'Reparo da placa principal e substituição da fonte de alimentação.',
              additionalNotes: 'Equipamento apresentou falha intermitente durante exames.',
              createdBy: tech.id
            }
          });

          // Manutenção 3
          const maintenance3 = await prisma.maintenance.create({
            data: {
              equipmentId: equipment3.id,
              type: 'preventive',
              status: 'completed',
              executionDate: new Date('2023-11-10'),
              nextMaintenanceDate: new Date('2024-05-10'),
              technician: 'Ana Paula Santos',
              serviceTime: 180,
              cost: 800.00,
              replacedParts: 'Filtros, cabos de conexão',
              serviceDescription: 'Manutenção preventiva semestral. Limpeza geral, calibração e testes de funcionamento.',
              additionalNotes: 'Equipamento funcionando dentro dos parâmetros esperados.',
              createdBy: tech.id
            }
          });

          // Criar alerta para próxima manutenção
          await prisma.alert.create({
            data: {
              equipmentId: equipment3.id,
              maintenanceId: maintenance3.id,
              type: 'maintenance',
              status: 'pending',
              dueDate: new Date('2024-05-10'),
              message: `Manutenção preventiva programada para o equipamento Siemens MAGNETOM Aera (SN11223344).`
            }
          });

          console.log('Manutenções e alertas de exemplo criados com sucesso');
        }
      }
    }

    console.log('Seed concluído com sucesso');
  } catch (error) {
    console.error('Erro ao executar seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
