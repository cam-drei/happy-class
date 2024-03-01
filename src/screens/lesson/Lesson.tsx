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
  const [buttonColors, setButtonColors] = useState<{[key: number]: string}>({});
  const [clickedContents, setClickedContents] = useState<{
    [key: number]: boolean;
  }>({});

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
              const contentSubjectResponse = await axios.get(
                `${baseUrl}/api/v1/users/enrolled_courses/${courseId}/lessons/${lesson.id}/subjects/${subject.id}/contents`,
                {
                  headers: {
                    Authorization: `Bearer ${authToken}`,
                  },
                },
              );
              subject.contents = contentSubjectResponse.data.contents;
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

  const revertButtonColor = (contentId: number) => {
    setButtonColors(prevState => {
      const updatedColors = {...prevState};
      delete updatedColors[contentId];
      return updatedColors;
    });
  };

  const revertClickedTitle = (contentId: number) => {
    setClickedContents(prevState => ({
      ...prevState,
      [contentId]: false,
    }));
  };

  const handleButtonClick = (contentId: number) => {
    if (buttonColors[contentId]) {
      revertButtonColor(contentId);
    } else {
      setButtonColors(prevState => ({
        ...prevState,
        [contentId]: '#A9A9A9',
      }));
    }
  };

  const updateClickedTitle = (resourseId: number) => {
    setClickedContents(prevState => ({
      ...prevState,
      [resourseId]: true,
    }));
  };

  const isLoggedIn = !!authToken;

  const [expandedLessons, setExpandedLessons] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleLessonExpansion = (lessonId: number) => {
    setExpandedLessons(prevState => ({
      ...prevState,
      [lessonId]: !prevState[lessonId],
    }));
  };

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <>
          {lessons.length > 0 ? (
            lessons.map(lesson => (
              <View key={lesson.id} style={styles.box}>
                <View style={styles.titleLessonView}>
                  <View style={styles.titleView}>
                    <View style={styles.arrowButton}>
                      <MaterialIcons
                        name={
                          expandedLessons[lesson.id]
                            ? 'arrow-drop-up'
                            : 'arrow-drop-down'
                        }
                        size={40}
                        color="#4F7942"
                        onPress={() => toggleLessonExpansion(lesson.id)}
                      />
                    </View>
                    <Text style={[styles.boxTitle]}>
                      {lesson.name}
                      <Text style={[styles.statusText, styles.statusColor]}>
                        {'  (In progress)'}
                      </Text>
                    </Text>
                  </View>
                  {lesson.contents.map(content => (
                    <View key={content.id} style={styles.iconTitleGroup}>
                      {content.video_link && (
                        <Feather
                          name="video"
                          size={30}
                          color={buttonColors[content.id] || '#4F7942'}
                          onPress={() => {
                            handleButtonClick(content.id);
                            handleVideoPlay(content.video_link, lesson.name);
                            // updateClickedTitle(lesson.id);
                          }}
                        />
                      )}
                      {content.document_link && (
                        <FontAwesome
                          name="book"
                          style={styles.paddingLeftIcon}
                          size={30}
                          color={buttonColors[content.id] || '#4F7942'}
                          onPress={() => {
                            handleButtonClick(content.id);
                            openResourceLink(content.document_link);
                            // updateClickedTitle(lesson.id);
                          }}
                        />
                      )}
                      {content.video_link && content.document_link && (
                        <FontAwesome
                          name="undo"
                          size={20}
                          color="#A9A9A9"
                          style={styles.paddingLeftIcon}
                          onPress={() => {
                            revertClickedTitle(lesson.id);
                            revertButtonColor(content.id);
                          }}
                        />
                      )}
                    </View>
                  ))}
                </View>
                <Text style={[styles.normalSizeText, styles.progressText]}>
                  {'Progress: 3/8 subjects'}
                </Text>
                {expandedLessons[lesson.id] && (
                  <>
                    {lesson.subjects.map(subject => (
                      <View>
                        <View key={subject.id} style={styles.subjectContainer}>
                          <Text
                            style={[
                              styles.normalSizeText,
                              clickedContents[subject.id]
                                ? {color: '#A9A9A9'}
                                : null,
                            ]}>
                            {subject.name}
                          </Text>
                          {subject.contents.map(content => (
                            <View
                              key={content.id}
                              style={styles.iconSubjectContainer}>
                              {content.video_link && (
                                <FontAwesome
                                  name="play-circle"
                                  size={30}
                                  color={buttonColors[content.id] || '#FF9900'}
                                  onPress={() => {
                                    handleButtonClick(content.id);
                                    handleVideoPlay(
                                      content.video_link,
                                      subject.name,
                                    );
                                    updateClickedTitle(subject.id);
                                  }}
                                />
                              )}
                              {content.document_link && (
                                <FontAwesome
                                  name="book"
                                  size={30}
                                  color={buttonColors[content.id] || '#4F7942'}
                                  style={styles.paddingLeftIcon}
                                  onPress={() => {
                                    handleButtonClick(content.id);
                                    openResourceLink(content.document_link);
                                    updateClickedTitle(subject.id);
                                  }}
                                />
                              )}
                              <FontAwesome
                                name="undo"
                                size={20}
                                color="#A9A9A9"
                                style={styles.paddingLeftIcon}
                                onPress={() => {
                                  revertClickedTitle(subject.id);
                                  revertButtonColor(content.id);
                                }}
                              />
                            </View>
                          ))}
                        </View>
                        <Line />
                      </View>
                    ))}
                  </>
                )}
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
