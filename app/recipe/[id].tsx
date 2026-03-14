// app/recipe/[id].tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components';
import { recipes } from '../../data/recipes';

const colors = {
  background: '#FFFFFF',
  textPrimary: '#0f172a',
  textSecondary: '#64748b',
  divider: '#e6e6e6',
  surface: '#f8fafc',
  border: '#e2e8f0',
  primary: '#ff6b6b',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

const typography = {
  size: {
    sm: 12,
    md: 16,
    lg: 18,
    xl: 20,
  },
  weight: {
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export default function RecipeDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const recipeId = params.id as string;

  const recipe = recipes.find((r) => r.id === recipeId);

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

  const handleStartCooking = () => {
    router.push(`/recipe/${recipe.id}/cook`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {recipe.title}
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Image */}
          <Image source={{ uri: recipe.image }} style={styles.heroImage} />

          {/* Quick Info */}
          <View style={styles.quickInfo}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.infoText}>{recipe.duration} min</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoItem}>
              <Ionicons name="list-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.infoText}>{recipe.steps.length} steps</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoItem}>
              <Ionicons name="people-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.infoText}>{recipe.servings} servings</Text>
            </View>
          </View>

          {/* Ingredients Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={styles.bullet} />
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>

          {/* Steps Preview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cooking Steps</Text>
            <Text style={styles.stepsPreview}>
              {recipe.steps.length} steps to complete this recipe. Tap "Start Cooking" below to
              begin following step-by-step instructions.
            </Text>
          </View>

          {/* CTA Button */}
          <View style={styles.ctaContainer}>
            <Button
              title="Start Cooking"
              onPress={handleStartCooking}
              variant="primary"
              fullWidth
            />
          </View>
        </ScrollView>
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
  backButton: {
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  heroImage: {
    width: '100%',
    height: 300,
    backgroundColor: colors.divider,
  },
  quickInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  infoText: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    fontWeight: typography.weight.medium,
  },
  infoDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.border,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 8,
    marginRight: spacing.sm,
  },
  ingredientText: {
    flex: 1,
    fontSize: typography.size.md,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  stepsPreview: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  ctaContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
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