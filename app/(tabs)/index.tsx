import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList, View, Image, Animated, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import FoodRecommendation from '@/components/FoodRecommendation';

// Sample restaurant data
const restaurants = [
  {
    id: '1',
    name: 'Phở Hà Nội',
    rating: 4.8,
    address: '123 Đại Cồ Việt, Hai Bà Trưng, Hà Nội',
    distance: '0.2',
    openingHours: '7 AM - 9 PM',
    price: '30,000 - 65,000₫',
    imageUrl: 'https://images.unsplash.com/photo-1503764654157-72d979d9af2f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1174&q=80',
    isBusy: true,
  },
  {
    id: '2',
    name: 'Bún Chả Hương Liên',
    rating: 4.5,
    address: '24 Lê Văn Hưu, Hai Bà Trưng, Hà Nội',
    distance: '0.5',
    openingHours: '10 AM - 8 PM',
    price: '45,000 - 80,000₫',
    imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    isBusy: false,
  },
  {
    id: '3',
    name: 'Cơm Tấm Sài Gòn',
    rating: 4.3,
    address: '56 Tạ Quang Bửu, Hai Bà Trưng, Hà Nội',
    distance: '0.4',
    openingHours: '6 AM - 10 PM',
    price: '35,000 - 60,000₫',
    imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    isBusy: true,
  },
  {
    id: '4',
    name: 'Bánh Mì Pate',
    rating: 4.7,
    address: '35 Tạ Quang Bửu, Hai Bà Trưng, Hà Nội',
    distance: '0.3',
    openingHours: '6 AM - 7 PM',
    price: '25,000 - 40,000₫',
    imageUrl: 'https://images.unsplash.com/photo-1600688640154-9619e002df30?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    isBusy: false,
  },
  {
    id: '5',
    name: 'Bún Đậu Mắm Tôm',
    rating: 4.4,
    address: '78 Đại Cồ Việt, Hai Bà Trưng, Hà Nội',
    distance: '0.6',
    openingHours: '10 AM - 9 PM',
    price: '50,000 - 95,000₫',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80',
    isBusy: true,
  },
];

// Filter option types
const filterOptions = {
  ALL: 'Tất cả',
  NEAREST: 'Gần nhất',
  HIGHEST_RATED: 'Đánh giá cao'
};

// Restaurant type definition
interface Restaurant {
  id: string;
  name: string;
  rating: number;
  address: string;
  distance: string;
  openingHours: string;
  price: string;
  imageUrl: string;
  isBusy: boolean;
}

export default function RestaurantScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(filterOptions.ALL);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollY] = useState(new Animated.Value(0));
  
  // Animation values
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 60],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Show recommendation after a short delay
      setTimeout(() => setShowRecommendation(true), 500);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter restaurants based on active filter
  const getFilteredRestaurants = () => {
    let filtered = [...restaurants];
    
    // Apply search filter if query exists
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply additional filters
    switch (activeFilter) {
      case filterOptions.NEAREST:
        filtered.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        break;
      case filterOptions.HIGHEST_RATED:
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Default sorting can be based on some relevance score or just keep original order
        break;
    }
    
    return filtered;
  };

  const handleRestaurantPress = (restaurant: Restaurant) => {
    console.log(`Selected restaurant: ${restaurant.name}`);
    // In a real app, navigate to the restaurant detail screen
    router.push('/(tabs)/explore');
  };

  // Render a restaurant item
  const renderRestaurantItem = ({ item }: { item: Restaurant }) => (
    <Animated.View
      style={{
        opacity: 1,
        transform: [{ scale: 1 }],
      }}
    >
      <TouchableOpacity 
        style={styles.restaurantItem}
        activeOpacity={0.7}
        onPress={() => handleRestaurantPress(item)}
      >
        <View style={styles.restaurantImageContainer}>
          <Image 
            source={{ uri: item.imageUrl }}
            style={styles.restaurantImage}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent']}
            style={styles.imageGradient}
          />
          {item.isBusy && (
            <View style={styles.busyBadge}>
              <IconSymbol name="person.3.fill" size={10} color="#FFF" style={styles.busyIcon} />
              <ThemedText style={styles.busyText}>Đông</ThemedText>
            </View>
          )}
        </View>
        <View style={styles.restaurantInfo}>
          <View style={styles.restaurantHeader}>
            <ThemedText type="subtitle" numberOfLines={1} style={styles.restaurantName}>{item.name}</ThemedText>
            <View style={styles.ratingContainer}>
              <IconSymbol name="star.fill" size={14} color="#FFC107" />
              <ThemedText style={styles.ratingText}>{item.rating}</ThemedText>
            </View>
          </View>
          
          <ThemedText numberOfLines={1} style={styles.restaurantAddress}>{item.address}</ThemedText>
          
          <View style={styles.restaurantDetails}>
            <View style={styles.detailItem}>
              <IconSymbol name="clock" size={12} color="#888" />
              <ThemedText style={styles.detailText}>{item.openingHours}</ThemedText>
            </View>
            
            <View style={styles.detailItem}>
              <IconSymbol name="location" size={12} color="#888" />
              <ThemedText style={styles.detailText}>{item.distance} km</ThemedText>
            </View>
            
            <View style={styles.detailItem}>
              <IconSymbol name="tag" size={12} color="#888" />
              <ThemedText style={styles.detailText}>{item.price}</ThemedText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  // Loading screen
  if (isLoading) {
    return (
      <ThemedView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <ThemedText style={styles.loadingText}>Đang tìm nhà hàng gần bạn...</ThemedText>
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
            height: headerHeight,
            paddingTop: insets.top
          }
        ]}
      >
        <BlurView intensity={90} style={StyleSheet.absoluteFill} />
      </Animated.View>

      {/* Main Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <ThemedView style={styles.header}>
          <View>
            <ThemedText style={styles.welcomeText}>Xin chào 👋</ThemedText>
            <ThemedText type="title" style={styles.titleText}>Tìm nhà hàng</ThemedText>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <IconSymbol name="slider.horizontal.3" size={22} color="#FF6B00" />
          </TouchableOpacity>
        </ThemedView>
        
        {/* Search Bar */}
        <ThemedView style={styles.searchContainer}>
          <IconSymbol name="magnifyingglass" size={18} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm nhà hàng, món ăn..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <IconSymbol name="xmark.circle.fill" size={16} color="#CCC" />
            </TouchableOpacity>
          )}
        </ThemedView>
        
        {/* Filter Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsContainer}
        >
          {Object.values(filterOptions).map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.filterTab,
                activeFilter === option && styles.activeFilterTab
              ]}
              onPress={() => setActiveFilter(option)}
            >
              <ThemedText 
                style={[
                  styles.filterTabText,
                  activeFilter === option && styles.activeFilterTabText
                ]}
              >
                {option}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {/* Restaurant List Section Header */}
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Nhà hàng gần bạn</ThemedText>
          <TouchableOpacity style={styles.seeAllButton}>
            <ThemedText style={styles.seeAllText}>Xem tất cả</ThemedText>
            <IconSymbol name="chevron.right" size={14} color="#FF6B00" />
          </TouchableOpacity>
        </View>
        
        {/* Restaurant List */}
        <FlatList
          data={getFilteredRestaurants()}
          keyExtractor={(item) => item.id}
          renderItem={renderRestaurantItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.restaurantList}
          scrollEnabled={false} // Disable scrolling for nested FlatList
          ListEmptyComponent={
            <ThemedView style={styles.emptyContainer}>
              <IconSymbol name="magnifyingglass" size={40} color="#CCC" />
              <ThemedText style={styles.emptyText}>Không tìm thấy nhà hàng phù hợp</ThemedText>
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={() => {
                  setSearchQuery('');
                  setActiveFilter(filterOptions.ALL);
                }}
              >
                <ThemedText style={styles.resetButtonText}>Đặt lại bộ lọc</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          }
        />
      </Animated.ScrollView>
      
      {/* Food Recommendation Modal */}
      <FoodRecommendation 
        visible={showRecommendation}
        onClose={() => setShowRecommendation(false)}
        onSeeMore={() => {
          setShowRecommendation(false);
          // Handle see more action
        }}
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
    backgroundColor: 'rgba(255,255,255,0.8)',
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 4,
  },
  titleText: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: '#333',
  },
  clearButton: {
    padding: 6,
  },
  filterTabsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#F5F5F5',
  },
  activeFilterTab: {
    backgroundColor: '#FF6B00',
  },
  filterTabText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterTabText: {
    color: '#FFF',
    fontWeight: 'bold',
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
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: '#FF6B00',
    marginRight: 4,
  },
  restaurantList: {
    paddingBottom: 20,
  },
  restaurantItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  restaurantImageContainer: {
    width: 110,
    position: 'relative',
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  imageGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    borderTopLeftRadius: 16,
  },
  busyBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 59, 48, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  busyIcon: {
    marginRight: 3,
  },
  busyText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  restaurantInfo: {
    flex: 1,
    padding: 14,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  restaurantName: {
    flex: 1,
    marginRight: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 2,
    color: '#FF8C00',
  },
  restaurantAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  restaurantDetails: {
    flexDirection: 'column',
    gap: 5,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: '#FF6B00',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});
