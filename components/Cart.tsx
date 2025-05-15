import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions, Animated, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { ThemedText } from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';

// Sample cart data for demo
const defaultCartItems = [
  {
    id: '1',
    name: 'Phở Bò Đặc Biệt',
    price: 65000,
    quantity: 1,
    imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    options: ['Không hành'],
  },
  {
    id: '2',
    name: 'Bún Chả',
    price: 55000,
    quantity: 2,
    imageUrl: 'https://images.unsplash.com/photo-1627308595171-d1b5d95d0e7f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
    options: ['Thêm rau'],
  },
];

// Cart item type
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  options?: string[];
}

interface CartProps {
  isVisible: boolean;
  onClose: () => void;
  onCheckout: (totalAmount: number) => void;
}

const { width, height } = Dimensions.get('window');
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function Cart({ isVisible, onClose, onCheckout }: CartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>(defaultCartItems);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  
  // Animation
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Bottom Sheet Modal
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['70%'], []);

  // Calculate total
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = 15000; // 15,000 VND delivery fee
  const total = subtotal + deliveryFee;
  
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '₫';
  };
  
  useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isVisible]);
  
  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return; // Don't allow less than 1
    
    setIsUpdating(true);
    
    setTimeout(() => {
      setCartItems(current =>
        current.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
      setIsUpdating(false);
    }, 300);
  };
  
  const handleRemoveItem = (id: string) => {
    setIsUpdating(true);
    
    // Animation delay to simulate a network request
    setTimeout(() => {
      setCartItems(current => current.filter(item => item.id !== id));
      setIsUpdating(false);
    }, 300);
  };
  
  const handleCheckout = () => {
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      onClose();
      onCheckout(total);
    }, 1000);
  };
  
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );
  
  const renderItem = (item: CartItem) => (
    <View key={item.id} style={styles.cartItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      
      <View style={styles.itemDetails}>
        <ThemedText numberOfLines={1} style={styles.itemName}>{item.name}</ThemedText>
        {item.options && item.options.length > 0 && (
          <ThemedText style={styles.itemOptions}>
            {item.options.join(', ')}
          </ThemedText>
        )}
        <ThemedText style={styles.itemPrice}>{formatPrice(item.price)}</ThemedText>
      </View>
      
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
        >
          <IconSymbol name="minus" size={12} color="#666" />
        </TouchableOpacity>
        
        <ThemedText style={styles.quantityText}>{item.quantity}</ThemedText>
        
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
        >
          <IconSymbol name="plus" size={12} color="#666" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleRemoveItem(item.id)}
      >
        <IconSymbol name="trash" size={16} color="#FF6B00" />
      </TouchableOpacity>
    </View>
  );

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={styles.indicator}
        backgroundStyle={styles.modalBackground}
        onDismiss={onClose}
      >
        <View style={styles.container}>
          {/* Cart Header */}
          <View style={styles.header}>
            <ThemedText style={styles.headerTitle}>Giỏ hàng của bạn</ThemedText>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <IconSymbol name="xmark" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          
          {/* Loading Overlay */}
          {(isLoading || isUpdating) && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color="#FF6B00" size="large" />
            </View>
          )}
          
          {/* Cart Items */}
          <View style={styles.itemsContainer}>
            {cartItems.length === 0 ? (
              <View style={styles.emptyCartContainer}>
                <IconSymbol name="cart" size={48} color="#CCC" />
                <ThemedText style={styles.emptyCartText}>Giỏ hàng trống</ThemedText>
                <TouchableOpacity 
                  style={styles.browseButton}
                  onPress={onClose}
                >
                  <ThemedText style={styles.browseButtonText}>Tiếp tục mua sắm</ThemedText>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {cartItems.map(renderItem)}
              </>
            )}
          </View>
          
          {/* Pricing Summary */}
          {cartItems.length > 0 && (
            <View style={styles.pricingSummary}>
              <View style={styles.pricingRow}>
                <ThemedText style={styles.pricingLabel}>Tạm tính</ThemedText>
                <ThemedText style={styles.pricingValue}>{formatPrice(subtotal)}</ThemedText>
              </View>
              
              <View style={styles.pricingRow}>
                <ThemedText style={styles.pricingLabel}>Phí vận chuyển</ThemedText>
                <ThemedText style={styles.pricingValue}>{formatPrice(deliveryFee)}</ThemedText>
              </View>
              
              <View style={[styles.pricingRow, styles.totalRow]}>
                <ThemedText style={styles.totalLabel}>Tổng cộng</ThemedText>
                <ThemedText style={styles.totalValue}>{formatPrice(total)}</ThemedText>
              </View>
            </View>
          )}
          
          {/* Checkout Button */}
          {cartItems.length > 0 && (
            <TouchableOpacity 
              style={styles.checkoutButton}
              activeOpacity={0.85}
              onPress={handleCheckout}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <>
                  <ThemedText style={styles.checkoutButtonText}>Thanh toán</ThemedText>
                  <IconSymbol name="arrow.right" size={16} color="#FFF" />
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  indicator: {
    width: 40,
    backgroundColor: '#DDD',
  },
  modalBackground: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderRadius: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemsContainer: {
    flex: 1,
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginBottom: 12,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
  },
  itemOptions: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B00',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    width: 24,
    textAlign: 'center',
    fontWeight: '600',
  },
  deleteButton: {
    padding: 6,
    alignSelf: 'center',
  },
  pricingSummary: {
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pricingLabel: {
    color: '#666',
  },
  pricingValue: {
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
  },
  totalLabel: {
    fontWeight: '600',
    fontSize: 16,
  },
  totalValue: {
    fontWeight: '700',
    fontSize: 16,
    color: '#FF6B00',
  },
  checkoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FF6B00',
    borderRadius: 16,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#888',
    marginTop: 16,
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  browseButtonText: {
    fontWeight: '500',
    color: '#333',
  },
}); 