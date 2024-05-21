import React, {useState, useEffect, useCallback} from 'react';
import {View, Alert, ScrollView} from 'react-native';
import {Text, CheckBox} from '@rneui/base';
import styles from './styles';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import HeaderRight from '../../components/header/HeaderRight';
import HeaderLeft from '../../components/header/HeaderLeft';
import LoadingIndicator from '../../components/loading/LoadingIndicator';
import axios from 'axios';
import {baseUrl} from '../../utils/apiConfig';

interface SubjectListProps {
  navigation: any;
  route: {
    params: {
      authToken: string;
      userName: string;
      courseId: number;
    };
  };
}

interface Subject {
  id: number;
  name: string;
  description: string;
}

interface UserSubject {
  id: number;
  user_id: number;
  subject_id: number;
  selected: boolean;
}

function SubjectList({navigation, route}: SubjectListProps) {
  const {authToken, userName, courseId} = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedUserSubjects, setSelectedUserSubjects] = useState<{
    [key: number]: boolean;
  }>({});
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const [subjectsResponse, selectedSubjectsResponse] = await Promise.all([
          axios.get(`${baseUrl}/users/enrolled_courses/${courseId}/subjects`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }),
          axios.get(
            `${baseUrl}/users/enrolled_courses/${courseId}/selected_user_subjects`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            },
          ),
        ]);

        const fetchedSubjects = subjectsResponse.data.subjects;
        const fetchedSelectedUserSubjects =
          selectedSubjectsResponse.data.selected_user_subjects;

        const initialSelectedUserSubjects: {[key: number]: boolean} = {};
        fetchedSelectedUserSubjects.forEach((userSubject: UserSubject) => {
          initialSelectedUserSubjects[userSubject.subject_id] =
            userSubject.selected;
        });

        const sortedSubjects = fetchedSubjects
          .slice()
          .sort((a: Subject, b: Subject) => {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          });

        setSubjects(sortedSubjects);
        setSelectedUserSubjects(initialSelectedUserSubjects);
        const allSelected =
          sortedSubjects.length > 0 &&
          sortedSubjects.every(
            (subject: Subject) => initialSelectedUserSubjects[subject.id],
          );
        setSelectAllChecked(allSelected);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    if (authToken) {
      fetchSubjects();
    }
  }, [authToken, courseId]);

  const navigateToCourse = useCallback(() => {
    const selectedSubjectsId = Object.keys(selectedUserSubjects)
      .filter((subjectId: any) => selectedUserSubjects[subjectId])
      .map(Number);

    if (selectedSubjectsId.length === 0) {
      Alert.alert('Selection Required', 'Please select the subjects.');
      return;
    }

    navigation.navigate('Course', {
      authToken,
      userName,
      courseId,
      selectedSubjectsId: selectedSubjectsId,
    });
  }, [selectedUserSubjects, navigation, authToken, userName, courseId]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => <HeaderLeft onPress={navigateToCourse} />,
      headerRight: () => (
        <HeaderRight
          userName={userName}
          userImage={require('../../assets/images/tiger.jpeg')}
        />
      ),
    });
  }, [navigation, userName, navigateToCourse]);

  const toggleSubjectSelection = async (
    subjectId: number,
    isSelected: boolean,
  ) => {
    try {
      const endpoint = isSelected
        ? `enrolled_courses/${courseId}/user_subjects/${subjectId}/mark_selected`
        : `enrolled_courses/${courseId}/user_subjects/${subjectId}/unmark_selected`;

      await axios.put(
        `${baseUrl}/users/${endpoint}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      setSelectedUserSubjects(prevSelectedUserSubjects => {
        const updatedSubjects = {
          ...prevSelectedUserSubjects,
          [subjectId]: isSelected,
        };
        const allSelected =
          subjects.length > 0 &&
          subjects.every(subject => updatedSubjects[subject.id]);
        setSelectAllChecked(allSelected);
        return updatedSubjects;
      });
    } catch (error) {
      console.error('Error toggling subject selection:', error);
    }
  };

  const toggleSelectAll = async () => {
    const allSelected = !selectAllChecked;
    const updatedSelectedSubjects: {[key: number]: boolean} = {};

    try {
      for (const subject of subjects) {
        const endpoint = allSelected
          ? `enrolled_courses/${courseId}/user_subjects/${subject.id}/mark_selected`
          : `enrolled_courses/${courseId}/user_subjects/${subject.id}/unmark_selected`;

        await axios.put(
          `${baseUrl}/users/${endpoint}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );

        updatedSelectedSubjects[subject.id] = allSelected;
      }

      setSelectAllChecked(allSelected);
      setSelectedUserSubjects(updatedSelectedSubjects);
    } catch (error) {
      console.error('Error toggling select all:', error);
    }
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
                {'Select the subjects you want to learn:'}
              </Text>
              <CheckBox
                title={'Select All'}
                checked={selectAllChecked}
                onPress={toggleSelectAll}
                iconType="material-community"
                checkedIcon="checkbox-outline"
                uncheckedIcon="checkbox-blank-outline"
                checkedColor="#FF9900"
                textStyle={styles.selectAllText}
                containerStyle={styles.selectAllContainer}
              />
              {subjects.map(subject => (
                <CheckBox
                  key={subject.id}
                  title={subject.name}
                  checked={selectedUserSubjects[subject.id]}
                  onPress={() =>
                    toggleSubjectSelection(
                      subject.id,
                      !selectedUserSubjects[subject.id],
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
          <View style={styles.primaryButton}>
            <Text style={styles.totalText}>
              {`You selected ${
                Object.values(selectedUserSubjects).filter(selected => selected)
                  .length
              }/${subjects.length} subjects`}
            </Text>
            <PrimaryButton text="Submit" onPress={navigateToCourse} />
          </View>
        </>
      )}
    </View>
  );
}

export default SubjectList;
