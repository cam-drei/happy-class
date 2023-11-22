import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './src/screens/home/Home';
import Login from './src/screens/login/Login';
import Signup from './src/screens/signup/Signup';
import User from './src/screens/user/User';
import Course from './src/screens/course/Course';
import {NativeBaseProvider} from 'native-base';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="User" component={User} />
          <Stack.Screen name="Course" component={Course} />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;
