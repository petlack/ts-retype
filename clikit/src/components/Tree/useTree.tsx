import { useContext } from 'react';
import { TreeContext } from './TreeContext.js';

export const useTree = () => {
  const context = useContext(TreeContext);  
  return context;
};