import React from 'react';
import {View} from 'react-native';
import {Text} from '@rneui/base';
import Video from 'react-native-video';
import styles from './styles';

const VideoScreen = ({route}: any) => {
  const {videoLink, videoName} = route.params;

  return (
    <View style={styles.container}>
      <Video
        source={{uri: videoLink}}
        style={styles.videoView}
        controls={true}
        resizeMode="contain"
        paused={false}
      />
      <Text h4 style={styles.videoName}>
        {videoName}
      </Text>
    </View>
  );
};

export default VideoScreen;
