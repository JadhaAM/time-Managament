
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Switch,
  Alert
} from 'react-native';
import { useTimers } from '../context/TimerContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const AddTimerScreen = () => {
  const { addTimer, getCategories } = useTimers();
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  const [name, setName] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [category, setCategory] = useState('');
  const [halfwayAlert, setHalfwayAlert] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  
  const existingCategories = getCategories();
  
  const handleAddTimer = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a timer name');
      return;
    }
    
    const totalSeconds = 
      (parseInt(hours || '0') * 3600) + 
      (parseInt(minutes || '0') * 60) + 
      parseInt(seconds || '0');
    
    if (totalSeconds <= 0) {
      Alert.alert('Error', 'Please enter a valid duration');
      return;
    }
    
    const finalCategory = showNewCategoryInput ? newCategory.trim() : category;
    
    if (!finalCategory) {
      Alert.alert('Error', 'Please select or create a category');
      return;
    }
  
    const newTimer = {
      name: name.trim(),
      duration: totalSeconds,
      category: finalCategory,
      halfwayAlert
    };
    
    addTimer(newTimer);
    Alert.alert('Success', 'Timer added successfully');
   
    setName('');
    setHours('');
    setMinutes('');
    setSeconds('');
    setHalfwayAlert(false);
   
    navigation.navigate('Home');
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.formContainer}>
        <Text style={[styles.label, { color: theme.text }]}>Timer Name</Text>
        <TextInput
          style={[styles.input, { 
            color: theme.text,
            backgroundColor: theme.card,
            borderColor: theme.border
          }]}
          placeholder="Enter timer name"
          placeholderTextColor={theme.secondaryText}
          value={name}
          onChangeText={setName}
        />
        
        <Text style={[styles.label, { color: theme.text }]}>Duration</Text>
        <View style={styles.durationContainer}>
          <View style={styles.durationInput}>
            <TextInput
              style={[styles.timeInput, { 
                color: theme.text,
                backgroundColor: theme.card,
                borderColor: theme.border
              }]}
              placeholder="00"
              placeholderTextColor={theme.secondaryText}
              keyboardType="number-pad"
              maxLength={2}
              value={hours}
              onChangeText={setHours}
            />
            <Text style={[styles.timeLabel, { color: theme.text }]}>hrs</Text>
          </View>
          
          <View style={styles.durationInput}>
            <TextInput
              style={[styles.timeInput, { 
                color: theme.text,
                backgroundColor: theme.card,
                borderColor: theme.border
              }]}
              placeholder="00"
              placeholderTextColor={theme.secondaryText}
              keyboardType="number-pad"
              maxLength={2}
              value={minutes}
              onChangeText={setMinutes}
            />
            <Text style={[styles.timeLabel, { color: theme.text }]}>min</Text>
          </View>
          
          <View style={styles.durationInput}>
            <TextInput
              style={[styles.timeInput, { 
                color: theme.text,
                backgroundColor: theme.card,
                borderColor: theme.border
              }]}
              placeholder="00"
              placeholderTextColor={theme.secondaryText}
              keyboardType="number-pad"
              maxLength={2}
              value={seconds}
              onChangeText={setSeconds}
            />
            <Text style={[styles.timeLabel, { color: theme.text }]}>sec</Text>
          </View>
        </View>
        
        <Text style={[styles.label, { color: theme.text }]}>Category</Text>
        {!showNewCategoryInput ? (
          <>
            <ScrollView horizontal style={styles.categoryContainer}>
              {existingCategories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    { 
                      backgroundColor: category === cat ? theme.accent : theme.card,
                      borderColor: theme.border
                    }
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      { color: category === cat ? '#fff' : theme.text }
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  { 
                    backgroundColor: theme.card,
                    borderColor: theme.border
                  }
                ]}
                onPress={() => setShowNewCategoryInput(true)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    { color: theme.accent }
                  ]}
                >
                  + New
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </>
        ) : (
          <View style={styles.newCategoryContainer}>
            <TextInput
              style={[styles.input, { 
                color: theme.text,
                backgroundColor: theme.card,
                borderColor: theme.border,
                flex: 1
              }]}
              placeholder="Enter new category"
              placeholderTextColor={theme.secondaryText}
              value={newCategory}
              onChangeText={setNewCategory}
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowNewCategoryInput(false);
                setNewCategory('');
              }}
            >
              <Text style={{ color: theme.danger }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.alertContainer}>
          <Text style={[styles.label, { color: theme.text }]}>Halfway Alert</Text>
          <Switch
            value={halfwayAlert}
            onValueChange={setHalfwayAlert}
            trackColor={{ false: theme.border, true: theme.accent }}
            thumbColor="#fff"
          />
        </View>
        
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.accent }]}
          onPress={handleAddTimer}
        >
          <Text style={styles.addButtonText}>Add Timer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationInput: {
    width: '30%',
    alignItems: 'center',
  },
  timeInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 18,
    textAlign: 'center',
    width: '100%',
  },
  timeLabel: {
    marginTop: 5,
    fontSize: 14,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
  },
  newCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelButton: {
    marginLeft: 10,
    padding: 10,
  },
  alertContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  addButton: {
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddTimerScreen;