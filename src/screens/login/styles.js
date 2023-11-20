import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  logo: {
    aspectRatio: 1,
    width: 300,
    height: 300,
    borderRadius: 300 / 2,
  },
  inputGroup: {
    width: 300,
  },
  title: {
    fontWeight: 'bold',
    color: '#FF9900',
    paddingBottom: 20,
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
    marginVertical: -10,
  },
  checkboxTitle: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  loginBtn: {
    backgroundColor: '#FF9900',
    borderColor: 'transparent',
    borderRadius: 30,
    width: 300,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  loginBtnTitle: {
    fontWeight: 'bold',
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
