/**
 * src/contexts/CartContext.js
 */

import React, { createContext, useContext, useState,  } from 'react';
import { NotificationContext } from './NotificationContext';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [ basket, setBasket ] = useState([]);
  const [ delivery, setDelivery ] = useState([]);
  const [ subtotal, setSubTotal] = useState(0);

  const { getPushToken } = useContext(NotificationContext);

  async function AddToBasket(produto, qtd, itensAcrescentar, valorAcrescentar, obs) {
    const pushToken = await getPushToken();
    if (isDevelopment) {
      console.log('pushToken:', pushToken);
    }
    
    const i = basket.findIndex(item => item?.PRODUTO_ID === produto?.PRODUTO_ID);
    let updatedBasket = [...basket];  // Copia o estado original do basket
    if (i !== -1) {
      updatedBasket[i] = {
        ...updatedBasket[i], // Mantém as propriedades do item original
        QTD: updatedBasket[i].QTD + qtd,
        TOTAL: updatedBasket[i].TOTAL + (qtd * (produto?.VR_UNITARIO + valorAcrescentar)),
      };
    } else {
      let data = {
        ...produto,
        "ACRESCIMOS": itensAcrescentar, "OBS": obs, "QTD": qtd, "VR_UNITARIO": produto?.VR_UNITARIO, "VR_ACRESCIMOS": valorAcrescentar,
        "TOTAL": qtd * (produto?.VR_UNITARIO + valorAcrescentar),
      };
      updatedBasket = [...updatedBasket, data]; // Adiciona o novo item
    }
    setBasketTotal(updatedBasket); // Atualiza o subtotal com a lista atualizada
    setBasket(updatedBasket);
  }
  
  async function RemoveFromBasket(produto) {
    const i = basket.findIndex(item => item?.PRODUTO_ID === produto?.PRODUTO_ID);
    let updatedBasket = [...basket];  // Copia o estado original do basket
    if (updatedBasket[i]?.QTD > 1) {
      updatedBasket[i] = {
        ...updatedBasket[i], // Mantém as propriedades do item original
        QTD: updatedBasket[i].QTD - 1,
        TOTAL: updatedBasket[i].TOTAL - (updatedBasket[i].VR_UNITARIO + updatedBasket[i].VR_ACRESCIMOS),
      };
    } else {
      updatedBasket = updatedBasket.filter(item => item?.PRODUTO_ID !== produto?.PRODUTO_ID);
    }
    setBasketTotal(updatedBasket); // Atualiza o subtotal com a lista atualizada 
    setBasket(updatedBasket);
  }
  
  function setBasketTotal(cart) {
    let result = cart.reduce((acc, obj) => { return acc + obj?.TOTAL}, 0);
    setSubTotal(result);
  }

  async function CleanBasket() {
    setBasket([]);
    setSubTotal(0);
  }

  return(
    <CartContext.Provider value={{ 
      basket, delivery, subtotal,
      AddToBasket, RemoveFromBasket, CleanBasket, setDelivery 
    }}>
      { children }
    </CartContext.Provider>
  )
}

