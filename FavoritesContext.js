import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Load favorites from AsyncStorage on app start
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem('favorites');
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    };
    loadFavorites();
  }, []);

  const toggleFavorite = async (ref, watch) => {
    try {
      let updatedFavorites = [...favorites];
      const exists = updatedFavorites.some(item => item.reference === ref);
      if (exists) {
        updatedFavorites = updatedFavorites.filter(item => item.reference !== ref);
      } else {
        updatedFavorites.push(watch);
      }
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};