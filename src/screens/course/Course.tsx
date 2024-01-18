import React from 'react';
import {View} from 'react-native';
import {Text} from '@rneui/base';
import styles from './styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface CourseProps {
  navigation: any;
  route: {params: {authToken: string}};
}

function Course({navigation, route}: CourseProps) {
  const {authToken} = route.params;

  const navigateToLesson = () => {
    navigation.navigate('Lesson', {authToken});
  };

  const navigateToEnroll = () => {
    navigation.navigate('Enroll', {authToken});
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.titleView}>
          <Text h4 style={styles.boxTitle}>
            ABEKA K4
          </Text>
          <FontAwesome
            name="book"
            size={30}
            color="#4F7942"
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={[styles.titleView]}>
          <View style={styles.contentView}>
            <FontAwesome
              name="play-circle"
              size={60}
              color="#FF9900"
              style={styles.iconPlay}
              onPress={navigateToLesson}
            />
            <View>
              <Text style={styles.progressText}>Progress: 150/170 lessons</Text>
              <Text style={styles.statusText}>Status: in progress</Text>
            </View>
          </View>
          <AntDesign
            name="edit"
            size={30}
            color="#4F7942"
            onPress={navigateToEnroll}
          />
        </View>
      </View>

      <View style={styles.box}>
        <View style={styles.titleView}>
          <Text h4 style={styles.boxTitle}>
            ABEKA K4
          </Text>
          <FontAwesome
            name="book"
            size={30}
            color="#4F7942"
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={[styles.titleView]}>
          <View style={styles.contentView}>
            <FontAwesome
              name="play-circle"
              size={60}
              color="#FF9900"
              style={styles.iconPlay}
              onPress={navigateToLesson}
            />
            <View>
              <Text style={styles.progressText}>Progress: 150/170 lessons</Text>
              <Text style={styles.statusText}>Status: in progress</Text>
            </View>
          </View>
          <AntDesign
            name="edit"
            size={30}
            color="#4F7942"
            onPress={navigateToEnroll}
          />
        </View>
      </View>
      {/* <Button
        title="Go back to first screen in stack"
        onPress={() => navigation.popToTop()}
      /> */}
    </View>
  );
}

export default Course;
