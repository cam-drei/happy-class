import React from 'react';
import {View, Image} from 'react-native';
import {Input, Text} from '@rneui/themed';
import styles from './styles';
import BottomButton from '../../components/buttons/BottomButton';

function Signup({navigation}: {navigation: any}) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
      />
      <View style={styles.inputGroup}>
        <Text h4 style={styles.title}>
          SIGN UP
        </Text>
        <Input placeholder="Username" inputContainerStyle={styles.inputField} />
        <Input placeholder="Password" inputContainerStyle={styles.inputField} />
        <Input
          placeholder="Comfirm password"
          inputContainerStyle={styles.inputField}
        />
      </View>
      <BottomButton
        text="Sign up"
        onPress={() => navigation.navigate('Course')}
      />
      <Text style={styles.baseText}>
        Already have an account?
        <Text
          style={styles.innerText}
          onPress={() => navigation.navigate('Login')}>
          {' Login here'}
        </Text>
      </Text>
    </View>
  );
}

export default Signup;
