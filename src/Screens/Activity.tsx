/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React from 'react';
import BackgroundService from 'react-native-background-actions';

const sleep = (time: number | undefined) =>
  new Promise<void>(resolve => setTimeout(() => resolve(), time));

const requestNotificationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Notification Permission',
          message: 'This app needs access to show notifications',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission granted');
      } else {
        console.log('Notification permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }
};

const Activity: React.FC = () => {
  const theBackgroundTask = async (taskDataArguments: {delay: any}) => {
    const {delay} = taskDataArguments;
    await new Promise(async resolve => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        console.log(i);
        await BackgroundService.updateNotification({
          taskDesc: `Task running with time in seconds: ${i}`,
        });
        await sleep(delay);
      }
    });
  };

  const options = {
    taskName: 'Bhari Service',
    taskTitle: 'ExampleTask title',
    taskDesc: 'ExampleTask description',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourSchemeHere://chat/jane',
    parameters: {
      delay: 1000,
    },
  };

  const startBackgroundService = async () => {
    await requestNotificationPermission(); // Request notification permission
    await BackgroundService.start(theBackgroundTask, options);
  };

  const stopBackgroundService = async () => {
    await BackgroundService.stop();
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={{color: 'black', fontSize: 25}}>Activity</Text>

      <TouchableOpacity style={styles.btn} onPress={startBackgroundService}>
        <Text style={{color: 'black', fontSize: 17}}>Start Karo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={stopBackgroundService}>
        <Text style={{color: 'black', fontSize: 17}}>Band Karo</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Activity;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    backgroundColor: 'beige',
  },
  btn: {
    backgroundColor: 'red',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 28,
  },
});
