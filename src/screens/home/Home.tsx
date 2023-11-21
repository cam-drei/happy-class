import React from 'react';
import {View, Image} from 'react-native';
import styles from './styles';
import BottomButton from '../../components/buttons/BottomButton';

function Home({navigation}: {navigation: any}) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
      />
      <BottomButton
        text="Login"
        type="filled"
        titleStyle={styles.bottomButtonTitle}
        onPress={() => navigation.navigate('Login')}
      />
      <BottomButton
        text="Signup"
        type="outlined"
        titleStyle={styles.bottomButtonTitle}
        onPress={() => navigation.navigate('Signup')}
      />
    </View>
  );
}

export default Home;
