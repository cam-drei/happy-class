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
  selected: boolean;
}

function CourseList({navigation, route}: CourseListProps) {
  const {authToken, userId, userName} = route.params;
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourses, setSelectedCourses] = useState<{
    [key: number]: boolean;
  }>({});
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${baseUrl}/users/courses`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const coursesData = response.data.courses;

        const initialSelectedCourses: {[key: number]: boolean} = {};
        coursesData.forEach((course: Course) => {
          initialSelectedCourses[course.id] = course.selected;
        });

        setCourses(coursesData);
        setSelectedCourses(initialSelectedCourses);
        setIsLoading(false);
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
  }, [selectedCourses, navigation, authToken, userName]);

  const toggleCourseSelection = async (
    courseId: number,
    isSelected: boolean,
  ) => {
    try {
      const endpoint = isSelected
        ? `courses/${courseId}/mark_selected`
        : `courses/${courseId}/unmark_selected`;

      await axios.put(
        `${baseUrl}/users/${endpoint}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      setSelectedCourses({
        ...selectedCourses,
        [courseId]: isSelected,
      });
    } catch (error) {
      console.error('Error toggling course selection:', error);
    }
  };

  const toggleSelectAll = async () => {
    const allSelected = !selectAllChecked;
    const updatedSelectedCourses: {[key: number]: boolean} = {};

    try {
      for (const course of courses) {
        const endpoint = allSelected
          ? `courses/${course.id}/mark_selected`
          : `courses/${course.id}/unmark_selected`;

        await axios.put(
          `${baseUrl}/users/${endpoint}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );

        updatedSelectedCourses[course.id] = allSelected;
      }

      setSelectAllChecked(allSelected);
      setSelectedCourses(updatedSelectedCourses);
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
                checked={Object.values(selectedCourses).every(course => course)}
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
                  onPress={() =>
                    toggleCourseSelection(
                      course.id,
                      !selectedCourses[course.id],
                    )
                  }
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
