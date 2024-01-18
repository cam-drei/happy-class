import React, {useState} from 'react';
import {View, Alert} from 'react-native';
import {Input, Text, CheckBox} from '@rneui/themed';
import styles from './styles';
import BottomButton from '../../components/buttons/BottomButton';
import Logo from '../../components/logo/Logo';
import axios from 'axios';
import {baseUrl} from '../../utils/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Login({navigation}: {navigation: any}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [check1, setCheck1] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/login`,
        {
          user: {
            email: email,
            password: password,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const authToken = response.data.token;
      console.log('AsyncStorage:', AsyncStorage);
      await AsyncStorage.setItem('authToken', authToken);

      const userName = email.split('@')[0];
      navigation.navigate('User', {userName});
    } catch (error: any) {
      console.error('Error:', error);
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };

  return (
    <View style={styles.container}>
      <Logo width={250} height={250} />
      <View style={styles.inputGroup}>
        <Text h4 style={styles.title}>
          LOGIN
        </Text>
        <Input
          placeholder="Email"
          inputContainerStyle={styles.inputField}
          autoCapitalize={'none'}
          keyboardType={'email-address'}
          onChangeText={text => setEmail(text)}
        />
        <Input
          placeholder="Password"
          inputContainerStyle={styles.inputField}
          secureTextEntry
          onChangeText={text => setPassword(text)}
        />
        <Text style={styles.forgotText}>Forgot password?</Text>
        <CheckBox
          title="Remember me"
          checked={check1}
          onPress={() => setCheck1(!check1)}
          iconType="material-community"
          checkedIcon="checkbox-outline"
          uncheckedIcon={'checkbox-blank-outline'}
          checkedColor="#FF9900"
          textStyle={styles.checkboxTitle}
          containerStyle={styles.checkbox}
        />
      </View>
      <BottomButton text="Login" onPress={handleLogin} />
      <Text style={styles.baseText}>
        Don't have an account?
        <Text
          style={styles.innerText}
          onPress={() => navigation.navigate('Signup')}>
          {' Sign up'}
        </Text>
      </Text>
    </View>
  );
}

export default Login;
