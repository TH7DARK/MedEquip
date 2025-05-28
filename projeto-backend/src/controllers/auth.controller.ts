import { Request, Response } from 'express';
import { prisma } from '../server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Constantes
const JWT_SECRET = process.env.JWT_SECRET || 'seu_jwt_secret';
const JWT_EXPIRES_IN = '24h';

// Interface para o payload do token
interface TokenPayload {
  userId: number;
  email: string;
  role: string;
}

// Registro de usuário
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Criar novo usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      }
    });

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role } as TokenPayload,
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
};

// Login de usuário
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role } as TokenPayload,
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
};

// Obter informações do usuário atual
export const getMe = async (req: Request, res: Response) => {
  try {
    // O middleware de autenticação já deve ter verificado o token
    // e adicionado o userId ao objeto de requisição
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Não autorizado' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao obter informações do usuário:', error);
    res.status(500).json({ message: 'Erro ao obter informações do usuário' });
  }
};

// Logout (apenas invalidação do token no cliente)
export const logout = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Logout realizado com sucesso' });
};
