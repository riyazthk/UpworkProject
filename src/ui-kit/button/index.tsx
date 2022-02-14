import React from 'react';
import {ActivityIndicator, Pressable} from 'react-native';
import {color, spacing, typography} from '../../theme';
import {Text} from '../text';

const BASE_VIEW = {
  // paddingVertical: spacing[2],
  paddingHorizontal: spacing[2],
  borderRadius: 6,
  justifyContent: 'center',
  alignItems: 'center',
};

const BASE_TEXT = {
  fontSize: 20,
  paddingHorizontal: spacing[3],
  fontFamily: typography.secondary,
};
/**
 * variant / type / preset -> All these are same thing
 */
const viewVariants = {
  solid: {...BASE_VIEW, backgroundColor: color.palette.btnColor},
  link: {
    ...BASE_VIEW,
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: 'flex-start',
  },
  outline: {
    ...BASE_VIEW,
    borderWidth: 2,
    borderColor: color.palette.btnColor,
    backgroundColor: 'white',
  },
};

const textVariants = {
  solid: {
    ...BASE_TEXT,
    color: color.palette.white,
    textAlign: 'center',
    letterSpacing: 0,
  },
  //   link: {
  //     ...BASE_TEXT,
  //     color: color.palette.brownishGrey,
  //     paddingHorizontal: 0,
  //     paddingVertical: 0,
  //     fontFamily: typography.primary,
  //     textDecorationLine: 'underline',
  //   },
  outline: {
    ...BASE_TEXT,
    color: color.palette.btnColor,
    fontFamily: typography.secondary,
    textAlign: 'center',
  },
};

/**
 * This component is a HOC over the built-in React Native one.
 */
export function Button(props: any) {
  const {
    variant = 'solid',
    title,
    style: styleOverride,
    textStyle: textStyleOverride,
    children,
    disabled,
    loading,
    ...rest
  } = props;

  const viewStyle = [viewVariants.solid, styleOverride];

  const textStyle = [textVariants.solid, textStyleOverride];

  const content = children || <Text text={title} style={textStyle} />;

  const disableStyle =
    variant === 'link'
      ? {backgroundColor: color.palette.white}
      : {backgroundColor: color.palette.darkBlue1};

  return (
    <Pressable
      style={[viewStyle, disabled && disableStyle]}
      {...{disabled}}
      {...rest}
      android_ripple={{color: color.palette.white}}>
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'link' || variant === 'outline'
              ? color.palette.azureBlue
              : color.palette.white
          }
        />
      ) : (
        content
      )}
    </Pressable>
  );
}
