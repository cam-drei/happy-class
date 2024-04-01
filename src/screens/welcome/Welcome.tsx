import React from 'react';
import {View, Image} from 'react-native';
import styles from './styles';
import BottomButton from '../../components/buttons/BottomButton';
import {Text} from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const navigateToCourse = () => {
    navigation.navigate('Course', {
      authToken,
      userId,
      userName,
      selectedCoursesId,
    });
  };

  const navigateToChooseCourse = () => {
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
        text="Click for choose your Course"
        buttonType={'outlined'}
        titleStyle={'normal'}
        onPress={navigateToChooseCourse}
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
