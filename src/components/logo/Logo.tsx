import React from 'react';
import {Image} from 'react-native';

interface Size {
  width?: any;
  height?: any;
}

const Logo = (props: Size) => {
  const {width, height} = props;

  return (
    <Image
      source={require('../../assets/images/logo.png')}
      style={[width, height]}
    />
  );
};

Logo.defaultProps = {
  width: {width: 300},
  height: {height: 300},
};
export default Logo;
