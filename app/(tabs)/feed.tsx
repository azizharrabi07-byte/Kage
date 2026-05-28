import React, { useState, useCallback } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useFocusEffect } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { KageText } from '@/components/ui/KageText';
import { KageButton } from '@/components/ui/KageButton';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { useColors, spacing } from '@/theme';
import { getFeed, createPost, likePost, addComment, type Post } from '@/store/socialStore';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const POST_TYPES = [
  { key: 'status', label: 'STATUS', icon: '✦' },
  { key: 'motivation', label: 'FIRE', icon: '🔥' },
  { key: 'question', label: 'ASK', icon: '❓' },
  { key: 'victory', label: 'WIN', icon: '⚔' },
] as const;

type PostType = typeof POST_TYPES[number]['key'];

export default function FeedScreen() {
  const colors = useColors();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [composerOpen, setComposerOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedType, setSelectedType] = useState<PostType>('status');
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useFocusEffect(
    useCallback(() => {
      loadFeed();
    }, [])
  );

  async function loadFeed() {
    setLoading(true);
    const data = await getFeed();
    setPosts(data);
    setLoading(false);
  }

  async function handlePost() {
    const text = message.trim();
    if (!text) return;
    const typeMap: Record<PostType, Post['type']> = {
      status: 'status',
      motivation: 'streak',
      question: 'status',
      victory: 'workout_complete',
    };
    await createPost({
      userId: 'kage_warrior',
      username: 'Warrior',
      rank: '影',
      type: typeMap[selectedType],
      message: text,
    });
    setMessage('');
    setComposerOpen(false);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    await loadFeed();
  }

  async function handleLike(postId: string) {
    const updated = await likePost(postId, 'kage_warrior');
    setPosts(updated);
  }

  async function handleComment(postId: string) {
    const text = commentText[postId]?.trim();
    if (!text) return;
    const updated = await addComment(postId, 'kage_warrior', 'Warrior', text);
    setCommentText(prev => ({ ...prev, [postId]: '' }));
    setPosts(updated);
  }

  function toggleExpand(postId: string) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => ({ ...prev, [postId]: !prev[postId] }));
  }

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={{ paddingTop: 50, paddingHorizontal: spacing.lg, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(60).duration(500)} style={{ marginBottom: spacing.lg, alignItems: 'center' }}>
          <KageText variant="caption" letterSpacing={4} color={colors.accent.gold} style={{ fontSize: 8 }}>THE DOJO CHRONICLES</KageText>
          <KageText variant="h3" letterSpacing={3}>FEED</KageText>
          <KageText variant="caption" color={colors.text.muted} style={{ marginTop: 4 }}>Share your path. Draw strength from the clan.</KageText>
        </Animated.View>

        {/* Composer */}
        <Animated.View entering={FadeInDown.delay(120).duration(500)} style={{ marginBottom: spacing.md }}>
          <GlassContainer padding={spacing.md} style={{ borderRadius: 14 }}>
            {!composerOpen ? (
              <TouchableOpacity onPress={() => setComposerOpen(true)} style={{ alignItems: 'center', paddingVertical: 8 }}>
                <KageText variant="bodyBold" color={colors.accent.cyan} style={{ fontSize: 13, letterSpacing: 1 }}>✉ SHARE A MESSAGE</KageText>
                <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 9, marginTop: 2 }}>Upload your victories, questions, or fire to the feed</KageText>
              </TouchableOpacity>
            ) : (
              <View style={{ gap: spacing.sm }}>
                <KageText variant="caption" color={colors.accent.gold} style={{ fontSize: 8, letterSpacing: 1.5 }}>WHAT ARE YOU SENDING?</KageText>
                <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                  {POST_TYPES.map(t => (
                    <TouchableOpacity
                      key={t.key}
                      onPress={() => setSelectedType(t.key)}
                      style={{
                        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
                        backgroundColor: selectedType === t.key ? colors.accent.primary : colors.glass.light,
                        borderWidth: 1, borderColor: selectedType === t.key ? colors.accent.primary : colors.glass.border,
                      }}
                    >
                      <KageText variant="caption" style={{ fontSize: 10, color: selectedType === t.key ? '#fff' : colors.text.secondary }}>
                        {t.icon} {t.label}
                      </KageText>
                    </TouchableOpacity>
                  ))}
                </View>

                <TextInput
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Speak from the heart, warrior..."
                  placeholderTextColor={colors.text.muted}
                  multiline
                  style={{
                    minHeight: 80, backgroundColor: colors.glass.light, borderRadius: 10,
                    padding: 12, fontSize: 14, color: colors.text.primary,
                    borderWidth: 1, borderColor: colors.glass.border, textAlignVertical: 'top',
                  }}
                />

                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <KageButton title="CANCEL" variant="ghost" size="sm" onPress={() => { setComposerOpen(false); setMessage(''); }} style={{ flex: 1 }} />
                  <KageButton title="SHARE TO FEED" variant="primary" size="sm" onPress={handlePost} style={{ flex: 1 }} />
                </View>
              </View>
            )}
          </GlassContainer>
        </Animated.View>

        {/* Feed List */}
        {loading ? (
          <GlassContainer padding={spacing.lg} style={{ alignItems: 'center' }}>
            <KageText variant="body" color={colors.text.muted}>Loading the chronicles...</KageText>
          </GlassContainer>
        ) : posts.length === 0 ? (
          <GlassContainer padding={spacing.xl} style={{ alignItems: 'center', gap: 8 }}>
            <KageText variant="kanji" style={{ fontSize: 28, color: colors.accent.gold, opacity: 0.6 }}>影</KageText>
            <KageText variant="bodyBold" color={colors.text.primary}>The scroll is empty</KageText>
            <KageText variant="caption" color={colors.text.muted} align="center" style={{ maxWidth: 260 }}>
              Be the first to post. Complete workouts or tap SHARE A MESSAGE above to inspire the clan.
            </KageText>
          </GlassContainer>
        ) : (
          posts.map((post, idx) => (
            <Animated.View key={post.id} entering={FadeInDown.delay(80 + Math.min(idx, 8) * 30).duration(400)} style={{ marginBottom: spacing.sm }}>
              <GlassContainer padding={spacing.md} intensity="light" glow={idx === 0 ? 'subtle' : undefined}>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                  <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.glass.medium, alignItems: 'center', justifyContent: 'center' }}>
                    <KageText variant="kanji" style={{ fontSize: 16, color: colors.accent.primary }}>{post.rank || '影'}</KageText>
                  </View>
                  <View style={{ flex: 1 }}>
                    <KageText variant="bodyBold" style={{ fontSize: 13, color: colors.text.primary }}>{post.username || 'Warrior'}</KageText>
                    <KageText variant="caption" style={{ fontSize: 9, color: colors.text.muted }}>
                      {post.type.replace('_', ' ')} · {new Date(post.createdAt).toLocaleDateString()}
                    </KageText>
                  </View>
                  {post.xp != null && (
                    <View style={{ backgroundColor: colors.glass.light, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                      <KageText variant="mono" style={{ fontSize: 10, color: colors.accent.gold }}>+{post.xp} XP</KageText>
                    </View>
                  )}
                </View>

                <KageText variant="body" style={{ fontSize: 14, color: colors.text.secondary, lineHeight: 20, marginBottom: 10 }}>
                  {post.message}
                </KageText>

                <View style={{ flexDirection: 'row', gap: spacing.lg, alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => handleLike(post.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <KageText style={{ fontSize: 14 }}>❤</KageText>
                    <KageText variant="caption" color={colors.text.muted}>{post.likes || 0}</KageText>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => toggleExpand(post.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <KageText style={{ fontSize: 14 }}>💬</KageText>
                    <KageText variant="caption" color={colors.text.muted}>{post.comments?.length || 0}</KageText>
                  </TouchableOpacity>
                </View>

                {expanded[post.id] && (
                  <View style={{ marginTop: 10, gap: 6, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.glass.border }}>
                    {(post.comments || []).map((c: any, i: number) => (
                      <KageText key={i} variant="caption" style={{ fontSize: 12, color: colors.text.secondary }}>
                        <KageText variant="bodyBold" color={colors.accent.gold}>{c.username || 'Warrior'}: </KageText>
                        {c.text}
                      </KageText>
                    ))}
                    <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                      <TextInput
                        value={commentText[post.id] || ''}
                        onChangeText={(t) => setCommentText(prev => ({ ...prev, [post.id]: t }))}
                        placeholder="Comment as Warrior..."
                        placeholderTextColor={colors.text.muted}
                        style={{
                          flex: 1, height: 36, backgroundColor: colors.glass.light, borderRadius: 8,
                          paddingHorizontal: 10, fontSize: 12, color: colors.text.primary,
                          borderWidth: 1, borderColor: colors.glass.border,
                        }}
                        onSubmitEditing={() => handleComment(post.id)}
                      />
                      <TouchableOpacity onPress={() => handleComment(post.id)} style={{ paddingHorizontal: 14, justifyContent: 'center', backgroundColor: colors.accent.primary, borderRadius: 8 }}>
                        <KageText variant="caption" style={{ color: '#fff', fontSize: 11 }}>SEND</KageText>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </GlassContainer>
            </Animated.View>
          ))
        )}

        <KageText variant="caption" align="center" color={colors.text.muted} style={{ marginTop: spacing.lg, fontSize: 9, letterSpacing: 2 }}>
          YOUR VOICE STRENGTHENS THE CLAN
        </KageText>
      </ScrollView>
    </ScreenContainer>
  );
}
