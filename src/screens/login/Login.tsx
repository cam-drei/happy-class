import React, {useState} from 'react';
import {View} from 'react-native';
import {Input, Text, CheckBox} from '@rneui/themed';
import styles from './styles';
import BottomButton from '../../components/buttons/BottomButton';
import Logo from '../../components/logo/Logo';

function Login({navigation}: {navigation: any}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [check1, setCheck1] = useState(false);

  return (
    <View style={styles.container}>
      <Logo width={250} height={250} />
      <View style={styles.inputGroup}>
        <Text h4 style={styles.title}>
          LOGIN
        </Text>
        <Input
          placeholder="Username"
          inputContainerStyle={styles.inputField}
          autoCapitalize={'none'}
          keyboardType={'email-address'}
          onChangeText={() => setUsername(username)}
        />
        <Input
          placeholder="Password"
          inputContainerStyle={styles.inputField}
          secureTextEntry
          onChangeText={() => setPassword(password)}
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
      <BottomButton text="Login" onPress={() => navigation.navigate('User')} />
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
