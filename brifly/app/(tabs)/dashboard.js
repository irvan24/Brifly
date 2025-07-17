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

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [ongoingCourses, setOngoingCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch authenticated user
  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (!error) setUser(data.user);
  };

  // Fetch dynamic data once user is available
  const fetchData = async () => {
    setLoading(true);
    // Categories
    const { data: cats, error: catsError } = await supabase
      .from("Categories")
      .select("name");
    if (!catsError) setCategories(cats.map((c) => c.name));

    // Featured courses
    const { data: featured, error: fError } = await supabase
      .from("Categories")
      .select("name");
    if (!catsError) setCategories(cats.map((c) => c.name));

    // Ongoing courses for this user
    const { data: ongoing, error: oError } = await supabase
      .from("courses")
      .select("*")
      .eq("is_ongoing", true)
      .eq("user_id", user.id);
    if (!oError) setOngoingCourses(ongoing);

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
                uri:
                  user.user_metadata.avatar_url || "https://i.pravatar.cc/100",
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
            <Ionicons name="notifications-outline" size={24} color="white" />
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
              {categories.map((name, idx) => (
                <View
                  key={idx}
                  style={[styles.featureCard, { backgroundColor: "black" }]}
                >
                  <TouchableOpacity style={styles.heartIcon}>
                    <Ionicons name="heart-outline" size={18} color="white" />
                  </TouchableOpacity>
                  <Text style={styles.featureTitle}>{name}</Text>
                  <Text style={styles.featureSub}>8 lessons</Text>
                  <Image
                    source={{ uri: "https://via.placeholder.com/36" }}
                    style={styles.featureImage}
                  />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Ongoing */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ongoing</Text>
            {ongoingCourses.length > 0 ? (
              ongoingCourses.map((course, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.ongoingCard}
                  onPress={() => handleArticlePress(course)}
                >
                  <View style={styles.ongoingInfo}>
                    <View
                      style={[
                        styles.courseIconWrapper,
                        { backgroundColor: course.color },
                      ]}
                    >
                      <Image
                        source={{ uri: course.icon }}
                        style={styles.courseIcon}
                      />
                    </View>
                    <View>
                      <Text style={styles.courseTitle}>{course.title}</Text>
                      <Text style={styles.courseAuthor}>{course.author}</Text>
                      <Text style={styles.courseLessons}>
                        {course.lessons} lessons
                      </Text>
                    </View>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progress,
                        { width: `${course.progress}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {course.progress}% complete
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Aucun cours en cours</Text>
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
