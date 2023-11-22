import React from 'react';
import {Image} from 'react-native';
import styles from './styles';

interface Size {
  width?: any;
  height?: any;
}

const Logo = (props: Size) => {
  return (
    <Image
      source={require('../../assets/images/logo.png')}
      style={[styles.logo, props.width, props.height]}
    />
  );
};

export default Logo;
