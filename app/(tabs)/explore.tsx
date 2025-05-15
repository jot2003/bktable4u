import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView, Image, FlatList, Animated, Dimensions, Platform, StatusBar, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import OrderForm from '@/components/OrderForm';
import Cart from '@/components/Cart';
import Checkout from '@/components/Checkout';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 60;

// Sample restaurant data
const restaurantDetail = {
  id: '1',
  name: 'Phở Hà Nội',
  rating: 4.8,
  reviewCount: 128,
  address: '123 Đại Cồ Việt, Hai Bà Trưng, Hà Nội',
  distance: '0.2',
  openingHours: '7 AM - 9 PM',
  price: '30,000 - 65,000₫',
  hygieneRating: 4.5,
  seatingAvailability: 'Tốt',
  imageUrl: 'https://images.unsplash.com/photo-1503764654157-72d979d9af2f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1174&q=80',
  images: [
    'https://images.unsplash.com/photo-1503764654157-72d979d9af2f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1174&q=80',
    'https://images.unsplash.com/photo-1555126634-323283e090fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80',
    'https://images.unsplash.com/photo-1576749872435-ff88a71c1ae2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80',
  ],
  isBusy: true,
  about: 'Được thành lập vào năm 2010, Phở Hà Nội phục vụ ẩm thực Việt Nam truyền thống cho khách hàng tại Hà Nội. Chuyên môn của chúng tôi là phở bò truyền thống được nấu với nước dùng đậm đà được ninh trong hơn 8 giờ với các loại thảo mộc và gia vị.',
  featuredDishes: [
    {
      id: '1',
      name: 'Phở Bò Đặc Biệt',
      price: '65,000₫',
      description: 'Phở bò đặc biệt với các loại thịt bò cao cấp và nước dùng đậm đà',
      imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      isPopular: true,
    },
    {
      id: '2',
      name: 'Bún Chả',
      price: '55,000₫',
      description: 'Thịt lợn nướng ăn kèm với bún và nước chấm',
      imageUrl: 'https://images.unsplash.com/photo-1627308595171-d1b5d95d0e7f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
      isPopular: true,
    },
    {
      id: '3',
      name: 'Bánh Mì Thịt',
      price: '35,000₫',
      description: 'Bánh mì kẹp thịt và rau củ tươi',
      imageUrl: 'https://images.unsplash.com/photo-1600688640154-9619e002df30?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      isPopular: false,
    },
    {
      id: '4',
      name: 'Gỏi Cuốn',
      price: '45,000₫',
      description: 'Cuốn tươi với tôm, rau thơm và bún',
      imageUrl: 'https://images.unsplash.com/photo-1625835452282-52d128897dec?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
      isPopular: false,
    },
  ],
};

// Restaurant dish type
interface Dish {
  id: string;
  name: string;
  price: string;
  description: string;
  imageUrl: string;
  isPopular?: boolean;
}

export default function RestaurantDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutAmount, setCheckoutAmount] = useState(0);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  // Interpolation for header animations
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [HEADER_HEIGHT - HEADER_MIN_HEIGHT - 40, HEADER_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolateLeft: 'extend',
    extrapolateRight: 'clamp',
  });
  
  // Header background opacity for the blurred header
  const headerBgOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Effect to auto-rotate header images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === restaurantDetail.images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  // Add dish to selection with animation
  const addDish = (dishId: string) => {
    // Play animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
    
    // Update selected dishes
    setSelectedDishes(prev => {
      if (prev.includes(dishId)) {
        return prev.filter(id => id !== dishId);
      } else {
        return [...prev, dishId];
      }
    });
  };
  
  // Handle back navigation
  const handleBack = () => {
    router.back();
  };
  
  // Handle share action
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Hãy khám phá ${restaurantDetail.name} trên ứng dụng BKHN Restaurant! Phở ngon tuyệt vời và dịch vụ chuyên nghiệp.`,
        url: 'https://bkhn-restaurant.app',
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Handle order form submission
  const handleOrderSubmit = () => {
    setShowOrderModal(false);
    setShowCart(true);
  };
  
  // Handle cart checkout
  const handleCartCheckout = (amount: number) => {
    setCheckoutAmount(amount);
    setShowCheckout(true);
  };
  
  // Handle checkout success
  const handleCheckoutSuccess = () => {
    setShowCheckout(false);
    setOrderSuccess(true);
    
    // Navigate to orders screen after a delay
    setTimeout(() => {
      router.push('/(tabs)/orders');
    }, 3000);
  };

  // Render featured dish item
  const renderFeaturedDish = ({ item }: { item: Dish }) => {
    const isSelected = selectedDishes.includes(item.id);
    
    return (
      <Animated.View style={[
        isSelected && {
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim,
        }
      ]}>
        <View style={styles.dishItem}>
          <View style={styles.dishImageContainer}>
            <Image source={{ uri: item.imageUrl }} style={styles.dishImage} />
            {item.isPopular && (
              <View style={styles.popularBadge}>
                <ThemedText style={styles.popularBadgeText}>Phổ biến</ThemedText>
              </View>
            )}
          </View>
          <ThemedView style={styles.dishInfo}>
            <ThemedView style={styles.dishHeader}>
              <ThemedText type="subtitle" numberOfLines={1} style={styles.dishName}>{item.name}</ThemedText>
              <ThemedText style={styles.dishPrice}>{item.price}</ThemedText>
            </ThemedView>
            <ThemedText numberOfLines={2} style={styles.dishDescription}>
              {item.description}
            </ThemedText>
            <TouchableOpacity 
              style={[
                styles.addButton,
                isSelected && styles.addedButton
              ]} 
              activeOpacity={0.8}
              onPress={() => addDish(item.id)}
            >
              <IconSymbol 
                name={isSelected ? "checkmark" : "plus"} 
                size={16} 
                color="#FFF" 
              />
              <ThemedText style={styles.addButtonText}>
                {isSelected ? 'Đã thêm' : 'Thêm'}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </View>
      </Animated.View>
    );
  };

  // Badge count for selected dishes
  const getBadgeCount = () => {
    return selectedDishes.length > 0 ? selectedDishes.length : undefined;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        
        {/* Animated Header */}
        <Animated.View style={[
          styles.header, 
          { height: headerHeight }
        ]}>
          {/* Header Image */}
          <Animated.Image 
            source={{ uri: restaurantDetail.images[currentImageIndex] }}
            style={[
              styles.headerImage,
              { transform: [{ scale: imageScale }] }
            ]} 
          />
          
          {/* Header Gradient Overlay */}
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.3)']}
            style={styles.headerGradient}
          />
          
          {/* Blurred Header Background for scrolling */}
          <Animated.View 
            style={[
              styles.headerBackground,
              { 
                opacity: headerBgOpacity,
                paddingTop: insets.top,
              }
            ]}
          >
            <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
            <Animated.Text 
              style={[
                styles.headerTitle,
                { opacity: headerTitleOpacity }
              ]}
              numberOfLines={1}
            >
              {restaurantDetail.name}
            </Animated.Text>
          </Animated.View>
          
          {/* Header Controls */}
          <View style={[styles.headerControls, { marginTop: insets.top }]}>
            <TouchableOpacity 
              style={styles.headerButton} 
              onPress={handleBack}
            >
              <IconSymbol name="chevron.left" size={24} color="#FFF" />
            </TouchableOpacity>
            
            <View style={styles.headerRightControls}>
              <TouchableOpacity 
                style={[styles.headerButton, styles.marginRight]}
                onPress={handleShare}
              >
                <IconSymbol name="square.and.arrow.up" size={20} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => setIsFavorite(!isFavorite)}
              >
                <IconSymbol 
                  name={isFavorite ? "heart.fill" : "heart"} 
                  size={22} 
                  color={isFavorite ? "#FF6B00" : "#FFF"} 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Image Pagination Indicators */}
          <View style={styles.paginationContainer}>
            {restaurantDetail.images.map((_, index) => (
              <View 
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentImageIndex && styles.paginationDotActive
                ]}
              />
            ))}
          </View>
        </Animated.View>
        
        {/* Main Content */}
        <Animated.ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          contentContainerStyle={[
            styles.scrollViewContent,
            { paddingBottom: insets.bottom + 100 } // Extra padding for action buttons
          ]}
        >
          {/* Restaurant Name and Rating */}
          <ThemedView style={styles.nameContainer}>
            <ThemedText type="title" style={styles.restaurantName}>
              {restaurantDetail.name}
            </ThemedText>
            
            <View style={styles.ratingSection}>
              <View style={styles.ratingContainer}>
                <IconSymbol name="star.fill" size={16} color="#FFC107" />
                <ThemedText style={styles.ratingText}>{restaurantDetail.rating}</ThemedText>
              </View>
              <ThemedText style={styles.reviewCount}>
                ({restaurantDetail.reviewCount} đánh giá)
              </ThemedText>
            </View>
          </ThemedView>
          
          {/* Restaurant Details */}
          <ThemedView style={styles.infoSection}>
            <ThemedView style={styles.infoRow}>
              <ThemedView style={styles.infoItem}>
                <IconSymbol name="clock" size={18} color="#666" />
                <View style={styles.infoTextContainer}>
                  <ThemedText style={styles.infoLabel}>Giờ mở cửa</ThemedText>
                  <ThemedText style={styles.infoValue}>{restaurantDetail.openingHours}</ThemedText>
                </View>
              </ThemedView>
              
              <ThemedView style={styles.infoItem}>
                <IconSymbol name="tag" size={18} color="#666" />
                <View style={styles.infoTextContainer}>
                  <ThemedText style={styles.infoLabel}>Giá</ThemedText>
                  <ThemedText style={styles.infoValue}>{restaurantDetail.price}</ThemedText>
                </View>
              </ThemedView>
            </ThemedView>
            
            <ThemedView style={styles.infoRow}>
              <ThemedView style={styles.infoItem}>
                <IconSymbol name="hand.thumbsup.fill" size={18} color="#666" />
                <View style={styles.infoTextContainer}>
                  <ThemedText style={styles.infoLabel}>Vệ sinh</ThemedText>
                  <View style={styles.hygieneRating}>
                    {Array(5).fill(0).map((_, i) => (
                      <IconSymbol 
                        key={i} 
                        name="star.fill" 
                        size={12} 
                        color={i < Math.floor(restaurantDetail.hygieneRating) ? "#4CAF50" : "#DDD"} 
                      />
                    ))}
                  </View>
                </View>
              </ThemedView>
              
              <ThemedView style={styles.infoItem}>
                <IconSymbol name="chair" size={18} color="#666" />
                <View style={styles.infoTextContainer}>
                  <ThemedText style={styles.infoLabel}>Chỗ ngồi</ThemedText>
                  <ThemedText style={styles.infoValue}>{restaurantDetail.seatingAvailability}</ThemedText>
                </View>
              </ThemedView>
            </ThemedView>
            
            <ThemedView style={styles.infoRow}>
              <ThemedView style={styles.infoItem}>
                <IconSymbol name="location" size={18} color="#666" />
                <View style={styles.infoTextContainer}>
                  <ThemedText style={styles.infoLabel}>Khoảng cách</ThemedText>
                  <ThemedText style={styles.infoValue}>{restaurantDetail.distance} km từ trường</ThemedText>
                </View>
              </ThemedView>
              
              {restaurantDetail.isBusy && (
                <ThemedView style={styles.warningItem}>
                  <IconSymbol name="exclamationmark.triangle" size={16} color="#FF6B00" />
                  <ThemedText style={styles.warningText}>Đông khách</ThemedText>
                </ThemedView>
              )}
            </ThemedView>
            
            <View style={styles.addressContainer}>
              <ThemedText style={styles.addressLabel}>Địa chỉ</ThemedText>
              <ThemedText style={styles.address}>{restaurantDetail.address}</ThemedText>
              <TouchableOpacity style={styles.directionsButton}>
                <IconSymbol name="map" size={15} color="#FF6B00" />
                <ThemedText style={styles.directionsText}>Chỉ đường</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
          
          {/* About Restaurant */}
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Giới thiệu</ThemedText>
            <ThemedText style={styles.aboutText}>{restaurantDetail.about}</ThemedText>
          </ThemedView>
          
          {/* Featured Dishes */}
          <ThemedView style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>Món nổi bật</ThemedText>
              <TouchableOpacity style={styles.viewAllButton}>
                <ThemedText style={styles.viewAllText}>Xem tất cả</ThemedText>
                <IconSymbol name="chevron.right" size={12} color="#FF6B00" />
              </TouchableOpacity>
            </View>
            
            {restaurantDetail.featuredDishes.map(dish => (
              <View key={dish.id} style={{ marginBottom: dish.id !== restaurantDetail.featuredDishes[restaurantDetail.featuredDishes.length - 1].id ? 16 : 0 }}>
                {renderFeaturedDish({ item: dish })}
              </View>
            ))}
          </ThemedView>
        </Animated.ScrollView>
        
        {/* Action Buttons */}
        <ThemedView style={[
          styles.actionButtons,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }
        ]}>
          <TouchableOpacity 
            style={styles.primaryButton}
            activeOpacity={0.9}
            onPress={() => setShowOrderModal(true)}
          >
            <IconSymbol name="bag" size={16} color="#FFF" style={styles.buttonIcon} />
            <ThemedText style={styles.primaryButtonText}>Đặt món</ThemedText>
            {getBadgeCount() && (
              <View style={styles.badgeContainer}>
                <ThemedText style={styles.badgeText}>{getBadgeCount()}</ThemedText>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.secondaryButton}
            activeOpacity={0.9}
            onPress={() => setShowOrderModal(true)}
          >
            <IconSymbol name="calendar.badge.plus" size={16} color="#444" style={styles.buttonIcon} />
            <ThemedText style={styles.secondaryButtonText}>Đặt bàn</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        {/* Order Form Modal */}
        <OrderForm 
          visible={showOrderModal}
          onClose={() => setShowOrderModal(false)}
          onSubmit={handleOrderSubmit}
        />
        
        {/* Cart Modal */}
        <Cart
          isVisible={showCart}
          onClose={() => setShowCart(false)}
          onCheckout={handleCartCheckout}
        />
        
        {/* Checkout Modal */}
        <Checkout
          visible={showCheckout}
          totalAmount={checkoutAmount}
          onClose={() => setShowCheckout(false)}
          onSuccess={handleCheckoutSuccess}
        />
      </ThemedView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_MIN_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  headerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 3,
  },
  headerRightControls: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  marginRight: {
    marginRight: 8,
  },
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    zIndex: 3,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#FFF',
    width: 12,
  },
  scrollView: {
    flex: 1,
    marginTop: HEADER_HEIGHT,
  },
  scrollViewContent: {
    padding: 16,
  },
  nameContainer: {
    marginBottom: 16,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  reviewCount: {
    fontSize: 14,
    color: '#888',
  },
  infoSection: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoTextContainer: {
    marginLeft: 10,
  },
  infoLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  hygieneRating: {
    flexDirection: 'row',
    gap: 2,
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'center',
  },
  warningText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF6B00',
    marginLeft: 6,
  },
  addressContainer: {
    marginTop: 6,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  addressLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  address: {
    fontSize: 15,
    marginBottom: 10,
    lineHeight: 22,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  directionsText: {
    fontSize: 14,
    color: '#FF6B00',
    fontWeight: '500',
    marginLeft: 6,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#FF6B00',
    marginRight: 4,
  },
  aboutText: {
    lineHeight: 22,
    color: '#444',
  },
  dishItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  dishImageContainer: {
    width: 100,
    height: 100,
    position: 'relative',
  },
  dishImage: {
    width: '100%',
    height: '100%',
  },
  popularBadge: {
    position: 'absolute',
    top: 8,
    left: 0,
    backgroundColor: '#FF6B00',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  popularBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  dishInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  dishHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  dishName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  dishPrice: {
    fontWeight: '600',
    color: '#FF6B00',
  },
  dishDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B00',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-end',
  },
  addedButton: {
    backgroundColor: '#4CAF50',
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 10,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#FF6B00',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  secondaryButtonText: {
    color: '#444',
    fontWeight: 'bold',
    fontSize: 15,
  },
  buttonIcon: {
    marginRight: 8,
  },
  badgeContainer: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
