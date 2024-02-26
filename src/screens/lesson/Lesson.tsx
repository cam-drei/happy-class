import React, {useState, useEffect} from 'react';
import {View, Linking} from 'react-native';
import {Text} from '@rneui/base';
import styles from './styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
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
  contents: Content[];
}

interface Content {
  id: number;
  video_link: string;
  document_link: string;
  resource_type: string;
}

interface Lesson {
  id: number;
  name: string;
  description: string;
  done: boolean;
  subjects: Subject[];
  contents: Content[];
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

        const lessonsWithSubjects = await Promise.all(
          response.data.lessons.map(async (lesson: Lesson) => {
            const subjectResponse = await axios.get(
              `${baseUrl}/api/v1/users/enrolled_courses/${courseId}/lessons/${lesson.id}/subjects`,
              {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              },
            );
            lesson.subjects = subjectResponse.data.subjects;

            for (let subject of lesson.subjects) {
              const contentResponse = await axios.get(
                `${baseUrl}/api/v1/users/enrolled_courses/${courseId}/lessons/${lesson.id}/subjects/${subject.id}/contents`,
                {
                  headers: {
                    Authorization: `Bearer ${authToken}`,
                  },
                },
              );
              subject.contents = contentResponse.data.contents;
            }

            const lessonContentResponse = await axios.get(
              `${baseUrl}/api/v1/users/enrolled_courses/${courseId}/lessons/${lesson.id}/contents`,
              {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              },
            );
            lesson.contents = lessonContentResponse.data.contents;

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
                  {lesson.contents.map(content => (
                    <View key={content.id} style={styles.iconTitleGroup}>
                      {content.video_link && (
                        <Feather
                          name="video"
                          size={30}
                          color="#4F7942"
                          onPress={() =>
                            handleVideoPlay(content.video_link, lesson.name)
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
                <Text style={[styles.normalSizeText, styles.progressText]}>
                  {'Progress: 3/8 subjects'}
                </Text>
                {lesson.subjects.map(subject => (
                  <View>
                    <View key={subject.id} style={styles.subjectGroup}>
                      <View style={styles.subjectView}>
                        <Text style={styles.normalSizeText}>
                          {subject.name}
                        </Text>
                      </View>
                      {subject.contents.map(content => (
                        <View key={content.id} style={styles.iconSubjectGroup}>
                          {content.video_link && (
                            <FontAwesome
                              name="play-circle"
                              size={30}
                              color="#FF9900"
                              onPress={() =>
                                handleVideoPlay(
                                  content.video_link,
                                  subject.name,
                                )
                              }
                            />
                          )}
                          {content.document_link && (
                            <FontAwesome
                              name="book"
                              size={30}
                              color="#4F7942"
                              onPress={() =>
                                openResourceLink(content.document_link)
                              }
                            />
                          )}
                          <FontAwesome
                            name="undo"
                            size={20}
                            color="#4F7942"
                            onPress={() => navigation.goBack()}
                          />
                        </View>
                      ))}
                    </View>
                    <Line />
                  </View>
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
