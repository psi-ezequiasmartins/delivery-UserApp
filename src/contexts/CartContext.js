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
    const i = basket.findIndex(item => item?.ProdutoID === produto?.ProdutoID);
    if(i !== -1){ 
      let cList = basket;
      cList[i].Qtd = cList[i].Qtd +qtd;
      cList[i].Total  = cList[i].Total + (qtd * (produto?.VrUnitario + valorAcrescentar));
      setBasket(cList);
      setBasketTotal(cList);
      return; 
    } else {
      let data = {
        ...produto,
        Acrescimos: itensAcrescentar,
        Obs: obs,
        Qtd: qtd,
        VrUnitario: parseFloat(produto?.VrUnitario),
        VrAcrescimos: parseFloat(valorAcrescentar),
        Total: qtd * (produto?.VrUnitario + valorAcrescentar),
      }
      setBasket(dishes => [...dishes, data]);
      setBasketTotal([...basket, data])
      return; 
    }
  };

  async function RemoveFromBasket(produto)  {
    const i = basket.findIndex(item => item?.ProdutoID === produto?.ProdutoID);
    if (basket[i]?.Qtd >1) {
      let cList = basket;
      cList[i].Qtd = cList[i].Qtd -1;
      cList[i].Total = cList[i].Total - (cList[i].VrUnitario + cList[i].VrAcrescimos);
      setBasket(cList);
      setBasketTotal(cList);
      return;
    } else {
      const newList = basket.filter(item => item?.ProdutoID !== produto?.ProdutoID);
      setBasket(newList);
      setBasketTotal(newList);
      return; 
    }
  }

  function setBasketTotal(cart) {
    let result = cart.reduce((acc, obj) => { return acc + obj?.Total}, 0);
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