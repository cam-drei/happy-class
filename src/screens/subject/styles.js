import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    padding: 20,
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
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
});

export default styles;
