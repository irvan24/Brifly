import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  Platform,
  StatusBar,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/SupabaseClient"; // ajuste le chemin si besoin

export default function ArticleScreen() {
  const router = useRouter();
  const { title, author, image, content, url, category, description} = useLocalSearchParams();
  const [isFavorited, setIsFavorited] = useState(false);
  const [user, setUser] = useState(null);

  const decodedUrl = decodeURIComponent(url); // pour s'assurer qu'il est lisible

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    };
    fetchUser();
  }, []);

//   useEffect(() => {
//     const logUserTopicView = async () => {
//       if (!user || !category) return;
  
//       const { error } = await supabase.from("UserTopics").upsert({
//         user_id: user.id,
//         topic_name: category,
//         viewed_at: new Date().toISOString(),
//       });
  
//       if (error) {
//         console.log("❌ Erreur en enregistrant la vue :", error.message);
//       } else {
//         console.log("📚 Vue de la catégorie enregistrée :", category);
//       }
//     };
  
//     logUserTopicView();
//   }, [user, category]);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!user || !decodedUrl) return;

      const { data, error } = await supabase
        .from("Favorites")
        .select("*")
        .eq("user_id", user.id)
        .eq("url", decodedUrl)
        .single();

      if (data) setIsFavorited(true);
    };
    checkFavorite();
  }, [user, decodedUrl]);

  const toggleFavorite = async () => {
    if (!user) return alert("Connecte-toi pour ajouter en favori.");
    console.log("✅ Utilisateur connecté :", user.email);
    console.log("URL article :", decodedUrl);
  
    if (isFavorited) {
      const { error } = await supabase
        .from("Favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("url", decodedUrl);
  
      if (error) {
        console.log("❌ Erreur lors de la suppression :", error.message);
      } else {
        console.log("🗑️ Article supprimé des favoris !");
        setIsFavorited(false);
      }
    } else {
      const { error } = await supabase.from("Favorites").insert([
        {
          user_id: user.id,
          title,
          author,
          image,
          url: decodedUrl,
          category,
        },
      ]);
  
      if (error) {
        console.log("❌ Erreur lors de l’ajout :", error.message);
      } else {
        console.log("❤️ Article ajouté en favori !");
        setIsFavorited(true);
      }
    }
  };
  

  const handleReadMore = async () => {
    console.log("🔍 user:", user);
console.log("🔍 category:", category);
console.log("🔍 url:", decodedUrl);
    if (decodedUrl) {
      // Enregistrement du topic consulté uniquement au clic
      if (user && category) {
        const { error } = await supabase.from("UserTopics").insert([{
            user_id: user.id,
            topic_name: category,
            viewed_at: new Date().toISOString(),
          }]);
  
        if (error) {
          console.log("❌ Erreur en enregistrant la vue (Read More) :", error.message);
        } else {
          console.log("📚 Vue enregistrée via bouton 'Read More' :", category);
        }
      }
  
      Linking.openURL(decodedUrl);
    } else {
      alert("Lien indisponible");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={{ uri: image }}
          style={styles.imageBackground}
          resizeMode="cover"
        >
          <View style={styles.imageOverlay} />

          {/* App Bar */}
          <View style={styles.appBar}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.iconButton}
            >
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleFavorite} style={styles.iconButton}>
              <Ionicons
                name={isFavorited ? "heart" : "heart-outline"}
                size={24}
                color={isFavorited ? "#ef4444" : "#fff"}
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* Contenu */}
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.author}>by {author}</Text>
          <Text style={styles.fullText}>{content || "Contenu non disponible pour cet article."}</Text>

          <TouchableOpacity style={styles.readMoreButton} onPress={handleReadMore}>
            <Text style={styles.readMoreText}>Read the full article</Text>
          </TouchableOpacity>
        </View>
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
  scrollContent: {
    paddingBottom: 60,
  },
  imageBackground: {
    height: 250,
    justifyContent: "flex-start",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  appBar: {
    marginTop: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconButton: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 50,
    padding: 8,
  },
  content: {
    padding: 20,
    marginTop: -20,
    backgroundColor: "#F4F6FA",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 6,
  },
  author: {
    fontSize: 14,
    color: "#6e6e73",
    marginBottom: 20,
  },
  fullText: {
    fontSize: 15,
    lineHeight: 26,
    color: "#333",
    marginBottom: 30,
  },
  readMoreButton: {
    backgroundColor: "#1C1C1E",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  readMoreText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
