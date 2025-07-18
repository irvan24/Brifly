import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

export default function OnboardingScreen() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/app/start');
  };

  return (
    <ImageBackground
      source={{ uri: './bg.png' }} // tu peux remplacer par ton image
      style={styles.container}
      resizeMode="cover"
    >
      <Image
        source={{ uri: 'https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png' }} // ajoute ton logo si tu veux
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>Bienvenue sur Brifly</Text>
      <Text style={styles.subtitle}>
        Apprends sur n’importe quel sujet en 5 minutes. Résumés, articles complets, fdavoris — tout est là.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Commencer</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: '#eee',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 10,
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