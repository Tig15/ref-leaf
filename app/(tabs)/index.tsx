import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flower2, Leaf, TreePine, Sun, Moon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';

export default function HomeScreen() {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.subtitle}>How are you feeling today?</Text>
          </View>
          {new Date().getHours() < 18 ? (
            <Sun size={32} color="#F4A261" strokeWidth={2} />
          ) : (
            <Moon size={32} color="#E76F51" strokeWidth={2} />
          )}
        </View>

        {/* Daily Quote */}
        <View style={styles.quoteCard}>
          <LinearGradient
            colors={['#F7F3E9', '#EDE7DA']}
            style={styles.quoteGradient}
          >
            <Text style={styles.quoteText}>
              "Growth begins the moment you embrace both your light and your shadows."
            </Text>
          </LinearGradient>
        </View>

        {/* Journal Options */}
        <View style={styles.journalSection}>
          <Text style={styles.sectionTitle}>Choose your reflection</Text>
          
          {/* Gratitude Button */}
          <TouchableOpacity 
            style={styles.journalButton}
            onPress={() => router.push('/gratitude')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FFE5E5', '#FFD1D1']}
              style={styles.buttonGradient}
            >
              <View style={styles.buttonContent}>
                <View style={styles.iconContainer}>
                  <Flower2 size={28} color="#E63946" strokeWidth={2} />
                </View>
                <View style={styles.buttonText}>
                  <Text style={styles.buttonTitle}>Gratitude</Text>
                  <Text style={styles.buttonSubtitle}>Plant a petal of appreciation</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Thoughts Button */}
          <TouchableOpacity 
            style={styles.journalButton}
            onPress={() => router.push('/thoughts')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#E8F5E8', '#D4E6D4']}
              style={styles.buttonGradient}
            >
              <View style={styles.buttonContent}>
                <View style={styles.iconContainer}>
                  <Leaf size={28} color="#2D6A2D" strokeWidth={2} />
                </View>
                <View style={styles.buttonText}>
                  <Text style={styles.buttonTitle}>Thoughts</Text>
                  <Text style={styles.buttonSubtitle}>Nurture your inner garden</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Accomplishments Button */}
          <TouchableOpacity 
            style={styles.journalButton}
            onPress={() => router.push('/accomplishments')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#E6F3FF', '#D1E9FF']}
              style={styles.buttonGradient}
            >
              <View style={styles.buttonContent}>
                <View style={styles.iconContainer}>
                  <TreePine size={28} color="#1E3A8A" strokeWidth={2} />
                </View>
                <View style={styles.buttonText}>
                  <Text style={styles.buttonTitle}>Accomplishments</Text>
                  <Text style={styles.buttonSubtitle}>Grow your forest of achievements</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Stats Preview */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your growth today</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Flower2 size={16} color="#E63946" strokeWidth={2} />
              <Text style={styles.statText}>3 petals</Text>
            </View>
            <View style={styles.statItem}>
              <Leaf size={16} color="#2D6A2D" strokeWidth={2} />
              <Text style={styles.statText}>2 plants</Text>
            </View>
            <View style={styles.statItem}>
              <TreePine size={16} color="#1E3A8A" strokeWidth={2} />
              <Text style={styles.statText}>1 tree</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#4A5D39',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#8B7355',
  },
  quoteCard: {
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  quoteGradient: {
    padding: 20,
  },
  quoteText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#4A5D39',
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  journalSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#4A5D39',
    marginBottom: 20,
  },
  journalButton: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonGradient: {
    padding: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  buttonText: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2F3E46',
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7556',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  statsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#4A5D39',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7556',
  },
});