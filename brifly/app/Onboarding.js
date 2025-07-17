import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function OnboardingScreen() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/app/start');
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>Bienvenue sur Brifly</Text>
      <Text style={styles.subtitle}>
        Apprends sur n’importe quel sujet en 5 minutes. Résumés, articles complets, favoris — tout est là.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Commencer</Text>
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
    image: {
      width: 250,
      height: 250,
      marginBottom: 32,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 16,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: '#ccc',
      textAlign: 'center',
      marginBottom: 32,
    },
    button: {
      backgroundColor: '#ffcc82',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 8,
    },
    buttonText: {
      fontWeight: 'bold',
      fontSize: 16,
      color: '#000',
    },
  });