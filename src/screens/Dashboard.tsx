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
  const answer = ['folgeo', 'commit', 'house', 'table'];

  const [selected_choice_index, setSelected_choice_index] = useState(null);
  const [selected_choice, setSelected_choice] = useState(null);
  const [answer_checked, set_answer_checked] = useState(false);
  const [correct_answer, setCorrrect_ans] = useState(false);
  const [loader, setLoader] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const [current_question, setCurrent_question] = useState(0);
  const [eng_split_sentence, setEng_split_sentence] = useState();
  const [ger_split_sentence, setGer_split_sentence] = useState();
  const [selected_ques_index, setSelected_ques_index] = useState();

  useEffect(() => {
    setSelected_choice_index(null);
    setSelected_choice(null);
    set_answer_checked(false);
    setCorrrect_ans(false);
  }, [current_question]);

  useEffect(() => {
    if (questionList?.length) {
      setEng_split_sentence(
        questionList[current_question]?.english?.question?.split(' '),
      );
      setGer_split_sentence(
        questionList[current_question]?.germany?.question?.split(' '),
      );
    }
  }, [current_question, questionList, questionList?.length]);

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
          setSelected_choice_index(index);
          setSelected_choice(item);
        }}>
        <View
          style={
            selected_choice_index === index
              ? [
                  styles.answerView,
                  {backgroundColor: color.palette.darkBlue1, width: 80},
                ]
              : styles.answerView
          }>
          <Text>{selected_choice_index === index ? null : item}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderQuestion = ({item, index}: any) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSelected_ques_index(index);
        }}>
        {index === selected_ques_index && (
          <View style={styles.translateView}>
            <Text>{eng_split_sentence[selected_ques_index]}</Text>
          </View>
        )}
        <View style={styles.textPara}>
          {!item?.includes('______') ? (
            <Text style={styles.questionText}>{item}</Text>
          ) : (
            <>
              <View
                style={
                  !correct_answer && !answer_checked
                    ? selected_choice
                      ? [
                          styles.answerView,
                          {elevation: 0, marginHorizontal: 10, height: 40},
                        ]
                      : styles.questionText
                    : correct_answer
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
                    !answer_checked
                      ? {color: color.palette.black}
                      : {color: color.palette.white}
                  }>
                  {selected_choice ?? item}
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
                data={ger_split_sentence}
                renderItem={renderQuestion}
                horizontal
              />
            </View>
            <View style={styles.viewFlatlist}>
              <FlatList
                data={questionList[current_question]?.germany?.choices}
                renderItem={renderAnswerList}
                numColumns={2}
              />
            </View>

            {!answer_checked ? (
              <View style={styles.buttonView}>
                <Button
                  title={selected_choice ? 'Check Answer' : 'Continue'}
                  style={
                    selected_choice
                      ? [
                          styles.button,
                          {backgroundColor: color.palette.darkBlue2},
                        ]
                      : styles.button
                  }
                  onPress={() => {
                    set_answer_checked(true);
                    if (
                      selected_choice ===
                      questionList[current_question]?.germany?.correct_answer
                    ) {
                      setCorrrect_ans(true);
                    } else {
                      setCorrrect_ans(false);
                    }
                  }}
                />
              </View>
            ) : (
              <View
                style={
                  correct_answer
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
                  style={[
                    styles.button,
                    {
                      backgroundColor: color.palette.white,
                      marginHorizontal: 20,
                    },
                  ]}
                  textStyle={
                    correct_answer
                      ? {color: color.palette.darkBlue2}
                      : {color: color.palette.darkRed}
                  }
                  onPress={() => {
                    // set_answer_checked(true);
                    setCurrent_question(current_question + 1);
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
    // marginHorizontal: 50,
    // a,
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
    // opacity: 0.2,
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
});
