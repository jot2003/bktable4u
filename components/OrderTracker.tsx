import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions, Image } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { IconSymbol } from './ui/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

// Order status types
enum OrderStatus {
  PLACED = 'PLACED',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  ON_THE_WAY = 'ON_THE_WAY',
  DELIVERED = 'DELIVERED',
}

// Sample order data
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  options?: string[];
}

interface Order {
  id: string;
  restaurantName: string;
  restaurantImage: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  estimatedDeliveryTime: string;
  placedAt: string;
  rider?: {
    name: string;
    phone: string;
    avatar: string;
  };
}

// Props for the OrderTracker component
interface OrderTrackerProps {
  order: Order;
}

const { width } = Dimensions.get('window');

export default function OrderTracker({ order }: OrderTrackerProps) {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const deliveryAnimation = useRef<LottieView>(null);
  
  // Steps for tracking order progress
  const steps = [
    { status: OrderStatus.PLACED, title: 'Đã đặt hàng', icon: 'cart' },
    { status: OrderStatus.CONFIRMED, title: 'Đã xác nhận', icon: 'checkmark.circle' },
    { status: OrderStatus.PREPARING, title: 'Đang chuẩn bị', icon: 'fork.knife' },
    { status: OrderStatus.ON_THE_WAY, title: 'Đang giao hàng', icon: 'bicycle' },
    { status: OrderStatus.DELIVERED, title: 'Đã giao hàng', icon: 'house' },
  ];
  
  // Get the current step index
  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.status === currentStatus);
  };
  
  // Calculate progress percentage
  const getProgressPercentage = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < 0) return 0;
    return (currentIndex / (steps.length - 1)) * 100;
  };
  
  // Format timestamp
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format price to VND
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '₫';
  };
  
  // Calculate total order amount
  const calculateTotal = () => {
    return order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  useEffect(() => {
    // Update status for demo
    if (currentStatus !== OrderStatus.DELIVERED) {
      const timer = setTimeout(() => {
        const currentIndex = getCurrentStepIndex();
        if (currentIndex < steps.length - 1) {
          setCurrentStatus(steps[currentIndex + 1].status);
        }
      }, 10000); // Update status every 10 seconds for demo
      
      return () => clearTimeout(timer);
    }
  }, [currentStatus]);
  
  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: getProgressPercentage(),
      duration: 1000,
      useNativeDriver: false,
    }).start();
    
    // Play delivery animation if status is ON_THE_WAY
    if (currentStatus === OrderStatus.ON_THE_WAY && deliveryAnimation.current) {
      deliveryAnimation.current.play();
    }
  }, [currentStatus]);
  
  // Width interpolation for progress bar
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });
  
  return (
    <ThemedView style={styles.container}>
      {/* Order Header */}
      <ThemedView style={styles.orderHeader}>
        <View style={styles.restaurantInfo}>
          <Image 
            source={{ uri: order.restaurantImage }} 
            style={styles.restaurantImage} 
          />
          <View style={styles.restaurantDetails}>
            <ThemedText style={styles.restaurantName}>{order.restaurantName}</ThemedText>
            <ThemedText style={styles.orderId}>Mã đơn: #{order.id}</ThemedText>
            <ThemedText style={styles.orderTime}>Đặt lúc: {formatTime(order.placedAt)}</ThemedText>
          </View>
        </View>
        
        <View style={styles.statusBadge}>
          <ThemedText style={styles.statusText}>
            {steps.find(step => step.status === currentStatus)?.title || ''}
          </ThemedText>
        </View>
      </ThemedView>
      
      {/* Progress Tracker */}
      <ThemedView style={styles.progressContainer}>
        {/* Progress Bar */}
        <View style={styles.progressTrack}>
          <Animated.View 
            style={[
              styles.progressBar,
              { width: progressWidth }
            ]} 
          />
          
          {/* Step Indicators */}
          {steps.map((step, index) => {
            const isCompleted = getCurrentStepIndex() >= index;
            const isActive = getCurrentStepIndex() === index;
            
            return (
              <View 
                key={step.status}
                style={[
                  styles.stepIndicator,
                  { left: `${(index / (steps.length - 1)) * 100}%` },
                  isActive && styles.activeStepIndicator,
                ]}
              >
                <View 
                  style={[
                    styles.stepCircle,
                    isCompleted && styles.completedStepCircle,
                    isActive && styles.activeStepCircle,
                  ]}
                >
                  {isCompleted && <IconSymbol name="checkmark" size={12} color={isActive ? '#FFF' : '#FFF'} />}
                </View>
                <View style={styles.stepLabelContainer}>
                  <ThemedText 
                    style={[
                      styles.stepLabel,
                      isActive && styles.activeStepLabel
                    ]}
                  >
                    {step.title}
                  </ThemedText>
                  <IconSymbol 
                    name={step.icon} 
                    size={16} 
                    color={isCompleted ? '#FF6B00' : '#CCC'} 
                  />
                </View>
              </View>
            );
          })}
        </View>
      </ThemedView>
      
      {/* Delivery Person Info */}
      {currentStatus === OrderStatus.ON_THE_WAY && order.rider && (
        <ThemedView style={styles.riderContainer}>
          <View style={styles.riderHeader}>
            <ThemedText style={styles.riderTitle}>Người giao hàng của bạn</ThemedText>
          </View>
          
          <View style={styles.riderInfo}>
            <Image source={{ uri: order.rider.avatar }} style={styles.riderAvatar} />
            <View style={styles.riderDetails}>
              <ThemedText style={styles.riderName}>{order.rider.name}</ThemedText>
              <ThemedText style={styles.riderPhone}>{order.rider.phone}</ThemedText>
            </View>
            <TouchableOpacity style={styles.callButton}>
              <IconSymbol name="phone.fill" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.animationContainer}>
            <LottieView
              ref={deliveryAnimation}
              source={require('@/assets/animations/delivery-bike.json')}
              style={styles.deliveryAnimation}
              autoPlay
              loop
            />
          </View>
        </ThemedView>
      )}
      
      {/* Estimated Delivery */}
      <ThemedView style={styles.deliveryTimeContainer}>
        <View style={styles.deliveryTimeContent}>
          <IconSymbol name="clock" size={22} color="#FF6B00" />
          <View style={styles.deliveryTimeInfo}>
            <ThemedText style={styles.deliveryTimeLabel}>Thời gian dự kiến</ThemedText>
            <ThemedText style={styles.deliveryTimeValue}>{order.estimatedDeliveryTime}</ThemedText>
          </View>
        </View>
      </ThemedView>
      
      {/* Order Items */}
      <ThemedView style={styles.orderItemsContainer}>
        <ThemedText style={styles.sectionTitle}>Chi tiết đơn hàng</ThemedText>
        
        <View style={styles.itemList}>
          {order.items.map(item => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.itemQuantity}>
                <ThemedText style={styles.quantityText}>{item.quantity}x</ThemedText>
              </View>
              
              <View style={styles.itemInfo}>
                <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                {item.options && item.options.length > 0 && (
                  <ThemedText style={styles.itemOptions}>{item.options.join(', ')}</ThemedText>
                )}
              </View>
              
              <ThemedText style={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</ThemedText>
            </View>
          ))}
        </View>
        
        {/* Order Total */}
        <View style={styles.orderTotal}>
          <ThemedText style={styles.totalLabel}>Tổng cộng</ThemedText>
          <ThemedText style={styles.totalAmount}>{formatPrice(order.totalAmount)}</ThemedText>
        </View>
      </ThemedView>
      
      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.supportButton}>
          <IconSymbol name="headphones" size={16} color="#555" />
          <ThemedText style={styles.supportButtonText}>Hỗ trợ</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cancelButton}>
          <IconSymbol name="xmark" size={16} color="#FF3B30" />
          <ThemedText style={styles.cancelButtonText}>Hủy đơn</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  restaurantDetails: {
    marginLeft: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  orderTime: {
    fontSize: 12,
    color: '#888',
  },
  statusBadge: {
    backgroundColor: '#FFF0E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#FF6B00',
    fontWeight: '600',
    fontSize: 13,
  },
  progressContainer: {
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    marginBottom: 30,
    position: 'relative',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#FF6B00',
    borderRadius: 2,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  stepIndicator: {
    position: 'absolute',
    top: -8,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10, // Half of width
  },
  stepCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F0F0F0',
  },
  completedStepCircle: {
    backgroundColor: '#FF6B00',
    borderColor: '#FF6B00',
  },
  activeStepCircle: {
    backgroundColor: '#FF6B00',
    borderColor: '#FF6B00',
    transform: [{ scale: 1.2 }],
  },
  activeStepIndicator: {
    zIndex: 1,
  },
  stepLabelContainer: {
    position: 'absolute',
    top: 24,
    width: 80,
    marginLeft: -30,
    alignItems: 'center',
    flexDirection: 'column',
  },
  stepLabel: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 2,
  },
  activeStepLabel: {
    fontWeight: '600',
    color: '#FF6B00',
  },
  riderContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  riderHeader: {
    marginBottom: 12,
  },
  riderTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  riderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riderAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  riderDetails: {
    flex: 1,
    marginLeft: 12,
  },
  riderName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  riderPhone: {
    fontSize: 14,
    color: '#666',
  },
  callButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationContainer: {
    height: 120,
    marginTop: 16,
  },
  deliveryAnimation: {
    width: '100%',
    height: '100%',
  },
  deliveryTimeContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  deliveryTimeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryTimeInfo: {
    marginLeft: 16,
  },
  deliveryTimeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  deliveryTimeValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  orderItemsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  itemList: {
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  itemQuantity: {
    width: 30,
    alignItems: 'center',
  },
  quantityText: {
    fontWeight: '600',
    color: '#FF6B00',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
  },
  itemOptions: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B00',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  supportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginRight: 8,
  },
  supportButtonText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
    fontWeight: '500',
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFE5E5',
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginLeft: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#FF3B30',
    marginLeft: 8,
    fontWeight: '500',
  },
}); 