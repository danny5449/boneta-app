import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function SearchScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Search Screen (To be implemented)</Text>
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