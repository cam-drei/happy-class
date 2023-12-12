import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1E6E3',
    alignItems: 'center',
  },
  box: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10, // Required for Android
    width: '90%',
    marginTop: 10,
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  innerText: {
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'italic',
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentView: {
    flexDirection: 'row',
  },
  normalSizeText: {
    fontSize: 16,
  },
  progressText: {
    paddingBottom: 10,
  },
  statusText: {
    fontSize: 16,
    color: '#FF9900',
  },
  subjectViewGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  subjectView: {
    flex: 2,
    paddingRight: 15,
  },
  iconSubjectViewGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  bottomArrow: {
    alignItems: 'center',
    marginTop: -5,
    marginBottom: -22,
  },
});

export default styles;
