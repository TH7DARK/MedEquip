'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

// Serviço para busca de informações de equipamentos médicos usando IA
export async function buscarInformacoesEquipamento(marca: string, modelo: string) {
  try {
    // Simulação de uma chamada a uma API de IA
    console.log(`Buscando informações para ${marca} ${modelo}...`);
    
    // Em um ambiente real, aqui seria feita uma chamada a uma API de IA
    // como OpenAI, Google AI, ou um serviço especializado em equipamentos médicos
    
    // Simulando tempo de processamento da IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Dados simulados baseados na marca e modelo
    const marcaLower = marca.toLowerCase();
    const modeloLower = modelo.toLowerCase().replace(/\s+/g, '_');
    
    // Mapeamento de algumas marcas conhecidas para URLs mais realistas
    const marcasConhecidas = {
      'philips': {
        base_url: 'https://www.philips.com.br/healthcare/produtos',
        imagem_base: 'https://images.philips.com/is/image/PhilipsConsumer'
      },
      'ge': {
        base_url: 'https://www.gehealthcare.com.br/produtos',
        imagem_base: 'https://www.gehealthcare.com/-/jssmedia/images'
      },
      'siemens': {
        base_url: 'https://www.siemens-healthineers.com/br/produtos',
        imagem_base: 'https://www.siemens-healthineers.com/images'
      },
      'drager': {
        base_url: 'https://www.draeger.com/pt_br/produtos',
        imagem_base: 'https://www.draeger.com/Products/Content/images'
      }
    };
    
    let resultado = {
      foto_url: '',
      manual_url: '',
      descricao: '',
      especificacoes: []
    };
    
    // Verificar se é uma marca conhecida
    if (marcasConhecidas[marcaLower]) {
      const marca_info = marcasConhecidas[marcaLower];
      resultado.foto_url = `${marca_info.imagem_base}/${modeloLower}_main.jpg`;
      resultado.manual_url = `${marca_info.base_url}/${modeloLower}/manual.pdf`;
      
      // Adicionar algumas especificações simuladas baseadas na marca
      if (marcaLower === 'philips') {
        resultado.descricao = `O ${marca} ${modelo} é um equipamento médico de alta precisão projetado para monitoramento contínuo de pacientes.`;
        resultado.especificacoes = [
          'Tela touchscreen de alta resolução',
          'Bateria de longa duração',
          'Conectividade sem fio',
          'Alarmes configuráveis'
        ];
      } else if (marcaLower === 'ge') {
        resultado.descricao = `O ${marca} ${modelo} oferece tecnologia avançada de imagem para diagnósticos precisos.`;
        resultado.especificacoes = [
          'Resolução de imagem superior',
          'Processamento rápido de dados',
          'Interface intuitiva',
          'Baixa emissão de radiação'
        ];
      } else if (marcaLower === 'siemens') {
        resultado.descricao = `O ${marca} ${modelo} combina tecnologia de ponta com facilidade de uso para diagnósticos confiáveis.`;
        resultado.especificacoes = [
          'Tecnologia de imagem 3D',
          'Sistema de refrigeração avançado',
          'Baixo consumo de energia',
          'Software de análise integrado'
        ];
      } else if (marcaLower === 'drager') {
        resultado.descricao = `O ${marca} ${modelo} é projetado para oferecer suporte respiratório confiável e preciso.`;
        resultado.especificacoes = [
          'Modos ventilatórios avançados',
          'Sistema de monitoramento integrado',
          'Calibração automática',
          'Interface de usuário intuitiva'
        ];
      }
    } else {
      // Para marcas não conhecidas, gerar URLs genéricas
      resultado.foto_url = `https://exemplo.com/imagens/${marcaLower}_${modeloLower}.jpg`;
      resultado.manual_url = `https://exemplo.com/manuais/${marcaLower}_${modeloLower}.pdf`;
      resultado.descricao = `Equipamento médico ${marca} ${modelo}.`;
      resultado.especificacoes = [
        'Especificação técnica 1',
        'Especificação técnica 2',
        'Especificação técnica 3'
      ];
    }
    
    return resultado;
  } catch (error) {
    console.error('Erro ao buscar informações do equipamento:', error);
    throw new Error('Não foi possível obter informações do equipamento');
  }
}

// Componente para exibir informações do equipamento
export function InformacoesAutomaticasComponent({ marca, modelo, onInformacoesEncontradas }) {
  const [buscando, setBuscando] = useState(false);
  const [informacoes, setInformacoes] = useState(null);
  const [erro, setErro] = useState('');
  
  const buscarInformacoes = async () => {
    if (!marca || !modelo) {
      setErro('Marca e modelo são necessários para buscar informações');
      return;
    }
    
    setBuscando(true);
    setErro('');
    
    try {
      const resultado = await buscarInformacoesEquipamento(marca, modelo);
      setInformacoes(resultado);
      
      // Notificar o componente pai sobre as informações encontradas
      if (onInformacoesEncontradas) {
        onInformacoesEncontradas(resultado);
      }
    } catch (error) {
      setErro(error.message || 'Erro ao buscar informações');
    } finally {
      setBuscando(false);
    }
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Informações Automáticas</h2>
        <button
          type="button"
          onClick={buscarInformacoes}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md flex items-center space-x-1 text-sm"
          disabled={buscando || !marca || !modelo}
        >
          {buscando ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-1"></div>
              <span>Buscando...</span>
            </>
          ) : (
            <>
              <Search size={16} />
              <span>Buscar Informações</span>
            </>
          )}
        </button>
      </div>
      
      {erro && (
        <div className="p-3 mb-4 rounded-md bg-red-50 text-red-700">
          {erro}
        </div>
      )}
      
      {buscando && (
        <div className="p-3 mb-4 rounded-md bg-blue-50 text-blue-700">
          Buscando informações para {marca} {modelo}...
        </div>
      )}
      
      {informacoes && !buscando && (
        <div className="space-y-4">
          <div className="p-3 rounded-md bg-green-50 text-green-700">
            Informações encontradas com sucesso!
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium mb-2">Imagem do Equipamento</h3>
              <div className="border rounded-md p-2">
                <div className="bg-gray-100 h-40 flex items-center justify-center">
                  <img 
                    src={informacoes.foto_url} 
                    alt={`${marca} ${modelo}`} 
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Imagem+não+disponível';
                    }}
                  />
                </div>
                <input
                  type="text"
                  value={informacoes.foto_url}
                  readOnly
                  className="w-full mt-2 px-2 py-1 text-xs border rounded"
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-2">Manual do Usuário</h3>
              <div className="border rounded-md p-2">
                <div className="bg-gray-100 h-40 flex items-center justify-center">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">Manual do Usuário</p>
                  </div>
                </div>
                <div className="mt-2 flex flex-col space-y-2">
                  <input
                    type="text"
                    value={informacoes.manual_url}
                    readOnly
                    className="w-full px-2 py-1 text-xs border rounded"
                  />
                  <a 
                    href={informacoes.manual_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm flex items-center justify-center"
                  >
                    Visualizar manual do usuário
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {informacoes.descricao && (
            <div>
              <h3 className="text-md font-medium mb-2">Descrição</h3>
              <p className="text-gray-700">{informacoes.descricao}</p>
            </div>
          )}
          
          {informacoes.especificacoes && informacoes.especificacoes.length > 0 && (
            <div>
              <h3 className="text-md font-medium mb-2">Especificações</h3>
              <ul className="list-disc pl-5 text-gray-700">
                {informacoes.especificacoes.map((spec, index) => (
                  <li key={index}>{spec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
