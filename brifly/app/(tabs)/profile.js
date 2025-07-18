import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/SupabaseClient";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) console.log("Erreur récupération user:", error.message);
      else setUser(user);
    };

    getUser();
  }, []);

  const stats = [
    { value: "12", label: "Articles lus", color: "#6366f1" },
    { value: "45m", label: "Temps total", color: "#10b981" },
    { value: "3", label: "Favoris", color: "#f97316" },
    { value: "7", label: "Série actuelle", color: "#ef4444" },
  ];



  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Profil</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push("/Settings")}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={{ uri: "https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png" + user.id }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user.user_metadata?.username || "Utilisateur"}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.levelContainer}>
          </View>
        </View>

        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statBox}>
              <Text style={[styles.statValue, { color: stat.color }]}> {stat.value} </Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  appBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#ffffff",
    borderBottomColor: "#e5e7eb",
    borderBottomWidth: 1,
  },
  appBarTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
  },
  settingsButton: {
    padding: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 9999,
  },
  settingsIcon: {
    fontSize: 20,
  },
  header: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#ffffff",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 9999,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#6366f1",
  },
  settingsButton: {
    padding: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 9999,
  },
  settingsIcon: {
    fontSize: 20,
  },
  header: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#ffffff",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 9999,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#6366f1",
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  email: {
    fontSize: 14,
    color: "#6b7280",
  },
  levelContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  level: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6366f1",
  },
  joinDate: {
    fontSize: 12,
    color: "#9ca3af",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statBox: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
});