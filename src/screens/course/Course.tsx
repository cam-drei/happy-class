import React, {useState, useEffect} from 'react';
import {View, Modal, TouchableOpacity, ScrollView, Linking} from 'react-native';
import {Text} from '@rneui/base';
import styles from './styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import HeaderRight from '../../components/header/HeaderRight';
import axios from 'axios';
import {baseUrl} from '../../utils/apiConfig';
import LoadingIndicator from '../../components/loading/LoadingIndicator';

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
  const [isCourseInfoModalVisible, setCourseInfoModalVisible] = useState(false);
  const [contents, setContents] = useState<{[courseId: number]: any[]}>({});
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(false);
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

  useEffect(() => {
    const fetchContentsForCourse = async (courseId: number) => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/v1/users/enrolled_courses/${courseId}/contents`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );

        setContents(prevContents => ({
          ...prevContents,
          [courseId]: response.data.contents,
        }));
      } catch (error) {
        console.error('Error fetching contents for course:', error);
      }
    };

    enrolledCourses.forEach(course => {
      fetchContentsForCourse(course.id);
    });
  }, [authToken, enrolledCourses]);

  const openResourceLink = (resourceLink: string) => {
    if (resourceLink) {
      Linking.openURL(resourceLink);
    }
  };

  const handleVideoPlay = (videoLink: string, videoName: string) => {
    navigation.navigate('VideoScreen', {videoLink, videoName});
  };

  const isLoggedIn = !!authToken;

  return (
    <View style={styles.container}>
      {isLoading ? (
        <LoadingIndicator />
      ) : isLoggedIn ? (
        <>
          {enrolledCourses.length > 0 ? (
            enrolledCourses.map(course => (
              <View key={course.id} style={styles.box}>
                <View style={styles.titleView}>
                  <Text
                    h4
                    style={styles.boxTitle}
                    onPress={() => {
                      setSelectedCourse(course);
                      setCourseInfoModalVisible(!!course.description);
                    }}>
                    {course.name}
                  </Text>
                  {contents[course.id] &&
                    contents[course.id].length > 0 &&
                    contents[course.id].map(content => (
                      <View key={content.id} style={styles.iconSubjectGroup}>
                        {content.video_link && (
                          <Feather
                            name="video"
                            size={30}
                            color="#4F7942"
                            onPress={() =>
                              handleVideoPlay(content.video_link, course.name)
                            }
                          />
                        )}
                        {content.document_link && (
                          <FontAwesome
                            name="book"
                            style={styles.bookIcon}
                            size={30}
                            color="#4F7942"
                            onPress={() =>
                              openResourceLink(content.document_link)
                            }
                          />
                        )}
                      </View>
                    ))}
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
                {selectedCourse && (
                  <Modal visible={isCourseInfoModalVisible} transparent>
                    <View style={styles.centeredView}>
                      <View style={styles.modalView}>
                        <ScrollView style={styles.scrollView}>
                          <Text h4>{selectedCourse.name}</Text>
                          <Text style={styles.modalText}>
                            {selectedCourse.description}
                          </Text>
                        </ScrollView>
                        <TouchableOpacity
                          style={[styles.button, styles.buttonClose]}
                          onPress={() => {
                            setCourseInfoModalVisible(false);
                            setSelectedCourse(null);
                          }}>
                          <Text style={styles.textStyle}>Close</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                )}
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
    </View>
  );
}

export default Course;
