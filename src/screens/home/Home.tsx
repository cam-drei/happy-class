import React from 'react';
import {View} from 'react-native';
import styles from './styles';
import BottomButton from '../../components/buttons/BottomButton';
import Logo from '../../components/logo/Logo';

function Home({navigation}: {navigation: any}) {
  return (
    <View style={styles.container}>
      <Logo />
      <BottomButton
        text="Login"
        buttonType="filled"
        titleStyle={styles.bottomButtonTitle}
        onPress={() => navigation.navigate('Login')}
      />
      <BottomButton
        text="Signup"
        buttonType="outlined"
        titleStyle={styles.bottomButtonTitle}
        onPress={() => navigation.navigate('Signup')}
      />
    </View>
  );
}

export default Home;
