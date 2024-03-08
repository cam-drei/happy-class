import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {Text, CheckBox} from '@rneui/base';
import styles from './styles';
import BottomButton from '../../components/buttons/BottomButton';
import HeaderRight from '../../components/header/HeaderRight';
import LoadingIndicator from '../../components/loading/LoadingIndicator';

interface EnrollProps {
  navigation: any;
  route: {params: {authToken: string; userId: string; userName: string}};
}


interface Subject {
  id: number;
  name: string;
  description: string;
  done: boolean;
}

function Enroll({navigation, route}: EnrollProps) {
  const {authToken, userId, userName} = route.params;

  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<{
    [key: number]: boolean;
  }>({});

  const isLoggedIn = !!authToken;

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch('YOUR_RAILS_API_ENDPOINT');
        const data = await response.json();
        setSubjects(data.subjects);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    if (authToken) {
      fetchSubjects();
    }
  }, [authToken]);

  const toggleSubject = (subjectId: number) => {
    setSelectedSubjects({
      ...selectedSubjects,
      [subjectId]: !selectedSubjects[subjectId]
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

  // const navigateToLesson = () => {
  //   navigation.navigate('Lesson', {authToken});
  // };
  const navigateToLesson = (courseId: number) => {
    navigation.navigate('Lesson', {authToken, userId, userName, courseId});
  };

  return (
    <View style={styles.container}>
      {isLoading && <LoadingIndicator /> && isLoggedIn && (
        <>
          <View>
            <Text style={styles.title}>
              {'Select the subjects you want to learn:'}
            </Text>
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
            <BottomButton text="Next" onPress={navigateToLesson} />
          </View>
        </>
      )}
    </View>
  );

  // return (
  //   <View style={styles.container}>
  //     {isLoggedIn && (
  //       <>
  //         <View>
  //           <Text style={styles.title}>
  //             {'Select the subjects you want to learn:'}
  //           </Text>
  //           <CheckBox
  //             title="Select All"
  //             checked={check1}
  //             onPress={() => setCheck1(!check1)}
  //             iconType="material-community"
  //             checkedIcon="checkbox-outline"
  //             uncheckedIcon={'checkbox-blank-outline'}
  //             checkedColor="#FF9900"
  //             textStyle={styles.checkboxTitle}
  //             containerStyle={styles.checkbox}
  //           />
  //           <View>
  //             <CheckBox
  //               title="Activity Time"
  //               checked={check2}
  //               onPress={() => setCheck2(!check2)}
  //               iconType="material-community"
  //               checkedIcon="checkbox-outline"
  //               uncheckedIcon={'checkbox-blank-outline'}
  //               checkedColor="#FF9900"
  //               textStyle={styles.checkboxTitleDetails}
  //               containerStyle={styles.checkboxDetails}
  //             />
  //             <CheckBox
  //               title="Bible"
  //               checked={check1}
  //               onPress={() => setCheck1(!check1)}
  //               iconType="material-community"
  //               checkedIcon="checkbox-outline"
  //               uncheckedIcon={'checkbox-blank-outline'}
  //               checkedColor="#FF9900"
  //               textStyle={styles.checkboxTitleDetails}
  //               containerStyle={styles.checkboxDetails}
  //             />
  //             <CheckBox
  //               title="Language Enrichment"
  //               checked={check2}
  //               onPress={() => setCheck2(!check2)}
  //               iconType="material-community"
  //               checkedIcon="checkbox-outline"
  //               uncheckedIcon={'checkbox-blank-outline'}
  //               checkedColor="#FF9900"
  //               textStyle={styles.checkboxTitleDetails}
  //               containerStyle={styles.checkboxDetails}
  //             />
  //             <CheckBox
  //               title="Language Enrichment"
  //               checked={check2}
  //               onPress={() => setCheck2(!check2)}
  //               iconType="material-community"
  //               checkedIcon="checkbox-outline"
  //               uncheckedIcon={'checkbox-blank-outline'}
  //               checkedColor="#FF9900"
  //               textStyle={styles.checkboxTitleDetails}
  //               containerStyle={styles.checkboxDetails}
  //             />
  //           </View>
  //           <Text style={styles.totalText}>You selected 7/10 subjects</Text>
  //         </View>
  //         <View style={styles.bottomButton}>
  //           <BottomButton text="Next" onPress={navigateToLesson} />
  //         </View>
  //       </>
  //     )}
  //   </View>
  // );
}

export default Enroll;
