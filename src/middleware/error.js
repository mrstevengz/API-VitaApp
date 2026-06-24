//Middleware para manejar errores

//Clase para errores, extiende el objeto de Error de js y le agrega el status code (ya tiene mensaje)
export class ApiError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

//Funcion para mandar 404 si alguna ruta no es encontrada
export function notFound(req, res, next) {
  //Crea un nuevo ApiError y le manda el codigo y mensaje (usa next() para ir directo al errorHandler principal)
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

//Error handler central del API. Se le pasan 4 argumentos segun docs de Express para identificar que es un manejador de errores
export function errorHandler(err, req, res, next) {
  //Logea el error completo al servidor
  console.error(err);

  //Se responde a los codigos de error de Prisma
  if (err.code === "P2025") {
    return res.status(404).json({ error: "Resource not found" });
  }

  if (err.code === "P2002") {
    return res
      .status(404)
      .json({ error: "An entry already exists with this value" });
  }

  //Errores lanzados desde la app
  if (err instanceof ApiError) {
    return res.status(err.code).json({ error: err.message });
  }

  //Si no cumple con ningun if, se manda error generico sin detalles
  return res.status(500).json({ error: "Internal server error" });
}
