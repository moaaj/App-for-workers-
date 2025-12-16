import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { tasks, locations } from '@/data/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MapScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const getTasksForLocation = (locationId: string) => {
    return tasks.filter((t) => t.location.id === locationId);
  };

  const getLocationStatus = (locationId: string) => {
    const locationTasks = getTasksForLocation(locationId);
    if (locationTasks.some((t) => t.status === 'in_progress')) return 'active';
    if (locationTasks.some((t) => t.status === 'pending')) return 'pending';
    return 'completed';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return colors.primary;
      case 'pending':
        return colors.warning;
      case 'completed':
        return colors.success;
      default:
        return colors.textMuted;
    }
  };

  const selectedLocationData = locations.find((l) => l.id === selectedLocation);
  const selectedLocationTasks = selectedLocation ? getTasksForLocation(selectedLocation) : [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Work Locations</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {locations.length} locations • {tasks.filter((t) => t.status === 'in_progress').length} active
          </Text>
        </View>
        <View style={[styles.viewToggle, { backgroundColor: colors.backgroundSecondary }]}>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              viewMode === 'map' && { backgroundColor: colors.card },
            ]}
            onPress={() => setViewMode('map')}
          >
            <IconSymbol
              name="map.fill"
              size={18}
              color={viewMode === 'map' ? colors.primary : colors.textMuted}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              viewMode === 'list' && { backgroundColor: colors.card },
            ]}
            onPress={() => setViewMode('list')}
          >
            <IconSymbol
              name="list.bullet"
              size={18}
              color={viewMode === 'list' ? colors.primary : colors.textMuted}
            />
          </TouchableOpacity>
        </View>
      </View>

      {viewMode === 'map' ? (
        <>
          {/* Map Placeholder - In production, use react-native-maps */}
          <View style={[styles.mapContainer, { backgroundColor: colors.backgroundSecondary }]}>
            <View style={[styles.mapPlaceholder, { borderColor: colors.border }]}>
              {/* Simulated Map with Location Pins */}
              <View style={styles.mapGrid}>
                {locations.map((location, index) => {
                  const status = getLocationStatus(location.id);
                  const isSelected = selectedLocation === location.id;
                  // Position pins in a grid pattern for demo
                  const positions = [
                    { top: '20%', left: '30%' },
                    { top: '35%', left: '65%' },
                    { top: '55%', left: '25%' },
                    { top: '70%', left: '55%' },
                  ];
                  const pos = positions[index % positions.length];

                  return (
                    <TouchableOpacity
                      key={location.id}
                      style={[
                        styles.mapPin,
                        {
                          top: pos.top,
                          left: pos.left,
                          backgroundColor: isSelected ? colors.primary : getStatusColor(status),
                          transform: [{ scale: isSelected ? 1.2 : 1 }],
                        },
                      ]}
                      onPress={() => setSelectedLocation(location.id)}
                    >
                      <IconSymbol name="location.fill" size={20} color="#FFFFFF" />
                      {isSelected && (
                        <View style={[styles.pinPulse, { borderColor: colors.primary }]} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Map Legend */}
              <View style={[styles.mapLegend, { backgroundColor: colors.card }]}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.legendText, { color: colors.textSecondary }]}>Active</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
                  <Text style={[styles.legendText, { color: colors.textSecondary }]}>Pending</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
                  <Text style={[styles.legendText, { color: colors.textSecondary }]}>Done</Text>
                </View>
              </View>

              {/* Map Controls */}
              <View style={styles.mapControls}>
                <TouchableOpacity
                  style={[styles.mapControlBtn, { backgroundColor: colors.card }]}
                >
                  <IconSymbol name="plus" size={20} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.mapControlBtn, { backgroundColor: colors.card }]}
                >
                  <Text style={[styles.minusText, { color: colors.text }]}>−</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.mapControlBtn, { backgroundColor: colors.primary }]}
                >
                  <IconSymbol name="location.fill" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Selected Location Details */}
          {selectedLocationData && (
            <View style={styles.locationDetails}>
              <Card variant="elevated" style={styles.locationCard}>
                <View style={styles.locationHeader}>
                  <View style={[styles.locationIcon, { backgroundColor: colors.primaryLight }]}>
                    <IconSymbol name="pin.fill" size={20} color={colors.primary} />
                  </View>
                  <View style={styles.locationInfo}>
                    <Text style={[styles.locationName, { color: colors.text }]}>
                      {selectedLocationData.name}
                    </Text>
                    <Text style={[styles.locationAddress, { color: colors.textSecondary }]}>
                      {selectedLocationData.address}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedLocation(null)}>
                    <IconSymbol name="xmark" size={20} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>

                <View style={styles.locationTasks}>
                  <Text style={[styles.tasksTitle, { color: colors.text }]}>
                    Tasks at this location ({selectedLocationTasks.length})
                  </Text>
                  {selectedLocationTasks.slice(0, 2).map((task) => (
                    <TouchableOpacity
                      key={task.id}
                      style={[styles.taskItem, { backgroundColor: colors.backgroundSecondary }]}
                      onPress={() => router.push({ pathname: '/task-detail', params: { id: task.id } })}
                    >
                      <View style={styles.taskItemContent}>
                        <Text style={[styles.taskItemTitle, { color: colors.text }]}>
                          {task.title}
                        </Text>
                        <Badge
                          label={task.status.replace('_', ' ')}
                          variant={task.status === 'completed' ? 'success' : 'primary'}
                          size="sm"
                        />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

                <Button
                  title="Get Directions"
                  onPress={() => {}}
                  variant="primary"
                  fullWidth
                  icon={<IconSymbol name="arrow.right" size={18} color="#FFFFFF" />}
                  iconPosition="right"
                />
              </Card>
            </View>
          )}
        </>
      ) : (
        /* List View */
        <ScrollView showsVerticalScrollIndicator={false} style={styles.listContainer}>
          {locations.map((location) => {
            const locationTasks = getTasksForLocation(location.id);
            const status = getLocationStatus(location.id);

            return (
              <Card
                key={location.id}
                variant="elevated"
                style={styles.listCard}
                onPress={() => setSelectedLocation(location.id)}
              >
                <View style={styles.listCardHeader}>
                  <View style={[styles.listIcon, { backgroundColor: `${getStatusColor(status)}20` }]}>
                    <IconSymbol name="location.fill" size={24} color={getStatusColor(status)} />
                  </View>
                  <View style={styles.listInfo}>
                    <Text style={[styles.listName, { color: colors.text }]}>{location.name}</Text>
                    <Text style={[styles.listAddress, { color: colors.textSecondary }]}>
                      {location.address}
                    </Text>
                  </View>
                  <IconSymbol name="chevron.right" size={20} color={colors.textMuted} />
                </View>

                <View style={[styles.listDivider, { backgroundColor: colors.border }]} />

                <View style={styles.listStats}>
                  <View style={styles.listStat}>
                    <Text style={[styles.listStatValue, { color: colors.text }]}>
                      {locationTasks.length}
                    </Text>
                    <Text style={[styles.listStatLabel, { color: colors.textSecondary }]}>
                      Total Tasks
                    </Text>
                  </View>
                  <View style={styles.listStat}>
                    <Text style={[styles.listStatValue, { color: colors.primary }]}>
                      {locationTasks.filter((t) => t.status === 'in_progress').length}
                    </Text>
                    <Text style={[styles.listStatLabel, { color: colors.textSecondary }]}>
                      In Progress
                    </Text>
                  </View>
                  <View style={styles.listStat}>
                    <Text style={[styles.listStatValue, { color: colors.success }]}>
                      {locationTasks.filter((t) => t.status === 'completed').length}
                    </Text>
                    <Text style={[styles.listStatLabel, { color: colors.textSecondary }]}>
                      Completed
                    </Text>
                  </View>
                </View>
              </Card>
            );
          })}
          <View style={{ height: Spacing.xxl * 2 }} />
        </ScrollView>
      )}

      {/* Quick Location Cards (Map View) */}
      {viewMode === 'map' && !selectedLocation && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickLocations}
          contentContainerStyle={styles.quickLocationsContent}
        >
          {locations.map((location) => {
            const status = getLocationStatus(location.id);
            const taskCount = getTasksForLocation(location.id).length;

            return (
              <TouchableOpacity
                key={location.id}
                style={[styles.quickCard, { backgroundColor: colors.card }]}
                onPress={() => setSelectedLocation(location.id)}
              >
                <View style={[styles.quickStatus, { backgroundColor: getStatusColor(status) }]} />
                <Text style={[styles.quickName, { color: colors.text }]} numberOfLines={1}>
                  {location.name}
                </Text>
                <Text style={[styles.quickTasks, { color: colors.textSecondary }]}>
                  {taskCount} task{taskCount !== 1 ? 's' : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
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
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
  },
  subtitle: {
    fontSize: FontSizes.md,
    marginTop: Spacing.xs,
  },
  viewToggle: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: BorderRadius.md,
  },
  toggleBtn: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  mapContainer: {
    flex: 1,
    margin: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    position: 'relative',
    // Simulate a map background with gradient colors
    backgroundColor: '#E8F4EA',
  },
  mapGrid: {
    flex: 1,
    position: 'relative',
  },
  mapPin: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  pinPulse: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    opacity: 0.5,
  },
  mapLegend: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    flexDirection: 'row',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: FontSizes.xs,
  },
  mapControls: {
    position: 'absolute',
    right: Spacing.md,
    top: Spacing.md,
    gap: Spacing.xs,
  },
  mapControlBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  minusText: {
    fontSize: 24,
    fontWeight: FontWeights.bold,
    lineHeight: 24,
  },
  locationDetails: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  locationCard: {},
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  locationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  locationAddress: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  locationTasks: {
    marginBottom: Spacing.md,
  },
  tasksTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.sm,
  },
  taskItem: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
  },
  taskItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskItemTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    flex: 1,
    marginRight: Spacing.sm,
  },
  quickLocations: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: 0,
    right: 0,
  },
  quickLocationsContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  quickCard: {
    width: 150,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: Spacing.sm,
  },
  quickName: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    marginBottom: 2,
  },
  quickTasks: {
    fontSize: FontSizes.xs,
  },
  listContainer: {
    flex: 1,
    paddingTop: Spacing.sm,
  },
  listCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  listCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  listAddress: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  listDivider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  listStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  listStat: {
    alignItems: 'center',
  },
  listStatValue: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
  },
  listStatLabel: {
    fontSize: FontSizes.xs,
    marginTop: 2,
  },
});

