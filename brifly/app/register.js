import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
//import { supabase } from '../lib/supabaseClient';

export default function RegisterScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    // const { error } = await supabase.auth.signUp({
    //   email,
    //   password,
    // });

    if (error) {
      Alert.alert('Erreur', error.message);
    } else {
      Alert.alert('Succès', 'Un lien de confirmation a été envoyé à ton email.');
      router.push('/LoginPage');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>S’inscrire</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/LoginPage')}>
        <Text style={styles.linkText}>Déjà un compte ? Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0e0e0e',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    title: {
      fontSize: 28,
      color: '#fff',
      marginBottom: 24,
      fontWeight: 'bold',
    },
    input: {
      width: '100%',
      backgroundColor: '#1e1e1e',
      borderRadius: 8,
      padding: 14,
      color: '#fff',
      marginBottom: 12,
    },
    button: {
      width: '100%',
      backgroundColor: '#ffcc82',
      padding: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 8,
    },
    buttonText: {
      fontWeight: 'bold',
      color: '#000',
    },
    linkText: {
      color: '#ccc',
      marginTop: 16,
      textDecorationLine: 'underline',
    },
  });