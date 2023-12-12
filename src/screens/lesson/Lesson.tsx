import React from 'react';
import {View} from 'react-native';
import {Text} from '@rneui/base';
import styles from './styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Line from '../../components/line/Line';

function Lesson({navigation}: {navigation: any}) {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.titleView}>
          <View style={styles.contentView}>
            <Text style={[styles.boxTitle, {color: '#A9A9A9'}]}>
              {'Lesson 152'}
              <Text style={[styles.innerText, {color: '#A9A9A9'}]}>{' (Done)'}</Text>
            </Text>
          </View>
          <FontAwesome
            name="book"
            size={30}
            color="#A9A9A9"
            onPress={() => navigation.goBack()}
          />
        </View>
        <Text style={[styles.normalSizeText, styles.progressText, {color: '#A9A9A9'}]}>
          {'Progress: 10/10 subjects'}
        </Text>

        <View style={styles.bottomArrow}>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={40}
            color="#A9A9A9"
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
      {/* end of subject */}

      <View style={styles.box}>
        <View style={styles.titleView}>
          <View style={styles.contentView}>
            <Text style={styles.boxTitle}>
              {'Lesson 152'}
              <Text style={[styles.innerText, {color: '#FF9900'}]}>{' (In progress)'}</Text>
            </Text>
          </View>
          <FontAwesome
            name="book"
            size={30}
            color="#4F7942"
            onPress={() => navigation.goBack()}
          />
        </View>
        <Text style={[styles.normalSizeText, styles.progressText]}>
          {'Progress: 3/8 subjects'}
        </Text>

        <View style={styles.subjectViewGroup}>
          <View style={styles.subjectView}>
            <Text style={styles.normalSizeText}>{'Activity Time'}</Text>
          </View>
          <View style={styles.iconSubjectViewGroup}>
            <FontAwesome
              name="play-circle"
              size={30}
              color="#FF9900"
              onPress={() => navigation.navigate('Lesson')}
            />
            <FontAwesome
              name="book"
              size={30}
              color="#4F7942"
              onPress={() => navigation.goBack()}
            />
            <FontAwesome
              name="undo"
              size={20}
              color="#4F7942"
              onPress={() => navigation.goBack()}
            />
          </View>
        </View>
        <Line />

        <View style={styles.subjectViewGroup}>
          <View style={styles.subjectView}>
            <Text style={styles.normalSizeText}>{'Activity Time jdgs jdsg jhsdg jhgds jhgds jhdgs nds jhdsg'}</Text>
          </View>
          <View style={styles.iconSubjectViewGroup}>
            <FontAwesome
              name="play-circle"
              size={30}
              color="#FF9900"
              onPress={() => navigation.navigate('Lesson')}
            />
            <FontAwesome
              name="book"
              size={30}
              color="#4F7942"
              onPress={() => navigation.goBack()}
            />
            <FontAwesome
              name="undo"
              size={20}
              color="#4F7942"
              onPress={() => navigation.goBack()}
            />
          </View>
        </View>
        <Line />

        <View style={styles.subjectViewGroup}>
          <View style={styles.subjectView}>
            <Text style={styles.normalSizeText}>{'Language Enrichment'}</Text>
          </View>
          <View style={styles.iconSubjectViewGroup}>
            <FontAwesome
              name="play-circle"
              size={30}
              color="#FF9900"
              onPress={() => navigation.navigate('Lesson')}
            />
            <FontAwesome
              name="book"
              size={30}
              color="#4F7942"
              onPress={() => navigation.goBack()}
            />
            <FontAwesome
              name="undo"
              size={20}
              color="#4F7942"
              onPress={() => navigation.goBack()}
            />
          </View>
        </View>
        <Line />

        <View style={styles.bottomArrow}>
          <MaterialIcons
            name="keyboard-arrow-up"
            size={40}
            color="#4F7942"
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
      {/* end of subject */}

      <View style={styles.box}>
        <View style={styles.titleView}>
          <View style={styles.contentView}>
            <Text style={styles.boxTitle}>
              {'Lesson 152'}
              <Text style={styles.innerText}>{' (To do)'}</Text>
            </Text>
          </View>
          <FontAwesome
            name="book"
            size={30}
            color="#4F7942"
            onPress={() => navigation.goBack()}
          />
        </View>
        <Text style={[styles.normalSizeText, styles.progressText]}>
          {'Progress: 10/10 subjects'}
        </Text>

        <View style={styles.bottomArrow}>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={40}
            color="#4F7942"
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
    </View>
  );
}

export default Lesson;
