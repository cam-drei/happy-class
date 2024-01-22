import React from 'react';
import {View, Image, ImageSourcePropType} from 'react-native';
import {Text} from '@rneui/themed';
import styles from './styles';

interface HeaderRightProps {
  userName: string;
  userImage: ImageSourcePropType;
}

const HeaderRight = (props: HeaderRightProps) => {
  const {userName, userImage} = props;
  return (
    <View style={styles.userNameView}>
      <Text style={styles.userNameText}>{userName}</Text>
      <Image source={userImage} style={styles.logo} />
    </View>
  );
};

export default HeaderRight;
