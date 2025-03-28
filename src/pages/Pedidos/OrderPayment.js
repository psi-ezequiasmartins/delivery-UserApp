import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, SafeAreaView, StyleSheet } from "react-native";
import { LogBox } from 'react-native';

import OrderCreditCardPayment from "../../components/OrderPayments/CreditCardPayment"; // Componente atual de cartão
import OrderPixPayment from "../../components/OrderPayments/PixPayment"; // Componente PIX

export default function OrderPayment({ pedido }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null); // 'cartão de crédito ou 'pix'

  // Ignore specific warning
  LogBox.ignoreLogs([
    'Warning: TextElement: Support for defaultProps will be removed from function components',
  ]);
 
  function handleSelectPayment(method) {
    setPaymentMethod(method);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>

        <View style={styles.orderInfoContainer}>
          <Text style={styles.orderNumber}>
            PEDIDO Nº {pedido?.PEDIDO_ID}
          </Text>
          <Text style={styles.deliveryInfo}>
            DELIVERY: {pedido?.DELIVERY_NOME}
          </Text>
          <Text style={styles.orderDate}>
            DATA: {pedido?.DATA}
          </Text>
          
          <View style={styles.valueContainer}>
            <View style={styles.valueRow}>
              <Text style={styles.valueLabel}>Subtotal:</Text>
              <Text style={styles.valueText}>
                R$ {parseFloat(pedido?.VR_SUBTOTAL).toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.valueRow}>
              <Text style={styles.valueLabel}>Taxa de Entrega:</Text>
              <Text style={styles.valueText}>
                R$ {parseFloat(pedido?.TAXA_ENTREGA).toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>
                R$ {parseFloat(pedido?.VR_TOTAL).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.subtitle}>SELECIONE A FORMA DE PAGAMENTO</Text>
        
        <TouchableOpacity 
          style={styles.paymentButton}
          onPress={() => handleSelectPayment('credit')}
        >
          <Text style={styles.paymentButtonText}>CARTÃO DE CRÉDITO</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.paymentButton}
          onPress={() => handleSelectPayment('pix')}
        >
          <Text style={styles.paymentButtonText}>PAGAMENTO VIA PIX</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <View style={styles.modalContent}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>

              {paymentMethod === 'credit' && (
                <OrderCreditCardPayment orderId={pedido?.PEDIDO_ID} />
              )}

              {paymentMethod === 'pix' && (
                <OrderPixPayment orderId={pedido?.PEDIDO_ID} />
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  subtitle: {
    color: '#000',
    textAlign: "center",
    fontSize: 15,
    marginBottom: 30,
  },
  paymentButton: {
    width: "95%",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 5,
    marginVertical: 10,
  },
  paymentButtonText: {
    color: "#FFF",
    fontSize: 20,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '95%',
    maxHeight: '90%',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  orderInfoContainer: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  deliveryInfo: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  valueContainer: {
    marginTop: 10,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  valueLabel: {
    fontSize: 14,
    color: '#666',
  },
  valueText: {
    fontSize: 14,
    color: '#333',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  }
});
