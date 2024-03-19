import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {Text, CheckBox} from '@rneui/base';
import styles from './styles';
import BottomButton from '../../components/buttons/BottomButton';
import HeaderRight from '../../components/header/HeaderRight';
import LoadingIndicator from '../../components/loading/LoadingIndicator';
import axios from 'axios';
import {baseUrl} from '../../utils/apiConfig';

interface EnrollProps {
  navigation: any;
  route: {params: {userName: string; authToken: string; courseId: number}};
}

interface Subject {
  id: number;
  name: string;
  description: string;
  done: boolean;
}

function Enroll({navigation, route}: EnrollProps) {
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
          `${baseUrl}/api/v1/users/enrolled_courses/${courseId}/subjects`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );

        const initialSelectedSubjects: {[key: number]: boolean} = {};
        response.data.subjects.forEach((subject: Subject) => {
          initialSelectedSubjects[subject.id] = false;
        });

        setSubjects(response.data.subjects);
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

  const toggleSubject = (subjectId: number) => {
    setSelectedSubjects({
      ...selectedSubjects,
      [subjectId]: !selectedSubjects[subjectId],
    });
  };

  const toggleSelectAll = () => {
    const allSelected = !selectAllChecked;
    const updatedSelectedSubjects: {[key: number]: boolean} = {};
    if (allSelected) {
      subjects.forEach(subject => {
        updatedSelectedSubjects[subject.id] = true;
      });
    } else {
      subjects.forEach(subject => {
        updatedSelectedSubjects[subject.id] = false;
      });
    }
    setSelectAllChecked(allSelected);
    setSelectedSubjects(updatedSelectedSubjects);
  };

  const navigateToLesson = () => {
    const selectedSubjectsIds = Object.keys(selectedSubjects)
      .filter((subjectId: any) => selectedSubjects[subjectId])
      .map(Number);
    navigation.navigate('Lesson', {
      authToken,
      userName,
      courseId,
      selectedSubjectsIds,
    });
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <>
          <View>
            <Text style={styles.title}>
              {'Select the subjects you want to learn:'}
            </Text>
            <CheckBox
              title={'Select All'}
              // checked={selectAllChecked}
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
                onPress={() => toggleSubject(subject.id)}
                iconType="material-community"
                checkedIcon="checkbox-outline"
                uncheckedIcon="checkbox-blank-outline"
                checkedColor="#FF9900"
                textStyle={styles.checkboxTitle}
                containerStyle={styles.checkbox}
              />
            ))}
          </View>
          <View style={styles.bottomButton}>
            <Text style={styles.totalText}>
              {`You selected ${
                Object.values(selectedSubjects).filter(selected => selected)
                  .length
              }/${subjects.length} subjects`}
            </Text>
            <BottomButton text="Next" onPress={navigateToLesson} />
          </View>
        </>
      )}
    </View>
  );
}

export default Enroll;
