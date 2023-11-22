import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
  },
  inputGroup: {
    width: 300,
  },
  title: {
    fontWeight: 'bold',
    color: '#FF9900',
    paddingBottom: 20,
  },
  forgotText: {
    textAlign: 'right',
    fontSize: 16,
    marginTop: -25,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#A9A9A9',
    borderRadius: 30,
    width: 300,
    alignSelf: 'center',
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  checkbox: {
    marginLeft: -10,
  },
  checkboxTitle: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  baseText: {
    fontSize: 16,
  },
  innerText: {
    color: '#FF9900',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
