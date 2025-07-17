import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../lib/SupabaseClient";

export default function Category() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("Categories")
        .select("name"); // ou icon, selon ce que tu as

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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Catégories</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {categories.map((cat, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => router.push(`/category/${cat.name.toLowerCase()}`)}
          >
            <Text style={styles.emoji}>{cat.emoji || "📚"}</Text>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{cat.name}</Text>
              <Text style={styles.cardDescription}>
                {cat.description || "Aucune description"}
              </Text>
            </View>
            <Text style={styles.arrow}>›</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    backgroundColor: "#FFFFFF",
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
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F5",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  emoji: {
    fontSize: 26,
    marginRight: 15,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  cardDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  arrow: {
    fontSize: 20,
    color: "#9CA3AF",
  },
});