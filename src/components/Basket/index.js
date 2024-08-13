/**
 * src/components/Basket/index.js
 */

import { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import api from '../../config/apiAxios';

export default function BasketItem({ item, AddQtd, RemoveQtd }) {
  const [ produto, setProduto ] = useState([]);
  const [ qtd, setQtd ] = useState(item?.Qtd);
  const [ total, setTotal ] = useState(qtd * (item?.VrUnitario + item?.VrAcrescimos));

  const id = item.ProdutoID; 

  useEffect(() => {
    if (id) {
      async function loadProdutoInfo() {
        await api.get(`/produto/${id}`).then((snapshot) => {
          setProduto(snapshot.data[0]);
          console.log(produto);
        });
      }
      loadProdutoInfo();
    }
  }, [id]);

  function add() {
    setQtd(qtd +1);
    setTotal((qtd +1) * (parseFloat(item?.VrUnitario) + parseFloat(item.VrAcrescimos)));
    AddQtd();
  }

  function remove() {
    if (qtd>1) {
      setQtd(qtd -1);
      setTotal((qtd -1) * (parseFloat(item?.VrUnitario) + parseFloat(item.VrAcrescimos)));
      RemoveQtd();
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <View>
          <Image style={styles.imagem} source={{uri: item?.UrlImagem }} />
          <Text style={styles.nome}>{ item?.Nome }</Text>

          {item?.Acrescimos &&
            <FlatList
              data={ item?.Acrescimos }
              showsVerticalScrollIndicator={ false }
              keyExtractor={(item)=>String(item.ExtraID)}
              renderItem={ ({item}) => (
                <View>
                  <Text>+ {item.Descricao} R$ {parseFloat(item.VrUnitario).toFixed(2)}</Text>
                </View>
              )}
              ListEmptyComponent={ () => <Text style={styles.empty}>Sem acréscimos neste item.</Text> }
            />
          }

          {item?.Obs &&
            <Text style={{fontWeight: "bold"}}>Obs.: {item?.Obs}</Text>
          }

          <Text style={styles.summary}>{qtd} x (R$ {parseFloat(item?.VrUnitario).toFixed(2)} + R$ {parseFloat(item?.VrAcrescimos).toFixed(2)}) = R$ {parseFloat(total).toFixed(2)}</Text>
        </View>
        <View style={styles.qtd}>
          <TouchableOpacity onPress={remove}>
            <Ionicons name="md-remove-circle-outline" size={30} color="red"/>
          </TouchableOpacity>
          <Text style={styles.qtdText}>{qtd}</Text>
          <TouchableOpacity onPress={add}>
            <Ionicons name="ios-add-circle-outline" size={30} color="green" />
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
