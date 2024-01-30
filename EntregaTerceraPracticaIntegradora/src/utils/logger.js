import winston from "winston";

const customLevelOptions = {
  levels: {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5,
  },
  colors: {
    debug: "gray",
    http: "green",
    info: "cyan",
    warning: "yellow",
    error: "red",
    fatal: "magenta",
  },
};

const logger = winston.createLogger({
  levels: customLevelOptions.levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      (info) =>
        `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
      format: winston.format.combine(
        winston.format.colorize({
          all: true,
          colors: customLevelOptions.colors,
        }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "logs/errors.log",
      level: "error",
      format: winston.format.combine(
        winston.format.uncolorize(),
        winston.format.json()
      ),
    }),
  ],
});

export default logger;
