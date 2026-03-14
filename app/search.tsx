// app/search.tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EmptyState, RecipeCard, SearchBar } from '../components';
import { recipes } from '../data/recipes';
import { colors } from '../styles/colors';
import { spacing } from '../styles/spacing';
import { typography } from '../styles/typography';
import { Recipe } from '../types/recipe';

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialQuery = typeof params.q === 'string' ? params.q : '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    filterRecipes(searchQuery);
  }, [searchQuery]);

  const filterRecipes = (query: string) => {
    if (!query.trim()) {
      setFilteredRecipes([]);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = recipes.filter((recipe) => {
      // Search in title
      if (recipe.title.toLowerCase().includes(lowercaseQuery)) {
        return true;
      }

      // Search in ingredients
      const matchesIngredient = recipe.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(lowercaseQuery)
      );

      return matchesIngredient;
    });

    setFilteredRecipes(filtered);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {searchQuery || 'Search'}
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search recipes..."
            autoFocus={true}
          />
        </View>

        {/* Results Count */}
        {searchQuery.trim() && (
          <View style={styles.resultsCount}>
            <Text style={styles.resultsText}>
              Found {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
            </Text>
          </View>
        )}

        {/* Results or Empty State */}
        {searchQuery.trim() === '' ? (
          <EmptyState
            icon="search"
            title="Start Searching"
            message="Enter a recipe name or ingredient to find delicious dishes"
          />
        ) : filteredRecipes.length === 0 ? (
          <EmptyState
            icon="restaurant-outline"
            title="No Recipes Found"
            message={`We couldn't find any recipes matching "${searchQuery}". Try a different search term.`}
          />
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onPress={() => router.push(`/recipe/${recipe.id}`)}
              />
            ))}
          </ScrollView>
        )}
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
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
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
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  resultsCount: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  resultsText: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    fontWeight: typography.weight.medium,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
});