import { describe, expect, it } from 'vitest';

import { sanitizeEnv, sanitizeMetadata } from '../../src/logging/index.js'; // Ajusta la ruta a tus archivos reales

describe('Pruebas de Sanitización de Seguridad', () => {
  describe('sanitizeEnv', () => {
    it('debería retornar undefined si el entorno es indefinido', () => {
      expect(sanitizeEnv(undefined)).toBeUndefined();
    });

    it('debería enmascarar llaves que coincidan con SECRET_KEY_PATTERN', () => {
      const envFalso = {
        NODE_ENV: 'production',
        DATABASE_PASSWORD: 'mi-password-secreto-123',
        GITHUB_TOKEN: 'ghp_tokenSuperSecreto',
        STRIPE_API_KEY: 'sk_live_5123',
        APP_SECRET: 'mi-app-secret',
        PORT: '3000',
      };

      const resultado = sanitizeEnv(envFalso);

      expect(resultado).toEqual({
        NODE_ENV: 'production',
        DATABASE_PASSWORD: '***',
        GITHUB_TOKEN: '***',
        STRIPE_API_KEY: '***',
        APP_SECRET: '***',
        PORT: '3000',
      });
    });

    it('no debería alterar valores que no coincidan con el patrón', () => {
      const envLimpio = { HOST: 'localhost', LOG_LEVEL: 'debug' };
      expect(sanitizeEnv(envLimpio)).toEqual(envLimpio);
    });
  });

  describe('sanitizeMetadata', () => {
    it('debería retornar undefined si los metadatos son indefinidos', () => {
      expect(sanitizeMetadata(undefined)).toBeUndefined();
    });

    it('debería enmascarar secretos en el primer nivel del objeto', () => {
      const metadata = {
        userId: 'user_99',
        api_key: 'clave-secreta',
        action: 'login_attempt',
      };

      expect(sanitizeMetadata(metadata)).toEqual({
        userId: 'user_99',
        api_key: '***',
        action: 'login_attempt',
      });
    });

    it('debería sanitizar recursivamente el objeto "env" si está presente', () => {
      const metadataCompleta = {
        requestId: 'req-abc-123',
        secretCode: '9999', // Primer nivel (coincide por "secret")
        env: {
          PUBLIC_URL: 'https://mi-sitio.com',
          DB_PASSWORD: 'password123', // Dentro de env
        },
        payload: {
          datosAdicionales: true, // Otro objeto que no es "env"
        },
      };

      const resultado = sanitizeMetadata(metadataCompleta);

      expect(resultado).toEqual({
        requestId: 'req-abc-123',
        secretCode: '***',
        env: {
          PUBLIC_URL: 'https://mi-sitio.com',
          DB_PASSWORD: '***',
        },
        payload: {
          datosAdicionales: true,
        },
      });
    });

    it('debería ignorar la propiedad "env" si es null o no es un objeto', () => {
      const metadataConEnvInvalido = {
        trackingId: 'xyz',
        env: null,
      };

      expect(sanitizeMetadata(metadataConEnvInvalido)).toEqual({
        trackingId: 'xyz',
        env: null,
      });
    });
  });
});
