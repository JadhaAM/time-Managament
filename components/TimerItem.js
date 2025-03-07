
import React from 'react';
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

const TimerItem = ({ timer }) => {
  const { startTimer, pauseTimer, resetTimer, deleteTimer, formatTime } = useTimers();
  const { theme } = useTheme();

  const progress = (timer.remainingTime / timer.duration) * 100;

  const getStatusColor = () => {
    switch (timer.status) {
      case 'running':
        return '#4cd964'; 
      case 'paused':
        return '#ff9500'; 
      case 'completed':
        return '#ff3b30'; 
      default:
        return theme.secondaryText;
    }
  };
  
  const handleDeleteTimer = () => {
    Alert.alert(
      'Delete Timer',
      `Are you sure you want to delete "${timer.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: () => deleteTimer(timer.id),
          style: 'destructive'
        },
      ]
    );
  };
  
  return (
    <View 
      style={[
        styles.container, 
        { borderColor: theme.border }
      ]}
    >
      <View style={styles.timerInfo}>
        <Text style={[styles.timerName, { color: theme.text }]}>{timer.name}</Text>
        <View style={styles.timerDetails}>
          <Text style={[styles.timerTime, { color: theme.text }]}>
            {formatTime(timer.remainingTime)}
          </Text>
          <View style={styles.statusContainer}>
            <View 
              style={[
                styles.statusDot, 
                { backgroundColor: getStatusColor() }
              ]} 
            />
            <Text style={[styles.statusText, { color: theme.secondaryText }]}>
              {timer.status.charAt(0).toUpperCase() + timer.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View 
          style={[
            styles.progressBar, 
            { backgroundColor: theme.progressBackground }
          ]}
        >
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${progress}%`, 
                backgroundColor: theme.progressFill 
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, { color: theme.secondaryText }]}>
          {Math.round(progress)}%
        </Text>
      </View>
      
      <View style={styles.timerControls}>
        {timer.status !== 'completed' && (
          <>
            {timer.status === 'paused' ? (
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={() => startTimer(timer.id)}
              >
                <Ionicons name="play" size={22} color={theme.accent} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={() => pauseTimer(timer.id)}
              >
                <Ionicons name="pause" size={22} color={theme.accent} />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => resetTimer(timer.id)}
            >
              <Ionicons name="refresh" size={22} color={theme.accent} />
            </TouchableOpacity>
          </>
        )}
        
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={handleDeleteTimer}
        >
          <Ionicons name="trash-outline" size={22} color={theme.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderTopWidth: 1,
  },
  timerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  timerName: {
    fontSize: 16,
    fontWeight: '500',
  },
  timerDetails: {
    alignItems: 'flex-end',
  },
  timerTime: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    flex: 1,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    width: 35,
  },
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  controlButton: {
    padding: 8,
    marginLeft: 5,
  },
});

export default TimerItem;
