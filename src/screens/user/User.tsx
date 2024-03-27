import React from 'react';
import {View, Image} from 'react-native';
import styles from './styles';
import BottomButton from '../../components/buttons/BottomButton';
import {Text} from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProps {
  navigation: any;
  route: {params: {authToken: string; userId: string; userName: string}};
}

function User({navigation, route}: UserProps) {
  const {authToken, userId, userName} = route.params;

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
    navigation.navigate('Course', {authToken, userId, userName});
  };

  const navigateToChooseCourse = () => {
    navigation.navigate('CourseList', {authToken, userId, userName});
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

export default User;
