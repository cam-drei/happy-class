import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1E6E3',
    alignItems: 'center',
  },
  logo: {
    aspectRatio: 1,
    width: 120,
    height: 120,
    borderRadius: 120 / 2,
  },
  bottomButtonTitle: {
    fontWeight: 'normal',
  },
  title: {
    fontWeight: 'bold',
    marginTop: 100,
    marginBottom: 50,
  },
  userName: {
    marginBottom: 20,
    marginTop: 5,
  },
  bottomTextView: {
    position: 'absolute',
    bottom: 50,
  },
  bottomText: {
    fontSize: 16,
  },
});

export default styles;
