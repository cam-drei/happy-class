import React, {useState} from 'react';
import {View} from 'react-native';
import {Text, CheckBox} from '@rneui/base';
import styles from './styles';
import BottomButton from '../../components/buttons/BottomButton';

interface EnrollProps {
  navigation: any;
  route: {params: {userName: string; authToken: string}};
}

function Enroll({navigation, route}: EnrollProps) {
  const {userName, authToken} = route.params;

  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(true);

  const navigateToLesson = () => {
    navigation.navigate('Lesson', {authToken});
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>
          {'Select the subjects you want to learn:'}
        </Text>
        <CheckBox
          title="Select All"
          checked={check1}
          onPress={() => setCheck1(!check1)}
          iconType="material-community"
          checkedIcon="checkbox-outline"
          uncheckedIcon={'checkbox-blank-outline'}
          checkedColor="#FF9900"
          textStyle={styles.checkboxTitle}
          containerStyle={styles.checkbox}
        />
        <View>
          <CheckBox
            title="Activity Time"
            checked={check2}
            onPress={() => setCheck2(!check2)}
            iconType="material-community"
            checkedIcon="checkbox-outline"
            uncheckedIcon={'checkbox-blank-outline'}
            checkedColor="#FF9900"
            textStyle={styles.checkboxTitleDetails}
            containerStyle={styles.checkboxDetails}
          />
          <CheckBox
            title="Bible"
            checked={check1}
            onPress={() => setCheck1(!check1)}
            iconType="material-community"
            checkedIcon="checkbox-outline"
            uncheckedIcon={'checkbox-blank-outline'}
            checkedColor="#FF9900"
            textStyle={styles.checkboxTitleDetails}
            containerStyle={styles.checkboxDetails}
          />
          <CheckBox
            title="Language Enrichment"
            checked={check2}
            onPress={() => setCheck2(!check2)}
            iconType="material-community"
            checkedIcon="checkbox-outline"
            uncheckedIcon={'checkbox-blank-outline'}
            checkedColor="#FF9900"
            textStyle={styles.checkboxTitleDetails}
            containerStyle={styles.checkboxDetails}
          />
          <CheckBox
            title="Language Enrichment"
            checked={check2}
            onPress={() => setCheck2(!check2)}
            iconType="material-community"
            checkedIcon="checkbox-outline"
            uncheckedIcon={'checkbox-blank-outline'}
            checkedColor="#FF9900"
            textStyle={styles.checkboxTitleDetails}
            containerStyle={styles.checkboxDetails}
          />
        </View>
        <Text style={styles.totalText}>You selected 7/10 subjects</Text>
      </View>
      <View style={styles.bottomButton}>
        <BottomButton text="Next" onPress={navigateToLesson} />
      </View>
    </View>
  );
}

export default Enroll;
