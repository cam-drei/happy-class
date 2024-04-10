import React, {useEffect} from 'react';
import {View} from 'react-native';
import {Input, Text} from '@rneui/themed';
import styles from './styles';
import BottomButton from '../../components/buttons/BottomButton';
import Logo from '../../components/logo/Logo';
import HeaderLeft from '../../components/header/HeaderLeft';

function Signup({navigation}: {navigation: any}) {
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
    <View style={styles.container}>
      <Logo width={250} height={250} />
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
