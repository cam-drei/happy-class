import React from 'react';
import {Button} from '@rneui/themed';
import styles from './styles';

const BottomButton = ({text, onPress}: {text: string; onPress: any}) => {
  return (
    <Button
      title={text}
      titleStyle={styles.bottomBtnTitle}
      buttonStyle={styles.bottomBtn}
      onPress={onPress}
    />
  );
};

export default BottomButton;
