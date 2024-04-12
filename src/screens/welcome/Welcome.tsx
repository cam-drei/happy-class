import React, {useEffect, useCallback} from 'react';
import {View, Image, Alert} from 'react-native';
import styles from './styles';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import {Text} from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import HeaderLeft from '../../components/header/HeaderLeft';
import HeaderRight from '../../components/header/HeaderRight';

interface WelcomeProps {
  navigation: any;
  route: {
    params: {
      authToken: string;
      userName: string;
      selectedCoursesId?: number[];
    };
  };
}

function Welcome({navigation, route}: WelcomeProps) {
  const {authToken, userName, selectedCoursesId} = route.params;

  const navigateToLogin = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  }, [navigation]);

  const handleLogout = useCallback(async () => {
    try {
      await axios.delete('http://localhost:3000/api/v1/logout');

      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userName');

      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('password');

      navigateToLogin();
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Logout Failed', 'An error occurred while logging out.');
    }
  }, [navigateToLogin]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => <HeaderLeft onPress={handleLogout} />,
      headerRight: () => (
        <HeaderRight
          userName={userName}
          userImage={require('../../assets/images/tulip.webp')}
        />
      ),
    });
  }, [navigation, userName, handleLogout]);

  const navigateToCourse = () => {
    navigation.navigate('Course', {
      authToken,
      userName,
      selectedCoursesId,
    });
  };

  const navigateToCourseList = () => {
    navigation.navigate('CourseList', {
      authToken,
      userName,
      selectedCoursesId,
    });
  };

  return (
    <View style={styles.container}>
      <Text h4 style={styles.title}>
        Welcome, {userName}!
      </Text>
      <Image
        source={require('../../assets/images/peppa.png')}
        style={styles.logo}
      />
      <Text h4 style={styles.userName}>
        {userName}
      </Text>
      <PrimaryButton text="Let's learn" onPress={navigateToCourse} />
      <PrimaryButton
        text="Click for choose your Courses"
        buttonType={'outlined'}
        titleStyle={'normal'}
        onPress={navigateToCourseList}
      />
      <View style={styles.bottomTextView}>
        <Text onPress={handleLogout} style={styles.bottomText}>
          Login to another account
        </Text>
      </View>
    </View>
  );
}

export default Welcome;
