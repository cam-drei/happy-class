import React from 'react';
import {Button} from '@rneui/themed';

interface ButtonProps {
  text: string;
  onPress: any;
  titleStyle?: any;
  buttonType?: string;
  buttonWidth?: number;
}

const BottomButton = (props: ButtonProps) => {
  const {text, onPress, titleStyle, buttonType, buttonWidth} = props;

  const btnBgColor = buttonType === 'filled' ? '#FF9900' : '#FFFFFF';
  const btnTextColor = buttonType === 'filled' ? '#FFFFFF' : '#FF9900';
  const fontWeight = titleStyle === 'bold' ? 'bold' : 'normal';

  const border = buttonType === 'outlined' && {
    borderColor: '#FF9900',
    borderWidth: 1,
  };

  const bottomBtn = {
    backgroundColor: btnBgColor,
    borderColor: 'transparent',
    borderRadius: 30,
    width: buttonWidth,
    marginVertical: 10,
  };

  const bottomBtnTitle = {
    color: btnTextColor,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: fontWeight,
  };

  return (
    <Button
      title={text}
      titleStyle={[bottomBtnTitle, titleStyle]}
      buttonStyle={[bottomBtn, border]}
      onPress={onPress}
    />
  );
};

BottomButton.defaultProps = {
  titleStyle: 'bold',
  buttonType: 'filled',
  buttonWidth: 300,
};

export default BottomButton;
