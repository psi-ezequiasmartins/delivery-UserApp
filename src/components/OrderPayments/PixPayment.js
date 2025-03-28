import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  Clipboard,
  Alert,
  ActivityIndicator,
  StyleSheet 
} from 'react-native';
import api from '../../config/apiAxios';

export default function OrderPixPayment({ orderId }) {
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState(null);
  const [pedido, setPedido] = useState(null);
  
  useEffect(() => {
    getPedidoAndGeneratePix();
  }, [orderId]);

  async function getPedidoAndGeneratePix() {
    setLoading(true);
    try {
      // Busca dados do pedido
      const orderResponse = await api.get(`/pedido/${orderId}`);
      setPedido(orderResponse.data);

      // Gera PIX
      const pixResponse = await api.post('/pix/generate', {
        orderId: orderId,
        value: orderResponse.data.VR_TOTAL,
        description: `Pedido #${orderId}`
      });
      
      setPixData(pixResponse.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar o PIX');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = () => {
    Clipboard.setString(pixData.copyPaste);
    Alert.alert('Sucesso', 'Código PIX copiado para área de transferência!');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Gerando PIX...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pagamento via PIX</Text>
      
      <Text style={styles.orderInfo}>
        Pedido #{orderId} - Total: R$ {pedido?.VR_TOTAL}
      </Text>

      {pixData?.qrcode && (
        <Image 
          source={{ uri: pixData.qrcode }}
          style={styles.qrCode}
          resizeMode="contain"
        />
      )}

      <TouchableOpacity 
        style={styles.copyButton} 
        onPress={copyToClipboard}
      >
        <Text style={styles.copyButtonText}>
          Copiar código PIX
        </Text>
      </TouchableOpacity>

      <Text style={styles.instructions}>
        1. Abra o app do seu banco
        2. Escolha pagar com PIX
        3. Escaneie o QR Code ou cole o código
        4. Confirme o pagamento
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  orderInfo: {
    fontSize: 16,
    marginBottom: 20,
  },
  qrCode: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  copyButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  copyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructions: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  }
});