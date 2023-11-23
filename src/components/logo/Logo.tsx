import React from 'react';
import {Image} from 'react-native';

interface Size {
  width?: number;
  height?: number;
}

const Logo = (props: Size) => {
  const {width, height} = props;

  const imageSize = {
    width: width,
    height: height,
  };

  return (
    <Image source={require('../../assets/images/logo.png')} style={imageSize} />
  );
};

Logo.defaultProps = {
  width: 300,
  height: 300,
};
export default Logo;
