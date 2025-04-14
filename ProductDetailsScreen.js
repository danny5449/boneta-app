import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Linking } from 'react-native';
import { FavoritesContext } from './FavoritesContext';

export default function ProductDetailsScreen({ route, navigation }) {
  const { product } = route.params;
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  const isFavorite = favorites.some(fav => fav.reference === product.reference);
  const isXpressShip = product.final_price < 100000;
  const lastSalePrice = product.final_price * 0.9; // Mocked last sale price (10% less)

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>⬅ Back</Text>
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image_url }} style={styles.image} />
        </View>
        <TouchableOpacity
          onPress={() => toggleFavorite(product.reference, product)}
          style={styles.favoriteIcon}
        >
          <Text style={styles.favoriteIconText}>{isFavorite ? "❤️" : "🤍"}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{product.brand} {product.model}</Text>
        <Text style={styles.priceLabel}>Lowest Ask</Text>
        <Text style={styles.price}>${product.final_price.toLocaleString()}</Text>
        <Text style={styles.lastSaleLabel}>Last Sale</Text>
        <Text style={styles.lastSale}>${lastSalePrice.toLocaleString()}</Text>
        <View style={styles.badgesContainer}>
          {isXpressShip && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🚀 Xpress Ship</Text>
            </View>
          )}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{product.condition}</Text>
          </View>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>Reference:</Text>
          <Text style={styles.detailValue}>{product.reference}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>Location:</Text>
          <Text style={styles.detailValue}>{product.location}</Text>
        </View>
        {product.comments && (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailLabel}>Comments:</Text>
            <Text style={styles.detailValue}>{product.comments}</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.inquiryButton}
          onPress={() =>
            Linking.openURL(
              `https://wa.me/+13059343988?text=Hi, I'm interested in the ${product.brand} ${product.model} listed at $${product.final_price.toLocaleString()}`
            )
          }
        >
          <Text style={styles.inquiryButtonText}>WhatsApp Inquiry</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 15,
  },
  backButton: {
    marginBottom: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#000',
  },
  imageContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 50,
    right: 25,
    zIndex: 1,
  },
  favoriteIconText: {
    fontSize: 24,
    color: '#ccc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  lastSaleLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  lastSale: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#000',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
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
    fontSize: 12,
    color: '#666',
  },
  detailsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    width: 100,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  inquiryButton: {
    backgroundColor: '#25D366',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  inquiryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});