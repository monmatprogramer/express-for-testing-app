function requiredEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value.length === 0) {
    throw new Error(`${name} is not set`);
  }
  return value;
}

export const env = {
  port: requiredEnv("PORT"),
  jwt_secret: requiredEnv("JWT_SECRET"),
  jwt_issuer: requiredEnv("JWT_ISSUER"),
  jwt_audience: requiredEnv("JWT_AUDIENCE"),
  node_env: requiredEnv("NODE_ENV"),
};
