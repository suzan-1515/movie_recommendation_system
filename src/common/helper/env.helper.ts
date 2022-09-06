import { existsSync } from 'fs';
import { resolve } from 'path';

// The getEnvPath function is used to resolve the environment variables file path based on the NODE_ENV environment variable.
// If the NODE_ENV is not set, the default value is development.
export function getEnvPath(dest: string): string {
  const env: string | undefined = process.env.NODE_ENV;
  const fallback: string = resolve(`${dest}/.env`);
  const filename: string = env ? `${env}.env` : 'development.env';
  let filePath: string = resolve(`${dest}/${filename}`);

  if (!existsSync(filePath)) {
    filePath = fallback;
  }

  return filePath;
}