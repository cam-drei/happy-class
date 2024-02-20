import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {Text} from '@rneui/base';
import styles from './styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Line from '../../components/line/Line';
import HeaderRight from '../../components/header/HeaderRight';
import axios from 'axios';
import {baseUrl} from '../../utils/apiConfig';

interface LessonProps {
  navigation: any;
  route: {params: {userName: string; authToken: string; courseId: number}};
}

interface Subject {
  id: number;
  name: string;
  description: string;
  done: boolean;
}

interface Lesson {
  id: number;
  name: string;
  description: string;
  done: boolean;
  subjects: Subject[];
}

function Lesson({navigation, route}: LessonProps) {
  const {userName, authToken, courseId} = route.params;
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    const fetchEnrolledLessons = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/v1/users/enrolled_courses/${courseId}/lessons`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );

        // setLessons(response.data.lessons);
        const lessonsWithSubjects = await Promise.all(
          response.data.lessons.map(async (lesson: Lesson) => {
            const subjectResponse = await axios.get(
              `${baseUrl}/api/v1/users/enrolled_courses/${courseId}/lessons/${lesson.id}/subjects`,
              {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              }
            );
            lesson.subjects = subjectResponse.data.subjects;
            return lesson;
          }),
        );

        setLessons(lessonsWithSubjects);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      }
    };

    if (courseId) {
      fetchEnrolledLessons();
    }
  }, [authToken, courseId]);

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
          {lessons.length > 0 ? (
            lessons.map(lesson => (
              <View key={lesson.id} style={styles.box}>
                <View style={styles.titleView}>
                  <View style={styles.contentView}>
                    <Text style={styles.boxTitle}>
                      {lesson.name}
                      <Text style={[styles.innerText, {color: '#FF9900'}]}>{'   (In progress)'}</Text>
                    </Text>
                  </View>
                  <FontAwesome
                    name="book"
                    size={30}
                    color="#4F7942"
                    onPress={() => navigation.goBack()}
                  />
                </View>
                <Text style={[styles.normalSizeText, styles.progressText]}>
                  {'Progress: 3/8 subjects'}
                </Text>
                {lesson.subjects.map(subject => (
                  <>
                    <View key={subject.id} style={styles.subjectViewGroup}>
                      <View style={styles.subjectView}>
                        <Text style={styles.normalSizeText}>
                          {subject.name}
                        </Text>
                      </View>
                      <View style={styles.iconSubjectViewGroup}>
                        <FontAwesome
                          name="play-circle"
                          size={30}
                          color="#FF9900"
                          onPress={() => navigation.navigate('Lesson')}
                        />
                        <FontAwesome
                          name="book"
                          size={30}
                          color="#4F7942"
                          onPress={() => navigation.goBack()}
                        />
                        <FontAwesome
                          name="undo"
                          size={20}
                          color="#4F7942"
                          onPress={() => navigation.goBack()}
                        />
                      </View>
                    </View>
                    <Line />
                  </>
                ))}

                <View style={styles.bottomArrow}>
                  <MaterialIcons
                    name="keyboard-arrow-up"
                    size={40}
                    color="#4F7942"
                    onPress={() => navigation.goBack()}
                  />
                </View>
              </View>
            ))
          ) : (
            <Text h4>No lessons.</Text>
          )}
        </>
      ) : (
        <View>
          <Text h4>Please log in to access the lesson.</Text>
        </View>
      )}
    </View>
  );
}

export default Lesson;
