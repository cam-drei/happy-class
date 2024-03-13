import React, {useState, useEffect, useCallback} from 'react';
import {View, Linking, ScrollView} from 'react-native';
import {Text} from '@rneui/base';
import styles from './styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Line from '../../components/line/Line';
import HeaderRight from '../../components/header/HeaderRight';
import axios from 'axios';
import {baseUrl} from '../../utils/apiConfig';
import LoadingIndicator from '../../components/loading/LoadingIndicator';

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

interface SubjectLesson {
  id: number;
  subject_id: number;
  lesson_id: number;
  done: boolean;
  contents: Content[];
  subject: Object;
}
interface Lesson {
  id: number;
  name: string;
  description: string;
  done: boolean;
  subjects: Subject[];
  contents: Content[];
  subject_lessons: SubjectLesson[];
}

function Lesson({navigation, route}: LessonProps) {
  const {userName, authToken, courseId} = route.params;
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
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
              // `${baseUrl}/api/v1/users/enrolled_courses/${courseId}/lessons/${lesson.id}/subjects`,
              `${baseUrl}/api/v1/users/enrolled_courses/${courseId}/lessons/${lesson.id}/subject_lessons`,
              {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              },
            );
            lesson.subject_lessons = subjectResponse.data.subject_lessons;

            // for (let subject of lesson.subjects) {
            //   const contentSubjectResponse = await axios.get(
            //     `${baseUrl}/api/v1/users/enrolled_courses/${courseId}/lessons/${lesson.id}/subjects/${subject.id}/contents`,
            //     {
            //       headers: {
            //         Authorization: `Bearer ${authToken}`,
            //       },
            //     },
            //   );
            //   subject.contents = contentSubjectResponse.data.contents;
            // }

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
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      }
    };

    if (courseId) {
      fetchLessons();
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

  const [expandedLessons, setExpandedLessons] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    const initialExpandedState: {[key: number]: boolean} = {};
    lessons.forEach(lesson => {
      const isDone = isLessonDone(lesson);
      const isTodo =
        lesson.subject_lessons.filter(subject_lesson => subject_lesson.done)
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

  const markLessonAsDone = useCallback(
    async (lessonId: number) => {
      try {
        await axios.put(
          `${baseUrl}/api/v1/users/enrolled_courses/${courseId}/lessons/${lessonId}/mark_done`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );

        setLessons(prevLessons =>
          prevLessons.map(lesson =>
            lesson.id === lessonId ? {...lesson, done: true} : lesson,
          ),
        );
      } catch (error) {
        console.error('Error marking lesson as done:', error);
      }
    },
    [authToken, courseId],
  );

  const unmarkLessonAsDone = useCallback(
    async (lessonId: number) => {
      try {
        await axios.put(
          `${baseUrl}/api/v1/users/enrolled_courses/${courseId}/lessons/${lessonId}/unmark_done`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );

        setLessons(prevLessons =>
          prevLessons.map(lesson =>
            lesson.id === lessonId ? {...lesson, done: false} : lesson,
          ),
        );
      } catch (error) {
        console.error('Error marking lesson as not done:', error);
      }
    },
    [authToken, courseId],
  );

  useEffect(() => {
    lessons.forEach(lesson => {
      const allSubjectsDone = lesson.subject_lessons.every(
        subject_lesson => subject_lesson.done,
      );
      if (allSubjectsDone && !lesson.done) {
        markLessonAsDone(lesson.id);
      }
    });
  }, [lessons, markLessonAsDone]);

  useEffect(() => {
    lessons.forEach(lesson => {
      const anySubjectNotDone = lesson.subject_lessons.some(
        subject_lesson => !subject_lesson.done,
      );
      if (anySubjectNotDone && lesson.done) {
        unmarkLessonAsDone(lesson.id);
      }
    });
  }, [lessons, unmarkLessonAsDone]);

  const markSubjectAsDone = async (lessonId: number, subjectId: number) => {
    try {
      await axios.put(
        `${baseUrl}/api/v1/users/enrolled_courses/${courseId}/lessons/${lessonId}/subjects/${subjectId}/mark_done`,
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
                subjects: lesson.subjects.map(subject =>
                  subject.id === subjectId ? {...subject, done: true} : subject,
                ),
              }
            : lesson,
        ),
      );
    } catch (error) {
      console.error('Error marking subject as done:', error);
    }
  };

  const unmarkSubjectAsDone = async (lessonId: number, subjectId: number) => {
    try {
      await axios.put(
        `${baseUrl}/api/v1/users/enrolled_courses/${courseId}/lessons/${lessonId}/subjects/${subjectId}/unmark_done`,
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
                subjects: lesson.subjects.map(subject =>
                  subject.id === subjectId
                    ? {...subject, done: false}
                    : subject,
                ),
              }
            : lesson,
        ),
      );
    } catch (error) {
      console.error('Error marking subject as not done:', error);
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
    subjectId: number,
  ) => {
    navigation.navigate('VideoScreen', {videoLink, videoName});
    markSubjectAsDone(lessonId, subjectId);
  };

  const openResourceLinkForSubject = (
    resourceLink: string,
    lessonId: number,
    subjectId: number,
  ) => {
    if (resourceLink) {
      Linking.openURL(resourceLink);
    }
    markSubjectAsDone(lessonId, subjectId);
  };

  const isLessonDone = (lesson: Lesson) => {
    return lesson.subject_lessons.every(
      (subject_lesson: SubjectLesson) => subject_lesson.done,
    );
  };

  const getLessonStatus = (lesson: Lesson): 'InProgress' | 'Done' | 'Todo' => {
    const allSubjectsDone = lesson.subject_lessons.every(
      subject_lesson => subject_lesson.done,
    );
    if (allSubjectsDone) {
      return 'Done';
    } else if (
      lesson.subject_lessons.some(subject_lesson => subject_lesson.done)
    ) {
      return 'InProgress';
    } else {
      return 'Todo';
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
      const match = lessonName.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    };

    const numberA = getNumber(a.name);
    const numberB = getNumber(b.name);

    return numberA - numberB;
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isLoading ? (
        <LoadingIndicator />
      ) : isLoggedIn ? (
        <>
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
                        color={isLessonDone(lesson) ? '#A9A9A9' : '#4F7942'}
                        onPress={() => toggleLessonExpansion(lesson.id)}
                      />
                    </View>
                    <Text
                      style={[
                        styles.boxTitle,
                        isLessonDone(lesson) && styles.doneTextColor,
                      ]}>
                      {lesson.name}
                      <Text
                        style={[
                          styles.statusText,
                          styles.statusColor,
                          lesson.subject_lessons.filter(
                            subject_lesson => subject_lesson.done,
                          ).length === 0 && styles.todoTextColor,
                          isLessonDone(lesson) && styles.doneTextColor,
                        ]}>
                        {lesson.subject_lessons.filter(
                          subject_lesson => subject_lesson.done,
                        ).length === 0
                          ? ' (Todo)'
                          : isLessonDone(lesson)
                          ? ' (Done)'
                          : ' (In progress)'}
                      </Text>
                    </Text>
                  </View>
                  {lesson.contents.map(content => (
                    <View key={content.id} style={styles.iconTitleGroup}>
                      {content.video_link && (
                        <Feather
                          name="video"
                          size={30}
                          color={lesson.done ? '#A9A9A9' : '#4F7942'}
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
                          color={lesson.done ? '#A9A9A9' : '#4F7942'}
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
                    isLessonDone(lesson) && styles.doneTextColor,
                  ]}>
                  {'Progress: '}
                  {
                    lesson.subject_lessons.filter(
                      subject_lesson => subject_lesson.done,
                    ).length
                  }
                  /{lesson.subject_lessons.length}
                  {lesson.subject_lessons.length <= 1
                    ? ' subject'
                    : ' subjects'}
                </Text>
                {expandedLessons[lesson.id] && (
                  <>
                    {lesson.subject_lessons.map(subject_lesson => (
                      <View>
                        <View
                          key={subject_lesson.id}
                          style={styles.subjectContainer}>
                          <Text
                            style={[
                              styles.normalSizeText,
                              subject_lesson.done && styles.doneTextColor,
                            ]}>
                            {subject_lesson.subject.name}
                          </Text>
                          {/* {subject.contents.map(content => (
                            <View
                              key={content.id}
                              style={styles.iconSubjectContainer}>
                              {content.video_link && (
                                <FontAwesome
                                  name="play-circle"
                                  size={30}
                                  color={subject.done ? '#A9A9A9' : '#FF9900'}
                                  onPress={() =>
                                    handleVideoPlayForSubject(
                                      content.video_link,
                                      subject.name,
                                      lesson.id,
                                      subject.id,
                                    )
                                  }
                                />
                              )}
                              {content.document_link && (
                                <FontAwesome
                                  name="book"
                                  size={30}
                                  color={subject.done ? '#A9A9A9' : '#4F7942'}
                                  style={styles.paddingLeftIcon}
                                  onPress={() =>
                                    openResourceLinkForSubject(
                                      content.document_link,
                                      lesson.id,
                                      subject.id,
                                    )
                                  }
                                />
                              )}
                              <FontAwesome
                                name="undo"
                                size={20}
                                color={subject.done ? '#A9A9A9' : '#4F7942'}
                                style={styles.paddingLeftIcon}
                                onPress={() => {
                                  if (subject.done) {
                                    unmarkSubjectAsDone(lesson.id, subject.id);
                                  } else {
                                    markSubjectAsDone(lesson.id, subject.id);
                                  }
                                }}
                              />
                            </View>
                          ))} */}
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
    </ScrollView>
  );
}

export default Lesson;
