import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, ScrollView, Dimensions, Animated, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;
const CARD_HEIGHT = 180;
const SPACING = 16;

// Mini games data
const miniGames = [
  {
    id: 'game1',
    name: 'Quay Số May Mắn',
    description: 'Xoay vòng quay để nhận phần thưởng mỗi ngày',
    imageUrl: 'https://img.freepik.com/free-vector/wheel-fortune-roulette-3d-spinning-lucky-roulette_107791-15837.jpg',
    color: ['#FF9800', '#F57C00'],
    icon: 'arrow.clockwise',
    pointsReward: 50,
    duration: '1 phút'
  },
  {
    id: 'game2',
    name: 'Ghép Đồ Ăn',
    description: 'Ghép các món ăn giống nhau để giành điểm',
    imageUrl: 'https://img.freepik.com/free-vector/food-matching-game-background_1308-95233.jpg',
    color: ['#4CAF50', '#2E7D32'],
    icon: 'square.grid.2x2',
    pointsReward: 80,
    duration: '2 phút'
  },
  {
    id: 'game3',
    name: 'Puzzle Nhà Hàng',
    description: 'Hoàn thành câu đố để nhận khuyến mãi hấp dẫn',
    imageUrl: 'https://img.freepik.com/free-vector/restaurant-mural-wallpaper_23-2148695092.jpg',
    color: ['#2196F3', '#1976D2'],
    icon: 'puzzle.piece',
    pointsReward: 100,
    duration: '3 phút'
  },
];

// Other utilities
const utilities = [
  {
    id: 'language',
    title: 'Ngôn ngữ',
    description: 'Thay đổi ngôn ngữ hiển thị',
    icon: 'globe',
    color: '#673AB7'
  },
  {
    id: 'theme',
    title: 'Giao diện',
    description: 'Tùy chỉnh giao diện ứng dụng',
    icon: 'paintbrush',
    color: '#3F51B5'
  },
  {
    id: 'feedback',
    title: 'Góp ý',
    description: 'Gửi phản hồi về ứng dụng',
    icon: 'bubble.left.and.bubble.right',
    color: '#009688'
  },
  {
    id: 'about',
    title: 'Giới thiệu',
    description: 'Thông tin về ứng dụng',
    icon: 'info.circle',
    color: '#795548'
  },
  {
    id: 'terms',
    title: 'Điều khoản',
    description: 'Điều khoản sử dụng',
    icon: 'doc.text',
    color: '#607D8B'
  },
  {
    id: 'privacy',
    title: 'Bảo mật',
    description: 'Chính sách bảo mật',
    icon: 'lock.shield',
    color: '#FF5722'
  },
];

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const [scrollX] = useState(new Animated.Value(0));
  
  // Render a mini-game item
  const renderGameItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.gameCard}
      onPress={() => console.log(`Launch game: ${item.name}`)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.gameImage} />
      <View style={styles.gameOverlay} />
      
      <View style={styles.gameInfo}>
        <ThemedText style={styles.gameName}>{item.name}</ThemedText>
        <ThemedText style={styles.gameDescription} numberOfLines={2}>
          {item.description}
        </ThemedText>
        
        <View style={styles.gameFooter}>
          <View style={styles.pointsBadge}>
            <IconSymbol name="star.fill" size={12} color="#FFC107" />
            <ThemedText style={styles.pointsText}>{item.pointsReward} pts</ThemedText>
          </View>
          <ThemedText style={styles.durationText}>{item.duration}</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render additional feature item
  const renderFeatureItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.featureItem}
      onPress={() => console.log(`Navigate to: ${item.title}`)}
    >
      <View style={[styles.featureIconContainer, { backgroundColor: `${item.color}15` }]}>
        <IconSymbol name={item.icon} size={24} color={item.color} />
      </View>
      <View style={styles.featureInfo}>
        <ThemedText style={styles.featureTitle}>{item.title}</ThemedText>
        <ThemedText style={styles.featureDescription}>{item.description}</ThemedText>
      </View>
      <IconSymbol name="chevron.right" size={18} color="#CCC" />
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">More</ThemedText>
      </ThemedView>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        
        {/* Mini-games section */}
        <ThemedView style={styles.section}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Mini-Games</ThemedText>
            <ThemedText style={styles.sectionSubtitle}>Play while waiting for your food</ThemedText>
          </ThemedView>
          
          <FlatList
            data={miniGames}
            renderItem={renderGameItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.gamesList}
          />
        </ThemedView>
        
        {/* Additional features section */}
        <ThemedView style={styles.section}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Features</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.featuresContainer}>
            {utilities.map(item => renderFeatureItem({ item }))}
          </ThemedView>
        </ThemedView>
        
        {/* App information */}
        <ThemedView style={styles.appInfoContainer}>
          <ThemedText style={styles.appVersionText}>BKHN Restaurant App v1.0.0</ThemedText>
          <ThemedText style={styles.copyrightText}>© 2024 ITSS</ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}