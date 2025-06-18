import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { container } from '../container';

// Extender la interfaz Request para incluir el id
declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Generar un ID único para la petición
  req.id = uuidv4();
  
  // Registrar la petición entrante
  container.logger.logRequest(req, res, next);

  // Capturar el tiempo de inicio
  const start = Date.now();

  // Registrar la respuesta cuando termine
  res.on('finish', () => {
    const responseTime = Date.now() - start;
    container.logger.logResponse(req, res, responseTime);
  });

  next();
}; 