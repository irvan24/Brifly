import React, { useEffect, useState } from "react";
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
import { supabase } from "../lib/SupabaseClient"; // ajuste le chemin si besoin

export default function Favorites() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndFavorites = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      setUser(userData.user);

      const { data: favs, error } = await supabase
        .from("Favorites")
        .select("*")
        .eq("user_id", userData.user.id);

      if (!error) {
        setFavorites(favs);
      } else {
        console.error("Erreur chargement favoris :", error.message);
      }
    };

    fetchUserAndFavorites();
  }, []);

  const handleArticle = (article) => {
    router.push({
      pathname: "/article",
      params: {
        title: article.title,
        author: article.author,
        image: article.image,
        content: article.content || "", // ou vide si absent
        url: article.url,
        category: article.category,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorite</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {favorites.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 30 }}>
            Aucun article ajouté en favori.
          </Text>
        ) : (
          favorites.map((article, index) => (
            <TouchableOpacity
              onPress={() => handleArticle(article)}
              key={index}
              style={styles.card}
            >
              <Image
                source={{ uri: article.image }}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.infoContainer}>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.author}>By {article.author}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
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
