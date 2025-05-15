import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Dimensions, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { IconSymbol } from './ui/IconSymbol';
import LottieView from 'lottie-react-native';

interface CheckoutProps {
  visible: boolean;
  totalAmount: number;
  onClose: () => void;
  onSuccess: () => void;
}

const paymentMethods = [
  { id: 'cash', name: 'Tiền mặt', icon: 'banknote' },
  { id: 'card', name: 'Thẻ tín dụng', icon: 'creditcard' },
  { id: 'banking', name: 'Internet Banking', icon: 'building.columns' },
  { id: 'zalopay', name: 'ZaloPay', icon: 'wallet.pass' },
];

const addressOptions = [
  { id: '1', name: 'Ký túc xá BKHN', address: 'Ngõ 22 Tạ Quang Bửu, Hai Bà Trưng, Hà Nội', isDefault: true },
  { id: '2', name: 'Văn phòng', address: 'Tòa nhà B1, ĐHBKHN, Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội', isDefault: false },
];

const { width, height } = Dimensions.get('window');
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function Checkout({ visible, totalAmount, onClose, onSuccess }: CheckoutProps) {
  const [currentStep, setCurrentStep] = useState(1); // 1: Address, 2: Payment, 3: Success
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(addressOptions[0].id);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id);
  const [note, setNote] = useState('');
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(width)).current;
  const successAnim = useRef(new Animated.Value(0)).current;
  const animation = useRef<LottieView>(null);
  
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: width,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
      
      // Reset state when closing
      setTimeout(() => {
        setCurrentStep(1);
        setIsProcessing(false);
      }, 300);
    }
  }, [visible]);
  
  // Format price to VND
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '₫';
  };
  
  // Handle back button press
  const handleBack = () => {
    if (currentStep === 1) {
      onClose();
    } else {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Handle next step
  const handleNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Process payment
      setIsProcessing(true);
      
      // Simulate payment processing
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentStep(3);
        
        // Play success animation
        Animated.timing(successAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
        
        if (animation.current) {
          animation.current.play();
        }
        
        // Auto close after success
        setTimeout(() => {
          onSuccess();
        }, 3000);
      }, 2000);
    }
  };
  
  // Get selected address
  const getSelectedAddress = () => {
    return addressOptions.find(addr => addr.id === selectedAddress);
  };
  
  // Get selected payment method
  const getSelectedPayment = () => {
    return paymentMethods.find(method => method.id === selectedPayment);
  };
  
  // Render Address Step
  const renderAddressStep = () => (
    <ScrollView style={styles.stepContainer}>
      <ThemedText style={styles.sectionTitle}>Địa chỉ giao hàng</ThemedText>
      
      {addressOptions.map(address => (
        <TouchableOpacity
          key={address.id}
          style={[
            styles.addressCard,
            selectedAddress === address.id && styles.selectedAddressCard
          ]}
          onPress={() => setSelectedAddress(address.id)}
        >
          <View style={styles.addressCardHeader}>
            <ThemedText style={styles.addressName}>{address.name}</ThemedText>
            {address.isDefault && (
              <View style={styles.defaultBadge}>
                <ThemedText style={styles.defaultBadgeText}>Mặc định</ThemedText>
              </View>
            )}
          </View>
          
          <ThemedText style={styles.addressText}>{address.address}</ThemedText>
          
          <View style={styles.addressActions}>
            {selectedAddress === address.id && (
              <IconSymbol name="checkmark.circle.fill" size={20} color="#FF6B00" />
            )}
          </View>
        </TouchableOpacity>
      ))}
      
      <TouchableOpacity style={styles.newAddressButton}>
        <IconSymbol name="plus" size={16} color="#FF6B00" />
        <ThemedText style={styles.newAddressText}>Thêm địa chỉ mới</ThemedText>
      </TouchableOpacity>
      
      <View style={styles.notesContainer}>
        <ThemedText style={styles.sectionTitle}>Ghi chú</ThemedText>
        <TextInput
          style={styles.noteInput}
          placeholder="Thêm ghi chú cho nhà hàng..."
          placeholderTextColor="#999"
          multiline
          value={note}
          onChangeText={setNote}
        />
      </View>
      
      <ThemedText style={styles.sectionTitle}>Thông tin đơn hàng</ThemedText>
      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}>
          <ThemedText style={styles.summaryLabel}>Tổng cộng</ThemedText>
          <ThemedText style={styles.summaryValue}>{formatPrice(totalAmount)}</ThemedText>
        </View>
      </View>
    </ScrollView>
  );
  
  // Render Payment Step
  const renderPaymentStep = () => (
    <ScrollView style={styles.stepContainer}>
      <ThemedText style={styles.sectionTitle}>Phương thức thanh toán</ThemedText>
      
      {paymentMethods.map(method => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.paymentCard,
            selectedPayment === method.id && styles.selectedPaymentCard
          ]}
          onPress={() => setSelectedPayment(method.id)}
        >
          <View style={styles.paymentCardContent}>
            <View style={styles.paymentIconContainer}>
              <IconSymbol name={method.icon} size={20} color="#FF6B00" />
            </View>
            <ThemedText style={styles.paymentName}>{method.name}</ThemedText>
          </View>
          
          {selectedPayment === method.id && (
            <IconSymbol name="checkmark.circle.fill" size={20} color="#FF6B00" />
          )}
        </TouchableOpacity>
      ))}
      
      <ThemedText style={[styles.sectionTitle, { marginTop: 24 }]}>Xác nhận đơn hàng</ThemedText>
      <View style={styles.confirmationBox}>
        <View style={styles.confirmationRow}>
          <ThemedText style={styles.confirmationLabel}>Địa chỉ giao hàng</ThemedText>
          <ThemedText style={styles.confirmationValue} numberOfLines={2}>
            {getSelectedAddress()?.address}
          </ThemedText>
        </View>
        
        <View style={styles.confirmationRow}>
          <ThemedText style={styles.confirmationLabel}>Ghi chú</ThemedText>
          <ThemedText style={styles.confirmationValue} numberOfLines={2}>
            {note || 'Không có ghi chú'}
          </ThemedText>
        </View>
        
        <View style={styles.confirmationRow}>
          <ThemedText style={styles.confirmationLabel}>Tổng thanh toán</ThemedText>
          <ThemedText style={[styles.confirmationValue, styles.totalAmount]}>
            {formatPrice(totalAmount)}
          </ThemedText>
        </View>
      </View>
    </ScrollView>
  );
  
  // Render Success Step
  const renderSuccessStep = () => (
    <Animated.View 
      style={[
        styles.successContainer,
        { opacity: successAnim }
      ]}
    >
      <View style={styles.animationContainer}>
        <LottieView
          ref={animation}
          source={require('@/assets/animations/order-success.json')}
          style={styles.lottieAnimation}
          autoPlay
          loop={false}
        />
      </View>
      
      <ThemedText style={styles.successTitle}>Đặt hàng thành công!</ThemedText>
      <ThemedText style={styles.successMessage}>
        Đơn hàng của bạn đang được xử lý. Cảm ơn bạn đã đặt món!
      </ThemedText>
      
      <View style={styles.orderInfoBox}>
        <View style={styles.orderInfoRow}>
          <ThemedText style={styles.orderInfoLabel}>Mã đơn hàng</ThemedText>
          <ThemedText style={styles.orderInfoValue}>#BK{Math.floor(100000 + Math.random() * 900000)}</ThemedText>
        </View>
        
        <View style={styles.orderInfoRow}>
          <ThemedText style={styles.orderInfoLabel}>Thời gian dự kiến</ThemedText>
          <ThemedText style={styles.orderInfoValue}>30 phút</ThemedText>
        </View>
      </View>
    </Animated.View>
  );
  
  if (!visible) {
    return null;
  }
  
  return (
    <View style={styles.overlay}>
      <Animated.View 
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }]
          }
        ]}
      >
        <View style={styles.header}>
          {currentStep < 3 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
            >
              <IconSymbol name="chevron.left" size={20} color="#555" />
            </TouchableOpacity>
          )}
          
          <ThemedText style={styles.headerTitle}>
            {currentStep === 1 ? 'Thanh toán' : 
             currentStep === 2 ? 'Phương thức thanh toán' : 
             'Xác nhận đơn hàng'}
          </ThemedText>
          
          {currentStep < 3 && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <IconSymbol name="xmark" size={20} color="#555" />
            </TouchableOpacity>
          )}
        </View>
        
        {currentStep === 1 && renderAddressStep()}
        {currentStep === 2 && renderPaymentStep()}
        {currentStep === 3 && renderSuccessStep()}
        
        {currentStep < 3 && (
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.nextButton}
              onPress={handleNextStep}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <ThemedText style={styles.nextButtonText}>
                    {currentStep === 1 ? 'Tiếp tục' : 'Xác nhận thanh toán'}
                  </ThemedText>
                  <IconSymbol name="arrow.right" size={16} color="#FFF" />
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: width * 0.9,
    maxWidth: 400,
    maxHeight: height * 0.9,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepContainer: {
    padding: 16,
    maxHeight: height * 0.6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  addressCard: {
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#FFF',
  },
  selectedAddressCard: {
    borderColor: '#FF6B00',
    backgroundColor: '#FFF9F5',
  },
  addressCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  addressName: {
    fontSize: 15,
    fontWeight: '600',
  },
  defaultBadge: {
    backgroundColor: '#E6F7ED',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  defaultBadgeText: {
    color: '#2E7D32',
    fontSize: 11,
    fontWeight: '500',
  },
  addressText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  newAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    justifyContent: 'center',
  },
  newAddressText: {
    color: '#FF6B00',
    marginLeft: 8,
    fontWeight: '500',
  },
  notesContainer: {
    marginVertical: 20,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    height: 80,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#333',
  },
  summaryBox: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B00',
  },
  paymentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#FFF',
  },
  selectedPaymentCard: {
    borderColor: '#FF6B00',
    backgroundColor: '#FFF9F5',
  },
  paymentCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentName: {
    fontSize: 15,
    fontWeight: '500',
  },
  confirmationBox: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
  },
  confirmationRow: {
    marginBottom: 12,
  },
  confirmationLabel: {
    fontSize: 13,
    color: '#777',
    marginBottom: 4,
  },
  confirmationValue: {
    fontSize: 15,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B00',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  nextButtonText: {
    color: '#FFF',
    fontWeight: '600',
    marginRight: 8,
  },
  successContainer: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationContainer: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#FF6B00',
  },
  successMessage: {
    fontSize: 15,
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  orderInfoBox: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  orderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderInfoLabel: {
    fontSize: 14,
    color: '#666',
  },
  orderInfoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 