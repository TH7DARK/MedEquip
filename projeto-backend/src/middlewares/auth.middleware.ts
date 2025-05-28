import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Constantes
const JWT_SECRET = process.env.JWT_SECRET || 'seu_jwt_secret';

// Interface para o payload do token
interface TokenPayload {
  userId: number;
  email: string;
  role: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Obter o token do cabeçalho de autorização
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }
  
  // O formato esperado é "Bearer TOKEN"
  const parts = authHeader.split(' ');
  
  if (parts.length !== 2) {
    return res.status(401).json({ message: 'Erro no formato do token' });
  }
  
  const [scheme, token] = parts;
  
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: 'Token mal formatado' });
  }
  
  try {
    // Verificar e decodificar o token
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    
    // Adicionar informações do usuário à requisição
    (req as any).user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
    
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};
