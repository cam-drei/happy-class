import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './src/screens/home/Home';
import Login from './src/screens/login/Login';
import Signup from './src/screens/signup/Signup';
import User from './src/screens/user/User';
import Course from './src/screens/course/Course';
import Subject from './src/screens/subject/Subject';
import Lesson from './src/screens/lesson/Lesson';
import VideoScreen from './src/components/video/VideoScreen';
import CourseList from './src/screens/course/CourseList';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="User" component={User} />
        <Stack.Screen name="Course" component={Course} />
        <Stack.Screen name="Subject" component={Subject} />
        <Stack.Screen name="Lesson" component={Lesson} />
        <Stack.Screen name="VideoScreen" component={VideoScreen} />
        <Stack.Screen name="CourseList" component={CourseList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
