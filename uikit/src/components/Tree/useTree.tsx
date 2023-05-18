import { useContext } from 'react';
import { TreeContext } from './TreeContext';

export const useTree = () => {
  const context = useContext(TreeContext);  
  return context;
};