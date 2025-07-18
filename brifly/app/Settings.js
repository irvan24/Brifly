import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../lib/SupabaseClient";
export default function Settings() {
  const router = useRouter();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);

  const menuItems = [
    {
      icon: "📊",
      title: "Mes statistiques",
      subtitle: "Voir mes progrès détaillés",
    },
    { icon: "🔔", title: "Notifications", subtitle: "Gérer les notifications" },
    { icon: "❓", title: "Aide & Support", subtitle: "FAQ et contact" },
    { icon: "⭐", title: "Noter l'app", subtitle: "Donnez-nous votre avis" },
  ];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erreur lors de la déconnexion :", error.message);
    } else {
      router.replace("/login"); // redirige vers la page de login (à adapter selon ton app)
    }
  };

  return (
    <View style={styles.container}>
      {/* App Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Paramètres</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>⚙️ Paramètres rapides</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingTitle}>Notifications</Text>
            <Text style={styles.settingSubtitle}>
              Recevoir des rappels quotidiens
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: "#d1d5db", true: "#facc15" }}
            thumbColor={notificationsEnabled ? "#000" : "#ccc"}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingTitle}>Mode sombre</Text>
            <Text style={styles.settingSubtitle}>Thème sombre activé</Text>
          </View>
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
            trackColor={{ false: "#d1d5db", true: "#facc15" }}
            thumbColor={darkModeEnabled ? "#000" : "#ccc"}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingTitle}>Lecture automatique</Text>
            <Text style={styles.settingSubtitle}>
              Passer au prochain article
            </Text>
          </View>
          <Switch
            value={autoPlayEnabled}
            onValueChange={setAutoPlayEnabled}
            trackColor={{ false: "#d1d5db", true: "#facc15" }}
            thumbColor={autoPlayEnabled ? "#000" : "#ccc"}
          />
        </View>

        {/* Menu principal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 Plus d'options</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bouton logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Brifly v1.0.0</Text>
        </View>
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
  content: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 15,
    marginTop: 30,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  settingLeft: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: "#1C1C1E",
    fontWeight: "600",
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  section: {
    marginTop: 20,
    marginBottom: 25,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    color: "#1C1C1E",
    fontWeight: "600",
  },
  menuSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  menuArrow: {
    fontSize: 20,
    color: "#9CA3AF",
  },
  logoutButton: {
    backgroundColor: "#facc15",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  logoutText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  versionContainer: {
    alignItems: "center",
    paddingBottom: 30,
  },
  versionText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});
