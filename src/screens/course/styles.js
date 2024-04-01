import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollViewContainer: {
    alignItems: 'center',
  },
  box: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    width: '90%',
    borderWidth: 1,
    marginTop: 20,
  },
  doneBorder: {
    borderColor: '#A9A9A9',
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
  normalSizeText: {
    fontSize: 16,
  },
  statusText: {
    fontSize: 16,
    color: '#FF9900',
  },
  doneColor: {
    color: '#A9A9A9',
  },
  todoTextColor: {
    color: '#000000',
  },
  scrollView: {
    flexGrow: 0,
    minHeight: 50,
    maxHeight: 600,
    minWidth: '90%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    marginTop: 10,
    marginBottom: -10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    fontSize: 16,
    paddingTop: 10,
  },
  iconSubjectGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
  },
  bookIcon: {
    paddingLeft: 15,
  },
  noCourse: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  }
});

export default styles;
