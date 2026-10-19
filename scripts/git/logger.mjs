// logger.mjs

const NIVELES = {
  DEBUG: { prioridad: 0, color: '\x1b[36m', icono: '⚙️' }, // Engranaje
  INFO: { prioridad: 1, color: '\x1b[34m', icono: 'ℹ️' }, // Información (Cambiado a Azul)
  SUCCESS: { prioridad: 2, color: '\x1b[1;32m', icono: '✅' }, // Marca de verificación verde
  WARN: { prioridad: 3, color: '\x1b[33m', icono: '⚠️' }, // Advertencia
  ERROR: { prioridad: 4, color: '\x1b[31m', icono: '❌' }, // Cruz roja
};

const RESET = '\x1b[0m';

export class Logger {
  constructor(opciones = {}) {
    this.nivelMinimo = opciones.nivel || 'DEBUG';
  }

  _formatear(nivel, mensaje) {
    const timestamp = new Date().toISOString();
    const config = NIVELES[nivel];
    // Se incluye el icono justo antes del nombre del nivel
    return `${config.color}[${timestamp}] ${config.icono} [${nivel}]${RESET} ${mensaje}`;
  }

  _puedeRegistrar(nivel) {
    return NIVELES[nivel].prioridad >= NIVELES[this.nivelMinimo].prioridad;
  }

  debug(mensaje) {
    if (this._puedeRegistrar('DEBUG')) console.debug(this._formatear('DEBUG', mensaje));
  }

  info(mensaje) {
    if (this._puedeRegistrar('INFO')) console.info(this._formatear('INFO', mensaje));
  }

  success(mensaje) {
    if (this._puedeRegistrar('SUCCESS')) console.log(this._formatear('SUCCESS', mensaje));
  }

  warn(mensaje) {
    if (this._puedeRegistrar('WARN')) console.warn(this._formatear('WARN', mensaje));
  }

  error(mensaje) {
    if (this._puedeRegistrar('ERROR')) console.error(this._formatear('ERROR', mensaje));
  }
}

export default new Logger();
