import React, {useState, useEffect} from 'react';
import {View, Alert} from 'react-native';
import {Input, Text, CheckBox} from '@rneui/themed';
import styles from './styles';
import BottomButton from '../../components/buttons/BottomButton';
import Logo from '../../components/logo/Logo';
import axios from 'axios';
import {baseUrl} from '../../utils/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderLeft from '../../components/header/HeaderLeft';

function Login({navigation}: {navigation: any}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/login`,
        {
          email: email,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const authToken = response.data.token;
      const userName = response.data.user.email.split('@')[0];
      await AsyncStorage.setItem('authToken', authToken);
      await AsyncStorage.setItem('userName', userName);

      if (rememberMe) {
        try {
          await AsyncStorage.setItem('email', email);
          await AsyncStorage.setItem('password', password);
        } catch (error) {
          console.error('Error saving credentials:', error);
        }
      }

      navigation.navigate('Welcome', {authToken, userName});
    } catch (error: any) {
      console.error('Error:', error);
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('email');
        const savedPassword = await AsyncStorage.getItem('password');

        if (savedEmail && savedPassword && rememberMe) {
          setEmail(savedEmail);
          setPassword(savedPassword);
        }
      } catch (error) {
        console.error('Error loading credentials:', error);
      }
    };

    loadCredentials();
  }, [rememberMe]);

  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <HeaderLeft
          iconName={'home'}
          onPress={() => navigation.navigate('Home')}
        />
      ),
    });
  }, [navigation]);

  const handleForgotPassword = () => {
    // navigation.navigate('ForgotPassword');
    Alert.alert('Alert Title', 'Button Clicked!');
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
        <Text onPress={handleForgotPassword} style={styles.forgotText}>
          Forgot password?
        </Text>
        <CheckBox
          title="Remember me"
          checked={rememberMe}
          onPress={() => setRememberMe(!rememberMe)}
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
