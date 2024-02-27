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
    paddingHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10, // Required for Android
    width: '90%',
    marginTop: 10,
    paddingTop: 8,
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
  subjectGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  subjectView: {
    flex: 2,
    paddingRight: 15,
  },
  iconSubjectGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
  },
  iconTitleGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
  },
  bottomArrow: {
    alignItems: 'center',
    marginTop: -5,
  },
  paddingLeftIcon: {
    paddingLeft: 15,
  },
});

export default styles;
