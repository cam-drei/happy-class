
import React, {useState, useEffect, useCallback} from 'react';
import {View, Linking, ScrollView} from 'react-native';
import {Text} from '@rneui/base';
import styles from './styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Line from '../../components/line/Line';
import HeaderRight from '../../components/header/HeaderRight';
import HeaderLeft from '../../components/header/HeaderLeft';
import axios from 'axios';
import {baseUrl} from '../../utils/apiConfig';
import LoadingIndicator from '../../components/loading/LoadingIndicator';
import PrimaryButton from '../../components/buttons/PrimaryButton';

interface LessonProps {
  navigation: any;
  route: {
    params: {
      userName: string;
      authToken: string;
      courseId: number;
      selectedSubjectsId: number[];
    };
  };
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

interface SubjectLesson {
  id: number;
  subject_id: number; //check later
  lesson_id: number; //check later
  contents: Content[];
  subject: Subject; //check later
  user_subject_lesson: UserSubjectLesson; //check later
  done: boolean;
  subject_name: string;
}

interface UserSubjectLesson {
  id: number;
  user_id: number;
  subject_lesson_id: number;
  done: boolean;
  subject_lesson: SubjectLesson;
}

interface UserLesson {
  id: number;
  user_id: number;
  lesson_id: number;
  done: boolean;
}

interface Lesson {
  id: number;
  name: string;
  description: string;
  done: boolean;
  subjects: Subject[];
  contents: Content[];
  subject_lessons: SubjectLesson[];
  user_subject_lessons: UserSubjectLesson[];
}

function Lesson({navigation, route}: LessonProps) {
  const {userName, authToken, courseId, selectedSubjectsId} = route.params;
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allLessonsTodo, setAllLessonsTodo] = useState(false);
  const [userLessons, setUserLessons] = useState<UserLesson[]>([]);
  const [userLessonsLoading, setUserLessonsLoading] = useState<boolean>(true);
  const [expandedLessons, setExpandedLessons] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        console.log('selectedSubjectsId:', selectedSubjectsId);

        const lessonsResponse = await axios.get(
          `${baseUrl}/users/enrolled_courses/${courseId}/lessons`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );

        console.log('lessonsResponse:', lessonsResponse.data);
        setLessons(lessonsResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      }
    };

    if (authToken) {
      fetchLessons();
    }
  }, [authToken, courseId, selectedSubjectsId]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => <HeaderLeft onPress={() => navigation.goBack()} />,
      headerRight: () => (
        <HeaderRight
          userName={userName}
          userImage={require('../../assets/images/tiger.jpeg')}
        />
      ),
    });
  }, [navigation, userName]);

  const markLessonAsDone = useCallback(
    async (userLessonId: number) => {
      try {
        await axios.put(
          `${baseUrl}/users/enrolled_courses/${courseId}/user_lessons/${userLessonId}/mark_done`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );
      } catch (error) {
        console.error('Error marking lesson as done:', error);
      }
    },
    [authToken, courseId],
  );

  const unmarkLessonAsDone = useCallback(
    async (userLessonId: number) => {
      try {
        await axios.put(
          `${baseUrl}/users/enrolled_courses/${courseId}/user_lessons/${userLessonId}/unmark_done`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );
      } catch (error) {
        console.error('Error marking lesson as not done:', error);
      }
    },
    [authToken, courseId],
  );

  useEffect(() => {
    const fetchUserLessons = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/users/enrolled_courses/${courseId}/user_lessons`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );
        setUserLessons(response.data.user_lessons);
        setUserLessonsLoading(false);
      } catch (error) {
        console.error('Error fetching user lessons:', error);
      }
    };

    fetchUserLessons();
  }, [authToken, courseId]);

  useEffect(() => {
    if (userLessons.length === 0 || userLessonsLoading) {
      return;
    }

    lessons.forEach(async lesson => {
      const userLesson = userLessons.find(ul => ul.lesson_id === lesson.id);
      if (userLesson) {
        const isDone = lesson.subject_lessons.every(
          subjectLesson => subjectLesson.user_subject_lesson.done,
        );

        if (isDone && !userLesson.done) {
          await markLessonAsDone(userLesson.id);
        } else if (!isDone && userLesson.done) {
          await unmarkLessonAsDone(userLesson.id);
        }
      }
    });
  }, [
    lessons,
    userLessons,
    userLessonsLoading,
    markLessonAsDone,
    unmarkLessonAsDone,
  ]);

  const markUserSubjectAsDone = useCallback(
    async (lessonId: number, userSubjectLessonId: number) => {
      if (!userSubjectLessonId) {
        console.error('userSubjectLessonId is undefined');
        return;
      }

      try {
        await axios.put(
          `${baseUrl}/users/enrolled_courses/${courseId}/lessons/${lessonId}/user_subject_lessons/${userSubjectLessonId}/mark_done`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );

        setLessons(prevLessons =>
          prevLessons.map(lesson =>
            lesson.id === lessonId
              ? {
                  ...lesson,
                  subject_lessons: lesson.subject_lessons.map(subjectLesson =>
                    subjectLesson.id === userSubjectLessonId
                      ? {
                          ...subjectLesson,
                          done: true,
                        }
                      : subjectLesson,
                  ),
                }
              : lesson,
          ),
        );

        console.log('User subject lesson marked as done successfully');
      } catch (error) {
        console.error('Error marking user subject lesson as done:', error);
      }
    },
    [authToken, courseId],
  );

  const unmarkUserSubjectAsDone = async (
    lessonId: number,
    userSubjectLessonId: number,
  ) => {
    try {
      await axios.put(
        `${baseUrl}/users/enrolled_courses/${courseId}/lessons/${lessonId}/user_subject_lessons/${userSubjectLessonId}/unmark_done`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      setLessons(prevLessons =>
        prevLessons.map(lesson =>
          lesson.id === lessonId
            ? {
                ...lesson,
                subject_lessons: lesson.subject_lessons.map(subjectLesson =>
                  subjectLesson.id === userSubjectLessonId
                    ? {...subjectLesson, done: false}
                    : subjectLesson,
                ),
              }
            : lesson,
        ),
      );

      console.log('User subject lesson marked as not done successfully');
    } catch (error) {
      console.error('Error marking user subject as not done:', error);
    }
  };

  const handleVideoPlayForLesson = (videoLink: string, videoName: string) => {
    navigation.navigate('VideoScreen', {videoLink, videoName});
  };

  const openResourceLinkForLesson = (resourceLink: string) => {
    if (resourceLink) {
      Linking.openURL(resourceLink);
    }
  };

  const handleVideoPlayForSubject = (
    videoLink: string,
    videoName: string,
    lessonId: number,
    subjectLessonId: number,
  ) => {
    navigation.navigate('VideoScreen', {videoLink, videoName});
    markUserSubjectAsDone(lessonId, subjectLessonId);
  };

  const openResourceLinkForSubject = (resourceLink: string) => {
    Linking.openURL(resourceLink);
  };

  const getLessonStatus = (lesson: Lesson): 'InProgress' | 'Done' | 'Todo' => {
    const subjectLessons = lesson.subject_lessons || [];

    if (subjectLessons.length === 0) {
      return 'Todo';
    }

    const allSubjectsDone = subjectLessons.every(
      subjectLesson => subjectLesson.done === true,
    );
    if (allSubjectsDone) {
      return 'Done';
    } else if (
      subjectLessons.some(subjectLesson => subjectLesson.done === true)
    ) {
      return 'InProgress';
    } else {
      return 'Todo';
    }
  };

  const getStatusColor = (status: 'InProgress' | 'Done' | 'Todo') => {
    switch (status) {
      case 'Done':
        return '#A9A9A9'; // Gray for Done
      case 'InProgress':
        return '#FF9900'; // Orange for InProgress
      case 'Todo':
      default:
        return '#000000'; // Black for Todo
    }
  };

  const sortedLessons = lessons.slice().sort((a, b) => {
    const statusOrder = {InProgress: 0, Todo: 1, Done: 2};

    const aStatus = getLessonStatus(a);
    const bStatus = getLessonStatus(b);

    if (statusOrder[aStatus] !== statusOrder[bStatus]) {
      return statusOrder[aStatus] - statusOrder[bStatus];
    }

    const getNumber = (lessonName: string) => {
      if (typeof lessonName === 'string') {
        const match = lessonName.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      } else {
        console.warn('Invalid lessonName:', lessonName);
        return 0;
      }
    };

    const numberA = getNumber(a.name);
    const numberB = getNumber(b.name);

    return numberA - numberB;
  });

  useEffect(() => {
    const areAllLessonsTodo = sortedLessons.every(
      lesson => getLessonStatus(lesson) === 'Todo',
    );
    setAllLessonsTodo(areAllLessonsTodo);
  }, [sortedLessons]);

  const navigateToSubjectList = () => {
    navigation.navigate('SubjectList', {authToken, userName, courseId});
  };

  useEffect(() => {
    const initialExpandedState: {[key: number]: boolean} = {};
    lessons.forEach(lesson => {
      const isDone = getLessonStatus(lesson) === 'Done';
      const isTodo =
        lesson.subject_lessons.filter(subjectLesson => subjectLesson.done)
          .length === 0;
      initialExpandedState[lesson.id] = isDone || isTodo ? false : true;
    });
    setExpandedLessons(initialExpandedState);
  }, [lessons]);

  const toggleLessonExpansion = (lessonId: number) => {
    setExpandedLessons(prevState => ({
      ...prevState,
      [lessonId]: !prevState[lessonId],
    }));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            {allLessonsTodo && (
              <View style={styles.reviewSubjectBtn}>
                <PrimaryButton
                  text="Review your Subjects"
                  buttonType={'outlined'}
                  onPress={navigateToSubjectList}
                />
              </View>
            )}
            {sortedLessons.length > 0 ? (
              sortedLessons.map(lesson => (
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
                          color={
                            getLessonStatus(lesson) === 'Done'
                              ? '#A9A9A9'
                              : '#4F7942'
                          }
                          onPress={() => toggleLessonExpansion(lesson.id)}
                        />
                      </View>
                      <Text
                        style={[
                          styles.boxTitle,
                          getLessonStatus(lesson) === 'Done' &&
                            styles.doneTextColor,
                        ]}>
                        {lesson.name}
                        <Text
                          style={[
                            styles.statusText,
                            {color: getStatusColor(getLessonStatus(lesson))},
                          ]}>
                          {`  (${getLessonStatus(lesson)})`}
                        </Text>
                      </Text>
                    </View>

                    {lesson.contents?.map((content, contentIndex) => (
                      <View
                        key={`${lesson.id}-${content.id}-${contentIndex}`}
                        style={styles.iconTitleGroup}>
                        {content.video_link && (
                          <Feather
                            name="video"
                            size={30}
                            color={
                              getLessonStatus(lesson) === 'Done'
                                ? '#A9A9A9'
                                : '#4F7942'
                            }
                            onPress={() =>
                              handleVideoPlayForLesson(
                                content.video_link,
                                lesson.name,
                              )
                            }
                          />
                        )}
                        {content.document_link && (
                          <FontAwesome
                            name="book"
                            style={styles.paddingLeftIcon}
                            size={30}
                            color={
                              getLessonStatus(lesson) === 'Done'
                                ? '#A9A9A9'
                                : '#4F7942'
                            }
                            onPress={() =>
                              openResourceLinkForLesson(content.document_link)
                            }
                          />
                        )}
                      </View>
                    ))}
                  </View>
                  <Text
                    style={[
                      styles.normalSizeText,
                      styles.progressText,
                      getLessonStatus(lesson) === 'Done' &&
                        styles.doneTextColor,
                    ]}>
                    {'Progress: '}
                    {
                      lesson.subject_lessons.filter(
                        subjectLesson => subjectLesson.done,
                      ).length
                    }
                    /{lesson.subject_lessons.length}
                    {lesson.subject_lessons.length <= 1
                      ? ' subject'
                      : ' subjects'}
                  </Text>
                  {expandedLessons[lesson.id] && (
                    <>
                      {lesson.subject_lessons?.map(
                        (subjectLesson, subjectIndex) => (
                          <View
                            key={`${lesson.id}-${subjectLesson.id}-${subjectIndex}`}>
                            <View style={styles.subjectContainer}>
                              <Text
                                style={[
                                  styles.normalSizeText,
                                  subjectLesson.done && styles.doneTextColor,
                                ]}>
                                {subjectLesson.subject_name}
                              </Text>
                              {subjectLesson.contents?.map(content => (
                                <View
                                  key={content.id}
                                  style={styles.iconSubjectContainer}>
                                  {content.video_link && (
                                    <FontAwesome
                                      name="play-circle"
                                      size={30}
                                      color={
                                        subjectLesson.done
                                          ? '#A9A9A9'
                                          : '#FF9900'
                                      }
                                      onPress={() =>
                                        handleVideoPlayForSubject(
                                          content.video_link,
                                          subjectLesson.subject_name,
                                          lesson.id,
                                          subjectLesson.id,
                                        )
                                      }
                                    />
                                  )}
                                  {content.document_link && (
                                    <FontAwesome
                                      name="book"
                                      size={30}
                                      color={
                                        subjectLesson.done
                                          ? '#A9A9A9'
                                          : '#4F7942'
                                      }
                                      style={styles.paddingLeftIcon}
                                      onPress={() =>
                                        openResourceLinkForSubject(
                                          content.document_link,
                                        )
                                      }
                                    />
                                  )}
                                  <FontAwesome
                                    name="undo"
                                    size={20}
                                    color={
                                      subjectLesson.done ? '#A9A9A9' : '#4F7942'
                                    }
                                    style={styles.paddingLeftIcon}
                                    onPress={() => {
                                      if (subjectLesson.done) {
                                        unmarkUserSubjectAsDone(
                                          lesson.id,
                                          subjectLesson.id,
                                        );
                                      } else {
                                        markUserSubjectAsDone(
                                          lesson.id,
                                          subjectLesson.id,
                                        );
                                      }
                                    }}
                                  />
                                </View>
                              ))}
                            </View>
                            <Line />
                          </View>
                        ),
                      )}
                    </>
                  )}
                </View>
              ))
            ) : (
              <Text h4>No lessons available.</Text>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

export default Lesson;
