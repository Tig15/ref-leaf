import { View, Text, StyleSheet, TouchableOpacity, Platform, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mic, MicOff, TreePine, Mountain } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { AIService } from '@/services/ai';

const { width, height } = Dimensions.get('window');

export default function AccomplishmentsScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [showResponse, setShowResponse] = useState(false);

  // Animation values
  const micScale = useRef(new Animated.Value(1)).current;
  const treeOpacity = useRef(new Animated.Value(0)).current;
  const treeScale = useRef(new Animated.Value(0.5)).current;
  const responseOpacity = useRef(new Animated.Value(0)).current;
  const landscapeOpacity = useRef(new Animated.Value(1)).current;

  // Existing trees animation
  const existingTrees = useRef(
    Array.from({ length: 5 }, (_, index) => ({
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(0.3 + Math.random() * 0.4),
      scale: new Animated.Value(0.8 + Math.random() * 0.4),
      left: 20 + index * 15 + Math.random() * 10,
    }))
  ).current;

  useEffect(() => {
    // Animate existing trees swaying
    existingTrees.forEach((tree, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(tree.translateY, {
            toValue: -5 - Math.random() * 5,
            duration: 2000 + index * 500,
            useNativeDriver: true,
          }),
          Animated.timing(tree.translateY, {
            toValue: 0,
            duration: 2000 + index * 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
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
        const mockTranscription = "I successfully completed my first 5K run today! I've been training for months and finally achieved my goal.";
        setTranscription(mockTranscription);
        processAccomplishment(mockTranscription);
      }, 2000);
    } else {
      // Start recording
      setIsRecording(true);
      setShowResponse(false);
      setTranscription('');
      setAiResponse('');
      
      // Animate mic
      Animated.spring(micScale, {
        toValue: 1.2,
        useNativeDriver: true,
      }).start();

      // Dim the landscape slightly
      Animated.timing(landscapeOpacity, {
        toValue: 0.7,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const processAccomplishment = async (text: string) => {
    try {
      const response = await AIService.processAccomplishment(text);
      setAiResponse(response.message);
      setIsProcessing(false);
      setShowResponse(true);

      // Animate new tree growing
      Animated.sequence([
        Animated.parallel([
          Animated.timing(treeOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.spring(treeScale, {
            toValue: 1,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(1000),
        Animated.timing(responseOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      // Brighten the landscape
      Animated.timing(landscapeOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      // Save to storage
      await AIService.saveAccomplishment(text, response.message);
    } catch (error) {
      console.error('Error processing accomplishment:', error);
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    // Reset animations
    Animated.parallel([
      Animated.timing(treeOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(treeScale, {
        toValue: 0.5,
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
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1E293B', '#334155', '#475569']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#E2E8F0" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.title}>Achievement Forest</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Landscape */}
        <Animated.View
          style={[
            styles.landscapeContainer,
            {
              opacity: landscapeOpacity,
            },
          ]}
        >
          {/* Mountains Background */}
          <View style={styles.mountainsContainer}>
            <Mountain size={120} color="#0F172A" strokeWidth={0.5} style={styles.mountain1} />
            <Mountain size={100} color="#1E293B" strokeWidth={0.5} style={styles.mountain2} />
            <Mountain size={80} color="#334155" strokeWidth={0.5} style={styles.mountain3} />
          </View>

          {/* Ground */}
          <LinearGradient
            colors={['#374151', '#4B5563']}
            style={styles.ground}
          >
            {/* Existing Trees */}
            {existingTrees.map((tree, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.existingTree,
                  {
                    left: `${tree.left}%`,
                    transform: [
                      { translateY: tree.translateY },
                      { scale: tree.scale },
                    ],
                    opacity: tree.opacity,
                  },
                ]}
              >
                <TreePine size={30 + index * 5} color="#059669" strokeWidth={1.5} />
              </Animated.View>
            ))}

            {/* New Tree Animation */}
            {showResponse && (
              <Animated.View
                style={[
                  styles.newTree,
                  {
                    opacity: treeOpacity,
                    transform: [{ scale: treeScale }],
                  },
                ]}
              >
                <TreePine size={60} color="#10B981" strokeWidth={2} />
              </Animated.View>
            )}
          </LinearGradient>

          {/* Accomplishment Card */}
          {showResponse && (
            <Animated.View
              style={[
                styles.accomplishmentCard,
                {
                  opacity: treeOpacity,
                },
              ]}
            >
              <LinearGradient
                colors={['#1E3A8A', '#3B82F6']}
                style={styles.cardGradient}
              >
                <TreePine size={24} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.accomplishmentText}>{transcription}</Text>
              </LinearGradient>
            </Animated.View>
          )}
        </Animated.View>

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
              colors={['#F0F9FF', '#E0F2FE']}
              style={styles.aiResponse}
            >
              <View style={styles.leafIcon}>
                <Text style={styles.leafEmoji}>🍃</Text>
              </View>
              <Text style={styles.aiResponseText}>{aiResponse}</Text>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Plant in Forest</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Processing State */}
        {isProcessing && (
          <View style={styles.processingContainer}>
            <Text style={styles.processingText}>Leaf is celebrating...</Text>
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
                colors={isRecording ? ['#3B82F6', '#1E3A8A'] : ['#FFFFFF', '#F1F5F9']}
                style={styles.micGradient}
              >
                {isRecording ? (
                  <MicOff size={32} color="#FFFFFF" strokeWidth={2} />
                ) : (
                  <Mic size={32} color="#1E3A8A" strokeWidth={2} />
                )}
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
          <Text style={styles.micText}>
            {isRecording ? 'Tap to stop' : 'Share your achievement'}
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#E2E8F0',
  },
  placeholder: {
    width: 40,
  },
  landscapeContainer: {
    flex: 1,
    position: 'relative',
  },
  mountainsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  mountain1: {
    position: 'absolute',
    left: '10%',
    bottom: '20%',
  },
  mountain2: {
    position: 'absolute',
    right: '20%',
    bottom: '30%',
  },
  mountain3: {
    position: 'absolute',
    left: '60%',
    bottom: '25%',
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  existingTree: {
    position: 'absolute',
    bottom: 20,
  },
  newTree: {
    position: 'absolute',
    bottom: 30,
    left: '45%',
    transform: [{ translateX: -30 }],
  },
  accomplishmentCard: {
    position: 'absolute',
    top: '20%',
    left: 20,
    right: 20,
  },
  cardGradient: {
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  accomplishmentText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
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
    color: '#1E3A8A',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#1E3A8A',
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
    color: '#E2E8F0',
    marginBottom: 12,
  },
  transcriptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
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
        shadowOpacity: 0.3,
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
    color: '#E2E8F0',
  },
});