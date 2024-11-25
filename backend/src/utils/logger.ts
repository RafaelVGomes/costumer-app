import winston from 'winston';

// Configuração do logger
const logger = winston.createLogger({
  level: 'info', // Define o nível padrão
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(), // Logs no console
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Logs de erro
    new winston.transports.File({ filename: 'logs/combined.log' }), // Todos os logs
  ],
});

// Exporta o logger
export default logger;
