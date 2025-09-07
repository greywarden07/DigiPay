import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, ScrollView } from 'react-native';
import { UpiQr } from '../components/UpiQr';
import { UpiPaymentParams } from '../payment/upiTypes';
import { buildUpiUri } from '../payment/buildUpiUri';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type QRCodeScreenProps = StackScreenProps<RootStackParamList, 'QRCode'>;

export const QRCodeScreen = ({ route, navigation }: QRCodeScreenProps) => {
  const { paymentData } = route.params;
  const [qrSize, setQrSize] = useState(250);
  
  const { uri, missing, warnings } = buildUpiUri(paymentData);
  
  const handleShare = async () => {
    try {
      await Share.share({
        message: `UPI Payment Request: ${uri}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  const handleNewPayment = () => {
    navigation.navigate('PaymentInput');
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>UPI Payment QR</Text>
      
      <View style={styles.qrContainer}>
        <UpiQr params={paymentData} size={qrSize} showMeta={false} />
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.detailTitle}>Payment Details</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>To:</Text>
          <Text style={styles.detailValue}>{paymentData.payeeName}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>UPI ID:</Text>
          <Text style={styles.detailValue}>{paymentData.payeeVpa}</Text>
        </View>
        
        {paymentData.amount && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount:</Text>
            <Text style={styles.detailValue}>₹{paymentData.amount.toFixed(2)}</Text>
          </View>
        )}
        
        {paymentData.transactionNote && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Note:</Text>
            <Text style={styles.detailValue}>{paymentData.transactionNote}</Text>
          </View>
        )}
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Reference:</Text>
          <Text style={styles.detailValue}>{paymentData.transactionRef}</Text>
        </View>
      </View>
      
      {(missing.length > 0 || warnings.length > 0) && (
        <View style={styles.warningsContainer}>
          {missing.length > 0 && (
            <Text style={styles.errorText}>Missing: {missing.join(', ')}</Text>
          )}
          {warnings.map((warning, index) => (
            <Text key={index} style={styles.warningText}>{warning}</Text>
          ))}
        </View>
      )}
      
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.buttonText}>Share Payment Link</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.newButton} onPress={handleNewPayment}>
          <Text style={styles.newButtonText}>New Payment</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.instructions}>
        <Text style={styles.instructionTitle}>How to Pay</Text>
        <Text style={styles.instructionText}>1. Open any UPI app (Google Pay, PhonePe, etc.)</Text>
        <Text style={styles.instructionText}>2. Scan this QR code</Text>
        <Text style={styles.instructionText}>3. Verify details and approve payment</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
    marginBottom: 20,
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '500',
    width: 80,
  },
  detailValue: {
    fontSize: 16,
    flex: 1,
  },
  warningsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },
  warningText: {
    color: 'orange',
    marginBottom: 5,
  },
  actionButtons: {
    width: '100%',
    marginBottom: 20,
  },
  shareButton: {
    backgroundColor: '#4A89F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  newButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  newButtonText: {
    color: '#4A89F3',
    fontSize: 18,
    fontWeight: '600',
  },
  instructions: {
    width: '100%',
    marginTop: 10,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#444',
  },
});
