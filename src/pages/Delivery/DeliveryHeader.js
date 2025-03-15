/**
 * DeliveryHeader.js
 */

import { View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import { MaterialCommunityIcons, Fontisto } from '@expo/vector-icons';

export default function DeliveryHeader({ delivery, listbyaz }) { 
  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        <Text style={styles.title}>{ delivery?.DELIVERY_NOME }</Text>
        <Image style={styles.imagem} source={{ uri:(delivery?.URL_IMAGEM === "" ? "https://via.placeholder.com/540x300" : delivery.URL_IMAGEM)}} />
        <Text style={styles.info}>{ delivery?.HORARIO }</Text>
        <Text style={styles.info}><Fontisto color="#FF0000" name='map-marker-alt' size={18}/> {delivery?.ENDERECO}, {delivery?.NUMERO} - {delivery?.BAIRRO}</Text>
        <Text style={styles.info}>Valor da Taxa de Entrega: R$ { parseFloat( delivery?.TAXA_ENTREGA ).toFixed(2) }</Text>
        <Text style={[styles.info, {marginBottom: 10}]}>Tempo Estimado: { delivery?.MIN_DELIVERY_TIME } a { delivery?.MAX_DELIVERY_TIME } min.</Text>
        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
          <TouchableOpacity onPress={ listbyaz }>
            <MaterialCommunityIcons name='order-alphabetical-ascending' size={25} color={"#757575"} />
          </TouchableOpacity>
          <Text style={{fontSize: 14, fontWeight: "bold", marginRight: 10}}>CARDÁPIO</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 10
  },
  title: {
    fontSize: 21,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 15,
    color: "#525252",
  },
  info:{
    fontSize: 13,
    color: "#707070",
  },
  imagem: {
    width: "100%",
    aspectRatio: 5 / 3,
    marginBottom: 5,
  },
})
