import React, { useEffect, useState, useCallback, useContext } from 'react';
import {
  View, Text, FlatList, StyleSheet, Image, TouchableOpacity,
  ActivityIndicator, TextInput, SafeAreaView
} from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import debounce from 'lodash/debounce';
import { FavoritesContext } from './FavoritesContext';

export default function MarketScreen({ navigation }) {
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const [watches, setWatches] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const apiBase = 'https://unagedluxury-3uyy6etro-daniel-kassabs-projects.vercel.app/inventory';

  const brandLogos = {
    "ROLEX": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Rolex_logo.svg/512px-Rolex_logo.svg.png",
    "PATEK PHILIPPE": "https://upload.wikimedia.org/wikipedia/en/5/5a/Patek_Philippe_logo.svg",
    "AUDEMARS PIGUET": "https://upload.wikimedia.org/wikipedia/commons/2/2a/Audemars_Piguet_logo.svg",
    "CARTIER": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Cartier_logo.svg/512px-Cartier_logo.svg.png",
    "RICHARD MILLE": "https://upload.wikimedia.org/wikipedia/commons/3/3b/Richard_Mille_logo.svg"
  };

  const fetchInventory = (query = searchQuery) => {
    setLoading(true);
    let params = [];
    if (brand) params.push(`brand=${brand}`);
    if (size) params.push(`size=${size}`);
    let url = params.length ? `${apiBase}?${params.join("&")}` : apiBase;
    axios.get(url, { timeout: 10000 })
      .then(res => {
        let filteredData = res.data;
        if (query) {
          filteredData = filteredData.filter(item =>
            `${item.brand} ${item.model}`.toLowerCase().includes(query.toLowerCase())
          );
        }
        setWatches(filteredData);
        setLoading(false);
      })
      .catch(err => {
        console.error("API error:", err);
        setLoading(false);
      });
  };

  const loadRecentlyViewed = async () => {
    try {
      const stored = await AsyncStorage.getItem('recentlyViewed');
      if (stored) {
        setRecentlyViewed(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading recently viewed:", error);
    }
  };

  const saveRecentlyViewed = async (watch) => {
    try {
      let updatedRecentlyViewed = [...recentlyViewed];
      const exists = updatedRecentlyViewed.some(item => item.reference === watch.reference);
      if (!exists) {
        updatedRecentlyViewed = [watch, ...updatedRecentlyViewed].slice(0, 10); // Keep only the latest 10
        await AsyncStorage.setItem('recentlyViewed', JSON.stringify(updatedRecentlyViewed));
        setRecentlyViewed(updatedRecentlyViewed);
      }
    } catch (error) {
      console.error("Error saving recently viewed:", error);
    }
  };

  const debouncedFetchInventory = useCallback(debounce((query) => {
    fetchInventory(query);
  }, 500), [brand, size]);

  useEffect(() => {
    fetchInventory();
    loadRecentlyViewed();
  }, [brand, size]);

  useEffect(() => {
    debouncedFetchInventory(searchQuery);
    return () => debouncedFetchInventory.cancel();
  }, [searchQuery, debouncedFetchInventory]);

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by brand, color, etc"
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filterContainer}>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={brand}
          style={styles.picker}
          onValueChange={setBrand}
        >
          <Picker.Item label="All Brands" value="" />
          <Picker.Item label="ROLEX" value="ROLEX" />
          <Picker.Item label="PATEK PHILIPPE" value="PATEK PHILIPPE" />
          <Picker.Item label="CARTIER" value="CARTIER" />
          <Picker.Item label="AUDEMARS PIGUET" value="AUDEMARS PIGUET" />
        </Picker>
      </View>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={size}
          style={styles.picker}
          onValueChange={setSize}
        >
          <Picker.Item label="All Sizes" value="" />
          <Picker.Item label="31mm" value="31mm" />
          <Picker.Item label="36mm" value="36mm" />
          <Picker.Item label="41mm" value="41mm" />
        </Picker>
      </View>
    </View>
  );

  const renderItem = ({ item }) => {
    const isFavorite = favorites.some(fav => fav.reference === item.reference);
    const isXpressShip = item.final_price < 100000;
    const lastSalePrice = item.final_price * 0.9; // Mocked last sale price (10% less)

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          saveRecentlyViewed(item);
          navigation.navigate('ProductDetails', { product: item });
        }}
      >
        <TouchableOpacity
          onPress={() => toggleFavorite(item.reference, item)}
          style={styles.favoriteIcon}
        >
          <Text style={styles.favoriteIconText}>{isFavorite ? "❤️" : "🤍"}</Text>
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image_url }} style={styles.image} />
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {item.brand} {item.model}
        </Text>
        <Text style={styles.priceLabel}>Lowest Ask</Text>
        <Text style={styles.price}>${item.final_price.toLocaleString()}</Text>
        <Text style={styles.lastSaleLabel}>Last Sale</Text>
        <Text style={styles.lastSale}>${lastSalePrice.toLocaleString()}</Text>
        <View style={styles.badgesContainer}>
          {isXpressShip && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🚀 Xpress Ship</Text>
            </View>
          )}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.condition}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderRecentlyViewed = () => {
    if (recentlyViewed.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recently Viewed</Text>
        <FlatList
          data={recentlyViewed}
          renderItem={renderItem}
          keyExtractor={(item, index) => `recent-${item.reference}-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recentlyViewedList}
        />
      </View>
    );
  };

  const renderHeader = () => (
    <View>
      {renderSearchBar()}
      {renderFilters()}
      {renderRecentlyViewed()}
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#000" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={watches}
        keyExtractor={(item, index) => `${item.reference}-${index}`}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.container}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 10,
    backgroundColor: '#fff',
  },
  searchContainer: {
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  pickerWrapper: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  recentlyViewedList: {
    paddingHorizontal: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  imageContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  favoriteIconText: {
    fontSize: 20,
    color: '#ccc',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 10,
    marginTop: 5,
    color: '#000',
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    marginHorizontal: 10,
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
    marginBottom: 2,
    color: '#000',
  },
  lastSaleLabel: {
    fontSize: 12,
    color: '#666',
    marginHorizontal: 10,
  },
  lastSale: {
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 10,
    marginBottom: 5,
    color: '#000',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 10,
    marginBottom: 5,
  },
  badge: {
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginRight: 5,
    marginBottom: 5,
  },
  badgeText: {
    fontSize: 10,
    color: '#666',
  },
});