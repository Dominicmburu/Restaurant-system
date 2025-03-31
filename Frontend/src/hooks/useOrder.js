import { useContext } from 'react';
import { OrderContext } from '../contexts/OrderContext';

export const useOrder = () => {
  return useContext(OrderContext);
};
