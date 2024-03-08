import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import styles from './styles';

const LoadingIndicator = () => (
  <View style={[styles.container, styles.loadingContainer]}>
    <ActivityIndicator size="large" color="#FF9900" />
  </View>
);

export default LoadingIndicator;
