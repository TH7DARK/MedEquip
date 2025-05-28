# Documentação da API - Sistema de Gerenciamento de Equipamentos Médicos

## Visão Geral

Esta documentação descreve a API REST do Sistema de Gerenciamento de Equipamentos Médicos, que permite o cadastro, monitoramento e manutenção de equipamentos médicos.

## Base URL

```
http://localhost:3001/api
```

## Autenticação

A API utiliza autenticação baseada em tokens JWT. Para acessar endpoints protegidos, é necessário incluir o token no cabeçalho de autorização:

```
Authorization: Bearer {seu_token_jwt}
```

### Endpoints de Autenticação

#### Registrar Usuário

```
POST /auth/register
```

**Corpo da Requisição:**
```json
{
  "name": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "password": "senha123",
  "role": "user" // "admin", "user" ou "technician"
}
```

**Resposta de Sucesso:**
```json
{
  "message": "Usuário registrado com sucesso",
  "token": "seu_token_jwt",
  "user": {
    "id": 1,
    "name": "Nome do Usuário",
    "email": "usuario@exemplo.com",
    "role": "user"
  }
}
```

#### Login

```
POST /auth/login
```

**Corpo da Requisição:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Resposta de Sucesso:**
```json
{
  "message": "Login realizado com sucesso",
  "token": "seu_token_jwt",
  "user": {
    "id": 1,
    "name": "Nome do Usuário",
    "email": "usuario@exemplo.com",
    "role": "user"
  }
}
```

#### Obter Informações do Usuário Atual

```
GET /auth/me
```

**Resposta de Sucesso:**
```json
{
  "id": 1,
  "name": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "role": "user",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

## Equipamentos

### Listar Equipamentos

```
GET /equipment
```

**Parâmetros de Consulta:**
- `status` - Filtrar por status (active, maintenance, inactive)
- `search` - Buscar por número de série, marca ou modelo
- `unit` - Filtrar por unidade
- `city` - Filtrar por cidade

**Resposta de Sucesso:**
```json
[
  {
    "id": 1,
    "serialNumber": "SN12345678",
    "invoiceNumber": "NF987654",
    "brand": "Philips",
    "model": "IntelliVue MX40",
    "unit": "Hospital Santa Maria",
    "city": "São Paulo",
    "supportPhone": "11 3456-7890",
    "status": "active",
    "acquisitionDate": "2023-01-15T00:00:00.000Z",
    "warrantyUntil": "2025-01-15T00:00:00.000Z",
    "imageUrl": "https://example.com/images/mx40.jpg",
    "description": "Monitor de paciente portátil com ECG, SpO2 e pressão não invasiva",
    "createdAt": "2023-01-15T00:00:00.000Z",
    "updatedAt": "2023-01-15T00:00:00.000Z",
    "createdBy": 1,
    "maintenance": [
      {
        "id": 1,
        "type": "preventive",
        "status": "completed",
        "executionDate": "2023-07-15T00:00:00.000Z"
      }
    ]
  }
]
```

### Obter Detalhes de um Equipamento

```
GET /equipment/:id
```

**Resposta de Sucesso:**
```json
{
  "id": 1,
  "serialNumber": "SN12345678",
  "invoiceNumber": "NF987654",
  "brand": "Philips",
  "model": "IntelliVue MX40",
  "unit": "Hospital Santa Maria",
  "city": "São Paulo",
  "supportPhone": "11 3456-7890",
  "status": "active",
  "acquisitionDate": "2023-01-15T00:00:00.000Z",
  "warrantyUntil": "2025-01-15T00:00:00.000Z",
  "imageUrl": "https://example.com/images/mx40.jpg",
  "description": "Monitor de paciente portátil com ECG, SpO2 e pressão não invasiva",
  "createdAt": "2023-01-15T00:00:00.000Z",
  "updatedAt": "2023-01-15T00:00:00.000Z",
  "createdBy": 1,
  "maintenance": [
    {
      "id": 1,
      "equipmentId": 1,
      "type": "preventive",
      "status": "completed",
      "executionDate": "2023-07-15T00:00:00.000Z",
      "nextMaintenanceDate": "2024-01-15T00:00:00.000Z",
      "technician": "Carlos Silva",
      "serviceTime": 120,
      "cost": 500,
      "replacedParts": "Bateria, cabo de ECG",
      "serviceDescription": "Manutenção preventiva semestral. Substituição da bateria e cabo de ECG.",
      "additionalNotes": "Equipamento em bom estado geral.",
      "createdAt": "2023-07-15T00:00:00.000Z",
      "updatedAt": "2023-07-15T00:00:00.000Z",
      "createdBy": 2
    }
  ],
  "alerts": [
    {
      "id": 1,
      "equipmentId": 1,
      "maintenanceId": 1,
      "type": "maintenance",
      "status": "pending",
      "dueDate": "2024-01-15T00:00:00.000Z",
      "message": "Manutenção preventiva programada para o equipamento Philips IntelliVue MX40 (SN12345678).",
      "createdAt": "2023-07-15T00:00:00.000Z",
      "updatedAt": "2023-07-15T00:00:00.000Z"
    }
  ]
}
```

### Adicionar Equipamento

```
POST /equipment
```

**Corpo da Requisição:**
```json
{
  "serialNumber": "SN12345678",
  "invoiceNumber": "NF987654",
  "brand": "Philips",
  "model": "IntelliVue MX40",
  "unit": "Hospital Santa Maria",
  "city": "São Paulo",
  "supportPhone": "11 3456-7890",
  "status": "active",
  "acquisitionDate": "2023-01-15",
  "warrantyUntil": "2025-01-15",
  "imageUrl": "https://example.com/images/mx40.jpg",
  "manualUrl": "https://example.com/manuals/mx40.pdf",
  "description": "Monitor de paciente portátil com ECG, SpO2 e pressão não invasiva"
}
```

**Resposta de Sucesso:**
```json
{
  "message": "Equipamento cadastrado com sucesso",
  "equipment": {
    "id": 1,
    "serialNumber": "SN12345678",
    "invoiceNumber": "NF987654",
    "brand": "Philips",
    "model": "IntelliVue MX40",
    "unit": "Hospital Santa Maria",
    "city": "São Paulo",
    "supportPhone": "11 3456-7890",
    "status": "active",
    "acquisitionDate": "2023-01-15T00:00:00.000Z",
    "warrantyUntil": "2025-01-15T00:00:00.000Z",
    "imageUrl": "https://example.com/images/mx40.jpg",
    "manualUrl": "https://example.com/manuals/mx40.pdf",
    "description": "Monitor de paciente portátil com ECG, SpO2 e pressão não invasiva",
    "createdAt": "2023-01-15T00:00:00.000Z",
    "updatedAt": "2023-01-15T00:00:00.000Z",
    "createdBy": 1
  }
}
```

### Atualizar Equipamento

```
PUT /equipment/:id
```

**Corpo da Requisição:**
```json
{
  "serialNumber": "SN12345678",
  "invoiceNumber": "NF987654",
  "brand": "Philips",
  "model": "IntelliVue MX40",
  "unit": "Hospital Santa Maria",
  "city": "São Paulo",
  "supportPhone": "11 3456-7890",
  "status": "active",
  "acquisitionDate": "2023-01-15",
  "warrantyUntil": "2025-01-15",
  "imageUrl": "https://example.com/images/mx40.jpg",
  "manualUrl": "https://example.com/manuals/mx40.pdf",
  "description": "Monitor de paciente portátil com ECG, SpO2 e pressão não invasiva"
}
```

**Resposta de Sucesso:**
```json
{
  "message": "Equipamento atualizado com sucesso",
  "equipment": {
    "id": 1,
    "serialNumber": "SN12345678",
    "invoiceNumber": "NF987654",
    "brand": "Philips",
    "model": "IntelliVue MX40",
    "unit": "Hospital Santa Maria",
    "city": "São Paulo",
    "supportPhone": "11 3456-7890",
    "status": "active",
    "acquisitionDate": "2023-01-15T00:00:00.000Z",
    "warrantyUntil": "2025-01-15T00:00:00.000Z",
    "imageUrl": "https://example.com/images/mx40.jpg",
    "manualUrl": "https://example.com/manuals/mx40.pdf",
    "description": "Monitor de paciente portátil com ECG, SpO2 e pressão não invasiva",
    "createdAt": "2023-01-15T00:00:00.000Z",
    "updatedAt": "2023-01-15T00:00:00.000Z",
    "createdBy": 1
  }
}
```

### Remover Equipamento

```
DELETE /equipment/:id
```

**Resposta de Sucesso:**
```json
{
  "message": "Equipamento removido com sucesso"
}
```

### Buscar Informações Automáticas

```
POST /equipment/search-info
```

**Corpo da Requisição:**
```json
{
  "brand": "Philips",
  "model": "IntelliVue MX40"
}
```

**Resposta de Sucesso:**
```json
{
  "imageUrl": "https://example.com/images/philips-intellivue-mx40.jpg",
  "manualUrl": "https://example.com/manuals/philips-intellivue-mx40.pdf",
  "description": "Equipamento médico Philips modelo IntelliVue MX40. Monitor de paciente portátil com ECG, SpO2 e pressão não invasiva."
}
```

## Manutenções

### Listar Manutenções

```
GET /maintenance
```

**Parâmetros de Consulta:**
- `type` - Filtrar por tipo (preventive, corrective)
- `status` - Filtrar por status (completed, in_progress, scheduled, canceled)
- `equipmentId` - Filtrar por ID do equipamento

**Resposta de Sucesso:**
```json
[
  {
    "id": 1,
    "equipmentId": 1,
    "type": "preventive",
    "status": "completed",
    "executionDate": "2023-07-15T00:00:00.000Z",
    "nextMaintenanceDate": "2024-01-15T00:00:00.000Z",
    "technician": "Carlos Silva",
    "serviceTime": 120,
    "cost": 500,
    "replacedParts": "Bateria, cabo de ECG",
    "serviceDescription": "Manutenção preventiva semestral. Substituição da bateria e cabo de ECG.",
    "additionalNotes": "Equipamento em bom estado geral.",
    "createdAt": "2023-07-15T00:00:00.000Z",
    "updatedAt": "2023-07-15T00:00:00.000Z",
    "createdBy": 2,
    "equipment": {
      "id": 1,
      "serialNumber": "SN12345678",
      "brand": "Philips",
      "model": "IntelliVue MX40",
      "unit": "Hospital Santa Maria",
      "city": "São Paulo"
    }
  }
]
```

### Obter Detalhes de uma Manutenção

```
GET /maintenance/:id
```

**Resposta de Sucesso:**
```json
{
  "id": 1,
  "equipmentId": 1,
  "type": "preventive",
  "status": "completed",
  "executionDate": "2023-07-15T00:00:00.000Z",
  "nextMaintenanceDate": "2024-01-15T00:00:00.000Z",
  "technician": "Carlos Silva",
  "serviceTime": 120,
  "cost": 500,
  "replacedParts": "Bateria, cabo de ECG",
  "serviceDescription": "Manutenção preventiva semestral. Substituição da bateria e cabo de ECG.",
  "additionalNotes": "Equipamento em bom estado geral.",
  "createdAt": "2023-07-15T00:00:00.000Z",
  "updatedAt": "2023-07-15T00:00:00.000Z",
  "createdBy": 2,
  "equipment": {
    "id": 1,
    "serialNumber": "SN12345678",
    "invoiceNumber": "NF987654",
    "brand": "Philips",
    "model": "IntelliVue MX40",
    "unit": "Hospital Santa Maria",
    "city": "São Paulo",
    "supportPhone": "11 3456-7890",
    "status": "active",
    "acquisitionDate": "2023-01-15T00:00:00.000Z",
    "warrantyUntil": "2025-01-15T00:00:00.000Z",
    "imageUrl": "https://example.com/images/mx40.jpg",
    "description": "Monitor de paciente portátil com ECG, SpO2 e pressão não invasiva",
    "createdAt": "2023-01-15T00:00:00.000Z",
    "updatedAt": "2023-01-15T00:00:00.000Z",
    "createdBy": 1
  },
  "alerts": [
    {
      "id": 1,
      "equipmentId": 1,
      "maintenanceId": 1,
      "type": "maintenance",
      "status": "pending",
      "dueDate": "2024-01-15T00:00:00.000Z",
      "message": "Manutenção preventiva programada para o equipamento Philips IntelliVue MX40 (SN12345678).",
      "createdAt": "2023-07-15T00:00:00.000Z",
      "updatedAt": "2023-07-15T00:00:00.000Z"
    }
  ]
}
```

### Adicionar Manutenção

```
POST /maintenance
```

**Corpo da Requisição:**
```json
{
  "equipmentId": 1,
  "type": "preventive",
  "status": "completed",
  "executionDate": "2023-07-15",
  "nextMaintenanceDate": "2024-01-15",
  "technician": "Carlos Silva",
  "serviceTime": 120,
  "cost": 500,
  "replacedParts": "Bateria, cabo de ECG",
  "serviceDescription": "Manutenção preventiva semestral. Substituição da bateria e cabo de ECG.",
  "additionalNotes": "Equipamento em bom estado geral."
}
```

**Resposta de Sucesso:**
```json
{
  "message": "Manutenção registrada com sucesso",
  "maintenance": {
    "id": 1,
    "equipmentId": 1,
    "type": "preventive",
    "status": "completed",
    "executionDate": "2023-07-15T00:00:00.000Z",
    "nextMaintenanceDate": "2024-01-15T00:00:00.000Z",
    "technician": "Carlos Silva",
    "serviceTime": 120,
    "cost": 500,
    "replacedParts": "Bateria, cabo de ECG",
    "serviceDescription": "Manutenção preventiva semestral. Substituição da bateria e cabo de ECG.",
    "additionalNotes": "Equipamento em bom estado geral.",
    "createdAt": "2023-07-15T00:00:00.000Z",
    "updatedAt": "2023-07-15T00:00:00.000Z",
    "createdBy": 2
  }
}
```

### Atualizar Manutenção

```
PUT /maintenance/:id
```

**Corpo da Requisição:**
```json
{
  "type": "preventive",
  "status": "completed",
  "executionDate": "2023-07-15",
  "nextMaintenanceDate": "2024-01-15",
  "technician": "Carlos Silva",
  "serviceTime": 120,
  "cost": 500,
  "replacedParts": "Bateria, cabo de ECG",
  "serviceDescription": "Manutenção preventiva semestral. Substituição da bateria e cabo de ECG.",
  "additionalNotes": "Equipamento em bom estado geral."
}
```

**Resposta de Sucesso:**
```json
{
  "message": "Manutenção atualizada com sucesso",
  "maintenance": {
    "id": 1,
    "equipmentId": 1,
    "type": "preventive",
    "status": "completed",
    "executionDate": "2023-07-15T00:00:00.000Z",
    "nextMaintenanceDate": "2024-01-15T00:00:00.000Z",
    "technician": "Carlos Silva",
    "serviceTime": 120,
    "cost": 500,
    "replacedParts": "Bateria, cabo de ECG",
    "serviceDescription": "Manutenção preventiva semestral. Substituição da bateria e cabo de ECG.",
    "additionalNotes": "Equipamento em bom estado geral.",
    "createdAt": "2023-07-15T00:00:00.000Z",
    "updatedAt": "2023-07-15T00:00:00.000Z",
    "createdBy": 2
  }
}
```

### Remover Manutenção

```
DELETE /maintenance/:id
```

**Resposta de Sucesso:**
```json
{
  "message": "Manutenção removida com sucesso"
}
```

### Listar Manutenções de um Equipamento

```
GET /maintenance/equipment/:equipmentId
```

**Resposta de Sucesso:**
```json
[
  {
    "id": 1,
    "equipmentId": 1,
    "type": "preventive",
    "status": "completed",
    "executionDate": "2023-07-15T00:00:00.000Z",
    "nextMaintenanceDate": "2024-01-15T00:00:00.000Z",
    "technician": "Carlos Silva",
    "serviceTime": 120,
    "cost": 500,
    "replacedParts": "Bateria, cabo de ECG",
    "serviceDescription": "Manutenção preventiva semestral. Substituição da bateria e cabo de ECG.",
    "additionalNotes": "Equipamento em bom estado geral.",
    "createdAt": "2023-07-15T00:00:00.000Z",
    "updatedAt": "2023-07-15T00:00:00.000Z",
    "createdBy": 2
  }
]
```

## Alertas

### Listar Alertas

```
GET /alerts
```

**Parâmetros de Consulta:**
- `type` - Filtrar por tipo (maintenance, warranty, other)
- `status` - Filtrar por status (pending, completed, canceled)
- `equipmentId` - Filtrar por ID do equipamento

**Resposta de Sucesso:**
```json
[
  {
    "id": 1,
    "equipmentId": 1,
    "maintenanceId": 1,
    "type": "maintenance",
    "status": "pending",
    "dueDate": "2024-01-15T00:00:00.000Z",
    "message": "Manutenção preventiva programada para o equipamento Philips IntelliVue MX40 (SN12345678).",
    "createdAt": "2023-07-15T00:00:00.000Z",
    "updatedAt": "2023-07-15T00:00:00.000Z",
    "equipment": {
      "id": 1,
      "serialNumber": "SN12345678",
      "brand": "Philips",
      "model": "IntelliVue MX40",
      "unit": "Hospital Santa Maria",
      "city": "São Paulo"
    },
    "maintenance": {
      "id": 1,
      "type": "preventive",
      "executionDate": "2023-07-15T00:00:00.000Z"
    }
  }
]
```

### Obter Detalhes de um Alerta

```
GET /alerts/:id
```

**Resposta de Sucesso:**
```json
{
  "id": 1,
  "equipmentId": 1,
  "maintenanceId": 1,
  "type": "maintenance",
  "status": "pending",
  "dueDate": "2024-01-15T00:00:00.000Z",
  "message": "Manutenção preventiva programada para o equipamento Philips IntelliVue MX40 (SN12345678).",
  "createdAt": "2023-07-15T00:00:00.000Z",
  "updatedAt": "2023-07-15T00:00:00.000Z",
  "equipment": {
    "id": 1,
    "serialNumber": "SN12345678",
    "invoiceNumber": "NF987654",
    "brand": "Philips",
    "model": "IntelliVue MX40",
    "unit": "Hospital Santa Maria",
    "city": "São Paulo",
    "supportPhone": "11 3456-7890",
    "status": "active",
    "acquisitionDate": "2023-01-15T00:00:00.000Z",
    "warrantyUntil": "2025-01-15T00:00:00.000Z",
    "imageUrl": "https://example.com/images/mx40.jpg",
    "description": "Monitor de paciente portátil com ECG, SpO2 e pressão não invasiva",
    "createdAt": "2023-01-15T00:00:00.000Z",
    "updatedAt": "2023-01-15T00:00:00.000Z",
    "createdBy": 1
  },
  "maintenance": {
    "id": 1,
    "equipmentId": 1,
    "type": "preventive",
    "status": "completed",
    "executionDate": "2023-07-15T00:00:00.000Z",
    "nextMaintenanceDate": "2024-01-15T00:00:00.000Z",
    "technician": "Carlos Silva",
    "serviceTime": 120,
    "cost": 500,
    "replacedParts": "Bateria, cabo de ECG",
    "serviceDescription": "Manutenção preventiva semestral. Substituição da bateria e cabo de ECG.",
    "additionalNotes": "Equipamento em bom estado geral.",
    "createdAt": "2023-07-15T00:00:00.000Z",
    "updatedAt": "2023-07-15T00:00:00.000Z",
    "createdBy": 2
  }
}
```

### Adicionar Alerta

```
POST /alerts
```

**Corpo da Requisição:**
```json
{
  "equipmentId": 1,
  "maintenanceId": null,
  "type": "warranty",
  "status": "pending",
  "dueDate": "2025-01-15",
  "message": "A garantia do equipamento Philips IntelliVue MX40 (SN12345678) expira nesta data."
}
```

**Resposta de Sucesso:**
```json
{
  "message": "Alerta criado com sucesso",
  "alert": {
    "id": 2,
    "equipmentId": 1,
    "maintenanceId": null,
    "type": "warranty",
    "status": "pending",
    "dueDate": "2025-01-15T00:00:00.000Z",
    "message": "A garantia do equipamento Philips IntelliVue MX40 (SN12345678) expira nesta data.",
    "createdAt": "2023-07-15T00:00:00.000Z",
    "updatedAt": "2023-07-15T00:00:00.000Z"
  }
}
```

### Atualizar Alerta

```
PUT /alerts/:id
```

**Corpo da Requisição:**
```json
{
  "status": "completed",
  "message": "A garantia do equipamento Philips IntelliVue MX40 (SN12345678) expira nesta data."
}
```

**Resposta de Sucesso:**
```json
{
  "message": "Alerta atualizado com sucesso",
  "alert": {
    "id": 2,
    "equipmentId": 1,
    "maintenanceId": null,
    "type": "warranty",
    "status": "completed",
    "dueDate": "2025-01-15T00:00:00.000Z",
    "message": "A garantia do equipamento Philips IntelliVue MX40 (SN12345678) expira nesta data.",
    "createdAt": "2023-07-15T00:00:00.000Z",
    "updatedAt": "2023-07-15T00:00:00.000Z"
  }
}
```

### Remover Alerta

```
DELETE /alerts/:id
```

**Resposta de Sucesso:**
```json
{
  "message": "Alerta removido com sucesso"
}
```

### Listar Alertas de um Equipamento

```
GET /alerts/equipment/:equipmentId
```

**Resposta de Sucesso:**
```json
[
  {
    "id": 1,
    "equipmentId": 1,
    "maintenanceId": 1,
    "type": "maintenance",
    "status": "pending",
    "dueDate": "2024-01-15T00:00:00.000Z",
    "message": "Manutenção preventiva programada para o equipamento Philips IntelliVue MX40 (SN12345678).",
    "createdAt": "2023-07-15T00:00:00.000Z",
    "updatedAt": "2023-07-15T00:00:00.000Z",
    "maintenance": {
      "id": 1,
      "type": "preventive",
      "executionDate": "2023-07-15T00:00:00.000Z"
    }
  },
  {
    "id": 2,
    "equipmentId": 1,
    "maintenanceId": null,
    "type": "warranty",
    "status": "pending",
    "dueDate": "2025-01-15T00:00:00.000Z",
    "message": "A garantia do equipamento Philips IntelliVue MX40 (SN12345678) expira nesta data.",
    "createdAt": "2023-07-15T00:00:00.000Z",
    "updatedAt": "2023-07-15T00:00:00.000Z",
    "maintenance": null
  }
]
```

## Dashboard

### Estatísticas de Equipamentos por Status

```
GET /dashboard/equipment-status
```

**Resposta de Sucesso:**
```json
[
  {
    "status": "active",
    "count": 2
  },
  {
    "status": "maintenance",
    "count": 1
  },
  {
    "status": "inactive",
    "count": 0
  }
]
```

### Manutenções Realizadas por Mês

```
GET /dashboard/maintenance-by-month
```

**Parâmetros de Consulta:**
- `year` - Ano para filtrar (padrão: ano atual)

**Resposta de Sucesso:**
```json
[
  {
    "month": "01",
    "total": 0,
    "preventive": 0,
    "corrective": 0
  },
  {
    "month": "02",
    "total": 0,
    "preventive": 0,
    "corrective": 0
  },
  {
    "month": "07",
    "total": 1,
    "preventive": 1,
    "corrective": 0
  },
  {
    "month": "11",
    "total": 1,
    "preventive": 1,
    "corrective": 0
  },
  {
    "month": "12",
    "total": 1,
    "preventive": 0,
    "corrective": 1
  }
]
```

### Custos de Manutenção

```
GET /dashboard/maintenance-costs
```

**Parâmetros de Consulta:**
- `period` - Período para filtrar (month, quarter, year)

**Resposta de Sucesso:**
```json
[
  {
    "total_cost": 2500,
    "average_cost": 833.33,
    "max_cost": 1200,
    "preventive_cost": 1300,
    "corrective_cost": 1200
  }
]
```

### Frequência de Manutenção por Equipamento

```
GET /dashboard/equipment-maintenance-frequency
```

**Parâmetros de Consulta:**
- `limit` - Limite de resultados (padrão: 10)

**Resposta de Sucesso:**
```json
[
  {
    "id": 1,
    "serialNumber": "SN12345678",
    "brand": "Philips",
    "model": "IntelliVue MX40",
    "unit": "Hospital Santa Maria",
    "maintenance_count": 1,
    "total_cost": 500
  },
  {
    "id": 2,
    "serialNumber": "SN87654321",
    "brand": "GE Healthcare",
    "model": "Logiq P9",
    "unit": "Clínica São Lucas",
    "maintenance_count": 1,
    "total_cost": 1200
  },
  {
    "id": 3,
    "serialNumber": "SN11223344",
    "brand": "Siemens",
    "model": "MAGNETOM Aera",
    "unit": "Hospital Regional",
    "maintenance_count": 1,
    "total_cost": 800
  }
]
```

## Códigos de Status

- `200 OK` - Requisição bem-sucedida
- `201 Created` - Recurso criado com sucesso
- `400 Bad Request` - Erro na requisição
- `401 Unauthorized` - Autenticação necessária
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro interno do servidor
