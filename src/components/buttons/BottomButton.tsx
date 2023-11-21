import React from 'react';
import {Button} from '@rneui/themed';

const BottomButton = ({
  text,
  onPress,
  type = 'filled',
  titleStyle,
}: {
  text: any;
  onPress: any;
  type: string;
  titleStyle: any;
}) => {
  const btnBgColor = type === 'filled' ? '#FF9900' : 'transparent';
  const btnTextColor = type === 'filled' ? '#ffffff' : '#FF9900';

  const border = type === 'outlined' && {
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
      title={text}
      titleStyle={[bottomBtnTitle, titleStyle]}
      buttonStyle={[bottomBtn, border]}
      onPress={onPress}
    />
  );
};

export default BottomButton;
