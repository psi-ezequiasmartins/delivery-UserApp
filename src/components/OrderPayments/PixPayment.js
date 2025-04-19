import React, { useState, useEffect } from 'react';
import { 
  View, Text, Image, TouchableOpacity, Alert, 
  ActivityIndicator, StyleSheet 
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import api from '../../config/apiAxios';

export default function OrderPixPayment({ orderId }) {
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState(null);
  const [pedido, setPedido] = useState(null);
  const [expirationTime, setExpirationTime] = useState(null);
 
  useEffect(() => {
    getPedidoAndGeneratePix();
  }, [orderId]);

  useEffect(() => {
    if (expirationTime > 0) {
      const timer = setInterval(() => {
        setExpirationTime(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [expirationTime]);

  useEffect(() => {
    if (pixData) {
      const checkStatus = setInterval(async () => {
        const response = await api.get(`/pix/status/${orderId}`);
        if (response.data.status === 'PAID') {
          clearInterval(checkStatus);
          Alert.alert('Sucesso', 'Pagamento confirmado!');
        }
      }, 5000);
      return () => clearInterval(checkStatus);
    }
  }, [pixData]);  

  async function getPedidoAndGeneratePix() {
    setLoading(true);
    try {
      // Busca dados do pedido
      const orderResponse = await api.get(`/api/pedido/${orderId}`);
      setPedido(orderResponse.data);

      // Gera PIX
      const pixResponse = await api.post('/pix/generate', {
        orderId: orderId,
        value: orderResponse.data.VR_TOTAL,
        description: `Pedido #${orderId}`
      });
      
      if (pixResponse.data.success) {
        setPixData(pixResponse.data);
        setExpirationTime(pixResponse.data.expiresIn);
      } else {
        throw new Error('Falha ao gerar PIX');
      }

    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar o PIX');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function copyToClipboard() {
    try {
      await Clipboard.setStringAsync(pixData.copyPaste);
      Alert.alert('Sucesso', 'Código PIX copiado para área de transferência!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível copiar o código');
    }
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
        <View style={styles.qrCodeContainer}>
          <Image 
            source={{ uri: pixData.qrcode }}
            style={styles.qrCode}
            resizeMode="contain"
          />
          <Text style={styles.expirationInfo}>
            Expira em: {Math.floor(expirationTime / 60)} minutos
          </Text>
        </View>
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
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
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
  qrCodeContainer: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
  },
  qrCode: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  expirationInfo: {
    color: '#666',
    marginTop: 10,
  },
  copyButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
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
    lineHeight: 24,
  }
});