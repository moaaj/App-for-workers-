import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { tasks, mockPhotos } from '@/data/mockData';

export default function UploadScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const activeTasks = tasks.filter((t) => t.status === 'in_progress' || t.status === 'pending');

  const handleSelectImage = () => {
    // Simulate image selection
    const demoImages = [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    ];
    const randomImage = demoImages[Math.floor(Math.random() * demoImages.length)];
    if (selectedImages.length < 5) {
      setSelectedImages([...selectedImages, randomImage]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (!selectedTask) {
      Alert.alert('Select Task', 'Please select a task to associate with these photos.');
      return;
    }
    if (selectedImages.length === 0) {
      Alert.alert('Add Photos', 'Please add at least one photo to upload.');
      return;
    }

    setIsUploading(true);
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      Alert.alert(
        'Upload Successful! 🎉',
        'Your photos have been uploaded and are being analyzed by AI.',
        [
          {
            text: 'View AI Analysis',
            onPress: () => router.push('/(tabs)/ai'),
          },
          { text: 'Done', style: 'cancel' },
        ]
      );
      setSelectedImages([]);
      setCaption('');
      setSelectedTask(null);
    }, 2000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Upload Work Photos</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Document your progress with photos
          </Text>
        </View>

        {/* Select Task */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Task</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.taskScroll}
          contentContainerStyle={styles.taskScrollContent}
        >
          {activeTasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={[
                styles.taskChip,
                {
                  backgroundColor:
                    selectedTask === task.id ? colors.primary : colors.backgroundSecondary,
                  borderColor: selectedTask === task.id ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setSelectedTask(task.id)}
            >
              <IconSymbol
                name="checklist"
                size={18}
                color={selectedTask === task.id ? '#FFFFFF' : colors.textSecondary}
              />
              <Text
                style={[
                  styles.taskChipText,
                  { color: selectedTask === task.id ? '#FFFFFF' : colors.text },
                ]}
                numberOfLines={1}
              >
                {task.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Photo Upload Area */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Photos</Text>
        <View style={styles.photoSection}>
          {/* Upload Button */}
          <TouchableOpacity
            style={[
              styles.uploadBox,
              {
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
              },
            ]}
            onPress={handleSelectImage}
          >
            <View style={[styles.uploadIconCircle, { backgroundColor: colors.primaryLight }]}>
              <IconSymbol name="camera.fill" size={32} color={colors.primary} />
            </View>
            <Text style={[styles.uploadTitle, { color: colors.text }]}>Take or Select Photo</Text>
            <Text style={[styles.uploadSubtitle, { color: colors.textSecondary }]}>
              Tap to capture or choose from gallery
            </Text>
            <View style={styles.uploadHints}>
              <View style={styles.hintItem}>
                <IconSymbol name="checkmark" size={14} color={colors.success} />
                <Text style={[styles.hintText, { color: colors.textSecondary }]}>Clear lighting</Text>
              </View>
              <View style={styles.hintItem}>
                <IconSymbol name="checkmark" size={14} color={colors.success} />
                <Text style={[styles.hintText, { color: colors.textSecondary }]}>Show work area</Text>
              </View>
              <View style={styles.hintItem}>
                <IconSymbol name="checkmark" size={14} color={colors.success} />
                <Text style={[styles.hintText, { color: colors.textSecondary }]}>Include details</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Selected Images */}
          {selectedImages.length > 0 && (
            <View style={styles.selectedImages}>
              <View style={styles.selectedHeader}>
                <Text style={[styles.selectedCount, { color: colors.text }]}>
                  {selectedImages.length}/5 photos selected
                </Text>
                <TouchableOpacity onPress={() => setSelectedImages([])}>
                  <Text style={[styles.clearAll, { color: colors.error }]}>Clear All</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.imageList}
              >
                {selectedImages.map((uri, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image source={{ uri }} style={styles.selectedImage} contentFit="cover" />
                    <TouchableOpacity
                      style={[styles.removeButton, { backgroundColor: colors.error }]}
                      onPress={() => handleRemoveImage(index)}
                    >
                      <IconSymbol name="xmark" size={14} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                ))}
                {selectedImages.length < 5 && (
                  <TouchableOpacity
                    style={[
                      styles.addMoreButton,
                      { backgroundColor: colors.backgroundSecondary, borderColor: colors.border },
                    ]}
                    onPress={handleSelectImage}
                  >
                    <IconSymbol name="plus" size={24} color={colors.textMuted} />
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Caption Input */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Add Caption (Optional)</Text>
        <View
          style={[
            styles.captionContainer,
            { backgroundColor: colors.backgroundSecondary, borderColor: colors.border },
          ]}
        >
          <TextInput
            style={[styles.captionInput, { color: colors.text }]}
            placeholder="Describe your work progress..."
            placeholderTextColor={colors.textMuted}
            value={caption}
            onChangeText={setCaption}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          <Text style={[styles.captionCount, { color: colors.textMuted }]}>
            {caption.length}/200
          </Text>
        </View>

        {/* AI Analysis Preview */}
        <Card variant="outlined" style={styles.aiPreview}>
          <View style={styles.aiHeader}>
            <View style={[styles.aiIcon, { backgroundColor: colors.primaryLight }]}>
              <IconSymbol name="sparkles" size={20} color={colors.primary} />
            </View>
            <View style={styles.aiInfo}>
              <Text style={[styles.aiTitle, { color: colors.text }]}>AI Work Verification</Text>
              <Text style={[styles.aiSubtitle, { color: colors.textSecondary }]}>
                Photos will be automatically analyzed
              </Text>
            </View>
          </View>
          <View style={styles.aiFeatures}>
            <View style={styles.aiFeature}>
              <IconSymbol name="checkmark.circle.fill" size={16} color={colors.success} />
              <Text style={[styles.aiFeatureText, { color: colors.textSecondary }]}>
                Work progress detection
              </Text>
            </View>
            <View style={styles.aiFeature}>
              <IconSymbol name="checkmark.circle.fill" size={16} color={colors.success} />
              <Text style={[styles.aiFeatureText, { color: colors.textSecondary }]}>
                Safety equipment check
              </Text>
            </View>
            <View style={styles.aiFeature}>
              <IconSymbol name="checkmark.circle.fill" size={16} color={colors.success} />
              <Text style={[styles.aiFeatureText, { color: colors.textSecondary }]}>
                Quality assessment
              </Text>
            </View>
          </View>
        </Card>

        {/* Recent Uploads */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Uploads</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recentList}
        >
          {mockPhotos.map((photo) => (
            <Card key={photo.id} variant="outlined" style={styles.recentCard} padding="sm">
              <Image source={{ uri: photo.uri }} style={styles.recentImage} contentFit="cover" />
              <View style={styles.recentInfo}>
                <Text style={[styles.recentCaption, { color: colors.text }]} numberOfLines={1}>
                  {photo.caption || 'No caption'}
                </Text>
                <View style={styles.recentMeta}>
                  {photo.aiVerified ? (
                    <Badge label="AI Verified" variant="success" size="sm" />
                  ) : (
                    <Badge label="Pending" variant="warning" size="sm" />
                  )}
                </View>
              </View>
            </Card>
          ))}
        </ScrollView>

        {/* Upload Button */}
        <View style={styles.uploadButtonContainer}>
          <Button
            title={isUploading ? 'Uploading...' : 'Upload Photos'}
            onPress={handleUpload}
            variant="primary"
            size="lg"
            fullWidth
            loading={isUploading}
            disabled={selectedImages.length === 0 || !selectedTask}
            icon={<IconSymbol name="arrow.up.circle.fill" size={22} color="#FFFFFF" />}
          />
        </View>

        <View style={{ height: Spacing.xxl * 2 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
  },
  subtitle: {
    fontSize: FontSizes.md,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  taskScroll: {
    maxHeight: 50,
  },
  taskScrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  taskChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: Spacing.xs,
    maxWidth: 200,
  },
  taskChipText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  photoSection: {
    paddingHorizontal: Spacing.lg,
  },
  uploadBox: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  uploadIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  uploadTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  uploadSubtitle: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.md,
  },
  uploadHints: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  hintItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  hintText: {
    fontSize: FontSizes.sm,
  },
  selectedImages: {
    marginTop: Spacing.lg,
  },
  selectedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  selectedCount: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  clearAll: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
  },
  imageList: {
    gap: Spacing.sm,
  },
  imageWrapper: {
    position: 'relative',
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.md,
  },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMoreButton: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captionContainer: {
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
  },
  captionInput: {
    fontSize: FontSizes.md,
    minHeight: 80,
  },
  captionCount: {
    fontSize: FontSizes.xs,
    textAlign: 'right',
    marginTop: Spacing.xs,
  },
  aiPreview: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  aiIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  aiInfo: {
    flex: 1,
  },
  aiTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  aiSubtitle: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  aiFeatures: {
    gap: Spacing.sm,
  },
  aiFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  aiFeatureText: {
    fontSize: FontSizes.sm,
  },
  recentList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  recentCard: {
    width: 160,
  },
  recentImage: {
    width: '100%',
    height: 100,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  recentInfo: {},
  recentCaption: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xs,
  },
  recentMeta: {
    flexDirection: 'row',
  },
  uploadButtonContainer: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
});

