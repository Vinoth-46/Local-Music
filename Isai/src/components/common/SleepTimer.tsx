import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../hooks/useTheme';
import { usePlayer } from '../../hooks/usePlayer';

interface SleepTimerProps {
  visible: boolean;
  onClose: () => void;
}

const SleepTimer: React.FC<SleepTimerProps> = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const { stop } = usePlayer();
  const [selectedMinutes, setSelectedMinutes] = useState(15);
  const [isActive, setIsActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const timerOptions = [5, 10, 15, 30, 45, 60, 90, 120];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            // Timer finished
            stop();
            setIsActive(false);
            Alert.alert('Sleep Timer', 'Music stopped. Good night! 🌙');
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, remainingTime, stop, onClose]);

  const startTimer = () => {
    setRemainingTime(selectedMinutes * 60);
    setIsActive(true);
    onClose();
  };

  const cancelTimer = () => {
    setIsActive(false);
    setRemainingTime(0);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Sleep Timer
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {isActive ? (
            <View style={styles.activeTimer}>
              <Ionicons name="moon" size={48} color={theme.colors.primary} />
              <Text style={[styles.remainingTime, { color: theme.colors.text }]}>
                {formatTime(remainingTime)}
              </Text>
              <Text style={[styles.remainingLabel, { color: theme.colors.textSecondary }]}>
                Music will stop in
              </Text>
              
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: theme.colors.error }]}
                onPress={cancelTimer}
              >
                <Text style={styles.cancelButtonText}>Cancel Timer</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.timerSetup}>
              <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                Select duration (minutes)
              </Text>

              <View style={styles.optionsGrid}>
                {timerOptions.map((minutes) => (
                  <TouchableOpacity
                    key={minutes}
                    style={[
                      styles.option,
                      {
                        backgroundColor: selectedMinutes === minutes 
                          ? theme.colors.primary 
                          : theme.colors.background,
                        borderColor: theme.colors.primary,
                      },
                    ]}
                    onPress={() => setSelectedMinutes(minutes)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color: selectedMinutes === minutes 
                            ? 'white' 
                            : theme.colors.text,
                        },
                      ]}
                    >
                      {minutes}m
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.startButton, { backgroundColor: theme.colors.primary }]}
                onPress={startTimer}
              >
                <Ionicons name="moon" size={20} color="white" />
                <Text style={styles.startButtonText}>
                  Start {selectedMinutes}m Timer
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  activeTimer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  remainingTime: {
    fontSize: 48,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  remainingLabel: {
    fontSize: 16,
    marginBottom: 32,
  },
  cancelButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  timerSetup: {
    paddingBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
  },
  option: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 24,
    gap: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SleepTimer;