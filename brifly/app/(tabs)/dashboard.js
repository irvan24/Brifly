import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/SupabaseClient";
import Constants from "expo-constants";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [ongoingCourses, setOngoingCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [articlesCountByTopic, setArticlesCountByTopic] = useState({});
  const API_KEY = Constants.expoConfig.extra.NEWS_API_KEY;

  // Fetch authenticated user
  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (!error) setUser(data.user);
  };

  // Fetch dynamic data once user is available
  const fetchData = async () => {
    if (!user) return;
    setLoading(true);

    const { data: topicsViewed, error: tError } = await supabase
      .from("UserTopics")
      .select("topic_name")
      .eq("user_id", user.id)
      .order("viewed_at", { ascending: false });

    if (!tError && topicsViewed.length > 0) {
      console.log("🔍 Topics vus :", topicsViewed);

      const uniqueTopics = [
        ...new Set(topicsViewed.map((t) => t.topic_name)),
      ].slice(0, 10);

      const articles = [];

      for (const topic of uniqueTopics) {
        const res = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(
            topic
          )}&language=fr&apiKey=${API_KEY}`
        );
        const result = await res.json();

        if (!res.ok) {
          console.log("❌ Erreur API News:", result);
          continue;
        }

        if (result.articles?.length) {
          articles.push({
            title: result.articles[0].title,
            author: result.articles[0].author,
            url: result.articles[0].url,
            image: result.articles[0].urlToImage,
            topic,
          });

          setArticlesCountByTopic((prev) => ({
            ...prev,
            [topic]: result.articles.length,
          }));
        }
      }

      console.log("📄 Articles récupérés :", articles);
      setOngoingCourses(articles);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const handleFavorites = () => router.push("/favorites");
  const handleArticlePress = (course) =>
    router.push({ pathname: "/article", params: { title: course.title } });
  const handleCategory = () => router.push("/category");

  const handleCategoriesFromDashboard = async (categoryName) => {
    if (!user) return;

    // Enregistre le clic
    const { error } = await supabase.from("UserTopics").upsert([
      {
        user_id: user.id,
        topic_name: categoryName,
        viewed_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error(
        "Erreur lors de l'enregistrement du topic :",
        error.message
      );
    }

    router.push(`/category/${categoryName}`);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.appBar}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{
                uri: "https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png",
              }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.userName}>
                {user.user_metadata.username || "Utilisateur"}
              </Text>
              <Text style={styles.userRole}>{user.email}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleFavorites}>
            <Ionicons name="bookmark" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <View style={styles.sheetContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Search */}
          <View style={styles.searchContainer}>
            <TextInput placeholder="Search courses" style={styles.input} />
            <Feather name="sliders" size={20} color="#666" />
          </View>

          {/* Featured */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <TouchableOpacity onPress={handleCategory}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[
                { name: "Productivité", color: "#3b82f6" },
                { name: "Technologie", color: "#8b5cf6" },
                { name: "Santé", color: "#10b981" },
                { name: "Business", color: "#f59e0b" },
                { name: "Lifestyle", color: "#ef4444" },
              ].map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.featureCard, { backgroundColor: item.color }]}
                  onPress={() => handleCategoriesFromDashboard(item.name)}
                >
                  <TouchableOpacity style={styles.heartIcon}>
                    <Ionicons name="heart-outline" size={18} color="white" />
                  </TouchableOpacity>
                  <Text style={styles.featureTitle}>{item.name}</Text>
                  <Text style={styles.featureSub}>
                    {articlesCountByTopic[item.name] || 0} article
                    {articlesCountByTopic[item.name] > 1 ? "s" : ""}
                  </Text>
                  <Image
                    source={{ uri: "https://via.placeholder.com/36" }}
                    style={styles.featureImage}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Ongoing */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Articles récemment consultés
            </Text>
            {ongoingCourses.length > 0 ? (
              ongoingCourses.map((article, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.ongoingCard}
                  onPress={() =>
                    router.push({
                      pathname: "/article",
                      params: {
                        title: article.title,
                        url: article.url,
                        image: article.image,
                        author: article.author,
                        category: article.topic,
                        content: article.content, // si vide, la page affichera une alerte
                      },
                    })
                  }
                >
                  <View style={styles.ongoingInfo}>
                    <View style={styles.courseIconWrapper}>
                      <Image
                        source={{ uri: article.image }}
                        style={styles.courseIcon}
                      />
                    </View>
                    <View style={{ flexShrink: 1 }}>
                      <Text style={styles.courseTitle}>{article.title}</Text>
                      <Text style={styles.courseAuthor}>
                        {article.author || article.topic}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  Aucun article consulté récemment
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#000" },
  safeArea: { backgroundColor: "#000" },
  appBar: {
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  userName: { fontSize: 18, fontWeight: "bold", color: "white" },
  userRole: { color: "#aaa" },

  scrollContent: { paddingBottom: 30 },
  sheetContainer: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 40,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
  },
  input: { flex: 1, marginRight: 10 },

  tagContainer: { flexDirection: "row", marginBottom: 20 },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#f2f2f2",
  },
  tagText: { color: "#333", textTransform: "capitalize" },

  section: { marginBottom: 25 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  seeAll: { color: "#666", fontSize: 13 },

  featureCard: {
    width: 150,
    height: 120,
    borderRadius: 15,
    padding: 12,
    marginRight: 12,
    justifyContent: "space-between",
  },
  heartIcon: { position: "absolute", top: 10, right: 10 },
  featureTitle: { color: "white", fontSize: 16, fontWeight: "bold" },
  featureSub: { color: "white", fontSize: 13 },
  featureImage: {
    width: 36,
    height: 36,
    position: "absolute",
    bottom: 12,
    right: 12,
  },

  ongoingCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  ongoingInfo: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  courseIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  courseIcon: { width: 24, height: 24 },
  courseTitle: { fontWeight: "bold" },
  courseAuthor: { color: "#666", fontSize: 13 },
  courseLessons: { color: "#888", fontSize: 12 },

  progressBar: {
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    height: 6,
    marginTop: 5,
    overflow: "hidden",
  },
  progress: {
    backgroundColor: "#55c57a",
    height: 6,
    borderRadius: 5,
  },
  progressText: {
    marginTop: 5,
    color: "#999",
    fontSize: 12,
  },

  emptyState: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 15,
  },
  emptyText: { color: "#666", fontSize: 14 },
  categoryCard: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginRight: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
  },

  categoryCardText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
