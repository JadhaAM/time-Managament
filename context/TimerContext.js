
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from './ThemeContext';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [timers, setTimers] = useState([]);
  const [history, setHistory] = useState([]);
  const { isDarkMode } = useTheme();
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedTimers = await AsyncStorage.getItem('timers');
        const storedHistory = await AsyncStorage.getItem('history');
        
        if (storedTimers) {
          setTimers(JSON.parse(storedTimers));
        }
        
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      }
    };
    
    loadData();
    
    const intervalId = setInterval(() => {
      setTimers(prevTimers => {
        const updatedTimers = prevTimers.map(timer => {
          if (timer.status === 'running') {
            const newRemainingTime = timer.remainingTime - 1;
          
            if (newRemainingTime <= 0) {
              const completedTimer = {
                id: timer.id,
                name: timer.name,
                category: timer.category,
                duration: timer.duration,
                completedAt: new Date().toISOString()
              };
              
              addToHistory(completedTimer);
          
              Alert.alert(
                'Timer Completed!',
                `Congratulations! Your "${timer.name}" timer is complete.`,
                [{ text: 'OK' }]
              );
              
              return {
                ...timer,
                remainingTime: 0,
                status: 'completed'
              };
            }
            
            if (timer.halfwayAlert && 
                Math.ceil(timer.duration / 2) === newRemainingTime) {
              Alert.alert(
                'Halfway Point!',
                `You're halfway through your "${timer.name}" timer.`,
                [{ text: 'OK' }]
              );
            }
            
            return {
              ...timer,
              remainingTime: newRemainingTime
            };
          }
          return timer;
        });
       
        AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
        
        return updatedTimers;
      });
    }, 1000);
 
    return () => clearInterval(intervalId);
  }, []);

  const addTimer = async (newTimer) => {
    const timerWithId = {
      ...newTimer,
      id: Date.now().toString(),
      status: 'paused',
      remainingTime: newTimer.duration
    };
    
    const updatedTimers = [...timers, timerWithId];
    setTimers(updatedTimers);
    
    try {
      await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
    } catch (error) {
      console.error('Error saving timers to AsyncStorage:', error);
    }
  };
 
  const addToHistory = async (completedTimer) => {
    const updatedHistory = [...history, completedTimer];
    setHistory(updatedHistory);
    
    try {
      await AsyncStorage.setItem('history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving history to AsyncStorage:', error);
    }
  };
  
  const startTimer = (id) => {
    const updatedTimers = timers.map(timer => {
      if (timer.id === id) {
        return { ...timer, status: 'running' };
      }
      return timer;
    });
    
    setTimers(updatedTimers);
    AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
  };

  const pauseTimer = (id) => {
    const updatedTimers = timers.map(timer => {
      if (timer.id === id) {
        return { ...timer, status: 'paused' };
      }
      return timer;
    });
    
    setTimers(updatedTimers);
    AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
  };
  
  const resetTimer = (id) => {
    const updatedTimers = timers.map(timer => {
      if (timer.id === id) {
        return { 
          ...timer, 
          status: 'paused',
          remainingTime: timer.duration 
        };
      }
      return timer;
    });
    
    setTimers(updatedTimers);
    AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
  };

  const deleteTimer = (id) => {
    const updatedTimers = timers.filter(timer => timer.id !== id);
    setTimers(updatedTimers);
    AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
  };

  const startAllInCategory = (category) => {
    const updatedTimers = timers.map(timer => {
      if (timer.category === category && timer.status !== 'completed') {
        return { ...timer, status: 'running' };
      }
      return timer;
    });
    
    setTimers(updatedTimers);
    AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
  };
  
  const pauseAllInCategory = (category) => {
    const updatedTimers = timers.map(timer => {
      if (timer.category === category && timer.status === 'running') {
        return { ...timer, status: 'paused' };
      }
      return timer;
    });
    
    setTimers(updatedTimers);
    AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
  };
  
  const resetAllInCategory = (category) => {
    const updatedTimers = timers.map(timer => {
      if (timer.category === category) {
        return { 
          ...timer, 
          status: 'paused',
          remainingTime: timer.duration 
        };
      }
      return timer;
    });
    
    setTimers(updatedTimers);
    AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
  };
 
  const clearHistory = () => {
    setHistory([]);
    AsyncStorage.setItem('history', JSON.stringify([]));
  };

  const exportTimerData = async () => {
    try {

      const exportData = {
        timers,
        history,
        exportDate: new Date().toISOString()
      };
      
      const jsonData = JSON.stringify(exportData, null, 2);
     
      const fileUri = `${FileSystem.documentDirectory}timer_data_${Date.now()}.json`;
      await FileSystem.writeAsStringAsync(fileUri, jsonData);
  
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Sharing not available', 'Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Export Failed', 'Unable to export timer data');
    }
  };
  
  const getCategories = () => {
    const categories = new Set(timers.map(timer => timer.category));
    return Array.from(categories);
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <TimerContext.Provider
      value={{
        timers,
        history,
        addTimer,
        startTimer,
        pauseTimer,
        resetTimer,
        deleteTimer,
        startAllInCategory,
        pauseAllInCategory,
        resetAllInCategory,
        clearHistory,
        exportTimerData,
        getCategories,
        formatTime,
        isDarkMode
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimers = () => useContext(TimerContext);