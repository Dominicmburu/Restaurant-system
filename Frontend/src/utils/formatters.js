// src/utils/formatters.js
export const formatPrice = (price) => `$${price.toFixed(2)}`;

export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
