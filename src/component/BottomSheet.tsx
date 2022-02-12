import React from 'react';
import {Text, StyleSheet, Dimensions, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import {color} from '../theme';

export const BottomSheet = ({refRBSheet}: any) => {
  return (
    <RBSheet
      ref={refRBSheet}
      closeOnDragDown={false}
      closeOnPressMask={false}
      customStyles={{
        wrapper: {
          backgroundColor: 'transparent',
        },
        container: {
          height: 40,
        },
        draggableIcon: {
          backgroundColor: '#000',
        },
      }}>
      <View style={{backgroundColor: 'red', flex: 1}}>
        <Text>hello</Text>
      </View>
    </RBSheet>
    // <Modal
    //   isVisible
    //   animationIn={'fadeIn'}
    //   backdropOpacity={0.7}
    //   backdropColor={color.palette.black}
    //   animationOut={'fadeOut'}
    //   //   onBackdropPress={onCancel}
    //   //   onBackButtonPress={onCancel}
    //   style={styles.modalView}>
    //   <SafeAreaView style={styles.modalreturnView}>
    //     <Text>Hello</Text>
    //     <Text>Hello</Text>
    //     <Text>Hello</Text>
    //     <Text>Hello</Text>
    //     <Text>Hello</Text>
    //     <Text>Hello</Text>
    //   </SafeAreaView>
    // </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    margin: 0,
  },
  modalreturnView: {
    height: 'auto',
    marginTop: 'auto',
    width: Dimensions.get('window').width,
    alignSelf: 'center',
    // borderTopLeftRadius: StyleConfig.countPixelRatio(20),
    // borderTopRightRadius: StyleConfig.countPixelRatio(20),
    backgroundColor: color.palette.black,
  },
});
