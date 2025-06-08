import { View, Text, StyleSheet, TouchableOpacity, Platform, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mic, MicOff, Flower2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { AIService } from '@/services/ai';

const { width, height } = Dimensions.get('window');

export default function GratitudeScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [showResponse, setShowResponse] = useState(false);

  // Animation values
  const basketScale = useRef(new Animated.Value(1)).current;
  const micScale = useRef(new Animated.Value(1)).current;
  const petalOpacity = useRef(new Animated.Value(0)).current;
  const responseOpacity = useRef(new Animated.Value(0)).current;

  // Floating petals animation
  const floatingPetals = useRef(
    Array.from({ length: 8 }, () => ({
      translateY: new Animated.Value(height),
      translateX: new Animated.Value(Math.random() * width),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    // Start floating petals animation
    const animateFloatingPetals = () => {
      floatingPetals.forEach((petal, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(index * 1000),
            Animated.parallel([
              Animated.timing(petal.translateY, {
                toValue: -100,
                duration: 8000,
                useNativeDriver: true,
              }),
              Animated.timing(petal.opacity, {
                toValue: 0.6,
                duration: 1000,
                useNativeDriver: true,
              }),
              Animated.timing(petal.rotate, {
                toValue: 360,
                duration: 8000,
                useNativeDriver: true,
              }),
            ]),
            Animated.timing(petal.opacity, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    };

    animateFloatingPetals();
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
        const mockTranscription = "I'm grateful for the beautiful sunset I witnessed today. It reminded me how precious these simple moments are.";
        setTranscription(mockTranscription);
        processGratitude(mockTranscription);
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

      // Animate basket
      Animated.sequence([
        Animated.timing(basketScale, {
          toValue: 1.1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(basketScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const processGratitude = async (text: string) => {
    try {
      const response = await AIService.processGratitude(text);
      setAiResponse(response.message);
      setIsProcessing(false);
      setShowResponse(true);

      // Animate petal appearing
      Animated.sequence([
        Animated.timing(petalOpacity, {
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

      // Save to storage
      await AIService.saveGratitude(text, response.message);
    } catch (error) {
      console.error('Error processing gratitude:', error);
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    // Reset animations
    Animated.parallel([
      Animated.timing(petalOpacity, {
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
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFF5F5', '#FFE8E8', '#FFD1D1']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#E63946" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.title}>Gratitude Petals</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Floating Petals Background */}
        {floatingPetals.map((petal, index) => (
          <Animated.View
            key={index}
            style={[
              styles.floatingPetal,
              {
                transform: [
                  { translateX: petal.translateX },
                  { translateY: petal.translateY },
                  {
                    rotate: petal.rotate.interpolate({
                      inputRange: [0, 360],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
                opacity: petal.opacity,
              },
            ]}
          >
            <Flower2 size={20} color="#E63946" strokeWidth={1} />
          </Animated.View>
        ))}

        {/* Main Content */}
        <View style={styles.content}>
          {/* Basket */}
          <Animated.View
            style={[
              styles.basketContainer,
              {
                transform: [{ scale: basketScale }],
              },
            ]}
          >
            <LinearGradient
              colors={['#FFFFFF', '#FFF8F8']}
              style={styles.basket}
            >
              <Flower2 size={80} color="#E63946" strokeWidth={1.5} />
              <Text style={styles.basketText}>Gratitude Basket</Text>
              <Text style={styles.basketSubtext}>Speak your appreciation</Text>
            </LinearGradient>
          </Animated.View>

          {/* New Petal Animation */}
          {showResponse && (
            <Animated.View
              style={[
                styles.newPetal,
                {
                  opacity: petalOpacity,
                },
              ]}
            >
              <LinearGradient
                colors={['#FFE5E5', '#FFD1D1']}
                style={styles.petalCard}
              >
                <Flower2 size={24} color="#E63946" strokeWidth={2} />
                <Text style={styles.petalText}>{transcription}</Text>
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
                colors={['#F0FDF4', '#E6F7E6']}
                style={styles.aiResponse}
              >
                <View style={styles.leafIcon}>
                  <Text style={styles.leafEmoji}>🍃</Text>
                </View>
                <Text style={styles.aiResponseText}>{aiResponse}</Text>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Add to Basket</Text>
                </TouchableOpacity>
              </LinearGradient>
            </Animated.View>
          )}

          {/* Processing State */}
          {isProcessing && (
            <View style={styles.processingContainer}>
              <Text style={styles.processingText}>Leaf is listening...</Text>
              <Text style={styles.transcriptionText}>{transcription}</Text>
            </View>
          )}
        </View>

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
                colors={isRecording ? ['#FF6B6B', '#E63946'] : ['#FFFFFF', '#FFF8F8']}
                style={styles.micGradient}
              >
                {isRecording ? (
                  <MicOff size={32} color="#FFFFFF" strokeWidth={2} />
                ) : (
                  <Mic size={32} color="#E63946" strokeWidth={2} />
                )}
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
          <Text style={styles.micText}>
            {isRecording ? 'Tap to stop' : 'Tap to speak'}
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
    color: '#E63946',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  basketContainer: {
    marginBottom: 40,
  },
  basket: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
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
  basketText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#E63946',
    marginTop: 12,
  },
  basketSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8B7355',
    marginTop: 4,
  },
  floatingPetal: {
    position: 'absolute',
    zIndex: 1,
  },
  newPetal: {
    position: 'absolute',
    top: '40%',
    left: 20,
    right: 20,
  },
  petalCard: {
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
  petalText: {
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
    backgroundColor: '#E63946',
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
    alignItems: 'center',
    marginTop: 40,
  },
  processingText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#E63946',
    marginBottom: 12,
  },
  transcriptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7556',
    textAlign: 'center',
    paddingHorizontal: 20,
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
    color: '#E63946',
  },
});