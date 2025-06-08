import { View, Text, StyleSheet, TouchableOpacity, Platform, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mic, MicOff, Leaf, Sprout, Sun, Droplets } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { AIService } from '@/services/ai';

const { width, height } = Dimensions.get('window');

export default function ThoughtsScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [thoughtType, setThoughtType] = useState<'positive' | 'negative' | null>(null);
  const [showResponse, setShowResponse] = useState(false);

  // Animation values
  const micScale = useRef(new Animated.Value(1)).current;
  const plantOpacity = useRef(new Animated.Value(0)).current;
  const seedOpacity = useRef(new Animated.Value(0)).current;
  const responseOpacity = useRef(new Animated.Value(0)).current;
  const gardenScale = useRef(new Animated.Value(1)).current;

  // Floating elements animation
  const floatingElements = useRef(
    Array.from({ length: 6 }, (_, index) => ({
      translateY: new Animated.Value(height + 100),
      translateX: new Animated.Value(Math.random() * width),
      opacity: new Animated.Value(0),
      isLeaf: index % 2 === 0,
    }))
  ).current;

  useEffect(() => {
    // Start floating elements animation
    const animateFloatingElements = () => {
      floatingElements.forEach((element, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(index * 1500),
            Animated.parallel([
              Animated.timing(element.translateY, {
                toValue: -100,
                duration: 10000,
                useNativeDriver: true,
              }),
              Animated.timing(element.opacity, {
                toValue: 0.4,
                duration: 1000,
                useNativeDriver: true,
              }),
            ]),
            Animated.timing(element.opacity, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    };

    animateFloatingElements();
  }, []);

  const handleMicPress = async () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      setIsProcessing(true);
      
      // Animate mic
      Animated.spring(micScale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();

      // Simulate speech processing
      setTimeout(() => {
        const mockTranscription = "I feel overwhelmed by all the tasks I need to complete today. It seems like there's never enough time.";
        setTranscription(mockTranscription);
        processThought(mockTranscription);
      }, 2000);
    } else {
      // Start recording
      setIsRecording(true);
      setShowResponse(false);
      setTranscription('');
      setAiResponse('');
      setThoughtType(null);
      
      // Animate mic
      Animated.spring(micScale, {
        toValue: 1.2,
        useNativeDriver: true,
      }).start();

      // Animate garden
      Animated.sequence([
        Animated.timing(gardenScale, {
          toValue: 1.05,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(gardenScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const processThought = async (text: string) => {
    try {
      const response = await AIService.processThought(text);
      setAiResponse(response.message);
      setThoughtType(response.tone);
      setIsProcessing(false);
      setShowResponse(true);

      // Animate based on thought type
      if (response.tone === 'positive') {
        Animated.sequence([
          Animated.timing(plantOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.delay(1000),
          Animated.timing(responseOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        Animated.sequence([
          Animated.timing(seedOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.delay(1000),
          Animated.timing(responseOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      }

      // Save to storage
      await AIService.saveThought(text, response.message, response.tone);
    } catch (error) {
      console.error('Error processing thought:', error);
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    // Reset animations
    Animated.parallel([
      Animated.timing(plantOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(seedOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(responseOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowResponse(false);
      setTranscription('');
      setAiResponse('');
      setThoughtType(null);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F0FDF4', '#E6F7E6', '#D4E6D4']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#2D6A2D" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.title}>Inner Garden</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Floating Elements Background */}
        {floatingElements.map((element, index) => (
          <Animated.View
            key={index}
            style={[
              styles.floatingElement,
              {
                transform: [
                  { translateX: element.translateX },
                  { translateY: element.translateY },
                ],
                opacity: element.opacity,
              },
            ]}
          >
            {element.isLeaf ? (
              <Leaf size={16} color="#2D6A2D" strokeWidth={1} />
            ) : (
              <Sprout size={16} color="#D97706" strokeWidth={1} />
            )}
          </Animated.View>
        ))}

        {/* Garden Sections */}
        <Animated.View
          style={[
            styles.gardenContainer,
            {
              transform: [{ scale: gardenScale }],
            },
          ]}
        >
          {/* Flourished Section (Top) */}
          <LinearGradient
            colors={['#F0FDF4', '#E6F7E6']}
            style={styles.flourishedSection}
          >
            <View style={styles.sectionHeader}>
              <Sun size={24} color="#2D6A2D" strokeWidth={2} />
              <Text style={styles.sectionTitle}>Flourishing</Text>
            </View>
            <View style={styles.plantsContainer}>
              {[1, 2, 3, 4, 5].map((_, index) => (
                <Leaf
                  key={index}
                  size={20 + Math.random() * 10}
                  color="#2D6A2D"
                  strokeWidth={1.5}
                  style={[
                    styles.plantIcon,
                    {
                      left: `${20 + index * 15}%`,
                      opacity: 0.6 + Math.random() * 0.4,
                    },
                  ]}
                />
              ))}
            </View>
          </LinearGradient>

          {/* Flourishing Section (Bottom) */}
          <LinearGradient
            colors={['#FEF3E2', '#F9E8D0']}
            style={styles.flourishingSection}
          >
            <View style={styles.sectionHeader}>
              <Droplets size={24} color="#D97706" strokeWidth={2} />
              <Text style={styles.sectionTitle}>Growing</Text>
            </View>
            <View style={styles.seedsContainer}>
              {[1, 2, 3].map((_, index) => (
                <Sprout
                  key={index}
                  size={16 + Math.random() * 8}
                  color="#D97706"
                  strokeWidth={1.5}
                  style={[
                    styles.seedIcon,
                    {
                      left: `${30 + index * 20}%`,
                      opacity: 0.5 + Math.random() * 0.3,
                    },
                  ]}
                />
              ))}
            </View>
          </LinearGradient>
        </Animated.View>

        {/* New Plant/Seed Animation */}
        {showResponse && thoughtType === 'positive' && (
          <Animated.View
            style={[
              styles.newPlant,
              {
                opacity: plantOpacity,
              },
            ]}
          >
            <LinearGradient
              colors={['#F0FDF4', '#E6F7E6']}
              style={styles.thoughtCard}
            >
              <Leaf size={24} color="#2D6A2D" strokeWidth={2} />
              <Text style={styles.thoughtText}>{transcription}</Text>
            </LinearGradient>
          </Animated.View>
        )}

        {showResponse && thoughtType === 'negative' && (
          <Animated.View
            style={[
              styles.newSeed,
              {
                opacity: seedOpacity,
              },
            ]}
          >
            <LinearGradient
              colors={['#FEF3E2', '#F9E8D0']}
              style={styles.thoughtCard}
            >
              <Sprout size={24} color="#D97706" strokeWidth={2} />
              <Text style={styles.thoughtText}>{transcription}</Text>
            </LinearGradient>
          </Animated.View>
        )}

        {/* AI Response */}
        {showResponse && (
          <Animated.View
            style={[
              styles.aiResponseContainer,
              {
                opacity: responseOpacity,
              },
            ]}
          >
            <LinearGradient
              colors={['#FFFFFF', '#F8FFF8']}
              style={styles.aiResponse}
            >
              <View style={styles.leafIcon}>
                <Text style={styles.leafEmoji}>🍃</Text>
              </View>
              <Text style={styles.aiResponseText}>{aiResponse}</Text>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>
                  {thoughtType === 'positive' ? 'Plant in Garden' : 'Nurture Seed'}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Processing State */}
        {isProcessing && (
          <View style={styles.processingContainer}>
            <Text style={styles.processingText}>Leaf is reflecting...</Text>
            <Text style={styles.transcriptionText}>{transcription}</Text>
          </View>
        )}

        {/* Microphone */}
        <View style={styles.micContainer}>
          <TouchableOpacity
            style={styles.micButton}
            onPress={handleMicPress}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[
                styles.micButtonInner,
                {
                  transform: [{ scale: micScale }],
                },
              ]}
            >
              <LinearGradient
                colors={isRecording ? ['#4ADE80', '#2D6A2D'] : ['#FFFFFF', '#F8FFF8']}
                style={styles.micGradient}
              >
                {isRecording ? (
                  <MicOff size={32} color="#FFFFFF" strokeWidth={2} />
                ) : (
                  <Mic size={32} color="#2D6A2D" strokeWidth={2} />
                )}
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
          <Text style={styles.micText}>
            {isRecording ? 'Tap to stop' : 'Share your thoughts'}
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#2D6A2D',
  },
  placeholder: {
    width: 40,
  },
  gardenContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  flourishedSection: {
    flex: 1,
    padding: 20,
    position: 'relative',
  },
  flourishingSection: {
    flex: 1,
    padding: 20,
    position: 'relative',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#4A5D39',
  },
  plantsContainer: {
    position: 'relative',
    height: 100,
  },
  seedsContainer: {
    position: 'relative',
    height: 80,
  },
  plantIcon: {
    position: 'absolute',
  },
  seedIcon: {
    position: 'absolute',
  },
  floatingElement: {
    position: 'absolute',
    zIndex: 1,
  },
  newPlant: {
    position: 'absolute',
    top: '25%',
    left: 20,
    right: 20,
  },
  newSeed: {
    position: 'absolute',
    top: '65%',
    left: 20,
    right: 20,
  },
  thoughtCard: {
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
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
  thoughtText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2F3E46',
    lineHeight: 24,
  },
  aiResponseContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
  },
  aiResponse: {
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
  leafIcon: {
    marginBottom: 12,
  },
  leafEmoji: {
    fontSize: 32,
  },
  aiResponseText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#2D6A2D',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#2D6A2D',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  processingContainer: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  processingText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#2D6A2D',
    marginBottom: 12,
  },
  transcriptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7556',
    textAlign: 'center',
    lineHeight: 24,
  },
  micContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  micButton: {
    marginBottom: 12,
  },
  micButtonInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  micGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#2D6A2D',
  },
});