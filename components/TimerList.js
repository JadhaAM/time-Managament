
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTimers } from '../context/TimerContext';
import { useTheme } from '../context/ThemeContext';
import TimerItem from './TimerItem';

const TimerList = ({ filterCategory }) => {
  const { 
    timers, 
    getCategories, 
    startAllInCategory, 
    pauseAllInCategory, 
    resetAllInCategory 
  } = useTimers();
  const { theme } = useTheme();
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
 
  const getTimersByCategory = () => {
    const categories = {};
    
    timers.forEach(timer => {
      if (!categories[timer.category]) {
        categories[timer.category] = [];
      }
      categories[timer.category].push(timer);
    });
    
    return categories;
  };
  
  const timersByCategory = getTimersByCategory();
  const filteredCategories = filterCategory 
    ? { [filterCategory]: timersByCategory[filterCategory] || [] } 
    : timersByCategory;
  
  if (Object.keys(filteredCategories).length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
          No timers available
        </Text>
        <Text style={[styles.emptySubText, { color: theme.secondaryText }]}>
          Add a timer using the + button
        </Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {Object.entries(filteredCategories).map(([category, categoryTimers]) => (
        <View 
          key={category}
          style={[
            styles.categoryContainer, 
            { borderColor: theme.border, backgroundColor: theme.card }
          ]}
        >
          <TouchableOpacity
            style={styles.categoryHeader}
            onPress={() => toggleCategory(category)}
          >
            <View style={styles.categoryTitleContainer}>
              <Ionicons
                name={expandedCategories[category] ? "chevron-down" : "chevron-forward"}
                size={20}
                color={theme.text}
              />
              <Text style={[styles.categoryTitle, { color: theme.text }]}>
                {category} ({categoryTimers.length})
              </Text>
            </View>
            
            <View style={styles.categoryActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => startAllInCategory(category)}
              >
                <Ionicons name="play" size={18} color={theme.accent} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => pauseAllInCategory(category)}
              >
                <Ionicons name="pause" size={18} color={theme.accent} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  Alert.alert(
                    'Reset All Timers',
                    `Are you sure you want to reset all timers in ${category}?`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Reset', onPress: () => resetAllInCategory(category) },
                    ]
                  );
                }}
              >
                <Ionicons name="refresh" size={18} color={theme.accent} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          
          {expandedCategories[category] && (
            <View style={styles.timerList}>
              {categoryTimers.map((timer) => (
                <TimerItem key={timer.id} timer={timer} />
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  categoryContainer: {
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  categoryActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 15,
  },
  timerList: {
    borderTopWidth: 1,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
  },
});

export default TimerList;
