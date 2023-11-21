import React, {useState} from 'react';
import {View, Image} from 'react-native';
import {Input, Text, CheckBox} from '@rneui/themed';
import styles from './styles';
import BottomButton from '../../components/buttons/BottomButton';

function Login({navigation}: {navigation: any}) {
  const [check1, setCheck1] = useState(false);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
      />
      <View style={styles.inputGroup}>
        <Text h4 style={styles.title}>
          LOGIN
        </Text>
        <Input placeholder="Username" inputContainerStyle={styles.inputField} />
        <Input placeholder="Password" inputContainerStyle={styles.inputField} />
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
      <BottomButton
        text="Login"
        type="filled"
        titleStyle
        onPress={() => navigation.navigate('Home')}
      />
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
