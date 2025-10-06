// src/utils/timeUtils.js

export function getBrasiliaDate(now = new Date()) {
  // Ajusta a data para o fuso de Brasília (UTC-3).
  // Usa now.getTimezoneOffset() para compensar o timezone local do dispositivo.
  return new Date(now.getTime() - (now.getTimezoneOffset() * 60000) - (3 * 60 * 60 * 1000));
}

export function formatDateKey(date) {
  // Gera uma string estável para chave de ticket: YYYY-MM-DD
  const d = date instanceof Date ? date : new Date(date);
  const pad = (n) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  return `${year}-${month}-${day}`;
}