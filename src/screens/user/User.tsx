import React from 'react';
import {View, Image} from 'react-native';
import styles from './styles';
import BottomButton from '../../components/buttons/BottomButton';
import {Text} from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';

function User({route, navigation}: {route: any; navigation: any}) {
  const {userName} = route.params;

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
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
      <BottomButton
        text="Let's learn"
        onPress={() => navigation.navigate('Course')}
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
