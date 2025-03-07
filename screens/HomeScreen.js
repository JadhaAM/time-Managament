
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TimerList from '../components/TimerList';
import CategoryFilter from '../components/CategoryFilter';
import { useTimers } from '../context/TimerContext';
import { useTheme } from '../context/ThemeContext';

const HomeScreen = () => {
  const { getCategories, exportTimerData } = useTimers();
  const { toggleTheme, theme ,isDarkMode  } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = getCategories();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={toggleTheme}
        >
          <Ionicons
            name={isDarkMode ? "sunny-outline" : "moon-outline"}
            size={24}
            color={theme.text}
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => {
            Alert.alert(
              'Export Data',
              'Do you want to export all timer data?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Export', onPress: exportTimerData },
              ]
            );
          }}
        >
          <Ionicons name="share-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
      
      <CategoryFilter 
        categories={['All', ...categories]} 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      
      <ScrollView>
        <TimerList filterCategory={selectedCategory !== 'All' ? selectedCategory : null} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  iconButton: {
    padding: 8,
    marginLeft: 10,
  }
});

export default HomeScreen;