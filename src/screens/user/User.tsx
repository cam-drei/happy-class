import React from 'react';
import {View, Image} from 'react-native';
import styles from './styles';
import BottomButton from '../../components/buttons/BottomButton';
import {Text, Button} from '@rneui/base';

function User({navigation}: {navigation: any}) {
  return (
    <View style={styles.container}>
      <Text h4 style={styles.title}>
        Welcome, {'Peppa'}!
      </Text>
      <Image
        source={require('../../assets/images/peppa.png')}
        style={styles.logo}
      />
      <Text h4 style={styles.userName}>
        {'Peppa'}
      </Text>
      <BottomButton
        text="Let's learn"
        type="filled"
        titleStyle
        onPress={() => navigation.navigate('Course')}
      />
      <View style={styles.bottomTextView}>
        <Text
          onPress={() => navigation.navigate('Login')}
          style={styles.bottomText}>
          Login to another account
        </Text>
      </View>
    </View>
  );
}

export default User;
