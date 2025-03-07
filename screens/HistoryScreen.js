
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { useTimers } from '../context/TimerContext';
import { useTheme } from '../context/ThemeContext';

const HistoryScreen = () => {
  const { history, clearHistory } = useTimers();
  const { theme } = useTheme();
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    const parts = [];
    if (hrs > 0) parts.push(`${hrs}h`);
    if (mins > 0) parts.push(`${mins}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
    
    return parts.join(' ');
  };
  
  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all timer history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          onPress: clearHistory,
          style: 'destructive'
        },
      ]
    );
  };
  
  const EmptyHistory = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
        No completed timers yet
      </Text>
    </View>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Timer History</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClearHistory}>
            <Text style={[styles.clearButton, { color: theme.danger }]}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={history.slice().reverse()}
        keyExtractor={(item) => item.id + item.completedAt}
        renderItem={({ item }) => (
          <View 
            style={[
              styles.historyItem, 
              { backgroundColor: theme.card, borderColor: theme.border }
            ]}
          >
            <View style={styles.historyHeader}>
              <Text style={[styles.historyName, { color: theme.text }]}>{item.name}</Text>
              <Text style={[styles.historyCategory, { color: theme.accent }]}>
                {item.category}
              </Text>
            </View>
            
            <View style={styles.historyDetails}>
              <Text style={[styles.historyTime, { color: theme.secondaryText }]}>
                Duration: {formatDuration(item.duration)}
              </Text>
              <Text style={[styles.historyDate, { color: theme.secondaryText }]}>
                Completed: {formatDate(item.completedAt)}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={EmptyHistory}
        contentContainerStyle={history.length === 0 && { flex: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearButton: {
    fontSize: 16,
  },
  historyItem: {
    padding: 15,
    borderBottomWidth: 1,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 8,
    elevation: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyCategory: {
    fontSize: 14,
  },
  historyDetails: {
    flexDirection: 'column',
  },
  historyTime: {
    fontSize: 14,
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});

export default HistoryScreen;