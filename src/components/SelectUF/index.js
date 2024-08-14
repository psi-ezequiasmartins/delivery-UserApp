import React from 'react';
import { Picker as Select } from '@react-native-picker/picker';
import { View, StyleSheet } from 'react-native';

export default function SelectUF({onChange, uf}) {
  return (
    <View style={styles.picker}>
      <Select selectedValue={uf} onValueChange={(valor) => onChange(valor)} uf={uf}>
        <Select.Item label='AC' value='AC' />
        <Select.Item label='AL' value='AL' />
        <Select.Item label='AP' value='AP' />
        <Select.Item label='AM' value='AM' />
        <Select.Item label='BA' value='BA' />
        <Select.Item label='CE' value='CE' />
        <Select.Item label='DF' value='DF' />
        <Select.Item label='ES' value='ES' />
        <Select.Item label='GO' value='GO' />
        <Select.Item label='MA' value='MA' />
        <Select.Item label='MT' value='MT' />
        <Select.Item label='MS' value='MS' />
        <Select.Item label='MG' value='MG' />
        <Select.Item label='PA' value='PA' />
        <Select.Item label='PB' value='PB' />
        <Select.Item label='PR' value='PR' />
        <Select.Item label='PE' value='PE' />
        <Select.Item label='PI' value='PI' />
        <Select.Item label='RJ' value='RJ' />
        <Select.Item label='RN' value='RN' />
        <Select.Item label='RS' value='RS' />
        <Select.Item label='RO' value='RO' />
        <Select.Item label='RR' value='RR' />
        <Select.Item label='SC' value='SC' />
        <Select.Item label='SP' value='SP' />
        <Select.Item label='SE' value='SE' />
        <Select.Item label='TO' value='TO' />
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
