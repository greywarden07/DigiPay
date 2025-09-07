import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { UpiQr } from './src/components/UpiQr';
import { UpiPaymentParams } from './src/payment/upiTypes';
import { SplashScreen } from './src/components/SplashScreen';
import * as Font from 'expo-font';

export default function App() {
  const [paymentData, setPaymentData] = useState<UpiPaymentParams>({
    payeeVpa: '',
    payeeName: '',
    transactionRef: `ORDER${Date.now().toString().substring(6)}`,
    transactionNote: '',
    amount: undefined,
    currency: 'INR',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showQR, setShowQR] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // Load fonts
    async function loadFonts() {
      try {
        // Try to load fonts, but continue even if they fail
        try {
          await Font.loadAsync({
            'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
            'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
            'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
          });
        } catch (err) {
          console.log('Font loading error:', err);
        }
        
        // Show splash screen for at least 2 seconds
        setTimeout(() => {
          setFontsLoaded(true);
        }, 2000);
      } catch (error) {
        console.log('Error:', error);
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

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
      setShowQR(true);
    }
  };

  const handleNewPayment = () => {
    setShowQR(false);
  };

  if (!fontsLoaded) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4361EE" barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>DigiPay</Text>
            <Text style={styles.tagline}>UPI Payment Made Simple</Text>
          </View>
          
          {!showQR ? (
            <View style={styles.formContainer}>
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>Create Payment QR</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>UPI ID / VPA <Text style={styles.required}>*</Text></Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, errors.payeeVpa ? styles.inputError : null]}
                      placeholder="name@bank (e.g. merchant@icici)"
                      value={paymentData.payeeVpa}
                      onChangeText={(value) => updateField('payeeVpa', value)}
                      placeholderTextColor="#A0AEC0"
                    />
                  </View>
                  {errors.payeeVpa && <Text style={styles.errorText}>{errors.payeeVpa}</Text>}
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Payee Name <Text style={styles.required}>*</Text></Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, errors.payeeName ? styles.inputError : null]}
                      placeholder="Merchant or person name"
                      value={paymentData.payeeName}
                      onChangeText={(value) => updateField('payeeName', value)}
                      placeholderTextColor="#A0AEC0"
                    />
                  </View>
                  {errors.payeeName && <Text style={styles.errorText}>{errors.payeeName}</Text>}
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Amount (₹)</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, errors.amount ? styles.inputError : null]}
                      placeholder="Leave empty for user to enter"
                      keyboardType="numeric"
                      value={paymentData.amount?.toString() || ''}
                      onChangeText={(value) => updateField('amount', value)}
                      placeholderTextColor="#A0AEC0"
                    />
                  </View>
                  {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
                  <Text style={styles.hint}>Optional: Leave blank to let the payer enter amount</Text>
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Transaction Reference</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Order ID or Reference"
                      value={paymentData.transactionRef}
                      onChangeText={(value) => updateField('transactionRef', value)}
                      placeholderTextColor="#A0AEC0"
                    />
                  </View>
                  <Text style={styles.hint}>Auto-generated, can be modified</Text>
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Payment Note</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Payment for order #12345"
                      value={paymentData.transactionNote}
                      onChangeText={(value) => updateField('transactionNote', value)}
                      placeholderTextColor="#A0AEC0"
                    />
                  </View>
                  <Text style={styles.hint}>Will be visible to the payer</Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.button} 
                  onPress={handleGenerateQR}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>Generate QR Code</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.supportedApps}>
                <Text style={styles.supportedTitle}>Supported UPI Apps</Text>
                <View style={styles.appsIconsRow}>
                  <View style={styles.appIconContainer}>
                    <View style={styles.appIcon}>
                      <Text style={styles.appIconText}>G</Text>
                    </View>
                    <Text style={styles.appName}>GPay</Text>
                  </View>
                  <View style={styles.appIconContainer}>
                    <View style={[styles.appIcon, {backgroundColor: '#5A31F4'}]}>
                      <Text style={styles.appIconText}>P</Text>
                    </View>
                    <Text style={styles.appName}>PhonePe</Text>
                  </View>
                  <View style={styles.appIconContainer}>
                    <View style={[styles.appIcon, {backgroundColor: '#00BAF2'}]}>
                      <Text style={styles.appIconText}>P</Text>
                    </View>
                    <Text style={styles.appName}>Paytm</Text>
                  </View>
                  <View style={styles.appIconContainer}>
                    <View style={[styles.appIcon, {backgroundColor: '#FF9E0D'}]}>
                      <Text style={styles.appIconText}>A</Text>
                    </View>
                    <Text style={styles.appName}>Amazon</Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.qrContainer}>
              <View style={styles.qrCard}>
                <Text style={styles.qrTitle}>Payment QR Code</Text>
                
                <View style={styles.qrWrapper}>
                  <UpiQr 
                    params={paymentData} 
                    size={250} 
                    backgroundColor="#FFFFFF" 
                    foregroundColor="#000000" 
                  />
                </View>
                
                <View style={styles.detailsContainer}>
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
              </View>
              
              <View style={styles.instructionsCard}>
                <Text style={styles.instructionTitle}>How to Pay</Text>
                <View style={styles.instructionStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <Text style={styles.instructionText}>Open any UPI app (Google Pay, PhonePe, etc.)</Text>
                </View>
                <View style={styles.instructionStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <Text style={styles.instructionText}>Scan this QR code with the app</Text>
                </View>
                <View style={styles.instructionStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <Text style={styles.instructionText}>Verify details and approve payment</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.newButton} 
                onPress={handleNewPayment}
                activeOpacity={0.8}
              >
                <Text style={styles.newButtonText}>Create New Payment</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4361EE',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#718096',
  },
  formContainer: {
    marginBottom: 20,
    width: '100%',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '500',
    color: '#4A5568',
  },
  required: {
    color: '#E53E3E',
  },
  inputWrapper: {
    backgroundColor: '#F7FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  input: {
    padding: 14,
    fontSize: 16,
    color: '#2D3748',
  },
  inputError: {
    borderColor: '#FC8181',
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    color: '#E53E3E',
    marginTop: 4,
    fontSize: 14,
  },
  hint: {
    color: '#718096',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 2,
  },
  button: {
    backgroundColor: '#4361EE',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  supportedApps: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  supportedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 16,
    textAlign: 'center',
  },
  appsIconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  appIconContainer: {
    alignItems: 'center',
  },
  appIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  appIconText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 12,
    color: '#4A5568',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },
  qrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  qrTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 20,
  },
  qrWrapper: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 20,
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
    paddingBottom: 8,
  },
  detailLabel: {
    fontWeight: 'bold',
    width: 80,
    color: '#4A5568',
  },
  detailValue: {
    flex: 1,
    color: '#2D3748',
  },
  instructionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: '100%',
    marginBottom: 20,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 16,
    textAlign: 'center',
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4361EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  instructionText: {
    color: '#4A5568',
    fontSize: 15,
  },
  newButton: {
    backgroundColor: '#4361EE',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  newButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
