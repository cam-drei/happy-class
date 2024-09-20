import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import {Text} from '@rneui/base';
import styles from './styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import HeaderRight from '../../components/header/HeaderRight';
import HeaderLeft from '../../components/header/HeaderLeft';
import axios from 'axios';
import {baseUrl} from '../../utils/apiConfig';
import LoadingIndicator from '../../components/loading/LoadingIndicator';
import {useFocusEffect} from '@react-navigation/native';
import PrimaryButton from '../../components/buttons/PrimaryButton';

interface CourseProps {
  navigation: any;
  route: {
    params: {
      authToken: string;
      userName: string;
      selectedCoursesId: number[];
    };
  };
}

interface UserSubject {
  id: number;
  user_id: number;
  subject_id: number;
  selected: boolean;
}

interface Course {
  id: number;
  name: string;
  description: string;
}

interface Lesson {
  id: number;
  name: string;
  description: string;
  done: boolean;
}

function Course({navigation, route}: CourseProps) {
  const {authToken, userName, selectedCoursesId} = route.params;
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [isCourseInfoModalVisible, setCourseInfoModalVisible] = useState(false);
  const [contents, setContents] = useState<{[courseId: number]: any[]}>({});
  const [lessons, setLessons] = useState<{[courseId: number]: Lesson[]}>({});
  const [currentSelection, setCurrentSelection] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [courseStatuses, setCourseStatuses] = useState<{
    [courseId: number]: string;
  }>({});

  const getNumber = (courseName: string) => {
    const match = courseName.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const getStatusValue = useCallback((status: string | undefined): number => {
    if (!status) {
      return 5;
    }

    switch (status.toLowerCase()) {
      case 'in progress':
        return 1;
      case 'todo':
        return 2;
      case 'done':
        return 3;
      case 'no lesson':
        return 4;
      default:
        return 5;
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchEnrolledCourses = async () => {
        try {
          const response = await axios.get(
            `${baseUrl}/users/enrolled_courses`,
            {headers: {Authorization: `Bearer ${authToken}`}},
          );
          setEnrolledCourses(response.data.enrolled_courses);
        } catch (error) {
          console.error('Error fetching enrolled courses:', error);
          Alert.alert('Error', 'Failed to fetch enrolled courses.');
        } finally {
          setIsLoading(false);
        }
      };

      if (authToken) {
        fetchEnrolledCourses();
      }
    }, [authToken]),
  );

  useFocusEffect(
    useCallback(() => {
      const fetchCourseStatuses = async () => {
        try {
          if (!enrolledCourses) {
            console.log('Enrolled courses is undefined or null.');
            return;
          }

          if (enrolledCourses.length === 0) {
            console.log('No enrolled courses found.');
            setIsLoading(false);
            return;
          }

          const promises = enrolledCourses.map(async course => {
            const response = await axios.get(
              `${baseUrl}/users/enrolled_courses/${course.id}/status`,
              {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              },
            );
            return {courseId: course.id, status: response.data.status};
          });

          const courseStatusData = await Promise.all(promises);
          const statusMap: {[courseId: number]: string} = {};
          courseStatusData.forEach(item => {
            statusMap[item.courseId] = item.status;
          });

          setCourseStatuses(statusMap);

          const sortedCourses = enrolledCourses.sort((a, b) => {
            const statusComparison =
              getStatusValue(statusMap[a.id]) - getStatusValue(statusMap[b.id]);

            if (statusComparison === 0) {
              const aNameLower = a.name.toLowerCase();
              const bNameLower = b.name.toLowerCase();

              if (
                aNameLower.startsWith('abeka k') &&
                !bNameLower.startsWith('abeka k')
              ) {
                return -1;
              }
              if (
                bNameLower.startsWith('abeka k') &&
                !aNameLower.startsWith('abeka k')
              ) {
                return 1;
              }

              const aNumber = getNumber(a.name);
              const bNumber = getNumber(b.name);
              return aNumber - bNumber;
            }

            return statusComparison;
          });

          setEnrolledCourses([...sortedCourses]);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching course statuses:', error);
          setIsLoading(false);
          Alert.alert(
            'Error',
            'An error occurred while fetching course statuses.',
          );
        }
      };

      fetchCourseStatuses();
    }, [authToken, enrolledCourses, getStatusValue]),
  );

  useEffect(() => {
    const fetchData = async () => {
      const promises = enrolledCourses.map(async course => {
        const [contentResponse, lessonResponse] = await Promise.all([
          axios.get(`${baseUrl}/users/enrolled_courses/${course.id}/contents`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }),
          axios.get(`${baseUrl}/users/enrolled_courses/${course.id}/lessons`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }),
        ]);

        setContents(prev => ({
          ...prev,
          [course.id]: contentResponse.data.contents,
        }));
        setLessons(prev => ({
          ...prev,
          [course.id]: lessonResponse.data,
        }));
      });

      await Promise.all(promises);
    };

    if (enrolledCourses.length) {
      fetchData();
    }
  }, [authToken, enrolledCourses]);

  const navigateToLesson = useCallback(
    async (courseId: number) => {
      try {
        const response = await axios.get(
          `${baseUrl}/users/enrolled_courses/${courseId}/selected_user_subjects`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );
        const selectedSubjectsId = response.data.selected_user_subjects.map(
          (userSubject: UserSubject) => userSubject.subject_id,
        );
        navigation.navigate('Lesson', {
          authToken,
          userName,
          courseId,
          selectedSubjectsId,
        });
      } catch (error) {
        console.error('Error fetching selected user subjects:', error);
      }
    },
    [authToken, navigation, userName],
  );

  const navigateToSubjectList = useCallback(
    (courseId: number) => {
      navigation.navigate('SubjectList', {
        authToken,
        userName,
        courseId,
      });
    },
    [authToken, navigation, userName],
  );

  const getTotalLessons = (courseId: number) => lessons[courseId]?.length || 0;
  const getDoneLessons = (courseId: number) =>
    lessons[courseId]?.filter(lesson => lesson.done).length || 0;

  const isCourseDone = (courseId: number) =>
    getTotalLessons(courseId) === getDoneLessons(courseId);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <HeaderLeft
          onPress={() =>
            navigation.navigate('Welcome', {
              authToken,
              userName,
              selectedCoursesId,
            })
          }
        />
      ),
      headerRight: () => (
        <HeaderRight
          userName={userName}
          userImage={require('../../assets/images/tiger.jpeg')}
          onPress={() =>
            navigation.navigate('Welcome', {
              authToken,
              userName,
              selectedCoursesId,
            })
          }
        />
      ),
    });
  }, [navigation, userName, authToken, selectedCoursesId]);

  const openResourceLink = (resourceLink: string) => {
    if (resourceLink) {
      Linking.openURL(resourceLink);
    }
  };

  const handleVideoPlay = (videoLink: string, videoName: string) => {
    navigation.navigate('VideoScreen', {videoLink, videoName});
  };

  const navigateToCourseList = () => {
    navigation.navigate('CourseList', {
      authToken,
      userName,
      selectedCoursesId,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            {enrolledCourses && enrolledCourses.length > 0 ? (
              enrolledCourses.map(course => (
                <View
                  key={course.id}
                  style={[
                    styles.box,
                    isCourseDone(course.id) && styles.doneBorder,
                  ]}>
                  <View style={styles.titleView}>
                    <Text
                      h4
                      style={[
                        styles.boxTitle,
                        isCourseDone(course.id) && styles.doneColor,
                      ]}
                      onPress={() => {
                        setCurrentSelection(course);
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
                              color={
                                isCourseDone(course.id) ? '#A9A9A9' : '#4F7942'
                              }
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
                              color={
                                isCourseDone(course.id) ? '#A9A9A9' : '#4F7942'
                              }
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
                        color={isCourseDone(course.id) ? '#A9A9A9' : '#FF9900'}
                        style={styles.iconPlay}
                        onPress={() => navigateToLesson(course.id)}
                      />
                      <View>
                        <Text
                          style={[
                            styles.normalSizeText,
                            isCourseDone(course.id) && styles.doneColor,
                          ]}>
                          Progress: {getDoneLessons(course.id)}/
                          {getTotalLessons(course.id)}
                          {getDoneLessons(course.id) <= 1
                            ? ' lesson'
                            : ' lessons'}
                        </Text>
                        <Text
                          style={[
                            styles.statusText,
                            courseStatuses[course.id] === 'Todo' &&
                              styles.todoTextColor,
                            (courseStatuses[course.id] === 'Done' ||
                              courseStatuses[course.id] === 'No Lesson') &&
                              styles.doneColor,
                            courseStatuses[course.id] === 'In Progress' &&
                              styles.inProgressColor,
                          ]}>
                          Status: {courseStatuses[course.id]}
                        </Text>
                      </View>
                    </View>
                    <AntDesign
                      name="edit"
                      size={30}
                      color={isCourseDone(course.id) ? '#A9A9A9' : '#4F7942'}
                      onPress={() => navigateToSubjectList(course.id)}
                    />
                  </View>
                  {currentSelection && (
                    <Modal visible={isCourseInfoModalVisible} transparent>
                      <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                          <ScrollView style={styles.scrollView}>
                            <Text h4>{currentSelection.name}</Text>
                            <Text style={styles.modalText}>
                              {currentSelection.description}
                            </Text>
                          </ScrollView>
                          <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                              setCourseInfoModalVisible(false);
                              setCurrentSelection(null);
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
              <View style={styles.noCourse}>
                <Text h4>No enrolled courses.</Text>
                <PrimaryButton
                  text="Click for choose your Courses"
                  buttonType={'outlined'}
                  onPress={navigateToCourseList}
                />
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

export default Course;
