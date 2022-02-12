import * as React from 'react';
import {Text as ReactNativeText} from 'react-native';
import {mergeAll, flatten} from 'ramda';
import {typography, color} from '../../theme';

const BASE = {
  fontFamily: typography.primary,
  color: color.palette.black,
  fontSize: 14,
};

const variants = {
  /**
   * The default text styles.
   */
  default: BASE,

  /**
   * A bold version of the default text.
   */
  bold: {...BASE, fontFamily: typography.secondary},

  /**
   * Large headers.
   */
  header: {...BASE, fontSize: 16, fontFamily: typography.secondary},

  /**
   * A smaller piece of secondary information.
   */
  secondary: {...BASE, fontSize: 14, fontFamily: typography.secondary},

  /**
   * Field labels that appear on forms above the inputs.
   */
  fieldLabel: {...BASE, fontSize: 16},

  /**
   * Field error
   */
  fieldError: {
    ...BASE,
    fontSize: 14,
    fontFamily: typography.tertiary,
    color: color.palette.red,
  },

  italic: {
    ...BASE,
    fontSize: 14,
    fontFamily: typography.tertiary,
  },

  success: {
    ...BASE,
    fontSize: 15,
    fontFamily: typography.primary,
    color: color.palette.green,
  },
  /**
   * label related to info
   */
  //   infoLabel: {
  //     ...BASE,
  //     color: color.palette.coolGrey,
  //   },
};

/**
 * variant - default | bold | header | secondary  | fieldValue
 *
 * This component is a HOC over the built-in React Native one.
 */
export function Text(props) {
  // grab the props
  const {
    variant = 'default',
    text,
    children,
    style: styleOverride,
    ...rest
  } = props;

  // figure out which content to use
  const content = text || children;

  const style = mergeAll(
    flatten([variants[variant] || variants.default, styleOverride]),
  );

  return (
    <ReactNativeText {...rest} style={style} allowFontScaling={false}>
      {content}
    </ReactNativeText>
  );
}
