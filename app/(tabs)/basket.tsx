import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flower2, Plus, Calendar, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

// Mock data for petals
const mockPetals = [
  {
    id: '1',
    text: 'Grateful for the warm coffee that started my morning perfectly',
    aiResponse: 'What a beautiful way to appreciate life\'s simple pleasures! ☕',
    date: '2024-01-15',
    time: '8:30 AM',
  },
  {
    id: '2',
    text: 'My friend surprised me with a thoughtful message today',
    aiResponse: 'Friendship is one of life\'s greatest gifts. How wonderful! 💝',
    date: '2024-01-15',
    time: '2:15 PM',
  },
  {
    id: '3',
    text: 'The sunset painted the sky in the most incredible colors',
    aiResponse: 'Nature\'s artistry never fails to inspire wonder. What a moment! 🌅',
    date: '2024-01-14',
    time: '6:45 PM',
  },
];

export default function BasketScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Petal Basket</Text>
          <Text style={styles.subtitle}>Your collection of gratitude</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/gratitude')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FFE5E5', '#FFD1D1']}
            style={styles.addButtonGradient}
          >
            <Plus size={24} color="#E63946" strokeWidth={2} />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsContainer}>
          <LinearGradient
            colors={['#FFF5F5', '#FFE8E8']}
            style={styles.statsGradient}
          >
            <View style={styles.statsContent}>
              <Flower2 size={32} color="#E63946" strokeWidth={2} />
              <Text style={styles.statsNumber}>{mockPetals.length}</Text>
              <Text style={styles.statsLabel}>Petals collected</Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.petalsContainer}>
          {mockPetals.map((petal) => (
            <TouchableOpacity key={petal.id} style={styles.petalCard} activeOpacity={0.9}>
              <LinearGradient
                colors={['#FFFFFF', '#FFF8F8']}
                style={styles.petalGradient}
              >
                <View style={styles.petalHeader}>
                  <Flower2 size={20} color="#E63946" strokeWidth={2} />
                  <View style={styles.dateContainer}>
                    <Calendar size={16} color="#8B7355" strokeWidth={2} />
                    <Text style={styles.dateText}>{petal.time}</Text>
                  </View>
                </View>
                
                <Text style={styles.petalText}>{petal.text}</Text>
                
                <View style={styles.aiResponseContainer}>
                  <Heart size={16} color="#E63946" strokeWidth={2} />
                  <Text style={styles.aiResponseText}>{petal.aiResponse}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {mockPetals.length === 0 && (
          <View style={styles.emptyState}>
            <Flower2 size={64} color="#E5DDD5" strokeWidth={1} />
            <Text style={styles.emptyTitle}>Your basket is empty</Text>
            <Text style={styles.emptySubtitle}>
              Start your gratitude journey by adding your first petal
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => router.push('/gratitude')}
              activeOpacity={0.8}
            >
              <Text style={styles.emptyButtonText}>Add First Petal</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  title: {
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
  addButton: {
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  addButtonGradient: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
  },
  statsContainer: {
    marginBottom: 24,
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
  statsGradient: {
    padding: 24,
  },
  statsContent: {
    alignItems: 'center',
  },
  statsNumber: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#E63946',
    marginTop: 8,
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#8B7355',
  },
  petalsContainer: {
    gap: 16,
  },
  petalCard: {
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
  petalGradient: {
    padding: 20,
  },
  petalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8B7355',
  },
  petalText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2F3E46',
    lineHeight: 24,
    marginBottom: 16,
  },
  aiResponseContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FFF5F5',
    padding: 12,
    borderRadius: 12,
  },
  aiResponseText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#E63946',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#4A5D39',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#8B7355',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  emptyButton: {
    backgroundColor: '#E63946',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});