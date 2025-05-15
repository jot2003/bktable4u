import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Animated, Image, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import OrderTracker from '@/components/OrderTracker';

// Order status enum
enum OrderStatus {
  PLACED = 'PLACED',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  ON_THE_WAY = 'ON_THE_WAY',
  DELIVERED = 'DELIVERED',
}

// Sample data for active orders
const activeOrders = [
  {
    id: 'BK123456',
    restaurantName: 'Phở Hà Nội',
    restaurantImage: 'https://images.unsplash.com/photo-1503764654157-72d979d9af2f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1174&q=80',
    status: OrderStatus.ON_THE_WAY,
    items: [
      {
        id: '1',
        name: 'Phở Bò Đặc Biệt',
        price: 65000,
        quantity: 1,
        options: ['Không hành'],
      },
      {
        id: '2',
        name: 'Bún Chả',
        price: 55000,
        quantity: 2,
      },
    ],
    totalAmount: 175000,
    estimatedDeliveryTime: '15-30 phút',
    placedAt: '2023-10-15T12:30:00',
    rider: {
      name: 'Nguyễn Văn A',
      phone: '0912345678',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
  },
  {
    id: 'BK123457',
    restaurantName: 'Bún Chả Hương Liên',
    restaurantImage: 'https://images.unsplash.com/photo-1552611052-33e04de081de?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    status: OrderStatus.PREPARING,
    items: [
      {
        id: '1',
        name: 'Bún Chả Đặc Biệt',
        price: 60000,
        quantity: 1,
      },
      {
        id: '2',
        name: 'Nem Rán',
        price: 35000,
        quantity: 1,
      },
    ],
    totalAmount: 95000,
    estimatedDeliveryTime: '30-45 phút',
    placedAt: '2023-10-15T12:15:00',
  },
];

// Sample data for past orders
const pastOrders = [
  {
    id: 'BK123455',
    restaurantName: 'Cơm Tấm Sài Gòn',
    restaurantImage: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    status: OrderStatus.DELIVERED,
    items: [
      {
        id: '1',
        name: 'Cơm Tấm Sườn Bì Chả',
        price: 55000,
        quantity: 1,
      },
    ],
    totalAmount: 55000,
    estimatedDeliveryTime: 'Đã giao',
    placedAt: '2023-10-14T18:30:00',
  },
  {
    id: 'BK123454',
    restaurantName: 'Bánh Mì Pate',
    restaurantImage: 'https://images.unsplash.com/photo-1600688640154-9619e002df30?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    status: OrderStatus.DELIVERED,
    items: [
      {
        id: '1',
        name: 'Bánh Mì Thịt',
        price: 30000,
        quantity: 2,
      },
    ],
    totalAmount: 60000,
    estimatedDeliveryTime: 'Đã giao',
    placedAt: '2023-10-13T12:00:00',
  },
];

// Order interface
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

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('active');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Header blur effect on scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  // Format timestamp
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Format price
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '₫';
  };
  
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Render order item
  const renderOrderItem = ({ item }: { item: Order }) => {
    const isActive = activeTab === 'active';
    
    return (
      <TouchableOpacity 
        style={styles.orderCard}
        onPress={() => setSelectedOrder(item)}
        activeOpacity={0.7}
      >
        <View style={styles.restaurantInfo}>
          <Image source={{ uri: item.restaurantImage }} style={styles.restaurantImage} />
          <View style={styles.orderDetails}>
            <ThemedText style={styles.restaurantName}>{item.restaurantName}</ThemedText>
            <ThemedText style={styles.orderId}>#{item.id}</ThemedText>
            <ThemedText style={styles.orderDate}>{formatDate(item.placedAt)}</ThemedText>
          </View>
          
          <View style={styles.statusContainer}>
            {isActive ? (
              <>
                <View style={[
                  styles.statusIndicator,
                  item.status === OrderStatus.ON_THE_WAY && styles.statusOnTheWay,
                  item.status === OrderStatus.PREPARING && styles.statusPreparing,
                  item.status === OrderStatus.CONFIRMED && styles.statusConfirmed,
                  item.status === OrderStatus.PLACED && styles.statusPlaced,
                ]} />
                <ThemedText style={styles.statusText}>
                  {item.status === OrderStatus.ON_THE_WAY && 'Đang giao'}
                  {item.status === OrderStatus.PREPARING && 'Đang chuẩn bị'}
                  {item.status === OrderStatus.CONFIRMED && 'Đã xác nhận'}
                  {item.status === OrderStatus.PLACED && 'Đã đặt hàng'}
                </ThemedText>
              </>
            ) : (
              <ThemedText style={styles.deliveredText}>Đã giao</ThemedText>
            )}
          </View>
        </View>
        
        <View style={styles.orderSummary}>
          <ThemedText style={styles.itemSummary}>
            {item.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
          </ThemedText>
          <ThemedText style={styles.totalAmount}>{formatPrice(item.totalAmount)}</ThemedText>
        </View>
        
        <View style={styles.orderActions}>
          {isActive ? (
            <>
              <View style={styles.estimatedDelivery}>
                <IconSymbol name="clock" size={12} color="#666" />
                <ThemedText style={styles.estimatedDeliveryText}>
                  {item.estimatedDeliveryTime}
                </ThemedText>
              </View>
              
              <TouchableOpacity style={styles.trackButton} onPress={() => setSelectedOrder(item)}>
                <ThemedText style={styles.trackButtonText}>Theo dõi</ThemedText>
                <IconSymbol name="arrow.right" size={12} color="#FF6B00" />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.reorderButton}>
              <ThemedText style={styles.reorderButtonText}>Đặt lại</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  
  // Render empty orders
  const renderEmptyOrders = () => (
    <View style={styles.emptyContainer}>
      <IconSymbol name={activeTab === 'active' ? "bag" : "clock.arrow.circlepath"} size={48} color="#DDD" />
      <ThemedText style={styles.emptyText}>
        {activeTab === 'active' 
          ? 'Bạn chưa có đơn hàng nào đang hoạt động' 
          : 'Chưa có lịch sử đơn hàng nào'}
      </ThemedText>
      <TouchableOpacity style={styles.browseButton}>
        <ThemedText style={styles.browseButtonText}>Khám phá nhà hàng</ThemedText>
      </TouchableOpacity>
    </View>
  );
  
  // Loading screen
  if (isLoading) {
    return (
      <ThemedView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <ThemedText style={styles.loadingText}>Đang tải đơn hàng...</ThemedText>
      </ThemedView>
    );
  }
  
  // Show order tracker when an order is selected
  if (selectedOrder) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedOrder(null)}
          >
            <IconSymbol name="chevron.left" size={22} color="#333" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Chi tiết đơn hàng</ThemedText>
          <View style={styles.placeholderButton} />
        </View>
        
        <OrderTracker order={selectedOrder} />
      </ThemedView>
    );
  }
  
  return (
    <ThemedView style={styles.container}>
      {/* Animated Header Background */}
      <Animated.View 
        style={[
          styles.headerBackground,
          { 
            opacity: headerOpacity,
            paddingTop: insets.top,
          }
        ]}
      >
        <BlurView intensity={90} style={StyleSheet.absoluteFill} />
      </Animated.View>
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <ThemedText style={styles.headerTitle}>Đơn hàng của bạn</ThemedText>
      </View>
      
      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[
            styles.tabButton,
            activeTab === 'active' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('active')}
        >
          <ThemedText 
            style={[
              styles.tabButtonText,
              activeTab === 'active' && styles.activeTabButtonText
            ]}
          >
            Đang hoạt động
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tabButton,
            activeTab === 'past' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('past')}
        >
          <ThemedText 
            style={[
              styles.tabButtonText,
              activeTab === 'past' && styles.activeTabButtonText
            ]}
          >
            Lịch sử
          </ThemedText>
        </TouchableOpacity>
      </View>
      
      {/* Order List */}
      <FlatList
        data={activeTab === 'active' ? activeOrders : pastOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        ListEmptyComponent={renderEmptyOrders}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    position: 'relative',
    zIndex: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 30,
  },
  placeholderButton: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    zIndex: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#FF6B00',
  },
  tabButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#888',
  },
  activeTabButtonText: {
    color: '#FF6B00',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  orderCard: {
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
  restaurantInfo: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  restaurantImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  orderDetails: {
    flex: 1,
    marginLeft: 12,
  },
  restaurantName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  orderId: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
    color: '#888',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 4,
  },
  statusPlaced: {
    backgroundColor: '#FFC107',
  },
  statusConfirmed: {
    backgroundColor: '#2196F3',
  },
  statusPreparing: {
    backgroundColor: '#9C27B0',
  },
  statusOnTheWay: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  deliveredText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  orderSummary: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
    paddingVertical: 12,
    marginBottom: 12,
  },
  itemSummary: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF6B00',
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  estimatedDelivery: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  estimatedDeliveryText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0E6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  trackButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FF6B00',
    marginRight: 4,
  },
  reorderButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  reorderButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#555',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 15,
    color: '#888',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  browseButton: {
    backgroundColor: '#FF6B00',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  browseButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
}); 