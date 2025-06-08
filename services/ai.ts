import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AIResponse {
  message: string;
  tone?: 'positive' | 'negative';
}

export interface StoredEntry {
  id: string;
  text: string;
  aiResponse: string;
  date: string;
  time: string;
  tone?: 'positive' | 'negative';
}

class AIServiceClass {
  private apiKey: string | null = null;
  private baseUrl = 'https://api.openai.com/v1/chat/completions';

  constructor() {
    // In a real app, you'd get this from environment variables
    // For demo purposes, we'll use mock responses
    this.apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY || null;
  }

  private async makeAPICall(messages: any[]): Promise<string> {
    if (!this.apiKey) {
      // Return mock responses for demo
      return this.getMockResponse(messages[messages.length - 1].content);
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages,
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('AI API Error:', error);
      return this.getMockResponse(messages[messages.length - 1].content);
    }
  }

  private getMockResponse(input: string): string {
    const lowerInput = input.toLowerCase();
    
    // Gratitude responses
    if (lowerInput.includes('grateful') || lowerInput.includes('thankful') || lowerInput.includes('appreciate')) {
      const gratitudeResponses = [
        "What a beautiful moment to cherish! Gratitude like this creates ripples of joy. 🌸",
        "Your appreciation for life's gifts is truly heartwarming. Keep nurturing this grateful heart! ✨",
        "This gratitude is like sunshine for your soul. Thank you for sharing this precious moment. 🌅",
        "Such beautiful awareness of life's blessings. Your grateful spirit is inspiring! 💝",
      ];
      return gratitudeResponses[Math.floor(Math.random() * gratitudeResponses.length)];
    }

    // Negative thought responses
    if (lowerInput.includes('overwhelm') || lowerInput.includes('stress') || lowerInput.includes('anxious') || 
        lowerInput.includes('worried') || lowerInput.includes('difficult') || lowerInput.includes('hard')) {
      const supportiveResponses = [
        "Even in challenging moments, seeds of growth are being planted. This feeling will transform. 🌱",
        "Your awareness of this struggle is the first step toward healing. Be gentle with yourself. 🤗",
        "These difficult emotions are temporary visitors. They carry wisdom for your journey. 🌿",
        "In the soil of challenge, the strongest roots grow. You're building resilience. 💪",
      ];
      return supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)];
    }

    // Positive thought responses
    if (lowerInput.includes('confident') || lowerInput.includes('happy') || lowerInput.includes('excited') || 
        lowerInput.includes('proud') || lowerInput.includes('wonderful') || lowerInput.includes('great')) {
      const positiveResponses = [
        "Your positive energy is radiating beautifully! Keep nurturing these uplifting thoughts. 🌟",
        "What a wonderful mindset! This positivity is like sunshine for your inner garden. ☀️",
        "Your confidence is blooming magnificently. Trust in this beautiful energy you're creating. 🌺",
        "This joy is contagious! Your positive spirit is a gift to yourself and others. 🎉",
      ];
      return positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
    }

    // Accomplishment responses
    if (lowerInput.includes('completed') || lowerInput.includes('achieved') || lowerInput.includes('accomplished') || 
        lowerInput.includes('finished') || lowerInput.includes('succeeded') || lowerInput.includes('goal')) {
      const accomplishmentResponses = [
        "What an incredible achievement! Your dedication has grown into something magnificent. 🏆",
        "This accomplishment is a testament to your strength and perseverance. Celebrate this victory! 🎊",
        "You've planted a mighty tree of success! Your hard work has truly paid off. 🌳",
        "This achievement will stand tall in your forest of accomplishments. Well done! 👏",
      ];
      return accomplishmentResponses[Math.floor(Math.random() * accomplishmentResponses.length)];
    }

    // Default response
    return "Thank you for sharing this with me. Every thought and feeling is a step in your growth journey. 🍃";
  }

  private detectTone(text: string): 'positive' | 'negative' {
    const lowerText = text.toLowerCase();
    
    const negativeKeywords = [
      'overwhelm', 'stress', 'anxious', 'worried', 'difficult', 'hard', 'sad', 'angry',
      'frustrated', 'tired', 'exhausted', 'lonely', 'confused', 'scared', 'upset'
    ];
    
    const positiveKeywords = [
      'happy', 'excited', 'confident', 'proud', 'grateful', 'thankful', 'wonderful',
      'great', 'amazing', 'fantastic', 'love', 'joy', 'peaceful', 'content', 'blessed'
    ];

    const negativeCount = negativeKeywords.filter(keyword => lowerText.includes(keyword)).length;
    const positiveCount = positiveKeywords.filter(keyword => lowerText.includes(keyword)).length;

    return negativeCount > positiveCount ? 'negative' : 'positive';
  }

  async processGratitude(text: string): Promise<AIResponse> {
    const messages = [
      {
        role: 'system',
        content: 'You are Leaf, a gentle AI companion for a mindfulness app. Respond to gratitude entries with warmth, encouragement, and nature metaphors. Keep responses under 100 characters and include an emoji.'
      },
      {
        role: 'user',
        content: `Gratitude entry: ${text}`
      }
    ];

    const response = await this.makeAPICall(messages);
    return { message: response };
  }

  async processThought(text: string): Promise<AIResponse> {
    const tone = this.detectTone(text);
    
    const messages = [
      {
        role: 'system',
        content: `You are Leaf, a gentle AI companion for a mindfulness app. Respond to ${tone} thoughts with empathy and nature metaphors. For positive thoughts, celebrate growth. For negative thoughts, offer gentle support and remind them that challenges help us grow. Keep responses under 100 characters and include an emoji.`
      },
      {
        role: 'user',
        content: `Thought: ${text}`
      }
    ];

    const response = await this.makeAPICall(messages);
    return { message: response, tone };
  }

  async processAccomplishment(text: string): Promise<AIResponse> {
    const messages = [
      {
        role: 'system',
        content: 'You are Leaf, a gentle AI companion for a mindfulness app. Respond to accomplishments with celebration, pride, and tree/forest metaphors. Keep responses under 100 characters and include an emoji.'
      },
      {
        role: 'user',
        content: `Accomplishment: ${text}`
      }
    ];

    const response = await this.makeAPICall(messages);
    return { message: response };
  }

  // Storage methods
  async saveGratitude(text: string, aiResponse: string): Promise<void> {
    try {
      const entry: StoredEntry = {
        id: Date.now().toString(),
        text,
        aiResponse,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const existing = await AsyncStorage.getItem('gratitude_entries');
      const entries = existing ? JSON.parse(existing) : [];
      entries.unshift(entry);
      
      await AsyncStorage.setItem('gratitude_entries', JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving gratitude:', error);
    }
  }

  async saveThought(text: string, aiResponse: string, tone: 'positive' | 'negative'): Promise<void> {
    try {
      const entry: StoredEntry = {
        id: Date.now().toString(),
        text,
        aiResponse,
        tone,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const existing = await AsyncStorage.getItem('thought_entries');
      const entries = existing ? JSON.parse(existing) : [];
      entries.unshift(entry);
      
      await AsyncStorage.setItem('thought_entries', JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving thought:', error);
    }
  }

  async saveAccomplishment(text: string, aiResponse: string): Promise<void> {
    try {
      const entry: StoredEntry = {
        id: Date.now().toString(),
        text,
        aiResponse,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const existing = await AsyncStorage.getItem('accomplishment_entries');
      const entries = existing ? JSON.parse(existing) : [];
      entries.unshift(entry);
      
      await AsyncStorage.setItem('accomplishment_entries', JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving accomplishment:', error);
    }
  }

  // Retrieval methods
  async getGratitudeEntries(): Promise<StoredEntry[]> {
    try {
      const entries = await AsyncStorage.getItem('gratitude_entries');
      return entries ? JSON.parse(entries) : [];
    } catch (error) {
      console.error('Error getting gratitude entries:', error);
      return [];
    }
  }

  async getThoughtEntries(): Promise<StoredEntry[]> {
    try {
      const entries = await AsyncStorage.getItem('thought_entries');
      return entries ? JSON.parse(entries) : [];
    } catch (error) {
      console.error('Error getting thought entries:', error);
      return [];
    }
  }

  async getAccomplishmentEntries(): Promise<StoredEntry[]> {
    try {
      const entries = await AsyncStorage.getItem('accomplishment_entries');
      return entries ? JSON.parse(entries) : [];
    } catch (error) {
      console.error('Error getting accomplishment entries:', error);
      return [];
    }
  }
}

export const AIService = new AIServiceClass();