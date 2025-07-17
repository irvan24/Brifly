import React from "react";
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
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ArticleScreen() {
  const router = useRouter();
  const { title, author, image } = useLocalSearchParams();

  const fullText = `
Dans un monde de plus en plus connecté, la capacité d'apprendre rapidement et efficacement est devenue un atout essentiel. Ce guide explore les principes fondamentaux de l'apprentissage en profondeur, des techniques de mémorisation aux stratégies de concentration.

L’apprentissage ne se résume pas à absorber des informations ; il s'agit de structurer ses idées, pratiquer régulièrement, et maintenir une curiosité constante. Prenons l’exemple de la méthode Feynman, qui consiste à expliquer un concept de manière simple pour mieux l’assimiler. Cette technique, combinée à des sessions de révision espacées, permet de retenir durablement.

D'autres approches incluent la technique Pomodoro pour améliorer la concentration, ou encore le mind mapping pour organiser visuellement ses connaissances. Mais la clé réside dans l'engagement actif de l'apprenant : poser des questions, faire des liens entre les idées, tester ses connaissances.

En fin de compte, apprendre est un processus dynamique. Ce n'est pas une course, mais un voyage. Il faut accepter de se tromper, d’oublier parfois, pour mieux réapprendre ensuite. La motivation joue aussi un rôle central : plus le sujet vous passionne, plus votre cerveau sera enclin à le retenir.

Alors que le monde évolue, le véritable super-pouvoir est de savoir apprendre, désapprendre, et réapprendre. Que ce soit pour acquérir une nouvelle compétence ou approfondir un domaine existant, l'apprentissage intentionnel transforme la manière dont nous vivons, travaillons, et pensons.
`;

  const handleReadMore = () => {
    alert("Lire l'article complet !");
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
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert("Ajouté aux favoris")} style={styles.iconButton}>
              <Ionicons name="heart-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* Contenu */}
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.author}>by {author}</Text>

          <Text style={styles.fullText}>{fullText}</Text>

          <TouchableOpacity style={styles.readMoreButton} onPress={handleReadMore}>
            <Text style={styles.readMoreText}>Lire l'article complet</Text>
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