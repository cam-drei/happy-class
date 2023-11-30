import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  box: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    width: '90%',
    borderWidth: 1,
    margin: 10,
  },
  boxTitle: {
    fontWeight: 'bold',
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  contentView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconPlay: {
    padding: 8,
  },
  progressText: {
    fontSize: 16,
  },
  statusText: {
    fontSize: 16,
    color: '#FF9900',
  },
});

export default styles;
