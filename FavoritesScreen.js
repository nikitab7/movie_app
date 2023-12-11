import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

const FavoritesScreen = ({ navigation, route }) => {
  const { favorites, setFavorites } = route.params;

  const removeFromFavorites = (movieId) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== movieId);
    setFavorites(updatedFavorites);
  };

  useEffect(() => {
    navigation.setParams({ favorites });
  }, [favorites]);

  const navigateToMovieDetails = (movieId) => {
    navigation.navigate("MovieDetails", { movieId });
  };

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <Text style={styles.noFavoritesText}>No favorites yet.</Text>
      ) : (
        <FlatList
          data={favorites}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigateToMovieDetails(item.id)}
              style={styles.movieContainer}
            >
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
                }}
                style={styles.poster}
              />
              <View style={styles.movieTitleContainer}>
                <Text style={styles.movieTitle}>{item.title}</Text>
              </View>
              <TouchableOpacity
                onPress={() => removeFromFavorites(item.id)}
                style={styles.removeFromFavoritesButton}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
  },
  noFavoritesText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  movieContainer: {
    margin: 10,
    alignItems: "center",
    position: "relative",
    borderRadius: 10,
  },
  poster: {
    width: 150,
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
  },
  movieTitleContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    alignItems: "flex-start",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  movieTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  removeFromFavoritesButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  removeButtonText: {
    color: "#fff",
  },
});

export default FavoritesScreen;
