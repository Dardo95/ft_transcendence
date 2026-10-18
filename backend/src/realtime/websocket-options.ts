const defaultOrigins =
  process.env.NODE_ENV === 'production'
    ? 'https://localhost:8443'
    : 'http://localhost:5173,https://localhost:8443';

const allowedOrigins = (
  process.env.FRONTEND_URL ?? defaultOrigins
)
  .split(',')
  .map((origin) => origin.trim());

export const websocketOptions = {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
};