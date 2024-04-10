import React, {useState, useEffect, useCallback} from 'react';
import {View, Alert, TouchableOpacity, ScrollView} from 'react-native';
import {Text, CheckBox} from '@rneui/base';
import styles from './styles';
import BottomButton from '../../components/buttons/BottomButton';
import HeaderRight from '../../components/header/HeaderRight';
import HeaderLeft from '../../components/header/HeaderLeft';
import LoadingIndicator from '../../components/loading/LoadingIndicator';
import axios from 'axios';
import {baseUrl} from '../../utils/apiConfig';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface SubjectListProps {
  navigation: any;
  route: {params: {userName: string; authToken: string; courseId: number}};
}

interface Subject {
  id: number;
  name: string;
  description: string;
  selected: boolean;
}

function SubjectList({navigation, route}: SubjectListProps) {
  const {authToken, userName, courseId} = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<{
    [key: number]: boolean;
  }>({});
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/users/enrolled_courses/${courseId}/subjects`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );

        const initialSelectedSubjects: {[key: number]: boolean} = {};
        response.data.subjects.forEach((subject: Subject) => {
          initialSelectedSubjects[subject.id] = subject.selected;
        });

        const sortedSubjects = response.data.subjects
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
        setSelectedSubjects(initialSelectedSubjects);
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
    const selectedSubjectsId = Object.keys(selectedSubjects)
      .filter((subjectId: any) => selectedSubjects[subjectId])
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
  }, [selectedSubjects, navigation, authToken, userName, courseId]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => <HeaderLeft onPress={navigateToCourse} />,
      headerRight: () => (
        <HeaderRight
          userName={userName}
          userImage={require('../../assets/images/tulip.webp')}
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
        ? `enrolled_courses/${courseId}/subjects/${subjectId}/mark_selected`
        : `enrolled_courses/${courseId}/subjects/${subjectId}/unmark_selected`;

      await axios.put(
        `${baseUrl}/users/${endpoint}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      setSelectedSubjects({
        ...selectedSubjects,
        [subjectId]: isSelected,
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
          ? `enrolled_courses/${courseId}/subjects/${subject.id}/mark_selected`
          : `enrolled_courses/${courseId}/subjects/${subject.id}/unmark_selected`;

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
      setSelectedSubjects(updatedSelectedSubjects);
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
                checked={Object.values(selectedSubjects).every(
                  subject => subject,
                )}
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
                  checked={selectedSubjects[subject.id]}
                  onPress={() =>
                    toggleSubjectSelection(
                      subject.id,
                      !selectedSubjects[subject.id],
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
                Object.values(selectedSubjects).filter(selected => selected)
                  .length
              }/${subjects.length} subjects`}
            </Text>
            <BottomButton text="Submit" onPress={navigateToCourse} />
          </View>
        </>
      )}
    </View>
  );
}

export default SubjectList;
