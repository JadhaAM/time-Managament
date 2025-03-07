
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text }]}>Filter by Category:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              { 
                backgroundColor: selectedCategory === category ? theme.accent : theme.card,
                borderColor: theme.border
              }
            ]}
            onPress={() => onSelectCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                { color: selectedCategory === category ? '#fff' : theme.text }
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
  },
});

export default CategoryFilter;

