import React from 'react';
import {View} from 'react-native';
import {Text} from '@rneui/base';
import styles from './styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface CourseProps {
  navigation: any;
  route: {params: {userName: string; authToken: string}};
}

function Course({navigation, route}: CourseProps) {
  const {userName, authToken} = route.params;

  const navigateToLesson = () => {
    navigation.navigate('Lesson', {userName, authToken});
  };

  const navigateToEnroll = () => {
    navigation.navigate('Enroll', {userName, authToken});
  };

  const isLoggedIn = !!authToken;

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <>
          <Text h4>{userName}</Text>
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
        </>
      ) : (
        <View>
          <Text h4>Please log in to access the course.</Text>
        </View>
      )}

      {/* <Button
        title="Go back to first screen in stack"
        onPress={() => navigation.popToTop()}
      /> */}
    </View>
  );
}

export default Course;
