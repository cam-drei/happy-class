import React, {useState, useEffect} from 'react';
import {View, Modal, TouchableOpacity, ScrollView} from 'react-native';
import {Text} from '@rneui/base';
import styles from './styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HeaderRight from '../../components/header/HeaderRight';
import axios from 'axios';
import {baseUrl} from '../../utils/apiConfig';

interface CourseProps {
  navigation: any;
  route: {params: {authToken: string; userId: string; userName: string}};
}

interface Course {
  id: number;
  name: string;
  description: string;
}

function Course({navigation, route}: CourseProps) {
  const {authToken, userId, userName} = route.params;
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/v1/users/enrolled_courses`,
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

  const navigateToLesson = (courseId: number) => {
    navigation.navigate('Lesson', {authToken, userId, userName, courseId});
  };

  const navigateToEnroll = () => {
    navigation.navigate('Enroll', {authToken, userId, userName});
  };

  const isLoggedIn = !!authToken;

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <>
          {enrolledCourses.length > 0 ? (
            enrolledCourses.map(course => (
              <View key={course.id} style={styles.box}>
                <View style={styles.titleView}>
                  <Text
                    h4
                    style={styles.boxTitle}
                    onPress={() => setModalVisible(true)}>
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
                      onPress={() => navigateToLesson(course.id)}
                    />
                    <View>
                      <Text style={styles.normalSizeText}>Progress: 150/170 lessons</Text>
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
                <Modal visible={isModalVisible} transparent>
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <ScrollView style={styles.scrollView}>
                        <Text h4>{course.name}</Text>
                        <Text style={styles.modalText}>
                          {course.description}
                        </Text>
                      </ScrollView>
                      <TouchableOpacity
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!isModalVisible)}>
                        <Text style={styles.textStyle}>Close</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </View>
            ))
          ) : (
            <Text h4>No enrolled courses.</Text>
          )}
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
