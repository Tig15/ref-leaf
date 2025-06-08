import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Leaf, Sprout, Plus, Sun, Droplets } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

// Mock data for plants and seeds
const mockPlants = [
  {
    id: '1',
    text: 'Today I felt really confident presenting my ideas at work',
    type: 'plant',
    aiResponse: 'Your confidence is blooming beautifully! Keep nurturing that self-belief. 🌱',
    date: '2024-01-15',
    tone: 'positive',
  },
  {
    id: '2',
    text: 'I feel overwhelmed by all the tasks on my plate',
    type: 'seed',
    aiResponse: 'Even in overwhelm, seeds of growth are planted. This feeling will transform. 🌰',
    date: '2024-01-15',
    tone: 'negative',
  },
  {
    id: '3',
    text: 'Had a wonderful conversation with an old friend today',
    type: 'plant',
    aiResponse: 'Connections like these make your garden flourish! What a gift. 🌿',
    date: '2024-01-14',
    tone: 'positive',
  },
];

export default function GardenScreen() {
  const plants = mockPlants.filter(item => item.type === 'plant');
  const seeds = mockPlants.filter(item => item.type === 'seed');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Inner Garden</Text>
          <Text style={styles.subtitle}>Where thoughts bloom and grow</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/thoughts')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#E8F5E8', '#D4E6D4']}
            style={styles.addButtonGradient}
          >
            <Plus size={24} color="#2D6A2D" strokeWidth={2} />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Stats Overview */}
        <View style={styles.statsRow}>
          <LinearGradient
            colors={['#F0FDF4', '#E6F7E6']}
            style={styles.statCard}
          >
            <Leaf size={28} color="#2D6A2D" strokeWidth={2} />
            <Text style={styles.statNumber}>{plants.length}</Text>
            <Text style={styles.statLabel}>Flourishing Plants</Text>
          </LinearGradient>
          
          <LinearGradient
            colors={['#FEF3E2', '#F9E8D0']}
            style={styles.statCard}
          >
            <Sprout size={28} color="#D97706" strokeWidth={2} />
            <Text style={styles.statNumber}>{seeds.length}</Text>
            <Text style={styles.statLabel}>Seeds in Soil</Text>
          </LinearGradient>
        </View>

        {/* Flourishing Plants Section */}
        {plants.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Sun size={20} color="#2D6A2D" strokeWidth={2} />
                <Text style={styles.sectionTitle}>Flourishing Plants</Text>
              </View>
              <Text style={styles.sectionSubtitle}>Your positive thoughts have bloomed</Text>
            </View>
            
            <View style={styles.itemsContainer}>
              {plants.map((plant) => (
                <TouchableOpacity key={plant.id} style={styles.plantCard} activeOpacity={0.9}>
                  <LinearGradient
                    colors={['#FFFFFF', '#F8FFF8']}
                    style={styles.cardGradient}
                  >
                    <View style={styles.cardHeader}>
                      <Leaf size={20} color="#2D6A2D" strokeWidth={2} />
                      <Text style={styles.cardDate}>{plant.date}</Text>
                    </View>
                    
                    <Text style={styles.cardText}>{plant.text}</Text>
                    
                    <View style={styles.aiResponseContainer}>
                      <Text style={styles.aiResponseText}>{plant.aiResponse}</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Seeds in Soil Section */}
        {seeds.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Droplets size={20} color="#D97706" strokeWidth={2} />
                <Text style={styles.sectionTitle}>Seeds in Rich Soil</Text>
              </View>
              <Text style={styles.sectionSubtitle}>Challenges that nurture growth</Text>
            </View>
            
            <View style={styles.itemsContainer}>
              {seeds.map((seed) => (
                <TouchableOpacity key={seed.id} style={styles.seedCard} activeOpacity={0.9}>
                  <LinearGradient
                    colors={['#FFFFFF', '#FFFBF5']}
                    style={styles.cardGradient}
                  >
                    <View style={styles.cardHeader}>
                      <Sprout size={20} color="#D97706" strokeWidth={2} />
                      <Text style={styles.cardDate}>{seed.date}</Text>
                    </View>
                    
                    <Text style={styles.cardText}>{seed.text}</Text>
                    
                    <View style={styles.aiResponseContainer}>
                      <Text style={styles.aiResponseText}>{seed.aiResponse}</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Empty State */}
        {mockPlants.length === 0 && (
          <View style={styles.emptyState}>
            <Leaf size={64} color="#E5DDD5" strokeWidth={1} />
            <Text style={styles.emptyTitle}>Your garden awaits</Text>
            <Text style={styles.emptySubtitle}>
              Plant your first thought and watch your inner garden flourish
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => router.push('/thoughts')}
              activeOpacity={0.8}
            >
              <Text style={styles.emptyButtonText}>Plant First Thought</Text>
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
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
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
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#2F3E46',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#8B7355',
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#4A5D39',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8B7355',
  },
  itemsContainer: {
    gap: 12,
  },
  plantCard: {
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
  seedCard: {
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
  cardGradient: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8B7355',
  },
  cardText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2F3E46',
    lineHeight: 24,
    marginBottom: 12,
  },
  aiResponseContainer: {
    backgroundColor: 'rgba(45, 106, 45, 0.1)',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#2D6A2D',
  },
  aiResponseText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2D6A2D',
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
    backgroundColor: '#2D6A2D',
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