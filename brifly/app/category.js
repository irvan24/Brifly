import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../lib/SupabaseClient";

const colors = [
  "#FDE68A", "#BFDBFE", "#FCA5A5", "#C4B5FD", "#6EE7B7", "#FCD34D",
  "#F9A8D4", "#93C5FD", "#FECACA", "#A5F3FC"
];

const emojiMap = {
  Santé: "🏥",
  Technologies: "🧠",
  Economy: "💰",
  Politics: "📈",
  Voyage: "✈️",
  Alimentation: "🍎",
  Education: "🎓",
  Divertissement: "🎬",
  Sciences: "🧪",
  Recent: "⌛️",
  Art: "🎨",
  Design: "🧑‍🎨",
};

export default function Category() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("Categories")
        .select("*");

      if (!error) {
        setCategories(data);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Catégories</Text>
      </View>

      {/* Grid */}
      <ScrollView contentContainerStyle={styles.grid}>
        {categories.map((cat, index) => {
          const emoji = emojiMap[cat.name] || "📚";
          return (
            <TouchableOpacity
              key={index}
              style={[styles.card, { backgroundColor: colors[index % colors.length] }]}
              onPress={() => router.push(`/category/${cat.name.toLowerCase()}`)}
            >
              <Text style={styles.emoji}>{emoji}</Text>
              <Text style={styles.cardTitle}>{cat.name}</Text>
              <Text style={styles.cardDescription}>
                {cat.description || "Aucune description"}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - 60) / 2; // deux colonnes + margin

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
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    paddingRight: 10,
  },
  backText: {
    fontSize: 28,
    color: "#1C1C1E",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  card: {
    width: cardWidth,
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    fontSize: 32,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C1C1E",
    textAlign: "center",
  },
  cardDescription: {
    fontSize: 13,
    color: "#4B5563",
    textAlign: "center",
    marginTop: 4,
  },
});