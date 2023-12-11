import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  FlatList,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import { Button, Icon, Text } from "react-native-elements";

const MovieDetailsScreen = ({ route, navigation }) => {
  const { movieId } = route.params;
  const [movieDetails, setMovieDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const [genres, setGenres] = useState([]);
  const [runtime, setRuntime] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const apiKey = "690795ce673d6ec1314dfc7af7719690";
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=credits,videos`
        );
        const data = await response.json();
        setMovieDetails(data);
        setCast(data.credits.cast);
        setVideos(data.videos.results);
        setGenres(data.genres);
        setRuntime(data.runtime);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  useEffect(() => {
    // Remove the header
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  if (!movieDetails) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        source={{
          uri: `https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`,
        }}
      >
        <Button
          icon={<Icon name="arrow-back" size={30} color="#fff" />}
          type="clear"
          onPress={() => navigation.goBack()}
          containerStyle={styles.backButton}
        />
        <View style={styles.overlay}>
          <Text style={styles.title}>{movieDetails.title}</Text>
          <Text style={styles.releaseDate}>
            {new Date(movieDetails.release_date).getFullYear()}
          </Text>
        </View>
      </ImageBackground>

      <ScrollView style={styles.movieDetailsContainer}>
        <View style={styles.rowContainer}>
          {genres.length > 0 && (
            <Text style={styles.additionalInfo}>
              {genres.map((genre) => genre.name).join(", ")}
            </Text>
          )}

          {runtime && (
            <Text style={styles.additionalInfo}>
              {runtime} {Platform.OS === "ios" ? "minutes" : "mins"}
            </Text>
          )}
        </View>
        <Text style={styles.overview}>{movieDetails.overview}</Text>
        <Text style={styles.subtitle}>Cast:</Text>
        <FlatList
          data={cast}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.castListContainer}
          renderItem={({ item }) => (
            <View style={styles.castItemContainer}>
              <View style={styles.castImageContainer}>
                <Image
                  style={styles.castImage}
                  source={{
                    uri: `https://image.tmdb.org/t/p/w200/${item.profile_path}`,
                  }}
                />
              </View>
              <Text style={styles.castName}>{item.name}</Text>
              <Text style={styles.characterName}>{item.character}</Text>
            </View>
          )}
        />
        {videos.length > 0 && (
          <>
            <Text style={styles.subtitle}>Videos:</Text>
            <WebView
              style={styles.trailer}
              source={{ uri: `https://www.youtube.com/embed/${videos[0].key}` }}
            />
          </>
        )}
        <View style={{ height: 70 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  backgroundImage: {
    flex: 1.75,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 15,
    justifyContent: "flex-end",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  releaseDate: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  movieDetailsContainer: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  overview: {
    fontSize: 15,
    textAlign: "left",
    color: "#fff",
    marginBottom: 20,
    fontFamily: "Avenir Next",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  castListContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  castItem: {
    fontSize: 14,
    color: "#fff",
    paddingHorizontal: 5,
    marginRight: 10,
  },
  trailer: {
    height: 200,
    marginTop: 20,
  },
  castItemContainer: {
    marginRight: 30,
  },
  castName: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
    width: 80,
    fontFamily: "Avenir Next",
  },
  characterName: {
    fontSize: 9,
    color: "#fff",
    width: 80,
    fontFamily: "Avenir Next",
  },
  videoListContainer: {
    marginTop: 1,
    marginBottom: 20,
  },
  castImageContainer: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    overflow: "hidden",
    marginBottom: 5,
  },
  castImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "cover",
  },
  additionalInfo: {
    fontSize: 11,
    color: "#ccc",
    marginBottom: 10,
    fontFamily: "Avenir Next",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
});

export default MovieDetailsScreen;
