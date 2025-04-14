import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function AccountScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Account Screen (To be implemented)</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
});