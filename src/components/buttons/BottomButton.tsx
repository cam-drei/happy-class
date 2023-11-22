import React from 'react';
import {Button} from '@rneui/themed';

interface ButtonProps {
  text: string;
  onPress: any;
  titleStyle?: any;
  buttonType?: any;
}

const BottomButton = (props: ButtonProps) => {
  const {text, onPress, titleStyle, buttonType} = props;

  const btnBgColor = buttonType === 'filled' ? '#FF9900' : 'transparent';
  const btnTextColor = buttonType === 'filled' ? '#ffffff' : '#FF9900';
  const fontWeight = titleStyle === 'bold' ? 'bold' : 'normal';

  const border = buttonType === 'outlined' && {
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
    fontWeight: fontWeight,
  };

  return (
    <Button
      title={text}
      titleStyle={[bottomBtnTitle, fontWeight]}
      buttonStyle={[bottomBtn, border]}
      onPress={onPress}
    />
  );
};

BottomButton.defaultProps = {
  titleStyle: 'bold',
  buttonType: 'filled',
};

export default BottomButton;
