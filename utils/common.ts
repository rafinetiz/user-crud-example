export function is_string(type: any): boolean {
  return typeof type === 'string';
}

/**
 * get jwt private key from .env file
 * 
 * TODO:
 *  allow to pass file to env variable
 * @returns
 */
export function get_jwt_private_key(): Buffer {
  if (process.env.JWT_PRIVATE_KEY) {
    return Buffer.from(process.env.JWT_PRIVATE_KEY);
  }

  throw new Error('jwt private key not set');
}