import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Avatar } from '@/components/ui/Avatar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { currentWorker, tasks, dailyStats, weeklyProgress, notifications } from '@/data/mockData';

export default function DashboardScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const todayStats = dailyStats[0];
  const activeTasks = tasks.filter((t) => t.status === 'in_progress');
  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              {getGreeting()},
            </Text>
            <Text style={[styles.userName, { color: colors.text }]}>
              {currentWorker.name.split(' ')[0]} 👋
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={[styles.notificationBtn, { backgroundColor: colors.backgroundSecondary }]}
            >
              <IconSymbol name="bell.fill" size={22} color={colors.icon} />
              {unreadNotifications > 0 && (
                <View style={[styles.notificationBadge, { backgroundColor: colors.error }]}>
                  <Text style={styles.notificationCount}>{unreadNotifications}</Text>
                </View>
              )}
            </TouchableOpacity>
            <Avatar
              source={currentWorker.avatar}
              name={currentWorker.name}
              size={44}
              status={currentWorker.status}
            />
          </View>
        </View>

        {/* Weekly Progress Card */}
        <Card variant="elevated" style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={[styles.progressTitle, { color: colors.text }]}>Weekly Progress</Text>
              <Text style={[styles.progressSubtitle, { color: colors.textSecondary }]}>
                {weeklyProgress.completed} of {weeklyProgress.total} tasks done
              </Text>
            </View>
            <View style={[styles.progressCircle, { borderColor: colors.primary }]}>
              <Text style={[styles.progressPercent, { color: colors.primary }]}>
                {weeklyProgress.percentage}%
              </Text>
            </View>
          </View>
          <ProgressBar progress={weeklyProgress.percentage} height={10} variant="primary" />
        </Card>

        {/* Quick Stats */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Overview</Text>
        <View style={styles.statsGrid}>
          <Card variant="outlined" style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.successLight }]}>
              <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{todayStats.tasksCompleted}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Completed</Text>
          </Card>
          <Card variant="outlined" style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.infoLight }]}>
              <IconSymbol name="camera.fill" size={24} color={colors.info} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{todayStats.photosUploaded}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Photos</Text>
          </Card>
          <Card variant="outlined" style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.warningLight }]}>
              <IconSymbol name="clock.fill" size={24} color={colors.warning} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{todayStats.hoursWorked}h</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Hours</Text>
          </Card>
          <Card variant="outlined" style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.primaryLight }]}>
              <IconSymbol name="sparkles" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{todayStats.aiVerifications}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>AI Verified</Text>
          </Card>
        </View>

        {/* Active Tasks */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Active Tasks</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/tasks')}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>

        {activeTasks.length > 0 ? (
          activeTasks.map((task) => (
            <Card
              key={task.id}
              variant="elevated"
              style={styles.taskCard}
              onPress={() => router.push({ pathname: '/task-detail', params: { id: task.id } })}
            >
              <View style={styles.taskHeader}>
                <View style={styles.taskTitleRow}>
                  <Badge
                    label={task.priority}
                    variant={getPriorityColor(task.priority) as any}
                    size="sm"
                  />
                  <Badge label={task.status.replace('_', ' ')} variant="primary" size="sm" />
                </View>
              </View>
              <Text style={[styles.taskTitle, { color: colors.text }]}>{task.title}</Text>
              <View style={styles.taskLocation}>
                <IconSymbol name="location.fill" size={16} color={colors.textSecondary} />
                <Text style={[styles.taskLocationText, { color: colors.textSecondary }]}>
                  {task.location.name}
                </Text>
              </View>
              <View style={styles.taskProgress}>
                <View style={styles.taskProgressInfo}>
                  <Text style={[styles.taskProgressLabel, { color: colors.textMuted }]}>
                    Progress
                  </Text>
                  <Text style={[styles.taskProgressValue, { color: colors.text }]}>
                    {task.progress}%
                  </Text>
                </View>
                <ProgressBar
                  progress={task.progress}
                  height={6}
                  variant={task.progress >= 75 ? 'success' : 'primary'}
                />
              </View>
            </Card>
          ))
        ) : (
          <Card variant="outlined" style={styles.emptyCard}>
            <IconSymbol name="checkmark.circle.fill" size={48} color={colors.success} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No active tasks right now
            </Text>
          </Card>
        )}

        {/* Upcoming Tasks */}
        {pendingTasks.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: Spacing.lg }]}>
              Upcoming Tasks
            </Text>
            {pendingTasks.slice(0, 2).map((task) => (
              <Card
                key={task.id}
                variant="outlined"
                style={styles.upcomingCard}
                onPress={() => router.push({ pathname: '/task-detail', params: { id: task.id } })}
              >
                <View style={styles.upcomingContent}>
                  <View style={[styles.upcomingIcon, { backgroundColor: colors.backgroundSecondary }]}>
                    <IconSymbol name="calendar" size={20} color={colors.icon} />
                  </View>
                  <View style={styles.upcomingInfo}>
                    <Text style={[styles.upcomingTitle, { color: colors.text }]}>{task.title}</Text>
                    <Text style={[styles.upcomingLocation, { color: colors.textSecondary }]}>
                      {task.location.name}
                    </Text>
                  </View>
                  <IconSymbol name="chevron.right" size={20} color={colors.textMuted} />
                </View>
              </Card>
            ))}
          </>
        )}

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: Spacing.lg }]}>
          Quick Actions
        </Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/(tabs)/upload')}
          >
            <IconSymbol name="camera.fill" size={28} color="#FFFFFF" />
            <Text style={styles.actionText}>Upload Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.info }]}
            onPress={() => router.push('/(tabs)/map')}
          >
            <IconSymbol name="map.fill" size={28} color="#FFFFFF" />
            <Text style={styles.actionText}>View Map</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.success }]}
            onPress={() => router.push('/(tabs)/ai')}
          >
            <IconSymbol name="sparkles" size={28} color="#FFFFFF" />
            <Text style={styles.actionText}>AI Verify</Text>
          </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  headerLeft: {},
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  greeting: {
    fontSize: FontSizes.md,
  },
  userName: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationCount: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: FontWeights.bold,
  },
  progressCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  progressTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  progressSubtitle: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  progressCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercent: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  seeAll: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  taskCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  taskHeader: {
    marginBottom: Spacing.sm,
  },
  taskTitleRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  taskTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  taskLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  taskLocationText: {
    fontSize: FontSizes.sm,
  },
  taskProgress: {},
  taskProgressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  taskProgressLabel: {
    fontSize: FontSizes.sm,
  },
  taskProgressValue: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
  },
  emptyCard: {
    marginHorizontal: Spacing.lg,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSizes.md,
    marginTop: Spacing.sm,
  },
  upcomingCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  upcomingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upcomingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  upcomingLocation: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  actionsGrid: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
  },
});
