import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { HelpyMark } from '../components/HelpyMark'
import { clearSession } from '../lib/session'

export default function HomePlaceholderScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <HelpyMark size={108} />
        <Text style={styles.title}>You’re signed in</Text>
        <Text style={styles.body}>The native Home screen is the next screen to build. This temporary destination only proves the persistent OTP session works.</Text>
        <Pressable onPress={() => void clearSession().then(() => router.replace('/sign-in'))} style={styles.button}>
          <Text style={styles.buttonText}>Sign out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f4f8ff' },
  screen: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: 28 },
  title: { color: '#101b3d', fontSize: 28, fontWeight: '800', marginTop: 22 },
  body: { color: '#64748b', fontSize: 16, lineHeight: 24, marginTop: 12, maxWidth: 330, textAlign: 'center' },
  button: { borderColor: '#0967ff', borderRadius: 14, borderWidth: 1, marginTop: 32, paddingHorizontal: 22, paddingVertical: 14 },
  buttonText: { color: '#0967ff', fontSize: 15, fontWeight: '800' },
})
