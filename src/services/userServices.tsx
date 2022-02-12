import database from '@react-native-firebase/database';

export const getQuestions = async () => {
  return await database()
    .ref('questions/')
    .once('value', (snapshot) => {
      // console.log(snapshot.val());
      return snapshot.val();
    });
};
