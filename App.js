import React, { useEffect, useState } from "react";
import {
  StatusBar,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MovieDetailsScreen from "./MovieDetails";
import FavoritesScreen from "./FavoritesScreen";
import { IconButton } from "react-native-paper";

import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import { LogBox } from "react-native";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);
const Stack = createStackNavigator();

const MovieListScreen = ({ navigation, route }) => {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState(null);

  const { selectedList } = route.params || {};

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const apiKey = "690795ce673d6ec1314dfc7af7719690";
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${selectedList}?api_key=${apiKey}`
        );
        const data = await response.json();
        setMovies(data.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMovies();

    navigation.setOptions({
      headerTitle:
        selectedList === "top_rated"
          ? "Top Rated"
          : selectedList === "upcoming"
          ? "Upcoming"
          : selectedList === "now_playing"
          ? "Now Playing"
          : selectedList.toUpperCase(),
    });
  }, [navigation, selectedList]);

  const toggleFavorite = (movieId) => {
    const isFavorite = favorites.some((fav) => fav.id === movieId);

    if (isFavorite) {
      setFavorites(favorites.filter((fav) => fav.id !== movieId));
    } else {
      const movieToAdd = movies.find((movie) => movie.id === movieId);
      setFavorites([...favorites, movieToAdd]);
    }
  };
  const handleIconPress = (selectedList) => {
    setSelectedIcon(selectedList);
    navigation.navigate("MovieList", { selectedList });
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={{ marginTop: 10 }}
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("MovieDetails", { movieId: item.id })
            }
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
            <View style={styles.favoriteIconContainer}>
              <TouchableOpacity
                onPress={() => toggleFavorite(item.id)}
                style={styles.favoriteIcon}
              >
                <FontAwesomeIcon
                  name={
                    favorites.some((fav) => fav.id === item.id)
                      ? "heart"
                      : "heart-o"
                  }
                  size={30}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      <View style={styles.footer}>
        <IconButton
          icon={() => (
            <FontAwesomeIcon name="exclamation" size={30} color="#fff" />
          )}
          color="#fff"
          size={30}
          onPress={() => handleIconPress("upcoming")}
          style={[
            styles.footerIcon,
            selectedIcon === "upcoming" && styles.selectedIcon,
          ]}
        />

        <IconButton
          icon={() => <IoniconsIcon name="star" size={30} color="#fff" />}
          color="#fff"
          size={30}
          onPress={() => handleIconPress("top_rated")}
          style={[
            styles.footerIcon,
            selectedIcon === "top_rated" && styles.selectedIcon,
          ]}
        />

        <IconButton
          icon={() => (
            <MaterialCommunityIcon name="fire" size={30} color="#fff" />
          )}
          color="#fff"
          size={30}
          onPress={() => handleIconPress("now_playing")}
          style={[
            styles.footerIcon,
            selectedIcon === "now_playing" && styles.selectedIcon,
          ]}
        />

        <IconButton
          icon={() => <MaterialIcon name="favorite" size={30} color="#fff" />}
          color="#fff"
          size={30}
          onPress={() =>
            navigation.navigate("Favorites", { favorites, setFavorites })
          }
          style={styles.footerIcon}
        />
      </View>

      <StatusBar style="light" />
    </View>
  );
};

MovieListScreen.navigationOptions = ({ navigation }) => ({
  headerRight: () => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Favorites")}
      style={styles.favoriteButton}
    >
      <Text style={styles.favoriteButtonText}>View Favorites</Text>
    </TouchableOpacity>
  ),
});

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MovieList"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#000",
            height: 100,
            elevation: 0,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="MovieList"
          component={MovieListScreen}
          initialParams={{ selectedList: "now_playing" }}
        />
        <Stack.Screen name="MovieDetails" component={MovieDetailsScreen} />
        <Stack.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{ headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
  },
  movieContainer: {
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  movieTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Avenir Next",
  },
  favoriteIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  favoriteIcon: {
    color: "#ba75b7",
    fontWeight: "bold",
    fontSize: 14,
  },
  favoriteButton: {
    marginRight: 20,
  },
  favoriteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#121212",
    paddingVertical: 10,
    marginBottom: 10,
    elevation: 2,
  },
  footerIcon: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedIcon: {
    borderBottomWidth: 2,
    borderColor: "#fff",
    paddingBottom: 8,
  },
});
