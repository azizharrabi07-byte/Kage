import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { KageText } from '@/components/ui/KageText';
import { useColors, spacing } from '@/theme';
import { callSenseiAI, clearSenseiHistory } from '@/utils/gemini';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  time: number;
}

const QUICK_ACTIONS = [
  { label: 'Squat form', icon: '💪', prompt: 'How do I improve my squat form?' },
  { label: 'Meal plan', icon: '🍱', prompt: 'What should I eat today based on my training?' },
  { label: 'Plateau', icon: '🔥', prompt: 'I hit a plateau. What should I do?' },
  { label: 'Program', icon: '📋', prompt: 'Should I adjust my training program?' },
  { label: 'Recovery', icon: '🧘', prompt: 'Tips for recovery after hard training' },
  { label: 'Motivation', icon: '⚡', prompt: 'I need motivation to keep training' },
];

const SYSTEM_PROMPT = `You are Sensei, a wise and warm martial arts and fitness coach with decades of experience. You speak with discipline but genuine warmth. You use Japanese martial arts concepts naturally (but not excessively). You are CONVERSATIONAL — you chat like a real person. When someone says "hi", you greet them warmly and ask what they want to work on today. You give SHORT, actionable advice (1-3 sentences max). You remember the conversation context. No lectures. No generic platitudes. Be specific and helpful.`;

function TypingIndicator({ colors }: { colors: any }) {
  return (
    <View style={[styles.messageRow, { marginTop: 0 }]}>
      <View style={[styles.avatar, { borderColor: colors.accent.gold, backgroundColor: colors.bg.secondary }]}>
        <KageText variant="kanji" style={{ fontSize: 16, color: colors.accent.gold }}>师</KageText>
      </View>
      <View style={[styles.typingBubble, { backgroundColor: colors.glass.medium, borderColor: colors.accent.gold + '40' }]}>
        <View style={styles.dotsRow}>
          {[0, 1, 2].map(i => (
            <View key={i} style={[styles.tdot, { backgroundColor: colors.accent.gold }]} />
          ))}
        </View>
        <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 8, marginTop: 4, letterSpacing: 1 }}>
          Sensei is reflecting...
        </KageText>
      </View>
    </View>
  );
}

export default function SenseiCoachScreen() {
  const colors = useColors();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Welcome, warrior. I am Sensei. What troubles your spirit today? Whether it's form, nutrition, recovery, or motivation — I am here to guide you on the path.",
      time: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = { role: 'user', text: text.trim(), time: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await callSenseiAI(SYSTEM_PROMPT, text.trim());
      if (reply) {
        setMessages(prev => [...prev.slice(-19), { role: 'model', text: reply, time: Date.now() }]);
      } else {
        setMessages(prev => [...prev.slice(-19), {
          role: 'model',
          text: 'The path is unclear. Ask again with clearer intent, warrior.',
          time: Date.now(),
        }]);
      }
    } catch (e) {
      setMessages(prev => [...prev.slice(-19), {
        role: 'model',
        text: 'The network is silent. Try again, warrior.',
        time: Date.now(),
      }]);
    }
    setLoading(false);
  }

  const handleQuickAction = (action: typeof QUICK_ACTIONS[0]) => {
    sendMessage(action.prompt);
  };

  const handleNewChat = () => {
    clearSenseiHistory();
    setMessages([{
      role: 'model',
      text: 'New session, warrior. Clean slate. What brings you to the dojo today?',
      time: Date.now(),
    }]);
  };

  return (
    <ScreenContainer safeTop safeBottom={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <LinearGradient
          colors={[colors.bg.primary, 'rgba(0,245,212,0.02)', colors.bg.primary]}
          style={StyleSheet.absoluteFill}
        />
        <View style={{ flex: 1 }}>
          {/* Header */}
          <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
            <View style={[styles.headerAvatar, { borderColor: colors.accent.gold, backgroundColor: colors.bg.secondary }]}>
              <KageText variant="kanji" style={{ fontSize: 28, color: colors.accent.gold }}>师</KageText>
            </View>
            <KageText variant="h3" letterSpacing={5} color={colors.accent.gold} style={{ fontSize: 11, marginTop: 8 }}>
              SENSEI
            </KageText>
            <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 7, letterSpacing: 2, marginTop: 2 }}>
              Your martial arts mentor
            </KageText>
            <Pressable onPress={handleNewChat} style={[styles.newChatBtn, { borderColor: colors.glass.border, backgroundColor: colors.glass.medium }]}>
              <KageText variant="caption" style={{ fontSize: 8, letterSpacing: 1.5, color: colors.accent.gold }}>NEW CHAT</KageText>
            </Pressable>
          </Animated.View>

          {/* Messages */}
          <ScrollView
            ref={scrollRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: spacing.md }}
            showsVerticalScrollIndicator={false}
          >
            {/* Quick Actions */}
            {messages.length <= 2 && (
              <Animated.View entering={FadeInDown.delay(200).duration(500)} style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
                <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 9, letterSpacing: 1.5, marginBottom: spacing.sm, textTransform: 'uppercase' }}>
                  Quick questions
                </KageText>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {QUICK_ACTIONS.map((action, i) => (
                    <Pressable
                      key={i}
                      onPress={() => handleQuickAction(action)}
                      style={[styles.quickChip, { backgroundColor: colors.glass.medium, borderColor: colors.glass.border }]}
                    >
                      <KageText variant="body" style={{ fontSize: 14, marginRight: 4 }}>{action.icon}</KageText>
                      <KageText variant="bodyBold" style={{ fontSize: 11, color: colors.text.primary }}>{action.label}</KageText>
                    </Pressable>
                  ))}
                </View>
              </Animated.View>
            )}

            {/* Chat Messages */}
            <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md, gap: spacing.sm }}>
              {messages.map((msg, i) => (
                <Animated.View key={`${msg.time}-${i}`} entering={FadeInUp.duration(300)}>
                  {/* Date separator */}
                  {(i === 0 || new Date(msg.time).toDateString() !== new Date(messages[i - 1].time).toDateString()) && (
                    <View style={{ alignItems: 'center', marginBottom: spacing.sm }}>
                      <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                        {new Date(msg.time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      </KageText>
                    </View>
                  )}
                  <View style={[styles.messageRow, msg.role === 'user' && { justifyContent: 'flex-end' }]}>
                    {msg.role === 'model' && (
                      <View style={[styles.avatar, { borderColor: colors.accent.gold, backgroundColor: colors.bg.secondary }]}>
                        <KageText variant="kanji" style={{ fontSize: 16, color: colors.accent.gold }}>师</KageText>
                      </View>
                    )}
                    <View style={[styles.bubbleWrapper, msg.role === 'user' && { alignItems: 'flex-end' }]}>
                      {msg.role === 'model' && (
                        <KageText variant="caption" color={colors.accent.gold} style={{ fontSize: 8, letterSpacing: 1.5, marginLeft: 8, marginBottom: 2 }}>
                          SENSEI
                        </KageText>
                      )}
                      <View
                        style={[styles.bubble, {
                          backgroundColor: msg.role === 'user' ? colors.glass.light : colors.bg.secondary,
                          borderColor: msg.role === 'user' ? colors.glass.border : colors.accent.gold + '40',
                          borderBottomRightRadius: msg.role === 'user' ? 2 : 14,
                          borderBottomLeftRadius: msg.role === 'model' ? 2 : 14,
                        }]}
                      >
                        <KageText variant="body" style={{ fontSize: 12.5, lineHeight: 18, color: msg.role === 'user' ? colors.text.primary : colors.text.secondary }}>
                          {msg.text}
                        </KageText>
                      </View>
                      <KageText variant="caption" style={{ fontSize: 7, color: colors.text.muted, marginTop: 3, marginHorizontal: 4, opacity: 0.5 }}>
                        {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </KageText>
                    </View>
                    {msg.role === 'user' && (
                      <View style={[styles.avatar, { borderColor: colors.accent.cyan, backgroundColor: colors.glass.medium }]}>
                        <KageText variant="kanji" style={{ fontSize: 14, color: colors.accent.cyan }}>武</KageText>
                      </View>
                    )}
                  </View>
                </Animated.View>
              ))}
            </View>

            {/* Typing indicator */}
            {loading && <TypingIndicator colors={colors} />}

            <View style={{ height: 40 }} />
          </ScrollView>

          {/* Input */}
          <View style={[styles.inputArea, { backgroundColor: colors.bg.primary }]}>
            <View style={[styles.inputGlass, { backgroundColor: colors.glass.light, borderColor: colors.glass.border }]}>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Ask Sensei anything..."
                placeholderTextColor={colors.text.muted}
                multiline
                maxLength={500}
                style={{ flex: 1, fontSize: 13, color: colors.text.primary, paddingVertical: 0, maxHeight: 120 }}
                onSubmitEditing={() => { sendMessage(input); }}
              />
              <Pressable
                onPress={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                style={[styles.sendBtn, {
                  backgroundColor: input.trim() && !loading ? colors.accent.gold + '25' : colors.glass.medium,
                  borderColor: input.trim() && !loading ? colors.accent.gold : colors.glass.border,
                }]}
              >
                <KageText variant="body" style={{ fontSize: 16, opacity: input.trim() && !loading ? 1 : 0.4, color: input.trim() && !loading ? colors.accent.gold : colors.text.muted }}>➤</KageText>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  headerAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newChatBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 8,
  },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 4,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  bubbleWrapper: {
    maxWidth: '75%',
    alignItems: 'flex-start',
  },
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  typingBubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    maxWidth: '75%',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'flex-end',
    height: 18,
  },
  tdot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    opacity: 0.6,
  },
  inputArea: {
    borderTopWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: 90,
  },
  inputGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
