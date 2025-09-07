import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { buildUpiUri } from '../payment/buildUpiUri';
import { UpiPaymentParams } from '../payment/upiTypes';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type PaymentInputScreenProps = StackScreenProps<RootStackParamList, 'PaymentInput'>;

export const PaymentInputScreen = ({ navigation }: PaymentInputScreenProps) => {
  const [paymentData, setPaymentData] = useState<UpiPaymentParams>({
    payeeVpa: '',
    payeeName: '',
    transactionRef: `ORDER${Date.now().toString().substring(6)}`,
    transactionNote: '',
    amount: undefined,
    currency: 'INR',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: keyof UpiPaymentParams, value: string) => {
    if (field === 'amount') {
      // Handle amount conversion to number
      const numValue = value === '' ? undefined : parseFloat(value);
      setPaymentData({ ...paymentData, [field]: numValue });
    } else {
      setPaymentData({ ...paymentData, [field]: value });
    }
    
    // Clear error when typing
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!paymentData.payeeVpa) {
      newErrors.payeeVpa = 'UPI ID is required';
    } else if (!paymentData.payeeVpa.includes('@')) {
      newErrors.payeeVpa = 'UPI ID should be in format name@bank';
    }
    
    if (!paymentData.payeeName) {
      newErrors.payeeName = 'Payee name is required';
    }
    
    if (paymentData.amount !== undefined) {
      if (isNaN(paymentData.amount) || paymentData.amount <= 0) {
        newErrors.amount = 'Amount must be greater than 0';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateQR = () => {
    if (validateForm()) {
      navigation.navigate('QRCode', { paymentData });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Generate UPI Payment QR</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>UPI ID / VPA <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, errors.payeeVpa ? styles.inputError : null]}
            placeholder="name@bank (e.g. merchant@icici)"
            value={paymentData.payeeVpa}
            onChangeText={(value) => updateField('payeeVpa', value)}
          />
          {errors.payeeVpa && <Text style={styles.errorText}>{errors.payeeVpa}</Text>}
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Payee Name <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, errors.payeeName ? styles.inputError : null]}
            placeholder="Merchant or person name"
            value={paymentData.payeeName}
            onChangeText={(value) => updateField('payeeName', value)}
          />
          {errors.payeeName && <Text style={styles.errorText}>{errors.payeeName}</Text>}
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount (₹)</Text>
          <TextInput
            style={[styles.input, errors.amount ? styles.inputError : null]}
            placeholder="Leave empty for user to enter"
            keyboardType="numeric"
            value={paymentData.amount?.toString() || ''}
            onChangeText={(value) => updateField('amount', value)}
          />
          {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
          <Text style={styles.hint}>Optional: Leave blank to let the payer enter amount</Text>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Transaction Reference</Text>
          <TextInput
            style={styles.input}
            placeholder="Order ID or Reference"
            value={paymentData.transactionRef}
            onChangeText={(value) => updateField('transactionRef', value)}
          />
          <Text style={styles.hint}>Auto-generated, can be modified</Text>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Payment Note</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Payment for order #12345"
            value={paymentData.transactionNote}
            onChangeText={(value) => updateField('transactionNote', value)}
          />
          <Text style={styles.hint}>Will be visible to the payer</Text>
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleGenerateQR}>
          <Text style={styles.buttonText}>Generate QR Code</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  required: {
    color: 'red',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  hint: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#4A89F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
