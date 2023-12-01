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
  },
  checkbox: {
    marginLeft: -10,
  },
  checkboxTitle: {
    fontSize: 18,
  },
  checkboxDetails: {
    marginTop: -5,
  },
  checkboxTitleDetails: {
    fontSize: 16,
    fontWeight: 'normal',
    marginVertical: -5,
  },
  totalText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  bottomButton: {
    position: 'absolute',
    bottom: 50,
  },
});

export default styles;
