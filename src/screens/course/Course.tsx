import React from 'react';
import {Text, View, Button} from 'react-native';
import styles from './styles';

function Course({navigation}: {navigation: any}) {
  return (
    <View style={styles.container}>
      <Text>Course</Text>
      <Button title="Go Home" onPress={() => navigation.navigate('Home')} />
      <Button
        title="Go to Login"
        onPress={() => navigation.navigate('Login')}
      />
      <Button
        title="Go to Signup"
        onPress={() => navigation.navigate('SignUp')}
      />
      <Button title="Go to User" onPress={() => navigation.navigate('User')} />
      <Button
        title="Go to Details... again"
        onPress={() => navigation.push('Details')}
      />
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button
        title="Go back to first screen in stack"
        onPress={() => navigation.popToTop()}
      />
    </View>
  );
}

export default Course;
