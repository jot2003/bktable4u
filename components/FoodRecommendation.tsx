import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Modal, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

const { width } = Dimensions.get('window');

// Sample recommended dishes
const recommendedDishes = [
  {
    id: '1',
    name: 'Phở Bò Đặc Biệt',
    restaurant: 'Phở Hà Nội',
    price: '65,000₫',
    imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
  },
  {
    id: '2',
    name: 'Bún Chả',
    restaurant: 'Bún Chả Hương Liên',
    price: '55,000₫',
    imageUrl: 'https://images.unsplash.com/photo-1627308595171-d1b5d95d0e7f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
  },
  {
    id: '3',
    name: 'Cơm Tấm Sườn',
    restaurant: 'Cơm Tấm Sài Gòn',
    price: '60,000₫',
    imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  },
];

interface FoodRecommendationProps {
  visible: boolean;
  onClose: () => void;
  onSeeMore: () => void;
}

export default function FoodRecommendation({ visible, onClose, onSeeMore }: FoodRecommendationProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <ThemedView style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <IconSymbol name="xmark" size={18} color="#888" />
          </TouchableOpacity>
          
          {/* Title */}
          <ThemedView style={styles.headerContainer}>
            <ThemedText type="subtitle" style={styles.title}>Today's Recommendations</ThemedText>
            <ThemedText style={styles.subtitle}>
              Dishes you might like based on your preferences
            </ThemedText>
          </ThemedView>
          
          {/* Recommended Dishes */}
          <ThemedView style={styles.recommendationsContainer}>
            {recommendedDishes.map((dish) => (
              <TouchableOpacity 
                key={dish.id} 
                style={styles.dishCard}
                onPress={() => console.log(`Selected dish: ${dish.name}`)}
              >
                <Image source={{ uri: dish.imageUrl }} style={styles.dishImage} />
                <View style={styles.dishDetails}>
                  <ThemedText numberOfLines={1} style={styles.dishName}>{dish.name}</ThemedText>
                  <ThemedText numberOfLines={1} style={styles.restaurantName}>{dish.restaurant}</ThemedText>
                  <ThemedText style={styles.dishPrice}>{dish.price}</ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </ThemedView>
          
          {/* See More Button */}
          <TouchableOpacity style={styles.seeMoreButton} onPress={onSeeMore}>
            <ThemedText style={styles.seeMoreText}>See More</ThemedText>
            <IconSymbol name="arrow.right" size={16} color="#FF6B00" />
          </TouchableOpacity>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  headerContainer: {
    marginBottom: 20,
    paddingRight: 20,
  },
  title: {
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
  },
  recommendationsContainer: {
    marginBottom: 20,
  },
  dishCard: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  dishImage: {
    width: 80,
    height: 80,
  },
  dishDetails: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  dishName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  dishPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B00',
  },
  seeMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#FF6B00',
    borderRadius: 12,
  },
  seeMoreText: {
    color: '#FF6B00',
    fontWeight: '600',
    marginRight: 8,
  },
}); 