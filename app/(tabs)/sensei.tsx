import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { KageText } from '@/components/ui/KageText';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { InkDivider } from '@/components/japanese/InkDivider';
import { useColors, spacing } from '@/theme';
import { getProgression } from '@/store/progressionStore';
import { callSenseiAI, resetSenseiRateLimit } from '@/utils/gemini';
import { getChronicWeaknesses } from '@/store/movementIntelligence';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  time: number;
  id: string; // Unique ID for deduplication
}

const QUICK_ACTIONS = [
  '💪 Form tips for squats',
  '📋 What should I eat?',
  '🔥 Break a plateau',
  '🔄 Adjust my program',
  '🧘 Recovery advice',
  '🏆 Motivation',
];

const SYSTEM_PROMPT = `You are Sensei, a wise and warm martial arts and fitness coach with decades of experience. You speak with discipline but genuine warmth. You use Japanese martial arts concepts naturally (but not excessively). You are CONVERSATIONAL — you chat like a real person. 

When someone says "hi", you greet them warmly and ask what they want to work on today. 

You give SHORT, actionable advice (1-3 sentences max). You remember the conversation context. No lectures. No generic platitudes. Be specific and helpful.

IMPORTANT: You have long-term memory of this warrior's movement patterns and chronic weaknesses. If relevant, gently reference patterns you've noticed in their training without being repetitive. Offer guidance that helps them overcome recurring issues over time.`;

export default function SenseiCoachScreen() {
  const colors = useColors();
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'model',
    text: 'Welcome, warrior. I am Sensei. What troubles your spirit today?',
    time: Date.now(),
    id: 'welcome-' + Date.now(),
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const lastSentMessage = useRef<string>('');
  const sendTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (sendTimeout.current) {
        clearTimeout(sendTimeout.current);
      }
    };
  }, []);

  const sendMessage = useCallback(async (text: string, force = false) => {
    if (!text.trim() || loading) return;
    
    // Debounce: prevent rapid-fire messages
    if (sendTimeout.current) {
      clearTimeout(sendTimeout.current);
    }
    
    // Check for duplicate message (within 2 seconds)
    const now = Date.now();
    if (text.trim() === lastSentMessage.current && now - (messages[messages.length - 1]?.time || 0) < 2000) {
      return; // Skip duplicate message
    }
    
    lastSentMessage.current = text.trim();
    
    const userMsg: ChatMessage = { 
      role: 'user', 
      text: text.trim(), 
      time: now,
      id: 'user-' + now 
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Inject user's chronic movement weaknesses for personalized coaching (high priority)
      const chronic = await getChronicWeaknesses();
      const enhancedSystem = chronic.length > 0 
        ? `${SYSTEM_PROMPT}\n\nIMPORTANT: This warrior has shown these recurring movement issues in past sessions: ${chronic.join(', ')}. Reference these patterns when relevant and coach with long-term awareness.`
        : SYSTEM_PROMPT;

      if (force) resetSenseiRateLimit();
      const aiResult = await callSenseiAI(enhancedSystem, text.trim(), force);
      
      await new Promise(resolve => setTimeout(resolve, 80));
      
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: aiResult.reply, 
        time: Date.now(),
        id: 'model-' + Date.now() 
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'model',
        text: 'The path is unclear. Ask again with clearer intent.',
        time: Date.now(),
        id: 'error-' + Date.now(),
      }]);
    }
    
    setLoading(false);
    
    // Reset last sent message after delay
    sendTimeout.current = setTimeout(() => {
      lastSentMessage.current = '';
    }, 2000);
  }, [loading, messages]);

  return (
    <ScreenContainer>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={{ 
          paddingTop: 50, 
          paddingHorizontal: spacing.lg, 
          flex: 1,
          maxWidth: Platform.OS === 'web' ? 720 : undefined,
          alignSelf: Platform.OS === 'web' ? 'center' : 'stretch',
          width: '100%'
        }}>
          {/* Header */}
          <Animated.View entering={FadeInDown.duration(400)} style={{ alignItems: 'center', marginBottom: spacing.sm }}>
            <KageText variant="kanji" style={{ fontSize: 32, color: colors.accent.primary, opacity: 0.2 }}>師</KageText>
            <KageText variant="h3" letterSpacing={5} color={colors.accent.gold} style={{ fontSize: 12 }}>SENSEI COACH</KageText>
            <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 7, letterSpacing: 1.5, marginTop: 1 }}>
              Your AI martial arts mentor
            </KageText>
          </Animated.View>

          <InkDivider />

          {/* Quick actions */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: spacing.sm }} contentContainerStyle={{ gap: 4, height: 28 }}>
            {QUICK_ACTIONS.map((a, i) => (
              <Pressable key={i} onPress={() => sendMessage(a)} style={{
                paddingHorizontal: 8, paddingVertical: 4, borderRadius: 14,
                backgroundColor: colors.glass.medium, borderWidth: 1, borderColor: colors.glass.border,
              }}>
                <KageText variant="body" style={{ fontSize: 8, color: colors.text.secondary }}>{a}</KageText>
              </Pressable>
            ))}
          </ScrollView>

          {/* Messages */}
          <ScrollView
            ref={scrollRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ gap: spacing.xs, paddingBottom: spacing.xs }}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => (
              <Animated.View key={msg.id} entering={FadeInUp.duration(300)} style={{
                flexDirection: 'row',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <View style={{
                  maxWidth: '80%',
                  paddingVertical: 6, paddingHorizontal: 10,
                  borderRadius: 10,
                  backgroundColor: msg.role === 'user' ? colors.glass.medium : colors.glass.light,
                  borderWidth: 1,
                  borderColor: msg.role === 'model' ? colors.accent.gold + '40' : colors.glass.border,
                  borderBottomRightRadius: msg.role === 'user' ? 2 : 10,
                  borderBottomLeftRadius: msg.role === 'model' ? 2 : 10,
                }}>
                  <KageText variant="body" style={{
                    fontSize: 11, lineHeight: 16,
                    color: msg.role === 'user' ? colors.text.primary : colors.text.secondary,
                  }}>
                    {msg.text}
                  </KageText>
                  <KageText variant="caption" style={{
                    fontSize: 6, color: colors.text.muted, marginTop: 2, textAlign: 'right',
                  }}>
                    {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </KageText>
                </View>
              </Animated.View>
            ))}
            {loading && (
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <View style={{
                  paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10,
                  backgroundColor: colors.glass.light, borderWidth: 1, borderColor: colors.accent.gold + '40',
                  borderBottomLeftRadius: 2,
                }}>
                  <KageText variant="body" color={colors.text.muted} style={{ fontSize: 10 }}>Sensei is thinking...</KageText>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input */}
          <View style={{
            flexDirection: 'row', gap: spacing.sm, paddingVertical: spacing.xs,
            paddingBottom: 90,
            borderTopWidth: 1, borderTopColor: colors.glass.border,
            backgroundColor: colors.bg.primary,
          }}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask Sensei..."
              placeholderTextColor={colors.text.muted}
              style={{
                flex: 1, height: 36, borderRadius: 10, paddingHorizontal: 12,
                fontSize: 11, color: colors.text.primary,
                backgroundColor: colors.glass.medium,
                borderWidth: 1, borderColor: colors.glass.border,
                fontFamily: undefined,
              }}
              onKeyPress={(e: any) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            />
            <Pressable onPress={() => sendMessage(input)} disabled={!input.trim() || loading} style={{
              width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
              backgroundColor: input.trim() && !loading ? colors.accent.primary : colors.glass.medium,
              borderWidth: 1, borderColor: input.trim() && !loading ? colors.accent.gold : colors.glass.border,
            }}>
              <KageText variant="body" style={{ fontSize: 14, opacity: input.trim() && !loading ? 1 : 0.4 }}>➤</KageText>
            </Pressable>
          </View>

          {/* Professional retry for when Sensei is silent (from roundtable feedback) */}
          <Pressable 
            onPress={() => { 
              if (input.trim()) sendMessage(input, true); 
              else if (messages.length > 1) {
                const lastUser = [...messages].reverse().find(m => m.role === 'user');
                if (lastUser) sendMessage(lastUser.text, true);
              }
            }}
            style={{ alignSelf: 'center', marginBottom: 70 }}
          >
            <KageText variant="caption" style={{ color: colors.accent.gold, fontSize: 9, opacity: 0.6 }}>
              Sensei silent? Tap to force fresh question (uses backup key)
            </KageText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
