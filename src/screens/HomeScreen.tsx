import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({ navigation }: HomeScreenProps) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>DigiPay</Text>
        <Text style={styles.subtitle}>UPI QR Code Generator</Text>
      </View>

      <View style={styles.featureCard}>
        <Text style={styles.cardTitle}>Create Payment QR</Text>
        <Text style={styles.cardDescription}>
          Generate a QR code that others can scan to pay you using any UPI app
        </Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('PaymentInput')}
        >
          <Text style={styles.buttonText}>Generate QR</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>What is UPI?</Text>
        <Text style={styles.infoText}>
          Unified Payments Interface (UPI) is India's instant real-time payment system.
          It allows you to link multiple bank accounts into a single mobile application,
          enabling seamless fund transfers and merchant payments.
        </Text>
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Required Information</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>UPI ID (VPA)</Text>
          <Text style={styles.infoValue}>Your virtual payment address (e.g., name@bank)</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Name</Text>
          <Text style={styles.infoValue}>Your name or business name</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Amount</Text>
          <Text style={styles.infoValue}>Optional, can be entered by payer</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Reference</Text>
          <Text style={styles.infoValue}>Unique ID for tracking transactions</Text>
        </View>
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Supported Apps</Text>
        <Text style={styles.infoText}>
          The generated QR code works with all UPI apps including Google Pay, PhonePe,
          Paytm, Amazon Pay, BHIM, and bank UPI apps.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#4A89F3',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  featureCard: {
    margin: 16,
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 16,
    color: '#444',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4A89F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  infoSection: {
    padding: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  infoCard: {
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#444',
  },
});
