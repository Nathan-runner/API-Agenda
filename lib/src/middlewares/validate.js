export function validar(schema) {
  return (req, res, next) => {
    const resultado = schema.safeParse(req.body);
    if (!resultado.success) {
      return res.status(400).json({ errors: resultado.error.flatten().fieldErrors });
    }
    req.body = resultado.data;
    next();
  };
}