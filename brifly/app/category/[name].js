import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "../../lib/SupabaseClient"; // adapte le chemin si nécessaire
import Constants from "expo-constants";

export default function CategoryArticles() {
  const { name } = useLocalSearchParams();
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_KEY = Constants.expoConfig.extra.NEWS_API_KEY;

  useEffect(() => {
    if (!name) return;
    console.log("Nom de la catégorie:", name);

    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await fetch(
            `https://newsapi.org/v2/everything?q=${encodeURIComponent(name)}&language=fr&pageSize=10&apiKey=${API_KEY}`            );
        const json = await response.json();
  
        if (json.status === "ok") {
          // on structure les articles pour ton UI
          const formatted = json.articles.map((item, idx) => ({
            id: idx,
            title: item.title,
            author: item.author || "Auteur inconnu",
            image: item.urlToImage || "https://via.placeholder.com/600x400",
            url: item.url,
            description: item.description || "Pas de description disponible.",
            content: item.content || "Pas de contenu disponible.",
            progress: Math.floor(Math.random() * 100),
          }));
          setArticles(formatted);
          console.log("Réponse JSON NewsAPI:", json);
        } else {
          console.error("Erreur API:", json);
        }
      } catch (err) {
        console.error("Erreur fetch:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchArticles();
  }, [name]);

  return (
    <View style={styles.container}>
      {/* App Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{name}</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {articles.length > 0 ? (
            articles.map((article) => (
              <TouchableOpacity
                key={article.id}
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: "/article",
                    params: {
                      title: article.title,
                      author: article.author,
                      image: article.image || "https://via.placeholder.com/600x400",
                      description: article.description,
                      content: article.content,
                      url: article.url,
                    },
                  })
                }
              >
                <Image
                  source={{ uri: article.image || "https://via.placeholder.com/600x400" }}
                  style={styles.image}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.articleTitle} numberOfLines={2}>
                    {article.title}
                  </Text>
                  <Text style={styles.author}>Par {article.author}</Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${article.progress || 0}%` },
                      ]}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={{ padding: 20 }}>
              <Text style={{ color: "#666", fontSize: 16 }}>
                Aucun article trouvé pour cette catégorie.
              </Text>
            </View>
          )}
        </ScrollView>
      )}
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