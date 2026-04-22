import jwt from 'jsonwebtoken';

export function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

export function apenasFunc(req, res, next) {
  if (req.usuario?.role !== 'FUNCIONARIO') {
    return res.status(403).json({ error: 'Acesso restrito a funcionários' });
  }
  next();
}