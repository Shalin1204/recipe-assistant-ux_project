// app/recipe/[id]/cook.tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../../components/Button';
import { ProgressIndicator } from '../../../components/ProgressIndicator';
import { recipes } from '../../../data/recipes';
import { colors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { typography } from '../../../styles/typography';

export default function CookingStepsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const recipeId = params.id as string;

  const recipe = recipes.find((r) => r.id === recipeId);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!recipe) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Recipe not found</Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const currentStep = recipe.steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === recipe.steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      // Show completion message
      Alert.alert(
        'Recipe Complete! 🎉',
        'Congratulations! You\'ve finished cooking. Enjoy your meal!',
        [
          {
            text: 'Done',
            onPress: () => router.back(),
            style: 'default',
          },
        ]
      );
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (isFirstStep) {
      router.back();
    } else {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    if (isLastStep) {
      handleNext();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleExit = () => {
    Alert.alert(
      'Exit Cooking Mode?',
      'Are you sure you want to exit? Your progress will not be saved.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Exit',
          onPress: () => router.back(),
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {recipe.title}
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <ProgressIndicator
            totalSteps={recipe.steps.length}
            currentStep={currentStepIndex + 1}
          />
          <Text style={styles.progressText}>
            Step {currentStepIndex + 1} of {recipe.steps.length}
          </Text>
        </View>

        {/* Step Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Step Instruction */}
          <View style={styles.instructionCard}>
            <Text style={styles.instructionText}>{currentStep.instruction}</Text>
          </View>

          {/* Tip (if available) */}
          {currentStep.tip && (
            <View style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <Ionicons name="bulb-outline" size={20} color={colors.warning} />
                <Text style={styles.tipLabel}>Tip</Text>
              </View>
              <Text style={styles.tipText}>{currentStep.tip}</Text>
            </View>
          )}

          {/* Duration (if available) */}
          {currentStep.duration && (
            <View style={styles.durationCard}>
              <Ionicons name="timer-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.durationText}>
                This step takes about {currentStep.duration} minutes
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {/* Primary Action */}
          <Button
            title={isLastStep ? 'Complete Recipe' : 'Next Step →'}
            onPress={handleNext}
            variant="primary"
            fullWidth
          />

          {/* Secondary Actions */}
          <View style={styles.secondaryActions}>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
              <Text style={styles.secondaryButtonText}>
                {isFirstStep ? 'Exit' : '← Back'}
              </Text>
            </TouchableOpacity>

            {!isLastStep && (
              <TouchableOpacity style={styles.secondaryButton} onPress={handleSkip}>
                <Text style={styles.secondaryButtonText}>Skip →</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  exitButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
  placeholder: {
    width: 40,
  },
  progressSection: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  progressText: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    fontWeight: typography.weight.medium,
    marginTop: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  instructionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xl,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  instructionText: {
    fontSize: typography.size.lg,
    color: colors.textPrimary,
    lineHeight: 32,
    fontWeight: typography.weight.medium,
  },
  tipCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: spacing.xs,
  },
  tipLabel: {
    fontSize: typography.size.sm,
    color: colors.warning,
    fontWeight: typography.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipText: {
    fontSize: typography.size.md,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  durationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.sm,
  },
  durationText: {
    flex: 1,
    fontSize: typography.size.md,
    color: colors.textSecondary,
  },
  actionsContainer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.background,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  secondaryButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  secondaryButtonText: {
    fontSize: typography.size.md,
    color: colors.primary,
    fontWeight: typography.weight.medium,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: typography.size.xl,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
});