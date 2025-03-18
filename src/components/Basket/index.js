/**
 * src/components/Basket/index.js
 */

import { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import api from '../../config/apiAxios';

export default function BasketItem({ item, AddQtd, RemoveQtd, updateTotal }) { 
  const [ produto, setProduto ] = useState([]);
  const [ qtd, setQtd ] = useState(item?.QTD);
  const [ total, setTotal ] = useState(qtd * (item?.VR_UNITARIO + item?.VR_ACRESCIMOS));

  const id = item.PRODUTO_ID; 

  useEffect(() => {
    if (id) {
      async function loadProdutoInfo() {
        await api.get(`/produto/${id}`).then((snapshot) => {
          setProduto(snapshot.data[0]);
        });
      }
      loadProdutoInfo();
    }
  }, [id]);

  function add() {
    setQtd(qtd + 1);
    setTotal((qtd + 1) * (item?.VR_UNITARIO + item?.VR_ACRESCIMOS));
    AddQtd(); // Atualiza o contexto do carrinho
    updateTotal(); // Atualiza o total
  }
  
  function remove() {
    if (qtd > 1) {
      setQtd(qtd - 1);
      setTotal((qtd - 1) * (item?.VR_UNITARIO + item?.VR_ACRESCIMOS));
      RemoveQtd(); // Atualiza o contexto do carrinho
      updateTotal(); // Atualiza o total
    }
  }
 
  return (
    <View style={styles.container}>
      <View>
        <View>
          <Image style={styles.imagem} source={{ uri: item?.URL_IMAGEM }} />
          <Text style={styles.nome}>{ item?.PRODUTO_NOME }</Text>

          {item?.ACRESCIMOS &&
            <FlatList
              data={item?.ACRESCIMOS}
              showsVerticalScrollIndicator={ false }
              keyExtractor={(item)=>String(item?.EXTRA_ID)}
              renderItem={ ({item}) => (
                <View>
                  <Text>+ {item?.DESCRICAO} R$ { parseFloat(item?.VR_UNITARIO).toFixed(2) }</Text>
                </View>
              )}
              ListEmptyComponent={ ()=><Text style={styles.empty}>Sem acréscimos neste item.</Text> }
            />
          }

          {item?.OBS &&
            <Text style={{fontWeight: "bold"}}>Obs.: { item?.OBS }</Text>
          }

          <Text style={styles.summary}>
            {qtd} x (R$ {parseFloat(item?.VR_UNITARIO || 0).toFixed(2)} + R$ {parseFloat(item?.VR_ACRESCIMOS || 0).toFixed(2)}) = R$ {parseFloat(total || 0).toFixed(2)}
          </Text>

        </View>
        <View style={styles.qtd}>
          <TouchableOpacity onPress={remove}>
            <Ionicons name="remove-circle-outline" size={30} color="red"/>
          </TouchableOpacity>
          <Text style={styles.qtdText}>{qtd}</Text>
          <TouchableOpacity onPress={add}>
            <Ionicons name="add-circle-outline" size={30} color="green" />
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#DFDFDF',
    borderRadius: 2,
    marginBottom: 10,
    padding: 5,
  },
  nome:{
    fontWeight: 'bold',
    fontSize: 18,
  },
  summary:{
    fontSize: 14,
  },
  qtd:{
    width: 100, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 5
  },
  qtdText:{
    color: '#000', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  imagem:{
    width: 75, 
    height: 75,
  },
})
