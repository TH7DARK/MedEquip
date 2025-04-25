import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Erro na aplicação:', error);

  // Erros do Prisma
  if (error.code) {
    // Erro de violação de chave única
    if (error.code === 'P2002') {
      return res.status(400).json({
        error: `Já existe um registro com este ${error.meta?.target || 'valor'}`
      });
    }
    
    // Erro de registro não encontrado
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Registro não encontrado'
      });
    }
  }

  // Erros de validação
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: error.message
    });
  }

  // Erros de autenticação
  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Não autorizado'
    });
  }

  // Erro padrão
  return res.status(500).json({
    error: 'Erro interno do servidor'
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ error: 'Rota não encontrada' });
};
