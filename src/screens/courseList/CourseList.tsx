import React, {useState, useEffect, useCallback} from 'react';
import {View, Alert, ScrollView} from 'react-native';
import {Text, CheckBox} from '@rneui/base';
import styles from './styles';
import BottomButton from '../../components/buttons/BottomButton';
import HeaderRight from '../../components/header/HeaderRight';
import LoadingIndicator from '../../components/loading/LoadingIndicator';
import axios from 'axios';
import {baseUrl} from '../../utils/apiConfig';

interface CourseListProps {
  navigation: any;
  route: {
    params: {
      authToken: string;
      userId: string;
      userName: string;
    };
  };
}

interface Course {
  id: number;
  name: string;
  description: string;
}

function CourseList({navigation, route}: CourseListProps) {
  const {authToken, userId, userName} = route.params;
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourses, setSelectedCourses] = useState<{
    [key: number]: boolean;
  }>({});
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const getNumber = (courseName: string) => {
    const match = courseName.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${baseUrl}/users/courses`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const coursesData = response.data.courses;

        const sortedCourses = coursesData.sort((a: Course, b: Course) => {
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
        });
        setCourses(sortedCourses);
        setIsLoading(false);

        const enrolledCoursesResponse = await axios.get(
          `${baseUrl}/users/enrolled_courses`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );

        const enrolledCoursesIds =
          enrolledCoursesResponse.data.enrolled_courses.map(
            (course: Course) => course.id,
          );
        const selectedCoursesState: {[key: number]: boolean} = {};
        coursesData.forEach((course: Course) => {
          selectedCoursesState[course.id] = enrolledCoursesIds.includes(
            course.id,
          );
        });
        setSelectedCourses(selectedCoursesState);
        setSelectAllChecked(enrolledCoursesIds.length === coursesData.length);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
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

  const navigateToCourse = useCallback(() => {
    const selectedCoursesId = Object.keys(selectedCourses)
      .filter((courseId: any) => selectedCourses[courseId])
      .map(Number);

    if (selectedCoursesId.length === 0) {
      Alert.alert('Selection Required', 'Please select the courses.');
      return;
    }

    navigation.navigate('Course', {
      authToken,
      userName,
      selectedCoursesId: selectedCoursesId,
    });
  }, [navigation, authToken, userName, selectedCourses]);

  const toggleCourseSelection = async (courseId: number) => {
    try {
      const updatedSelectedCourses = {
        ...selectedCourses,
        [courseId]: !selectedCourses[courseId],
      };
      setSelectedCourses(updatedSelectedCourses);

      const endpoint = updatedSelectedCourses[courseId]
        ? `courses/${courseId}/enroll_courses`
        : `courses/${courseId}/unenroll_courses`;

      await axios.put(
        `${baseUrl}/users/${endpoint}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      setSelectAllChecked(
        Object.values(updatedSelectedCourses).every(selected => selected),
      );
    } catch (error) {
      console.error('Error toggling course selection:', error);
    }
  };

  const toggleSelectAll = async () => {
    try {
      const updatedSelectedCourses: {[key: number]: boolean} = {};

      for (const course of courses) {
        updatedSelectedCourses[course.id] = !selectAllChecked;

        const endpoint = !selectAllChecked
          ? `courses/${course.id}/enroll_courses`
          : `courses/${course.id}/unenroll_courses`;

        await axios.put(
          `${baseUrl}/users/${endpoint}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );
      }

      setSelectedCourses(updatedSelectedCourses);
      setSelectAllChecked(!selectAllChecked);
    } catch (error) {
      console.error('Error toggling select all:', error);
    }
  };

  const handleCourseSelection = (courseId: number) => {
    navigation.navigate('CourseDetails', {
      courseId,
      authToken,
      userId,
      userName,
    });
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View>
              <Text style={styles.title}>
                {'Select the Courses you want to learn:'}
              </Text>
              <CheckBox
                title={'Select All'}
                // checked={Object.values(selectedCourses).every(
                //   selected => selected,
                // )}
                checked={selectAllChecked}
                onPress={toggleSelectAll}
                iconType="material-community"
                checkedIcon="checkbox-outline"
                uncheckedIcon="checkbox-blank-outline"
                checkedColor="#FF9900"
                textStyle={styles.selectAllText}
                containerStyle={styles.selectAllContainer}
              />
              {courses.map(course => (
                <CheckBox
                  key={course.id}
                  title={course.name}
                  checked={selectedCourses[course.id]}
                  onPress={() => toggleCourseSelection(course.id)}
                  iconType="material-community"
                  checkedIcon="checkbox-outline"
                  uncheckedIcon="checkbox-blank-outline"
                  checkedColor="#FF9900"
                  textStyle={styles.checkboxTitle}
                  containerStyle={styles.checkbox}
                />
              ))}
            </View>
          </ScrollView>
          <View style={styles.bottomButton}>
            <Text style={styles.totalText}>
              {`You selected ${
                Object.values(selectedCourses).filter(selected => selected)
                  .length
              }/${courses.length} courses`}
            </Text>
            <BottomButton text="Submit" onPress={navigateToCourse} />
          </View>
        </>
      )}
    </View>
  );
}

export default CourseList;
