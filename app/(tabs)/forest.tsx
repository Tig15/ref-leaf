import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TreePine, Plus, Award, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

// Mock data for trees/accomplishments
const mockTrees = [
  {
    id: '1',
    text: 'Completed my first marathon after months of training',
    aiResponse: 'What an incredible achievement! Your determination has grown into something magnificent. 🏃‍♀️✨',
    date: '2024-01-15',
    category: 'fitness',
  },
  {
    id: '2',
    text: 'Finally published the article I\'ve been working on',
    aiResponse: 'Your creativity has taken root and bloomed beautifully! Congratulations on sharing your voice. 📝🌟',
    date: '2024-01-14',
    category: 'creative',
  },
  {
    id: '3',
    text: 'Helped my neighbor with their garden project',
    aiResponse: 'Kindness creates the most beautiful forests. Your generosity is inspiring! 🤝💚',
    date: '2024-01-13',
    category: 'kindness',
  },
];

export default function ForestScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Achievement Forest</Text>
          <Text style={styles.subtitle}>Your mighty trees of accomplishment</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/accomplishments')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#E6F3FF', '#D1E9FF']}
            style={styles.addButtonGradient}
          >
            <Plus size={24} color="#1E3A8A" strokeWidth={2} />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Forest Stats */}
        <LinearGradient
          colors={['#F0F9FF', '#E0F2FE']}
          style={styles.statsContainer}
        >
          <View style={styles.statsContent}>
            <TreePine size={36} color="#1E3A8A" strokeWidth={2} />
            <Text style={styles.statsNumber}>{mockTrees.length}</Text>
            <Text style={styles.statsLabel}>Mighty Trees Growing</Text>
            <Text style={styles.statsSubtext}>Each one tells a story of triumph</Text>
          </View>
        </LinearGradient>

        {/* Achievement Trees */}
        <View style={styles.treesSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Star size={20} color="#1E3A8A" strokeWidth={2} />
              <Text style={styles.sectionTitle}>Your Forest of Success</Text>
            </View>
            <Text style={styles.sectionSubtitle}>Every tree represents a moment of pride</Text>
          </View>
          
          <View style={styles.treesContainer}>
            {mockTrees.map((tree, index) => (
              <TouchableOpacity key={tree.id} style={styles.treeCard} activeOpacity={0.9}>
                <LinearGradient
                  colors={['#FFFFFF', '#F8FAFF']}
                  style={styles.treeGradient}
                >
                  <View style={styles.treeHeader}>
                    <View style={styles.treeIconContainer}>
                      <TreePine size={24} color="#1E3A8A" strokeWidth={2} />
                      <Text style={styles.treeNumber}>#{mockTrees.length - index}</Text>
                    </View>
                    <View style={styles.categoryBadge}>
                      <Award size={14} color="#1E3A8A" strokeWidth={2} />
                      <Text style={styles.categoryText}>{tree.category}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.treeText}>{tree.text}</Text>
                  
                  <View style={styles.aiResponseContainer}>
                    <Star size={16} color="#1E3A8A" strokeWidth={2} />
                    <Text style={styles.aiResponseText}>{tree.aiResponse}</Text>
                  </View>
                  
                  <Text style={styles.treeDate}>Planted on {tree.date}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Empty State */}
        {mockTrees.length === 0 && (
          <View style={styles.emptyState}>
            <TreePine size={64} color="#E5DDD5" strokeWidth={1} />
            <Text style={styles.emptyTitle}>Your forest awaits</Text>
            <Text style={styles.emptySubtitle}>
              Plant your first tree by celebrating an accomplishment
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => router.push('/accomplishments')}
              activeOpacity={0.8}
            >
              <Text style={styles.emptyButtonText}>Plant First Tree</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Motivational Footer */}
        <View style={styles.motivationCard}>
          <LinearGradient
            colors={['#EEF2FF', '#E0E7FF']}
            style={styles.motivationGradient}
          >
            <TreePine size={28} color="#1E3A8A" strokeWidth={2} />
            <Text style={styles.motivationText}>
              "Every great forest started with a single seed of determination."
            </Text>
          </LinearGradient>
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
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
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
  statsContent: {
    alignItems: 'center',
  },
  statsNumber: {
    fontSize: 40,
    fontFamily: 'Inter-Bold',
    color: '#1E3A8A',
    marginTop: 8,
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2F3E46',
    marginBottom: 4,
  },
  statsSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8B7355',
    textAlign: 'center',
  },
  treesSection: {
    marginBottom: 24,
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
  treesContainer: {
    gap: 16,
  },
  treeCard: {
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
  treeGradient: {
    padding: 20,
  },
  treeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  treeIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  treeNumber: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E3A8A',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(30, 58, 138, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#1E3A8A',
    textTransform: 'capitalize',
  },
  treeText: {
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
    backgroundColor: 'rgba(30, 58, 138, 0.05)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#1E3A8A',
  },
  aiResponseText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1E3A8A',
    lineHeight: 20,
  },
  treeDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8B7355',
    textAlign: 'center',
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
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  motivationCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 16,
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
  motivationGradient: {
    padding: 20,
    alignItems: 'center',
  },
  motivationText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1E3A8A',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
    lineHeight: 24,
  },
});