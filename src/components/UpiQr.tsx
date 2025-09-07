// Using type declarations with require to avoid module resolution issues
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
const QRCode = require('react-native-qrcode-svg').default;
import { buildUpiUri } from '../payment/buildUpiUri';
import { UpiPaymentParams } from '../payment/upiTypes';

interface Props {
  params: UpiPaymentParams;
  size?: number;
  showMeta?: boolean;
  backgroundColor?: string;
  foregroundColor?: string;
  logoSize?: number;
}

export const UpiQr: React.FC<Props> = ({ 
  params, 
  size = 220, 
  showMeta = true,
  backgroundColor = '#FFFFFF',
  foregroundColor = '#000000',
  logoSize = 40
}) => {
  const { uri, missing, warnings } = buildUpiUri(params);
  
  // Logo for QR code (UPI logo) - can be replaced with an actual image when available
  const logoBase64 = null; 
  
  return (
    <View style={styles.container}>
      <View style={[styles.qrContainer, { backgroundColor }]}>
        <QRCode 
          value={uri} 
          size={size} 
          color={foregroundColor}
          backgroundColor={backgroundColor}
          logo={logoBase64}
          logoSize={logoSize}
          logoBackgroundColor={backgroundColor}
          logoBorderRadius={10}
          quietZone={10}
        />
      </View>
      
      {showMeta && warnings.length > 0 && (
        <View style={styles.metaContainer}>
          {missing.length > 0 && (
            <View style={styles.errorBadge}>
              <Text style={styles.errorText}>Missing: {missing.join(', ')}</Text>
            </View>
          )}
          
          {warnings.map((warning, index) => (
            <View key={index} style={styles.warningBadge}>
              <Text style={styles.warningText}>{warning}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  qrContainer: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  metaContainer: {
    marginTop: 12,
    alignItems: 'center',
    width: '100%',
  },
  errorBadge: {
    backgroundColor: '#FED7D7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FC8181',
  },
  errorText: {
    color: '#C53030',
    fontWeight: '500',
    fontSize: 14,
  },
  warningBadge: {
    backgroundColor: '#FEEBC8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F6AD55',
  },
  warningText: {
    color: '#C05621',
    fontWeight: '500',
    fontSize: 14,
  },
  uriText: {
    maxWidth: 260,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    color: '#666',
  },
});
