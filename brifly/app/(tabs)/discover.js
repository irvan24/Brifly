import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const API_KEY = "9091f0c576704bcaa10cf2329f94883a"

const categories = [
  { label: "Tous", color: "#1C1C1E", icon: "apps" },
  { label: "Productivité", color: "#3b82f6", icon: "flash" },
  { label: "Technologie", color: "#8b5cf6", icon: "laptop" },
  { label: "Santé", color: "#10b981", icon: "heart" },
  { label: "Business", color: "#f59e0b", icon: "briefcase" },
  { label: "Lifestyle", color: "#ef4444", icon: "cafe" },
];

const featured = [
  {
    id: 1,
    title: "5 habitudes des gens ultra-productifs",
    image: "https://source.unsplash.com/random/400x300/?productivity",
    author: "Marie Dupont",
    duration: "5 min",
    category: "Productivité",
    views: "12.3k",
    rating: 4.8,
    isBookmarked: false,
  },
  {
    id: 2,
    title: "Les bases de l'IA en 5 minutes",
    image: "https://source.unsplash.com/random/400x300/?ai",
    author: "Alex Martin",
    duration: "4 min",
    category: "Technologie",
    views: "8.7k",
    rating: 4.6,
    isBookmarked: true,
  },
  {
    id: 3,
    title: "Méditation pour débutants",
    image: "https://source.unsplash.com/random/400x300/?meditation",
    author: "Sophie Chen",
    duration: "7 min",
    category: "Santé",
    views: "15.2k",
    rating: 4.9,
    isBookmarked: false,
  },
];

const quickActions = [
  { title: "Continuer la lecture", icon: "book", color: "#3b82f6" },
  { title: "Mes favoris", icon: "heart", color: "#ef4444" },
  { title: "Tendances", icon: "trending-up", color: "#10b981" },
  { title: "Historique", icon: "time", color: "#f59e0b" },
];

const suggestions = [
  "Comment apprendre plus vite ?",
  "Comprendre les crypto-monnaies",
  "Le sommeil et la concentration",
  "Les bases de la psychologie humaine",
  "Gérer son stress au travail",
  "L'art de la négociation",
];


export default function Discover() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [randomSuggestion, setRandomSuggestion] = useState(
    suggestions[Math.floor(Math.random() * suggestions.length)]
  );
  const [bookmarks, setBookmarks] = useState(new Set([2]));
  const [fadeAnim] = useState(new Animated.Value(1));
  const [articles, setArticles] = useState([]);



  const toggleBookmark = (id) => {
    const newBookmarks = new Set(bookmarks);
    if (newBookmarks.has(id)) {
      newBookmarks.delete(id);
    } else {
      newBookmarks.add(id);
    }
    setBookmarks(newBookmarks);
  };

  const refreshSuggestion = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setRandomSuggestion(
      suggestions[Math.floor(Math.random() * suggestions.length)]
    );
  };

  const renderQuickAction = ({ item }) => (
    <TouchableOpacity style={styles.quickAction}>
      <View
        style={[styles.quickActionIcon, { backgroundColor: item.color + "22" }]}
      >
        <Ionicons name={item.icon} size={20} color={item.color} />
      </View>
      <Text style={styles.quickActionText}>{item.title}</Text>
    </TouchableOpacity>
  );


  const fetchArticles = async (category = "general") => {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=fr&category=${category}&pageSize=15&apiKey=${API_KEY}`
      );
      const json = await response.json();
  
      if (json.status === "ok") {
        const filteredArticles = json.articles
          .filter((item) => item.title && item.urlToImage)
          .map((item, index) => ({
            id: index,
            title: item.title,
            image: item.urlToImage || "https://source.unsplash.com/random/400x300",
            author: item.author || "Auteur inconnu",
            category: category,
            views: Math.floor(Math.random() * 10000) + " vues",
            rating: (Math.random() * 1 + 4).toFixed(1),
            isBookmarked: false,
          }));
  
        // Séparer les articles entre featured (5 max) et discover (10 max)
        setFeaturedArticles(filteredArticles.slice(0, 5));
        setDiscoverArticles(filteredArticles.slice(5, 15));
      } else {
        console.error("NewsAPI Error", json);
        setFeaturedArticles([]);
        setDiscoverArticles([]);
      }
    } catch (err) {
      console.error("API Fetch Error", err);
      setFeaturedArticles([]);
      setDiscoverArticles([]);
    }
  };
  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    if (selectedCategory === "Tous") {
      fetchArticles();
    } else {
      const categoryMap = {
        Productivité: "business",
        Technologie: "technology",
        Santé: "health",
        Business: "business",
        Lifestyle: "entertainment",
      };
  
      fetchArticles(categoryMap[selectedCategory] || "general");
    }
  }, [selectedCategory]);
  
  
  

  const renderFeaturedCard = ({ item }) => (
    <TouchableOpacity
      style={styles.featuredCard}
      onPress={() =>
        router.push({
          pathname: "/ArticleScreen",
          params: {
            title: item.title,
            author: item.author,
            image: item.image,
          },
        })
      }
    >
      <Image source={{ uri: item.image }} style={styles.featuredImage} />
      <View style={styles.featuredOverlay}>
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredBadgeText}>{item.category}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={() => toggleBookmark(item.id)}
        >
          <Ionicons
            name={bookmarks.has(item.id) ? "heart" : "heart-outline"}
            size={20}
            color={bookmarks.has(item.id) ? "#ef4444" : "#fff"}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.featuredContent}>
        <Text style={styles.featuredTitle}>{item.title}</Text>
        <View style={styles.featuredMeta}>
          <Text style={styles.featuredAuthor}>{item.author}</Text>
          <View style={styles.featuredStats}>
            <Ionicons name="star" size={12} color="#f59e0b" />
            <Text style={styles.featuredRating}>{item.rating}</Text>
            <Text style={styles.featuredViews}>• {item.views} vues</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Discover</Text>
          </View>
          
        </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#8E8E93" />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un sujet..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#8E8E93"
            />
          </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((cat, index) => (
           <TouchableOpacity
           key={index}
           activeOpacity={0.85}
           onPress={() => setSelectedCategory(cat.label)}
           style={[
             styles.categoryTag,
             {
               backgroundColor:
                 selectedCategory === cat.label
                   ? cat.color
                   : cat.color + "15", // plus doux
               shadowOpacity: selectedCategory === cat.label ? 0.25 : 0.1,
               transform: [{ scale: selectedCategory === cat.label ? 1.05 : 1 }],
             },
           ]}
         >
           <Ionicons
             name={cat.icon}
             size={16}
             color={selectedCategory === cat.label ? "#fff" : cat.color}
             style={{ marginRight: 6 }}
           />
           <Text
             style={[
               styles.categoryText,
               {
                 color: selectedCategory === cat.label ? "#fff" : cat.color,
               },
             ]}
           >
             {cat.label}
           </Text>
         </TouchableOpacity>
         
          ))}
        </ScrollView>

        {/* Featured Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 À la une</Text>
          <FlatList
            data={articles}
            renderItem={renderFeaturedCard}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredContainer}
            snapToInterval={width * 0.85}
            decelerationRate="fast"
          />
        </View>

        {/* Suggestion aléatoire */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Inspiration du moment</Text>
          <View style={styles.suggestionCard}>
            <View style={styles.suggestionIconContainer}>
              <Ionicons name="bulb" size={24} color="#f59e0b" />
            </View>
            <Animated.View
              style={[styles.suggestionContent, { opacity: fadeAnim }]}
            >
              <Text style={styles.suggestionText}>{randomSuggestion}</Text>
            </Animated.View>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={refreshSuggestion}
            >
              <Ionicons name="refresh" size={20} color="#3b82f6" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Trending Topics */}
        {/* Articles suggérés */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📰 Sujets à découvrir</Text>
          {featured.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.articleItem}
              onPress={() =>
                router.push({
                  pathname: "/ArticleScreen",
                  params: {
                    title: item.title,
                    author: item.author,
                    image: item.image,
                  },
                })
              }
            >
              <Image source={{ uri: item.image }} style={styles.articleImage} />
              <View style={styles.articleContent}>
                <Text style={styles.articleCategory}>{item.category}</Text>
                <Text style={styles.articleTitle}>{item.title}</Text>
                <View style={styles.articleMeta}>
                  <Text style={styles.articleAuthor}>{item.author}</Text>
                  <Text style={styles.articleDate}>• 27 fév. 2023</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  greeting: {
    fontSize: 16,
    color: "#8E8E93",
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  searchButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#1C1C1E",
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 16,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
  },
  quickAction: {
    alignItems: "center",
    marginRight: 24,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1C1C1E",
    textAlign: "center",
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  categoryTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#F2F2F7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    transition: "all 0.2s ease-in-out", // ignoré en natif mais utile pour web
  },
  
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  featuredContainer: {
    paddingHorizontal: 20,
  },
  featuredCard: {
    width: width * 0.8,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginRight: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  featuredImage: {
    width: "100%",
    height: 200,
  },
  featuredOverlay: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  featuredBadge: {
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  featuredBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  bookmarkButton: {
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 8,
    borderRadius: 20,
  },
  featuredContent: {
    padding: 16,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 8,
    lineHeight: 24,
  },
  featuredMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  featuredAuthor: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
  },
  featuredStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  featuredRating: {
    fontSize: 12,
    color: "#f59e0b",
    marginLeft: 4,
    fontWeight: "600",
  },
  featuredViews: {
    fontSize: 12,
    color: "#8E8E93",
    marginLeft: 4,
  },
  suggestionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  suggestionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF7ED",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    lineHeight: 22,
  },
  refreshButton: {
    padding: 8,
  },
  trendingContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  trendingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  trendingRank: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3b82f6",
    width: 32,
  },
  trendingTopic: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginLeft: 12,
  },


  articleItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  articleImage: {
    width: 80,
    height: 80,
  },
  articleContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  articleCategory: {
    fontSize: 12,
    color: "#3b82f6",
    marginBottom: 2,
    fontWeight: "600",
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  articleMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  articleAuthor: {
    fontSize: 12,
    color: "#666",
  },
  articleDate: {
    fontSize: 12,
    color: "#aaa",
    marginLeft: 6,
  },
});
