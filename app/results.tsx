import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { recipes } from '../data/recipes';

export default function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Support `ingredients` coming as a string or an array from query params
  const rawIngredients = Array.isArray(params.ingredients)
    ? params.ingredients.join(',')
    : (params.ingredients as string | undefined) ?? '';

  const list = rawIngredients
    .toString()
    .toLowerCase()
    .split(',')
    .map((i) => i.trim())
    .filter(Boolean);

  const filtered = useMemo(() => {
    if (!list.length) return [];
    return recipes.filter((r) =>
      r.ingredients.some((ing) => list.some((q) => ing.toLowerCase().includes(q)))
    );
  }, [list]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suggested Recipes</Text>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/recipe/${item.id}`)}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text>{item.duration} ⏱</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No recipes found 😔</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, marginTop: 60 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: {
    padding: 20,
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    marginBottom: 15,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
});
