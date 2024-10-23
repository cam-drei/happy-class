import React, {useEffect} from 'react';
import {View} from 'react-native';
import styles from './styles';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import Logo from '../../components/logo/Logo';

function Home({navigation}: {navigation: any}) {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
    });
  });

  return (
    <View style={styles.container}>
      <Logo />
      <PrimaryButton
        text="Login"
        titleStyle={'normal'}
        onPress={() => navigation.navigate('Login')}
      />
      <PrimaryButton
        text="Signup"
        buttonType={'outlined'}
        titleStyle={'normal'}
        onPress={() => navigation.navigate('Signup')}
      />
    </View>
  );
}

export default Home;
