
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '../components/Button';
import { addRecipe, recipes } from '../data/recipes';
import { colors } from '../styles/colors';
import { spacing } from '../styles/spacing';
import { typography } from '../styles/typography';

export default function AddRecipeScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!title || !ingredients || !instructions || !image) {
      Alert.alert('Error', 'Please fill all fields and select an image.');
      return;
    }

    const newRecipe = {
      id: String(recipes.length + 1),
      title,
      ingredients: ingredients.split('\n'),
      instructions: instructions.split('\n'),
      image,
    };

    addRecipe(newRecipe);
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add New Recipe</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Recipe Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Ingredients (one per line)"
          value={ingredients}
          onChangeText={setIngredients}
          multiline
        />
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Instructions (one per line)"
          value={instructions}
          onChangeText={setInstructions}
          multiline
        />
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        {image && <Text style={styles.imageText}>Image selected</Text>}
        
        <Button title="Save Recipe" onPress={handleSave} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  form: {
    padding: spacing.lg,
  },
  input: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
    fontSize: typography.size.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageText: {
    textAlign: 'center',
    marginVertical: spacing.md,
    color: colors.textSecondary,
  },
});
