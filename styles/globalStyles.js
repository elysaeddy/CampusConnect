import { StyleSheet } from 'react-native';

import COLORS from './colors';

const globalStyles = StyleSheet.create({

  /* Screen */

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
  },

  /* Titles */

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 90,
    marginBottom: 20,
  },

  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 5,
    marginBottom: 20,
  },

  /* Card */

  card: {
    backgroundColor: COLORS.white,

    borderRadius: 20,

    padding: 20,

    marginBottom: 15,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.1,

    shadowRadius: 5,

    elevation: 4,
  },

  /* Text */

  text: {
    color: COLORS.text,
    fontSize: 16,
  },

  infoText: {
    color: COLORS.gray,
    fontSize: 14,
  },

  /* Buttons */

  button: {
    backgroundColor: COLORS.primary,

    paddingVertical: 14,

    borderRadius: 15,

    alignItems: 'center',

    marginTop: 10,
  },

  buttonText: {
    color: COLORS.white,

    fontWeight: 'bold',

    fontSize: 16,
  },

  /* Input */

  input: {
    backgroundColor: COLORS.white,

    borderRadius: 15,

    borderWidth: 1,

    borderColor: COLORS.border,

    paddingHorizontal: 15,

    height: 55,

    marginBottom: 15,
  },

  /* Badge */

  badge: {
    backgroundColor: COLORS.accent,

    alignSelf: 'flex-start',

    paddingHorizontal: 12,

    paddingVertical: 6,

    borderRadius: 20,
  },

  badgeText: {
    color: COLORS.text,

    fontWeight: 'bold',
  },

});

export default globalStyles;