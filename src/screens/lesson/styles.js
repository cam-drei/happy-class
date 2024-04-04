import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1E6E3',
  },
  scrollViewContainer: {
    alignItems: 'center',
    paddingBottom: 20,
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
    paddingBottom: 10,
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'italic',
  },
  statusColor: {
    color: '#FF9900',
  },
  titleLessonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleView: {
    flexDirection: 'row',
  },
  normalSizeText: {
    fontSize: 16,
  },
  progressText: {
    paddingBottom: 10,
  },
  subjectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  iconSubjectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconTitleGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
  },
  arrowButton: {
    marginTop: -8,
    marginLeft: -10,
  },
  paddingLeftIcon: {
    paddingLeft: 10,
  },
  animatedLessonView: {
    overflow: 'scroll',
  },
  doneTextColor: {
    color: '#A9A9A9',
  },
  todoTextColor: {
    color: '#000000',
  },
  reviewSubjectBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -10,
  }
});

export default styles;
