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
  const [engLangIndex, setEngLangIndex] = useState(null);
  const [gerLangIndex, setGerLangIndex] = useState(null);
  const [resetQuestion, setResetQuestion] = useState(false);
  const [resetFlag, setResetFlag] = useState(false);

  useEffect(() => {
    setSelectedChoiceIndex(null);
    setSelectedChoice(null);
    setAnswerChecked(false);
    setCorrectAnswer(false);
  }, [currentQuestion]);

  useEffect(() => {
    if (questionList?.length) {
      questionList.forEach((item, index) => {
        if (item?.language === 'english') {
          setEngSplitSentence(
            questionList[index]?.questions[currentQuestion]?.question?.split(
              ' ',
            ),
          );
          setEngLangIndex(index);
        } else if (item?.language === 'germany') {
          setGerSplitSentence(
            questionList[index]?.questions[currentQuestion]?.question?.split(
              ' ',
            ),
          );
          setGerLangIndex(index);
        }
      });
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
  }, [resetFlag]);

  useEffect(() => {
    if (!currentQuestion < questionList[gerLangIndex]?.questions?.length) {
      setResetQuestion(true);
    }
  }, [currentQuestion, gerLangIndex, questionList]);

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
                      ? selectedChoice
                        ? {color: color.palette.black}
                        : {color: color.palette.white}
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

  const renderEngQuestion = ({item}: any) => {
    return (
      <View>
        {!item?.includes('______') ? (
          <Text style={[styles.questionText, styles.overrideText]}>{item}</Text>
        ) : (
          <Text style={[styles.questionText, styles.overrideAnswerText]}>
            {questionList[engLangIndex]?.questions[currentQuestion]?.choices[
              selectedChoiceIndex
            ] ?? item}
          </Text>
        )}
      </View>
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

            <View style={styles.questionOuterView}>
              <FlatList
                data={engSplitSentence}
                renderItem={renderEngQuestion}
                horizontal
              />
            </View>

            <View style={styles.questionOuterView}>
              <FlatList
                data={gerSplitSentence}
                renderItem={renderQuestion}
                horizontal
              />
            </View>
            <View style={styles.viewFlatlist}>
              <FlatList
                data={
                  questionList[gerLangIndex]?.questions[currentQuestion]
                    ?.choices
                }
                renderItem={renderAnswerList}
                numColumns={2}
              />
            </View>

            {!answerChecked ? (
              <View style={styles.buttonView}>
                <Button
                  title={
                    currentQuestion <
                    questionList[gerLangIndex]?.questions?.length
                      ? selectedChoice
                        ? 'Check Answer'
                        : 'Continue'
                      : 'Reset'
                  }
                  style={
                    selectedChoice
                      ? [
                          styles.button,
                          {backgroundColor: color.palette.darkBlue2},
                        ]
                      : styles.button
                  }
                  disabled={
                    !resetQuestion ? (selectedChoice ? false : true) : false
                  }
                  onPress={() => {
                    setAnswerChecked(true);
                    if (
                      currentQuestion <
                      questionList[gerLangIndex]?.questions?.length
                    ) {
                      if (
                        selectedChoice ===
                        questionList[gerLangIndex]?.questions[currentQuestion]
                          ?.correct_answer
                      ) {
                        setCorrectAnswer(true);
                      } else {
                        setCorrectAnswer(false);
                      }
                    } else {
                      setResetFlag(!resetFlag);
                      setSelectedChoiceIndex(null);
                      setSelectedChoice(null);
                      setAnswerChecked(false);
                      setCorrectAnswer(false);
                      setResetQuestion(false);
                      setCurrentQuestion(0);
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
                  <Text style={styles.text}>
                    {correctAnswer
                      ? 'Great Job!'
                      : `Answer: ${questionList[gerLangIndex]?.questions[currentQuestion]?.correct_answer}`}
                  </Text>
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
    paddingVertical: 5,
    paddingHorizontal: 2,
    position: 'absolute',
    top: -5,
    borderRadius: 5,
    // width: 50,
  },
  overrideBtnStyle: {
    backgroundColor: color.palette.white,
    marginHorizontal: 20,
  },
  overrideText: {
    textDecorationLine: 'none',
    marginRight: 5,
    marginTop: 0,
    fontSize: 16,
  },
  overrideAnswerText: {
    fontWeight: '700',
    fontSize: 16,
    marginTop: 0,
    marginRight: 5,
  },
});
