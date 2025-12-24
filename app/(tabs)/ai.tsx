import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image as RNImage,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { mockPhotos, workPhotoAssets } from '@/data/mockData';

// Helper to get image source
const getImageSource = (uri: string | number) => {
  if (typeof uri === 'string') {
    // Check if it's a key to our local assets
    if (uri in workPhotoAssets) {
      return workPhotoAssets[uri as keyof typeof workPhotoAssets];
    }
    // Otherwise treat as URL
    return { uri };
  }
  return uri;
};

export default function AIScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [selectedPhoto, setSelectedPhoto] = useState(mockPhotos[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2500);
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return { name: 'checkmark.circle.fill' as const, color: colors.success };
      case 'needs_review':
        return { name: 'exclamationmark.triangle.fill' as const, color: colors.warning };
      case 'rejected':
        return { name: 'xmark' as const, color: colors.error };
      default:
        return { name: 'sparkles' as const, color: colors.primary };
    }
  };

  const verifiedPhotos = mockPhotos.filter((p) => p.aiVerified);
  const pendingPhotos = mockPhotos.filter((p) => !p.aiVerified);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={[styles.aiIconLarge, { backgroundColor: colors.primaryLight }]}>
              <IconSymbol name="sparkles" size={32} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>AI Work Verification</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Automated proof analysis
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsRow}>
          <Card variant="outlined" style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.success }]}>{verifiedPhotos.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Verified</Text>
          </Card>
          <Card variant="outlined" style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.warning }]}>{pendingPhotos.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pending</Text>
          </Card>
          <Card variant="outlined" style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.primary }]}>96%</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Avg Score</Text>
          </Card>
        </View>

        {/* Selected Photo Analysis */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Photo Analysis</Text>
        <Card variant="elevated" style={styles.analysisCard}>
          {/* Photo Preview */}
          <View style={styles.photoPreview}>
            <RNImage
              source={getImageSource(selectedPhoto.uri)}
              style={styles.previewImage}
              resizeMode="cover"
            />
            {selectedPhoto.aiVerified && selectedPhoto.aiAnalysis && (
              <View style={[styles.verifiedBadge, { backgroundColor: colors.success }]}>
                <IconSymbol name="checkmark" size={14} color="#FFFFFF" />
                <Text style={styles.verifiedText}>AI Verified</Text>
              </View>
            )}
          </View>

          {/* Analysis Results */}
          {selectedPhoto.aiVerified && selectedPhoto.aiAnalysis ? (
            <View style={styles.analysisResults}>
              {/* Confidence Score */}
              <View style={styles.confidenceSection}>
                <View style={styles.confidenceHeader}>
                  <Text style={[styles.confidenceLabel, { color: colors.text }]}>
                    Confidence Score
                  </Text>
                  <Text style={[styles.confidenceValue, { color: colors.success }]}>
                    {selectedPhoto.aiAnalysis.confidence}%
                  </Text>
                </View>
                <ProgressBar
                  progress={selectedPhoto.aiAnalysis.confidence}
                  height={8}
                  variant="success"
                />
              </View>

              {/* Category */}
              <View style={styles.categorySection}>
                <Text style={[styles.categoryLabel, { color: colors.textSecondary }]}>
                  Detected Category
                </Text>
                <Badge label={selectedPhoto.aiAnalysis.category} variant="primary" />
              </View>

              {/* Details */}
              <View style={styles.detailsSection}>
                <Text style={[styles.detailsTitle, { color: colors.text }]}>Analysis Details</Text>
                {selectedPhoto.aiAnalysis.details.map((detail, index) => (
                  <View key={index} style={styles.detailItem}>
                    <IconSymbol name="checkmark.circle.fill" size={18} color={colors.success} />
                    <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                      {detail}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Verification Status */}
              <View
                style={[
                  styles.verificationStatus,
                  {
                    backgroundColor:
                      selectedPhoto.aiAnalysis.verificationStatus === 'verified'
                        ? colors.successLight
                        : colors.warningLight,
                  },
                ]}
              >
                <IconSymbol
                  name={getVerificationIcon(selectedPhoto.aiAnalysis.verificationStatus).name}
                  size={24}
                  color={getVerificationIcon(selectedPhoto.aiAnalysis.verificationStatus).color}
                />
                <View style={styles.verificationInfo}>
                  <Text style={[styles.verificationTitle, { color: colors.text }]}>
                    {selectedPhoto.aiAnalysis.verificationStatus === 'verified'
                      ? 'Work Verified Successfully'
                      : 'Needs Manual Review'}
                  </Text>
                  <Text style={[styles.verificationSubtitle, { color: colors.textSecondary }]}>
                    {selectedPhoto.aiAnalysis.verificationStatus === 'verified'
                      ? 'This photo meets all work proof requirements'
                      : 'Additional verification may be required'}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.pendingAnalysis}>
              <View style={[styles.pendingIcon, { backgroundColor: colors.warningLight }]}>
                <IconSymbol name="clock.fill" size={32} color={colors.warning} />
              </View>
              <Text style={[styles.pendingTitle, { color: colors.text }]}>Awaiting Analysis</Text>
              <Text style={[styles.pendingSubtitle, { color: colors.textSecondary }]}>
                This photo hasn't been analyzed yet
              </Text>
              <Button
                title={isAnalyzing ? 'Analyzing...' : 'Analyze Now'}
                onPress={handleAnalyze}
                variant="primary"
                loading={isAnalyzing}
                icon={<IconSymbol name="sparkles" size={18} color="#FFFFFF" />}
              />
            </View>
          )}
        </Card>

        {/* Photo Selection */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Photo</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.photoList}
        >
          {mockPhotos.map((photo) => (
            <TouchableOpacity
              key={photo.id}
              style={[
                styles.photoThumb,
                {
                  borderColor:
                    selectedPhoto.id === photo.id ? colors.primary : colors.border,
                  borderWidth: selectedPhoto.id === photo.id ? 3 : 1,
                },
              ]}
              onPress={() => setSelectedPhoto(photo)}
            >
              <RNImage 
                source={getImageSource(photo.uri)} 
                style={styles.thumbImage} 
                resizeMode="cover" 
              />
              {photo.aiVerified && (
                <View style={[styles.thumbBadge, { backgroundColor: colors.success }]}>
                  <IconSymbol name="checkmark" size={10} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* AI Features Info */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>AI Capabilities</Text>
        <View style={styles.featuresGrid}>
          <Card variant="outlined" style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: colors.successLight }]}>
              <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
            </View>
            <Text style={[styles.featureTitle, { color: colors.text }]}>Work Detection</Text>
            <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
              Identifies work activities in photos
            </Text>
          </Card>
          <Card variant="outlined" style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: colors.infoLight }]}>
              <IconSymbol name="person.fill" size={24} color={colors.info} />
            </View>
            <Text style={[styles.featureTitle, { color: colors.text }]}>Safety Check</Text>
            <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
              Verifies safety equipment usage
            </Text>
          </Card>
          <Card variant="outlined" style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: colors.warningLight }]}>
              <IconSymbol name="sparkles" size={24} color={colors.warning} />
            </View>
            <Text style={[styles.featureTitle, { color: colors.text }]}>Quality Score</Text>
            <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
              Rates work quality automatically
            </Text>
          </Card>
          <Card variant="outlined" style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: colors.primaryLight }]}>
              <IconSymbol name="clock.fill" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.featureTitle, { color: colors.text }]}>Progress Track</Text>
            <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
              Monitors task completion
            </Text>
          </Card>
        </View>

        {/* Recent Verifications */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Verifications</Text>
        {verifiedPhotos.map((photo) => (
          <Card
            key={photo.id}
            variant="outlined"
            style={styles.recentCard}
            onPress={() => setSelectedPhoto(photo)}
          >
            <View style={styles.recentContent}>
              <RNImage 
                source={getImageSource(photo.uri)} 
                style={styles.recentImage} 
                resizeMode="cover" 
              />
              <View style={styles.recentInfo}>
                <Text style={[styles.recentCaption, { color: colors.text }]}>
                  {photo.caption || 'Work photo'}
                </Text>
                <View style={styles.recentMeta}>
                  <Badge
                    label={photo.aiAnalysis?.category || 'Analyzed'}
                    variant="primary"
                    size="sm"
                  />
                  <Text style={[styles.recentScore, { color: colors.success }]}>
                    {photo.aiAnalysis?.confidence}% match
                  </Text>
                </View>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.textMuted} />
            </View>
          </Card>
        ))}

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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  aiIconLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
  },
  subtitle: {
    fontSize: FontSizes.md,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  statValue: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  analysisCard: {
    marginHorizontal: Spacing.lg,
  },
  photoPreview: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius.md,
  },
  verifiedBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
  },
  analysisResults: {},
  confidenceSection: {
    marginBottom: Spacing.md,
  },
  confidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  confidenceLabel: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  confidenceValue: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  categorySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  categoryLabel: {
    fontSize: FontSizes.sm,
  },
  detailsSection: {
    marginBottom: Spacing.md,
  },
  detailsTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  detailText: {
    fontSize: FontSizes.sm,
    flex: 1,
  },
  verificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  verificationInfo: {
    flex: 1,
  },
  verificationTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  verificationSubtitle: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  pendingAnalysis: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  pendingIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  pendingTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  pendingSubtitle: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.lg,
  },
  photoList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  photoThumb: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  thumbBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  featureCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  featureTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    marginBottom: 2,
    textAlign: 'center',
  },
  featureDesc: {
    fontSize: FontSizes.xs,
    textAlign: 'center',
  },
  recentCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  recentContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentImage: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.md,
  },
  recentInfo: {
    flex: 1,
  },
  recentCaption: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xs,
  },
  recentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  recentScore: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
  },
});
