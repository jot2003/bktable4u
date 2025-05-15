import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Modal, FlatList, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Sample restaurant data
const restaurant = {
  id: '1',
  name: 'Phở Hà Nội',
  imageUrl: 'https://images.unsplash.com/photo-1503764654157-72d979d9af2f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1174&q=80',
};

// Sample menu items
const menuItems = [
  {
    id: '1',
    name: 'Phở Bò Đặc Biệt',
    price: '65,000₫',
    description: 'Special beef phở with premium cuts of beef and rich broth',
    imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
  },
  {
    id: '2',
    name: 'Bún Chả',
    price: '55,000₫',
    description: 'Grilled pork served with rice noodles and dipping sauce',
    imageUrl: 'https://images.unsplash.com/photo-1627308595171-d1b5d95d0e7f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
  },
  {
    id: '3',
    name: 'Bánh Mì Thịt',
    price: '35,000₫',
    description: 'Vietnamese baguette sandwich with various meats and vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1600688640154-9619e002df30?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
  },
  {
    id: '4',
    name: 'Gỏi Cuốn',
    price: '45,000₫',
    description: 'Fresh spring rolls with shrimp, herbs, and rice noodles',
    imageUrl: 'https://images.unsplash.com/photo-1625835452282-52d128897dec?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
  },
];

// Time slot options
const timeSlots = [
  { id: 'now', label: 'Now' },
  { id: '30min', label: '30 minutes' },
  { id: '1hour', label: '1 hour' },
  { id: '2hours', label: '2 hours' },
  { id: 'custom', label: 'Custom' },
];

// Order type options
const orderTypes = [
  { id: 'dine_in', label: 'Dine in' },
  { id: 'takeaway', label: 'Take away' },
];

interface OrderFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (orderData: any) => void;
}

interface MenuItem {
  id: string;
  name: string;
  price: string;
  description: string;
  imageUrl: string;
}

export default function OrderForm({ visible, onClose, onSubmit }: OrderFormProps) {
  // Order state
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('now');
  const [selectedOrderType, setSelectedOrderType] = useState('dine_in');
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({});
  
  // Calculate total price
  const calculateTotal = () => {
    let total = 0;
    Object.keys(selectedItems).forEach(itemId => {
      const item = menuItems.find(item => item.id === itemId);
      if (item) {
        const quantity = selectedItems[itemId];
        const price = parseInt(item.price.replace(/[^\d]/g, ''), 10);
        total += price * quantity;
      }
    });
    return total.toLocaleString() + '₫';
  };
  
  // Add or remove item
  const updateItemQuantity = (itemId: string, increment: boolean) => {
    setSelectedItems(prev => {
      const currentQuantity = prev[itemId] || 0;
      const newQuantity = increment ? currentQuantity + 1 : Math.max(0, currentQuantity - 1);
      
      if (newQuantity === 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      
      return {
        ...prev,
        [itemId]: newQuantity
      };
    });
  };
  
  // Handle order submission
  const handleSubmit = () => {
    const orderData = {
      restaurant,
      timeSlot: selectedTimeSlot,
      orderType: selectedOrderType,
      items: Object.keys(selectedItems).map(itemId => {
        const item = menuItems.find(item => item.id === itemId);
        return {
          ...item,
          quantity: selectedItems[itemId]
        };
      }),
      totalAmount: calculateTotal()
    };
    onSubmit(orderData);
  };
  
  // Render menu item
  const renderMenuItem = ({ item }: { item: MenuItem }) => {
    const quantity = selectedItems[item.id] || 0;
    
    return (
      <ThemedView style={styles.menuItem}>
        <Image source={{ uri: item.imageUrl }} style={styles.menuItemImage} />
        <ThemedView style={styles.menuItemDetails}>
          <ThemedText style={styles.menuItemName}>{item.name}</ThemedText>
          <ThemedText style={styles.menuItemPrice}>{item.price}</ThemedText>
          
          <ThemedView style={styles.quantityControl}>
            <TouchableOpacity 
              style={[styles.quantityButton, quantity === 0 && styles.quantityButtonDisabled]}
              onPress={() => updateItemQuantity(item.id, false)}
              disabled={quantity === 0}
            >
              <IconSymbol name="minus" size={16} color={quantity === 0 ? "#CCC" : "#666"} />
            </TouchableOpacity>
            
            <ThemedText style={styles.quantityText}>{quantity}</ThemedText>
            
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => updateItemQuantity(item.id, true)}
            >
              <IconSymbol name="plus" size={16} color="#666" />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    );
  };
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <ThemedView style={styles.container}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <IconSymbol name="xmark" size={20} color="#666" />
          </TouchableOpacity>
          <ThemedText type="subtitle" style={styles.headerTitle}>Order & Reservation</ThemedText>
          <View style={styles.placeholder} />
        </ThemedView>
        
        {/* Restaurant Info */}
        <ThemedView style={styles.restaurantInfo}>
          <Image source={{ uri: restaurant.imageUrl }} style={styles.restaurantImage} />
          <ThemedText style={styles.restaurantName}>{restaurant.name}</ThemedText>
        </ThemedView>
        
        <ScrollView style={styles.content}>
          {/* Time Selection */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>When would you like to order?</ThemedText>
            <ThemedView style={styles.timeSlotContainer}>
              {timeSlots.map(slot => (
                <TouchableOpacity
                  key={slot.id}
                  style={[
                    styles.timeSlot,
                    selectedTimeSlot === slot.id && styles.timeSlotSelected
                  ]}
                  onPress={() => setSelectedTimeSlot(slot.id)}
                >
                  <ThemedText 
                    style={[
                      styles.timeSlotText,
                      selectedTimeSlot === slot.id && styles.timeSlotTextSelected
                    ]}
                  >
                    {slot.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
          </ThemedView>
          
          {/* Menu Items */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Select your food</ThemedText>
            <FlatList
              data={menuItems}
              renderItem={renderMenuItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </ThemedView>
          
          {/* Order Type */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Order Type</ThemedText>
            <ThemedView style={styles.orderTypeContainer}>
              {orderTypes.map(type => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.orderType,
                    selectedOrderType === type.id && styles.orderTypeSelected
                  ]}
                  onPress={() => setSelectedOrderType(type.id)}
                >
                  <IconSymbol 
                    name={type.id === 'dine_in' ? 'fork.knife' : 'bag'} 
                    size={20} 
                    color={selectedOrderType === type.id ? "#FFF" : "#666"} 
                  />
                  <ThemedText 
                    style={[
                      styles.orderTypeText,
                      selectedOrderType === type.id && styles.orderTypeTextSelected
                    ]}
                  >
                    {type.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
          </ThemedView>
        </ScrollView>
        
        {/* Order Summary */}
        <ThemedView style={styles.orderSummary}>
          <ThemedView style={styles.totalContainer}>
            <ThemedText style={styles.totalLabel}>Total Amount:</ThemedText>
            <ThemedText style={styles.totalAmount}>{calculateTotal()}</ThemedText>
          </ThemedView>
          
          <TouchableOpacity 
            style={[
              styles.orderButton,
              Object.keys(selectedItems).length === 0 && styles.orderButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={Object.keys(selectedItems).length === 0}
          >
            <ThemedText style={styles.orderButtonText}>Place Order</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  restaurantInfo: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  timeSlotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginBottom: 8,
  },
  timeSlotSelected: {
    backgroundColor: '#FF6B00',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#666',
  },
  timeSlotTextSelected: {
    color: '#FFF',
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  menuItemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B00',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: '#F8F8F8',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  orderTypeContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  orderType: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    gap: 8,
  },
  orderTypeSelected: {
    backgroundColor: '#FF6B00',
  },
  orderTypeText: {
    fontSize: 16,
    color: '#666',
  },
  orderTypeTextSelected: {
    color: '#FFF',
    fontWeight: '600',
  },
  orderSummary: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF6B00',
  },
  orderButton: {
    backgroundColor: '#FF6B00',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  orderButtonDisabled: {
    backgroundColor: '#FFD2B3',
  },
  orderButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 