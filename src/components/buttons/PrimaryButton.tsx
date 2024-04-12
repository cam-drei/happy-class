import React from 'react';
import {Button} from '@rneui/themed';

interface ButtonProps {
  text: string;
  onPress: any;
  titleStyle?: any;
  buttonType?: string;
  buttonWidth?: number;
}

const PrimaryButton = (props: ButtonProps) => {
  const {text, onPress, titleStyle, buttonType, buttonWidth} = props;

  const btnBgColor = buttonType === 'filled' ? '#FF9900' : '#FFFFFF';
  const btnTextColor = buttonType === 'filled' ? '#FFFFFF' : '#FF9900';
  const fontWeight = titleStyle === 'bold' ? 'bold' : 'normal';

  const border = buttonType === 'outlined' && {
    borderColor: '#FF9900',
    borderWidth: 1,
  };

  const primaryBtn = {
    backgroundColor: btnBgColor,
    borderColor: 'transparent',
    borderRadius: 30,
    width: buttonWidth,
    marginVertical: 10,
  };

  const primaryBtnTitle = {
    color: btnTextColor,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: fontWeight,
  };

  return (
    <Button
      title={text}
      titleStyle={[primaryBtnTitle, titleStyle]}
      buttonStyle={[primaryBtn, border]}
      onPress={onPress}
    />
  );
};

PrimaryButton.defaultProps = {
  titleStyle: 'bold',
  buttonType: 'filled',
  buttonWidth: 300,
};

export default PrimaryButton;
