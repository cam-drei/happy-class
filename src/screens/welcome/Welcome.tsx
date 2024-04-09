import React, {useEffect, useCallback} from 'react';
import {View, Image, Alert, TouchableOpacity} from 'react-native';
import styles from './styles';
import BottomButton from '../../components/buttons/BottomButton';
import {Text} from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import HeaderRight from '../../components/header/HeaderRight';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface WelcomeProps {
  navigation: any;
  route: {
    params: {
      authToken: string;
      userId: string;
      userName: string;
      selectedCoursesId: number[];
    };
  };
}

function Welcome({navigation, route}: WelcomeProps) {
  const {authToken, userId, userName, selectedCoursesId} = route.params;

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
      await AsyncStorage.removeItem('userId');
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
      headerRight: () => (
        <HeaderRight
          userName={userName}
          userImage={require('../../assets/images/tulip.webp')}
        />
      ),
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity onPress={handleLogout}>
          <MaterialIcons
            name={'arrow-back'}
            style={{marginLeft: 15, fontSize: 30}}
            color={'#FF9900'}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, userName, handleLogout]);

  const navigateToCourse = () => {
    navigation.navigate('Course', {
      authToken,
      userId,
      userName,
      selectedCoursesId,
    });
  };

  const navigateToCourseList = () => {
    navigation.navigate('CourseList', {
      authToken,
      userId,
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
      <BottomButton text="Let's learn" onPress={navigateToCourse} />
      <BottomButton
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
