import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { FavoritesContext } from './FavoritesContext';

export default function FavoritesScreen({ navigation }) {
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image_url }} style={styles.image} />
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {item.brand} {item.model}
      </Text>
      <Text style={styles.priceLabel}>Lowest Ask</Text>
      <Text style={styles.price}>${item.final_price.toLocaleString()}</Text>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => toggleFavorite(item.reference, item)}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.createListButton}>
        <Text style={styles.createListButtonText}>+ Create New List</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorites yet.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item, index) => `${item.reference}-${index}`}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.container}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}
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
  header: {
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  createListButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  createListButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
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
    marginBottom: 5,
    color: '#000',
  },
  removeButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 5,
    marginHorizontal: 10,
    marginBottom: 5,
    borderRadius: 4,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});