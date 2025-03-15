/**
 * src/contexts/CartContext.js
 */

import { useState, createContext } from 'react';

const CartContext = createContext({});

function CartProvider({ children }) {

  const [ basket, setBasket ] = useState([]);
  const [ delivery, setDelivery ] = useState([]);
  const [ subtotal, setSubTotal] = useState(0);

  async function AddToBasket(produto, qtd, itensAcrescentar, valorAcrescentar, obs) {
    const i = basket.findIndex(item => item?.PRODUTO_ID === produto?.PRODUTO_ID);
    if(i !== -1){ 
      let cList = basket;
      cList[i].QTD = cList[i].QTD +qtd;
      cList[i].TOTAL  = cList[i].TOTAL + (qtd * (produto?.VR_UNITARIO + valorAcrescentar));
      setBasket(cList);
      setBasketTotal(cList);
      return; 
    } else {
      let data = {
        ...produto,
        ACRESCIMOS: itensAcrescentar,
        OBS: obs,
        QTD: qtd,
        VR_UNITARIO: parseFloat(produto?.VR_UNITARIO),
        VR_ACRESCIMOS: parseFloat(valorAcrescentar),
        TOTAL: qtd * (produto?.VR_UNITARIO + valorAcrescentar),
      }
      setBasket(dishes => [...dishes, data]);
      setBasketTotal([...basket, data])
      return; 
    }
  };

  async function RemoveFromBasket(produto)  {
    const i = basket.findIndex(item => item?.PRODUTO_ID === produto?.PRODUTO_ID);
    if (basket[i]?.QTD >1) {
      let cList = basket;
      cList[i].QTD = cList[i].QTD -1;
      cList[i].TOTAL = cList[i].TOTAL - (cList[i].VR_UNITARIO + cList[i].VR_ACRESCIMOS);
      setBasket(cList);
      setBasketTotal(cList);
      return;
    } else {
      const newList = basket.filter(item => item?.PRODUTO_ID !== produto?.PRODUTO_ID);
      setBasket(newList);
      setBasketTotal(newList);
      return; 
    }
  }

  function setBasketTotal(cart) {
    let result = cart.reduce((acc, obj) => { return acc + obj?.TOTAL}, 0);
    setSubTotal(result.toFixed(2));
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

export { CartContext, CartProvider }