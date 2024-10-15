import React from 'react';
import {View} from 'react-native';
import {Text} from '@rneui/base';
import styles from './styles';
import PrimaryButton from '../../components/buttons/PrimaryButton';

interface NoCoursesProps {
  navigateToCourseList: () => void;
}

const NoCourses: React.FC<NoCoursesProps> = ({navigateToCourseList}) => {
  return (
    <View style={styles.noCourse}>
      <Text h4>No enrolled courses.</Text>
      <PrimaryButton
        text="Click to choose your Courses"
        buttonType="outlined"
        onPress={navigateToCourseList}
      />
    </View>
  );
};

export default NoCourses;
