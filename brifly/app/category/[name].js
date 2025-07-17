import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const sampleArticles = [
  {
    id: 1,
    title: "L'IA va-t-elle révolutionner la médecine ?",
    author: "Dr. Moreau",
    image: "https://source.unsplash.com/600x400/?ai,health",
    progress: 60,
  },
  {
    id: 2,
    title: "Comprendre le Bitcoin en 5 minutes",
    author: "Jean Dupont",
    image: "https://source.unsplash.com/600x400/?bitcoin",
    progress: 100,
  },
  {
    id: 3,
    title: "Les bases du Web3 expliquées simplement",
    author: "Sophie Martin",
    image: "https://source.unsplash.com/600x400/?blockchain",
    progress: 30,
  },
];

export default function CategoryArticles() {
  const { name } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* App Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{name}</Text>
      </View>

      {/* Articles list */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {sampleArticles.map((article) => (
          <TouchableOpacity
            key={article.id}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/article",
                params: {
                  title: article.title,
                  author: article.author,
                  image: article.image,
                },
              })
            }
          >
            <Image source={{ uri: article.image }} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.articleTitle} numberOfLines={2}>
                {article.title}
              </Text>
              <Text style={styles.author}>Par {article.author}</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${article.progress}%` },
                  ]}
                />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  back: {
    fontSize: 28,
    color: "#1C1C1E",
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  scroll: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
  },
  image: {
    height: 160,
    width: "100%",
  },
  textContainer: {
    padding: 16,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 6,
  },
  author: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#facc15",
  },
});