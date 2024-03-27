import React, {useState, useEffect} from 'react';
import {View, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {Text} from '@rneui/base';
import styles from './styles';
import axios from 'axios';
import {baseUrl} from '../../utils/apiConfig';
import LoadingIndicator from '../../components/loading/LoadingIndicator';

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

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/courses`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setCourses(response.data.courses);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [authToken]);

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
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <View>
            <Text h4>Choose Your Course</Text>
            {courses.map(course => (
              <TouchableOpacity
                key={course.id}
                // onPress={() => handleCourseSelection(course.id)}
                onPress={() => {
                  Alert.alert('Alert Title', 'Button Clicked!');
                }}>
                <Text>{course.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

export default CourseList;
