import React, {useState} from 'react';
import {View, Image} from 'react-native';
import {Input, Button, Text} from '@rneui/themed';
import styles from './styles';

function Course({navigation}) {
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
      <Button
        title="Signup"
        titleStyle={styles.loginBtnTitle}
        buttonStyle={styles.loginBtn}
        onPress={() => navigation.navigate('Course')}
      />
      <Text style={styles.baseText}>
        Already have an account?
        <Text
          style={styles.innerText}
          onPress={() => navigation.navigate('Login')}>
          {' Login'}
        </Text>
      </Text>
    </View>
  );
}

export default Course;
