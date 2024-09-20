import React from 'react';
import {View, Image, ImageSourcePropType, TouchableOpacity} from 'react-native';
import {Text} from '@rneui/themed';
import styles from './styles';

interface HeaderRightProps {
  userName: string;
  userImage: ImageSourcePropType;
  onPress?: () => void;
}

const HeaderRight = (props: HeaderRightProps) => {
  const {userName, userImage, onPress} = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.userNameView}>
        <Text style={styles.userNameText}>{userName}</Text>
        <Image source={userImage} style={styles.logo} />
      </View>
    </TouchableOpacity>
  );
};

export default HeaderRight;
