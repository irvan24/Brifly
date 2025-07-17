import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const favoriteArticles = [
  {
    title: "Understanding Design Systems",
    author: "Jane Doe",
    lessons: 5,
    progress: 80,
    image: "https://picsum.photos/600/300?random=1",
  },
  {
    title: "The Psychology of Colors",
    author: "John Smith",
    lessons: 4,
    progress: 40,
    image: "https://picsum.photos/600/300?random=2",
  },
];

export default function Favorites() {
  const router = useRouter();

  const handleArtcile = (article) => {
    router.push({
      pathname: "/article",
      params: {
        title: article.title,
        author: article.author,
        summary: `Résumé de l'article "${article.title}"...`, // tu peux le rendre plus riche si tu veux
        image: article.image,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Favorites</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {favoriteArticles.map((article, index) => (
          <TouchableOpacity
            onPress={() => handleArtcile(article)}
            key={index}
            style={styles.card}
          >
            {" "}
            <Image
              source={{ uri: article.image }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.infoContainer}>
              <Text style={styles.articleTitle}>{article.title}</Text>
              <Text style={styles.author}>By {article.author}</Text>
              <Text style={styles.lessonText}>{article.lessons} sections</Text>

              <View style={styles.progressContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { width: `${article.progress}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {article.progress}% complete
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F6FA",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#F4F6FA",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  scrollContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 160,
  },
  infoContainer: {
    padding: 16,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
    color: "#1C1C1E",
  },
  author: {
    fontSize: 14,
    color: "#6e6e73",
    marginBottom: 4,
  },
  lessonText: {
    fontSize: 13,
    color: "#8E8E93",
    marginBottom: 10,
  },
  progressContainer: {
    height: 8,
    backgroundColor: "#E5E5EA",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#34C759",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 6,
  },
});
