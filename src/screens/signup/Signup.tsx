import React from 'react';
import {Text, View, Button} from 'react-native';
import styles from './styles';

function Course({navigation}) {
  return (
    <View style={styles.container}>
      <Text>Sign up</Text>
      <Button
        title="Go to Login"
        onPress={() => navigation.navigate('Login')}
      />
      <Button
        title="Go to Course"
        onPress={() => navigation.navigate('Course')}
      />
    </View>
  );
}

export default Course;
