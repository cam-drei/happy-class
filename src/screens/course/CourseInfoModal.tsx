import React from 'react';
import {View, Modal, ScrollView, TouchableOpacity} from 'react-native';
import {Text} from '@rneui/base';
import styles from './styles';

interface CourseInfoModalProps {
  visible: boolean;
  course: {
    name: string;
    description: string;
  } | null;
  onClose: () => void;
}

const CourseInfoModal: React.FC<CourseInfoModalProps> = ({
  visible,
  course,
  onClose,
}) => {
  if (!course) {
    return null;
  }

  return (
    <Modal visible={visible} transparent>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView style={styles.scrollView}>
            <Text h4>{course.name}</Text>
            <Text style={styles.modalText}>{course.description}</Text>
          </ScrollView>
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={onClose}>
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CourseInfoModal;
