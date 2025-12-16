import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Avatar } from '@/components/ui/Avatar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { tasks } from '@/data/mockData';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [isUpdating, setIsUpdating] = useState(false);

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle.fill" size={64} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.text }]}>Task not found</Text>
          <Button title="Go Back" onPress={() => router.back()} variant="primary" />
        </View>
      </SafeAreaView>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'primary';
      case 'verified':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleUpdateProgress = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      Alert.alert('Progress Updated', 'Task progress has been updated successfully!');
    }, 1500);
  };

  const handleCompleteTask = () => {
    Alert.alert(
      'Complete Task',
      'Are you sure you want to mark this task as complete?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: () => {
            Alert.alert('Success', 'Task marked as complete!');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.backgroundSecondary }]}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Task Details</Text>
        <TouchableOpacity style={[styles.menuButton, { backgroundColor: colors.backgroundSecondary }]}>
          <IconSymbol name="gear" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Task Info Card */}
        <Card variant="elevated" style={styles.mainCard}>
          <View style={styles.badges}>
            <Badge label={task.priority} variant={getPriorityColor(task.priority) as any} />
            <Badge label={task.status.replace('_', ' ')} variant={getStatusColor(task.status) as any} />
          </View>

          <Text style={[styles.taskTitle, { color: colors.text }]}>{task.title}</Text>
          <Text style={[styles.taskDescription, { color: colors.textSecondary }]}>
            {task.description}
          </Text>

          {/* Progress Section */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressLabel, { color: colors.text }]}>Progress</Text>
              <Text style={[styles.progressValue, { color: colors.primary }]}>{task.progress}%</Text>
            </View>
            <ProgressBar
              progress={task.progress}
              height={10}
              variant={task.progress === 100 ? 'success' : 'primary'}
            />
          </View>
        </Card>

        {/* Location Card */}
        <Card variant="outlined" style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={[styles.infoIcon, { backgroundColor: colors.primaryLight }]}>
              <IconSymbol name="location.fill" size={20} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Location</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{task.location.name}</Text>
              <Text style={[styles.infoSubvalue, { color: colors.textMuted }]}>
                {task.location.address}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.directionBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/(tabs)/map')}
            >
              <IconSymbol name="arrow.right" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Time Info */}
        <View style={styles.timeGrid}>
          <Card variant="outlined" style={styles.timeCard}>
            <IconSymbol name="calendar" size={24} color={colors.info} />
            <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>Due Date</Text>
            <Text style={[styles.timeValue, { color: colors.text }]}>
              {formatDate(task.dueDate)}
            </Text>
          </Card>
          <Card variant="outlined" style={styles.timeCard}>
            <IconSymbol name="clock.fill" size={24} color={colors.warning} />
            <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>Time Spent</Text>
            <Text style={[styles.timeValue, { color: colors.text }]}>
              {task.actualHours || 0}h / {task.estimatedHours}h
            </Text>
          </Card>
        </View>

        {/* Assigned Worker */}
        <Card variant="outlined" style={styles.infoCard}>
          <View style={styles.workerRow}>
            <Avatar
              source={task.assignedTo.avatar}
              name={task.assignedTo.name}
              size={48}
              status={task.assignedTo.status}
            />
            <View style={styles.workerInfo}>
              <Text style={[styles.workerName, { color: colors.text }]}>{task.assignedTo.name}</Text>
              <Text style={[styles.workerRole, { color: colors.textSecondary }]}>
                {task.assignedTo.role}
              </Text>
            </View>
            <Badge label={task.assignedTo.status} variant="success" size="sm" />
          </View>
        </Card>

        {/* Photos Section */}
        <View style={styles.photosSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Work Photos ({task.photos.length})
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/upload')}>
              <Text style={[styles.addPhotoText, { color: colors.primary }]}>+ Add Photo</Text>
            </TouchableOpacity>
          </View>

          {task.photos.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.photoList}
            >
              {task.photos.map((photo) => (
                <TouchableOpacity key={photo.id} style={styles.photoCard}>
                  <Image source={{ uri: photo.uri }} style={styles.photoImage} contentFit="cover" />
                  {photo.aiVerified && (
                    <View style={[styles.photoBadge, { backgroundColor: colors.success }]}>
                      <IconSymbol name="checkmark" size={12} color="#FFFFFF" />
                      <Text style={styles.photoBadgeText}>Verified</Text>
                    </View>
                  )}
                  <View style={[styles.photoOverlay, { backgroundColor: colors.overlay }]}>
                    <Text style={styles.photoCaption} numberOfLines={1}>
                      {photo.caption || 'No caption'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.addPhotoCard, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
                onPress={() => router.push('/(tabs)/upload')}
              >
                <IconSymbol name="plus" size={32} color={colors.textMuted} />
                <Text style={[styles.addPhotoLabel, { color: colors.textMuted }]}>Add Photo</Text>
              </TouchableOpacity>
            </ScrollView>
          ) : (
            <Card variant="outlined" style={styles.emptyPhotos}>
              <IconSymbol name="camera.fill" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No photos uploaded yet
              </Text>
              <Button
                title="Upload Photo"
                onPress={() => router.push('/(tabs)/upload')}
                variant="primary"
                size="sm"
                icon={<IconSymbol name="camera.fill" size={16} color="#FFFFFF" />}
              />
            </Card>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          {task.status !== 'completed' && (
            <>
              <Button
                title="Update Progress"
                onPress={handleUpdateProgress}
                variant="outline"
                fullWidth
                loading={isUpdating}
                icon={<IconSymbol name="arrow.up.circle.fill" size={20} color={colors.primary} />}
              />
              <View style={{ height: Spacing.sm }} />
              <Button
                title="Mark as Complete"
                onPress={handleCompleteTask}
                variant="primary"
                fullWidth
                icon={<IconSymbol name="checkmark.circle.fill" size={20} color="#FFFFFF" />}
              />
            </>
          )}
          {task.status === 'completed' && (
            <View style={[styles.completedBanner, { backgroundColor: colors.successLight }]}>
              <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
              <Text style={[styles.completedText, { color: colors.success }]}>
                This task has been completed
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  badges: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  taskTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.sm,
  },
  taskDescription: {
    fontSize: FontSizes.md,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  progressSection: {
    marginTop: Spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  progressLabel: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  progressValue: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  infoCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FontSizes.sm,
  },
  infoValue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  infoSubvalue: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  directionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeGrid: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  timeCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  timeLabel: {
    fontSize: FontSizes.sm,
    marginTop: Spacing.sm,
  },
  timeValue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginTop: 2,
    textAlign: 'center',
  },
  workerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workerInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  workerName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  workerRole: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  photosSection: {
    marginTop: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  addPhotoText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
  },
  photoList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  photoCard: {
    width: 160,
    height: 120,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoBadge: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: 2,
  },
  photoBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: FontWeights.semibold,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.xs,
  },
  photoCaption: {
    color: '#FFFFFF',
    fontSize: FontSizes.xs,
  },
  addPhotoCard: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoLabel: {
    fontSize: FontSizes.sm,
    marginTop: Spacing.xs,
  },
  emptyPhotos: {
    marginHorizontal: Spacing.lg,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSizes.md,
    marginVertical: Spacing.md,
  },
  actions: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  completedText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  errorText: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
  },
});

