import React from 'react';
import { Picker as Select } from '@react-native-picker/picker';
import { View, StyleSheet } from 'react-native';

export default function SelectUF({onChange, uf}) {
  return (
    <View style={styles.picker}>
      <Select selectedValue={uf} onValueChange={(valor) => onChange(valor)} uf={uf}>
        <Select.Item label='Acre' value='AC' />
        <Select.Item label='Alagoas' value='AL' />
        <Select.Item label='Amapá' value='AP' />
        <Select.Item label='Amazonas' value='AM' />
        <Select.Item label='Bahia' value='BA' />
        <Select.Item label='Ceará' value='CE' />
        <Select.Item label='Distrito Federal' value='DF' />
        <Select.Item label='Espírito Santo' value='ES' />
        <Select.Item label='Goiás' value='GO' />
        <Select.Item label='Maranhão' value='MA' />
        <Select.Item label='Mato Grosso' value='MT' />
        <Select.Item label='Mato Grosso do Sul' value='MS' />
        <Select.Item label='Minas Gerais' value='MG' />
        <Select.Item label='Pará' value='PA' />
        <Select.Item label='Paraíba' value='PB' />
        <Select.Item label='Paraná' value='PR' />
        <Select.Item label='Pernambuco' value='PE' />
        <Select.Item label='Piauí' value='PI' />
        <Select.Item label='Rio de Janeiro' value='RJ' />
        <Select.Item label='Rio Grande do Norte' value='RN' />
        <Select.Item label='Rio Grande do Sul' value='RS' />
        <Select.Item label='Rondônia' value='RO' />
        <Select.Item label='Roraima' value='RR' />
        <Select.Item label='Santa Catarina' value='SC' />
        <Select.Item label='São Paulo' value='SP' />
        <Select.Item label='Sergipe' value='SE' />
        <Select.Item label='Tocantins' value='TO' />
      </Select>
    </View>
  )
}

const styles = StyleSheet.create({
  picker: {
    width: "95%",
    height: 45,
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderRadius: 5,
    color: "#FFF",
  },
})
