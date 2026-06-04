// src/utils/validators.ts

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Acepta formatos: +54 11 1234-5678, 011 1234-5678, 1112345678
  const phoneRegex = /^(\+?54)?[\s-]?(\d{2,4})[\s-]?(\d{4})[\s-]?(\d{4})$/;
  return phoneRegex.test(phone);
};

export const validateSKU = (sku: number): boolean => {
  return sku > 0 && Number.isInteger(sku);
};

export const validateStock = (stock: number): boolean => {
  return stock >= 0 && Number.isInteger(stock);
};

export const validatePrice = (price: number): boolean => {
  return price > 0 && !isNaN(price);
};

export const validateRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

export const validateLength = (value: string, min: number, max: number): boolean => {
  const length = value.trim().length;
  return length >= min && length <= max;
};