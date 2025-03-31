// src/utils/validators.js
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPhone = (phone) => /^\d{10}$/.test(phone);

export const isNotEmpty = (value) => value.trim() !== '';
