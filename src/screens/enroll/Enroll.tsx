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
  const [check1, setCheck1] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<{
    [key: number]: boolean;
  }>({});

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

        setSubjects(response.data.subjects);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    if (authToken) {
      fetchSubjects();
    }
  }, [authToken, courseId]);

  const toggleSubject = (subjectId: number) => {
    setSelectedSubjects({
      ...selectedSubjects,
      [subjectId]: !selectedSubjects[subjectId],
    });
  };

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

  const navigateToLesson = () => {
    navigation.navigate('Lesson', {authToken, userName, courseId});
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
              checked={check1}
              onPress={() => setCheck1(!check1)}
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
            <Text style={styles.totalText}>You selected 7/10 subjects</Text>
            <BottomButton text="Next" onPress={navigateToLesson} />
          </View>
        </>
      )}
    </View>
  );
}

export default Enroll;
