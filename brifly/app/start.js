import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

export default function StartScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo ou illustration */}
      <Image
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Welcome to Brifly</Text>
      <Text style={styles.subtitle}>Learn fast.</Text>

      <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/login')}>
        <Text style={styles.primaryText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/register')}>
        <Text style={styles.secondaryText}>SignUp</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0e0e0e',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    logo: {
      width: 200,
      height: 200,
      marginBottom: 32,
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 12,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: '#aaa',
      marginBottom: 48,
      textAlign: 'center',
    },
    primaryButton: {
      backgroundColor: '#ffcc82',
      paddingVertical: 14,
      paddingHorizontal: 48,
      borderRadius: 8,
      marginBottom: 16,
      width: '100%',
      alignItems: 'center',
    },
    primaryText: {
      fontWeight: 'bold',
      fontSize: 16,
      color: '#000',
    },
    secondaryButton: {
      borderColor: '#888',
      borderWidth: 1,
      borderRadius: 8,
      paddingVertical: 14,
      paddingHorizontal: 48,
      width: '100%',
      alignItems: 'center',
    },
    secondaryText: {
      fontSize: 16,
      color: '#fff',
    },
  });