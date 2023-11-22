import React from 'react';
import {Button} from '@rneui/themed';

interface ButtonProps {
  text: any;
  onPress: any;
  titleStyle?: any;
  buttonType?: any;
}

const BottomButton = (props: ButtonProps) => {
  const btnBgColor = props.buttonType === 'filled' ? '#FF9900' : 'transparent';
  const btnTextColor = props.buttonType === 'filled' ? '#ffffff' : '#FF9900';

  const border = props.buttonType === 'outlined' && {
    borderColor: '#FF9900',
    borderWidth: 1,
  };

  const bottomBtn = {
    backgroundColor: btnBgColor,
    borderColor: 'transparent',
    borderRadius: 30,
    width: 300,
    marginVertical: 10,
  };

  const bottomBtnTitle = {
    color: btnTextColor,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Quicksand-Medium',
    fontWeight: 'bold',
  };

  return (
    <Button
      title={props.text}
      titleStyle={[bottomBtnTitle, props.titleStyle]}
      buttonStyle={[bottomBtn, border]}
      onPress={props.onPress}
    />
  );
};

export default BottomButton;
