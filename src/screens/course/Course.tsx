import React, {useState, useEffect, useCallback} from 'react';
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
import {useFocusEffect} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface CourseProps {
  navigation: any;
  route: {
    params: {
      authToken: string;
      userId: string;
      userName: string;
      selectedCoursesId: number[];
    };
  };
}

interface Subject {
  id: number;
  name: string;
  description: string;
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
  const {authToken, userId, userName, selectedCoursesId} = route.params;
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

  useFocusEffect(
    useCallback(() => {
      const fetchEnrolledCourses = async () => {
        try {
          const response = await axios.get(
            // `${baseUrl}/users/enrolled_courses`,
            `${baseUrl}/users/courses/selected_course`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            },
          );

          const allEnrolledCourses = response.data.selected_courses;
          const filteredCourses = allEnrolledCourses.filter((course: Course) =>
            selectedCoursesId.includes(course.id),
          );
          setEnrolledCourses(filteredCourses);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching enrolled courses:', error);
        }
      };

      if (authToken) {
        fetchEnrolledCourses();
      }
    }, [authToken, selectedCoursesId]),
  );

  useEffect(() => {
    const fetchCourseStatuses = async () => {
      try {
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

        setEnrolledCourses(sortedCourses);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching course statuses:', error);
      }
    };

    if (enrolledCourses.length > 0) {
      fetchCourseStatuses();
    }
  }, [authToken, enrolledCourses]);

  const getStatusValue = (status: string): number => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return 1;
      case 'todo':
        return 2;
      case 'done':
        return 3;
      default:
        return 4;
    }
  };

  const navigateToUser = useCallback(() => {
    navigation.navigate('User', {
      authToken,
      userId,
      userName,
      selectedCoursesId,
    });
  }, [navigation, authToken, userId, userName, selectedCoursesId]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderRight
          userName={userName}
          userImage={require('../../assets/images/tulip.webp')}
        />
      ),
      headerTitle: 'Subjects',
      headerLeft: () => (
        <TouchableOpacity onPress={navigateToUser}>
          <MaterialIcons
            name={'arrow-back'}
            style={{marginLeft: 15, fontSize: 30}}
            color={'#FF9900'}
          />
        </TouchableOpacity>
    )});
  }, [navigation, userName, navigateToUser]);

  const navigateToLesson = async (courseId: number) => {
    try {
      const response = await axios.get(
        `${baseUrl}/users/enrolled_courses/${courseId}/selected_subjects`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      const fetchedSelectedSubjects = response.data.selected_subjects;
      const fetchedSelectedSubjectsId = fetchedSelectedSubjects.map(
        (subject: Subject) => subject.id,
      );
      navigation.navigate('Lesson', {
        authToken,
        userId,
        userName,
        courseId,
        selectedSubjectsId: fetchedSelectedSubjectsId,
      });
    } catch (error) {
      console.error('Error fetching selected subjects for course:', error);
    }
  };

  const navigateToEnroll = (courseId: number) => {
    navigation.navigate('Subject', {authToken, userId, userName, courseId});
  };

  useEffect(() => {
    const fetchContentsForCourse = async (courseId: number) => {
      try {
        const response = await axios.get(
          `${baseUrl}/users/enrolled_courses/${courseId}/contents`,
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

  useEffect(() => {
    const fetchLessonsForCourse = async (courseId: number) => {
      try {
        const response = await axios.get(
          `${baseUrl}/users/enrolled_courses/${courseId}/lessons`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );

        setLessons(prevLessons => ({
          ...prevLessons,
          [courseId]: response.data.lessons,
        }));
      } catch (error) {
        console.error('Error fetching lessons for course:', error);
      }
    };

    enrolledCourses.forEach(course => {
      fetchLessonsForCourse(course.id);
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

  const getTotalLessons = (courseId: number) => {
    const lessonsForCourse = lessons[courseId];
    return lessonsForCourse ? lessonsForCourse.length : 0;
  };

  const getDoneLessons = (courseId: number) => {
    const lessonsForCourse = lessons[courseId];
    if (!lessonsForCourse) {
      return 0;
    }
    return lessonsForCourse.filter(lesson => lesson.done).length;
  };

  const isCourseDone = (courseId: number) => {
    return getTotalLessons(courseId) === getDoneLessons(courseId);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            {enrolledCourses.length > 0 ? (
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
                            getDoneLessons(course.id) === 0 &&
                              styles.todoTextColor,
                            isCourseDone(course.id) && styles.doneColor,
                          ]}>
                          Status: {courseStatuses[course.id]}
                        </Text>
                      </View>
                    </View>
                    <AntDesign
                      name="edit"
                      size={30}
                      color={isCourseDone(course.id) ? '#A9A9A9' : '#4F7942'}
                      onPress={() => navigateToEnroll(course.id)}
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
              <Text h4>No enrolled courses.</Text>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

export default Course;
