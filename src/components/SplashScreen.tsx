import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>DigiPay</Text>
      <Text style={styles.subtitle}>UPI QR Code Generator</Text>
      <ActivityIndicator size="large" color="#4361EE" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4361EE',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#718096',
    marginBottom: 40,
  },
  loader: {
    marginTop: 20,
  },
});
