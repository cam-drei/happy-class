import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {Text} from '@rneui/base';
import styles from './styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HeaderRight from '../../components/header/HeaderRight';
import axios from 'axios';
import {baseUrl} from '../../utils/apiConfig';

interface CourseProps {
  navigation: any;
  route: {params: {userName: string; authToken: string}};
}

interface Course {
  id: number;
  name: string;
}

function Course({navigation, route}: CourseProps) {
  const {userName, authToken} = route.params;
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);

  const navigateToLesson = () => {
    navigation.navigate('Lesson', {userName, authToken});
  };

  const navigateToEnroll = () => {
    navigation.navigate('Enroll', {userName, authToken});
  };

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/v1/users/${userId}/enrolled_courses`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );

        setEnrolledCourses(response.data.enrolled_courses);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      }
    };

    if (authToken) {
      fetchEnrolledCourses();
    }
  }, [authToken]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderRight
          userName={userName}
          userImage={require('../../assets/images/tulip.webp')}
        />
      ),
    });
  }, [navigation, userName]);

  const isLoggedIn = !!authToken;

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <>
          {enrolledCourses.length > 0 ? (
            enrolledCourses.map(course => (
              <View key={course.id} style={styles.box}>
                <View style={styles.titleView}>
                  <Text h4 style={styles.boxTitle}>
                    {course.name}
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
            ))
          ) : (
            <Text h4>No enrolled courses.</Text>
          )}
          {/* <View style={styles.box}>
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
          </View> */}
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
