import React from 'react';
import {TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';

interface HeaderLeftProps {
  onPress: any;
  iconName: string;
  iconColor: string;
}

const HeaderLeft = (props: HeaderLeftProps) => {
  const {onPress, iconName, iconColor} = props;

  return (
    <TouchableOpacity onPress={onPress}>
      <MaterialIcons
        name={iconName}
        style={styles.headerLeftIcon}
        color={iconColor}
      />
    </TouchableOpacity>
  );
};

HeaderLeft.defaultProps = {
  iconName: 'arrow-back',
  iconColor: '#FF9900',
};

export default HeaderLeft;
