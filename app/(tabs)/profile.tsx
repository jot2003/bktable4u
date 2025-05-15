import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Sample user data
const userData = {
  name: 'Nguyễn Văn A',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  email: 'nguyenvana@example.com',
  phone: '0912345678',
  address: 'Ký túc xá BKHN, Ngõ 22 Tạ Quang Bửu, Hai Bà Trưng, Hà Nội',
};

// Menu items
const menuItems = [
  { 
    id: 'payment', 
    title: 'Phương thức thanh toán', 
    icon: 'creditcard',
    color: '#4CAF50',
  },
  { 
    id: 'addresses', 
    title: 'Địa chỉ đã lưu', 
    icon: 'mappin.and.ellipse',
    color: '#2196F3',
  },
  { 
    id: 'favorites', 
    title: 'Nhà hàng yêu thích', 
    icon: 'heart',
    color: '#E91E63',
  },
  { 
    id: 'notifications', 
    title: 'Thông báo', 
    icon: 'bell',
    color: '#FF9800',
  },
  { 
    id: 'settings', 
    title: 'Cài đặt', 
    icon: 'gear',
    color: '#607D8B',
  },
  { 
    id: 'help', 
    title: 'Trợ giúp và hỗ trợ', 
    icon: 'questionmark.circle',
    color: '#9C27B0',
  },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <ThemedText style={styles.headerTitle}>Hồ sơ</ThemedText>
          <TouchableOpacity style={styles.settingsButton}>
            <IconSymbol name="gear" size={22} color="#666" />
          </TouchableOpacity>
        </View>
        
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <Image source={{ uri: userData.avatar }} style={styles.avatar} />
          
          <View style={styles.userInfo}>
            <ThemedText style={styles.userName}>{userData.name}</ThemedText>
            <ThemedText style={styles.userEmail}>{userData.email}</ThemedText>
            <TouchableOpacity style={styles.editButton}>
              <ThemedText style={styles.editButtonText}>Chỉnh sửa hồ sơ</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Action Cards */}
        <View style={styles.actionCards}>
          <TouchableOpacity style={[styles.actionCard, styles.ordersCard]}>
            <IconSymbol name="bag" size={22} color="#FF6B00" />
            <ThemedText style={styles.actionCardTitle}>Đơn hàng</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionCard, styles.vouchersCard]}>
            <IconSymbol name="ticket" size={22} color="#FF6B00" />
            <ThemedText style={styles.actionCardTitle}>Khuyến mãi</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionCard, styles.pointsCard]}>
            <IconSymbol name="star" size={22} color="#FF6B00" />
            <ThemedText style={styles.actionCardTitle}>Điểm thưởng</ThemedText>
          </TouchableOpacity>
        </View>
        
        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map(item => (
            <TouchableOpacity 
              key={item.id}
              style={styles.menuItem}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: `${item.color}20` }]}>
                <IconSymbol name={item.icon} size={20} color={item.color} />
              </View>
              <ThemedText style={styles.menuItemTitle}>{item.title}</ThemedText>
              <IconSymbol name="chevron.right" size={16} color="#CCC" />
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <IconSymbol name="rectangle.portrait.and.arrow.right" size={18} color="#FF3B30" />
          <ThemedText style={styles.logoutText}>Đăng xuất</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#FF6B00',
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  editButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#555',
  },
  actionCards: {
    flexDirection: 'row',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ordersCard: {
    marginLeft: 0,
  },
  vouchersCard: {},
  pointsCard: {
    marginRight: 0,
  },
  actionCardTitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 8,
  },
  menuContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF3B30',
    marginLeft: 8,
  },
}); 