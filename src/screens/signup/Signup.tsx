import React, {useState, useEffect} from 'react';
import {View, Alert, KeyboardAvoidingView, Platform} from 'react-native';
import {Input, Text} from '@rneui/themed';
import styles from './styles';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import Logo from '../../components/logo/Logo';
import HeaderLeft from '../../components/header/HeaderLeft';
import axios from 'axios';
import {baseUrl} from '../../utils/apiConfig';

function Signup({navigation}: {navigation: any}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/signup`, {
        user: {
          email: email,
          password: password,
          password_confirmation: confirmPassword,
        },
      });

      if (response.status === 201) {
        const {authentication_token, email: userEmail} = response.data.user;
        const userName = userEmail.split('@')[0];

        navigation.navigate('Welcome', {
          authToken: authentication_token,
          userName: userName,
        });
      } else {
        const errorMessage = response.data.errors
          ? response.data.errors.join('\n')
          : 'An error occurred';
        Alert.alert('Error', errorMessage);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        Alert.alert('Alert', 'Email address already exists');
      } else {
        console.error('Error:', error);
        Alert.alert('Error', 'An error occurred, please try again later');
      }
    }
  };

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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Logo width={250} height={250} />
      <View style={styles.inputGroup}>
        <Text h4 style={styles.title}>
          SIGN UP
        </Text>
        <Input
          placeholder="Email"
          value={email}
          autoCapitalize={'none'}
          onChangeText={setEmail}
          inputContainerStyle={styles.inputField}
        />
        <Input
          placeholder="Password"
          value={password}
          autoCapitalize={'none'}
          onChangeText={setPassword}
          secureTextEntry
          inputContainerStyle={styles.inputField}
        />
        <Input
          placeholder="Confirm password"
          value={confirmPassword}
          autoCapitalize={'none'}
          onChangeText={setConfirmPassword}
          secureTextEntry
          inputContainerStyle={styles.inputField}
        />
      </View>
      <PrimaryButton text="Sign up" onPress={handleSignup} />
      <Text style={styles.baseText}>
        Already have an account?
        <Text
          style={styles.innerText}
          onPress={() => navigation.navigate('Login')}>
          {' Login here'}
        </Text>
      </Text>
    </KeyboardAvoidingView>
  );
}

export default Signup;
