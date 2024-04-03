import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  scrollViewContainer: {
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    paddingBottom: 10,
  },
  selectAllText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  selectAllContainer: {
    marginLeft: -10,
    marginBottom: -10,
  },
  checkbox: {
    marginBottom: -15,
  },
  checkboxTitle: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  totalText: {
    fontSize: 16,
    fontStyle: 'italic',
    fontWeight: 'bold',
    paddingBottom: 5,
  },
  bottomButton: {
    bottom: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
});

export default styles;
