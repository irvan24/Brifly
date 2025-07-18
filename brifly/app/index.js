import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

export default function OnboardingScreen() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/start');
  };

  return (
    <ImageBackground
      source={require('./bg.png')} // ✅ image de fond locale
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.top}>
          <Image
            source={('./logo.png')} // ✅ logo local
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.bottom}>
          <Text style={styles.title}>Bienvenue sur Brifly</Text>
          <Text style={styles.subtitle}>
            Apprends sur n’importe quel sujet en 5 minutes. Résumés, articles complets, favoris — tout est là.
          </Text>

          <TouchableOpacity style={styles.button} onPress={handleStart}>
            <Text style={styles.buttonText}>Commencer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 24,
    justifyContent: 'space-between',
  },
  top: {
    alignItems: 'center',
    marginTop: 60,
  },
  bottom: {
    alignItems: 'center',
    marginBottom: 60,
  },
  image: {
    width: 200,
    height: 200,
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