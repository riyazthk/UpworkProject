import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {getQuestions} from '../services/userServices';

import {color, typography} from '../theme';
import {Button} from '../ui-kit/button';
import {Text} from '../ui-kit/text';

export const Dashboard = () => {
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(false);
  const [loader, setLoader] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [engSplitSentence, setEngSplitSentence] = useState();
  const [gerSplitSentence, setGerSplitSentence] = useState();
  const [selectedQuesIndex, setSelectedQuesIndex] = useState();

  useEffect(() => {
    setSelectedChoiceIndex(null);
    setSelectedChoice(null);
    setAnswerChecked(false);
    setCorrectAnswer(false);
  }, [currentQuestion]);

  useEffect(() => {
    if (questionList?.length) {
      setEngSplitSentence(
        questionList[0]?.questions[currentQuestion]?.question?.split(' '),
      );
      setGerSplitSentence(
        questionList[1]?.questions[currentQuestion]?.question?.split(' '),
      );
    }
  }, [currentQuestion, questionList, questionList?.length]);

  useEffect(() => {
    setLoader(true);
    let array_question = [];
    getQuestions()
      .then((res) => {
        Object.values(res?.val()).map((item): any => {
          array_question.push(item);
        });
        setQuestionList(array_question);
        setLoader(false);
      })
      .catch((e) => {
        console.log('err', e);
      });
  }, []);

  const renderAnswerList = ({item, index}: any) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          setSelectedChoiceIndex(index);
          setSelectedChoice(item);
        }}>
        <View
          style={
            selectedChoiceIndex === index
              ? [
                  styles.answerView,
                  {backgroundColor: color.palette.darkBlue1, width: 80},
                ]
              : styles.answerView
          }>
          <Text>{selectedChoiceIndex === index ? null : item}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderQuestion = ({item, index}: any) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedQuesIndex(index);
        }}>
        {index === selectedQuesIndex && (
          <View style={styles.translateView}>
            <Text>{engSplitSentence[selectedQuesIndex]}</Text>
          </View>
        )}
        <View style={styles.textPara}>
          {!item?.includes('______') ? (
            <Text style={styles.questionText}>{item}</Text>
          ) : (
            <>
              <View
                style={
                  !correctAnswer && !answerChecked
                    ? selectedChoice
                      ? [
                          styles.answerView,
                          {elevation: 0, marginHorizontal: 10, height: 40},
                        ]
                      : styles.questionText
                    : correctAnswer
                    ? [
                        styles.answerView,
                        {
                          elevation: 0,
                          marginHorizontal: 10,
                          backgroundColor: color.palette.darkBlue2,
                          height: 40,
                        },
                      ]
                    : [
                        styles.answerView,
                        {
                          elevation: 0,
                          marginHorizontal: 10,
                          backgroundColor: color.palette.darkRed,
                          height: 40,
                        },
                      ]
                }>
                <Text
                  style={
                    !answerChecked
                      ? {color: color.palette.black}
                      : {color: color.palette.white}
                  }>
                  {selectedChoice ?? item}
                </Text>
              </View>
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.whiteSheet}>
        {loader ? (
          <ActivityIndicator style={styles.loader} />
        ) : (
          <>
            <Text style={styles.title}>Fill in the missing word</Text>
            <Text style={styles.question_ex_text}>
              The <Text style={styles.boldText}>house</Text> is small
            </Text>

            <View style={styles.questionOuterView}>
              <FlatList
                data={gerSplitSentence}
                renderItem={renderQuestion}
                horizontal
              />
            </View>
            <View style={styles.viewFlatlist}>
              <FlatList
                data={questionList[1]?.questions[currentQuestion]?.choices}
                renderItem={renderAnswerList}
                numColumns={2}
              />
            </View>

            {!answerChecked ? (
              <View style={styles.buttonView}>
                <Button
                  title={selectedChoice ? 'Check Answer' : 'Continue'}
                  style={
                    selectedChoice
                      ? [
                          styles.button,
                          {backgroundColor: color.palette.darkBlue2},
                        ]
                      : styles.button
                  }
                  onPress={() => {
                    setAnswerChecked(true);
                    if (
                      selectedChoice ===
                      questionList[1]?.questions[currentQuestion]?.correctAnswer
                    ) {
                      setCorrectAnswer(true);
                    } else {
                      setCorrectAnswer(false);
                    }
                  }}
                />
              </View>
            ) : (
              <View
                style={
                  correctAnswer
                    ? styles.bottomSheet
                    : [
                        styles.bottomSheet,
                        {backgroundColor: color.palette.darkRed},
                      ]
                }>
                <View style={styles.rowView}>
                  <Text style={styles.text}>Great Job!</Text>
                  <Image
                    source={require('../assets/icons/flag.png')}
                    style={styles.icon}
                  />
                </View>
                <Button
                  title={'Continue'}
                  style={[styles.button, styles.overrideBtnStyle]}
                  textStyle={
                    correctAnswer
                      ? {color: color.palette.darkBlue2}
                      : {color: color.palette.darkRed}
                  }
                  onPress={() => {
                    setCurrentQuestion(currentQuestion + 1);
                  }}
                />
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.palette.azureBlue,
  },
  whiteSheet: {
    flex: 1,
    backgroundColor: color.palette.darkBlue,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: 120,
  },
  title: {
    textAlign: 'center',
    marginTop: 50,
    color: color.palette.white,
    fontFamily: typography.primary,
  },
  question_ex_text: {
    fontSize: 24,
    color: color.palette.white,
    textAlign: 'center',
    marginTop: 15,
    fontFamily: typography.primary,
  },
  boldText: {
    fontWeight: '700',
    textDecorationLine: 'underline',
    color: color.palette.white,
    fontSize: 24,
    fontFamily: typography.primary,
  },
  questionText: {
    fontFamily: typography.primary,
    textDecorationLine: 'underline',
    color: color.palette.white,
    textAlign: 'center',
    marginTop: 20,
  },
  viewFlatlist: {
    alignItems: 'center',
    marginTop: 50,
  },
  answerView: {
    backgroundColor: color.palette.white,
    justifyContent: 'center',
    marginHorizontal: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 10,
  },
  buttonView: {
    flex: 1,
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  button: {
    height: 50,
    borderRadius: 25,
    backgroundColor: color.palette.darkBlue1,
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: color.palette.darkBlue2,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: 60,
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 25,
    marginVertical: 20,
  },
  icon: {
    height: 20,
    width: 20,
    tintColor: color.palette.white,
  },
  text: {
    color: color.palette.white,
    fontFamily: typography.secondary,
    fontSize: 15,
  },
  loader: {
    justifyContent: 'center',
    flex: 1,
  },
  textPara: {
    marginRight: 5,
  },
  questionOuterView: {
    flex: 0.3,
    alignItems: 'center',
    marginTop: 30,
  },
  translateView: {
    backgroundColor: color.palette.white,
    padding: 5,
    position: 'absolute',
    top: -5,
    borderRadius: 5,
    width: 50,
  },
  overrideBtnStyle: {
    backgroundColor: color.palette.white,
    marginHorizontal: 20,
  },
});
