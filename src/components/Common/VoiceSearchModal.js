import React, {useEffect, useRef, useState} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import Voice from '@react-native-voice/voice';
import Modal from 'react-native-modal';
import Dimension from '../../redux/constants/dimensions';
import Colors from '../../redux/constants/colors';
import LottieView from 'lottie-react-native';

const VoiceSearch = props => {
  let animation = useRef(null);
  const [recognized, setrecognized] = useState('');
  const [started, setstarted] = useState('');
  const [results, setresults] = useState([]);
  const [STT, setSTT] = useState(true);
  const [isRecord, setisRecord] = useState(true);
  const [analyzeText, setanalyzeText] = useState('');
  const [isError, setisError] = useState(false);

  const onSpeechStart = e => {
    setstarted('√');
    setSTT(true);
  };

  const onSpeechRecognized = e => {
    setrecognized('√');
  };

  const onSpeechResults = e => {
    let source = 'hi';
    let target = 'en';

    let data = `q=${encodeURIComponent(
      e.value[0],
    )}&target=${target}&source=${source}`;
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        if (
          JSON.parse(this.responseText) &&
          JSON.parse(this.responseText).message
        ) {
          setanalyzeText(e.value[0]);
          setresults(e.value[0]);
          setisRecord(false);
          setSTT(false);

          setTimeout(() => {
            props.closeModal();
            props.suggestionClicked(
              {
                type: 'Search',
                str: e.value[0],
                name: e.value[0],
                fromScreen: 'voice_search',
                from_component: 'voice_search',
              },
              true,
              false,
            );
          }, 1000);
        } else {
          let result = JSON.parse(this.responseText).data.translations[0]
            .translatedText;
          _onresult(e.value[0], result);
        }
      } else {
        if (this.readyState === XMLHttpRequest.DONE) {
          setanalyzeText(e.value[0]);
          setresults(e.value[0]);
          setisRecord(false);
          setSTT(false);

          setTimeout(() => {
            props.closeModal();
            props.suggestionClicked(
              {
                type: 'Search',
                str: e.value[0],
                name: e.value[0],
                fromScreen: 'voice_search',
                from_component: 'voice_search',
              },
              true,
              false,
            );
          }, 1000);
        }
      }
    });

    xhr.open(
      'POST',
      'https://google-translate1.p.rapidapi.com/language/translate/v2',
    );
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('accept-encoding', 'application/gzip');
    xhr.setRequestHeader(
      'x-rapidapi-key',
      'fc2047cfddmsh2387dec139bcaa1p1a65e0jsn57cc424e7b15',
    );
    xhr.setRequestHeader('x-rapidapi-host', 'google-translate1.p.rapidapi.com');

    xhr.send(data);
    // fc2047cfddmsh2387dec139bcaa1p1a65e0jsn57cc424e7b15
  };

  const _onSpeechError = e => {
    if (!isError) {
      onVoiceStop();
      setisError(true);
      onVoiceDestroy();
    }
  };

  const onSpeechPartialResults = e => {
    setanalyzeText(e.value[0] || analyzeText);
  };

  const _onresult = (recognizedVoice, result) => {
    let source = 'hi';
    let target = 'en';

    let data = `q=${encodeURIComponent(
      result,
    )}&target=${target}&source=${source}`;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        if (
          JSON.parse(this.responseText) &&
          JSON.parse(this.responseText).message
        ) {
          setanalyzeText(recognizedVoice);
          setresults(recognizedVoice);
          setisRecord(false);
          setSTT(false);
          setTimeout(() => {
            props.closeModal();
            props.suggestionClicked(
              {
                type: 'Search',
                str: recognizedVoice,
                name: recognizedVoice,
                fromScreen: 'voice_search',
                from_component: 'voice_search',
              },
              true,
              false,
            );
          }, 1000);
        } else {
          let result = JSON.parse(this.responseText).data.translations[0]
            .translatedText;
          setanalyzeText(result);
          setresults(result);
          setisRecord(false);
          setSTT(false);
          setTimeout(() => {
            props.closeModal();
            props.suggestionClicked(
              {
                type: 'Search',
                str: result,
                name: result,
                fromScreen: 'voice_search',
                from_component: 'voice_search',
              },
              true,
              false,
            );
          }, 1000);
        }
      }
    });

    xhr.open(
      'POST',
      'https://google-translate1.p.rapidapi.com/language/translate/v2',
    );
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('accept-encoding', 'application/gzip');
    xhr.setRequestHeader(
      'x-rapidapi-key',
      'fc2047cfddmsh2387dec139bcaa1p1a65e0jsn57cc424e7b15',
    );
    xhr.setRequestHeader('x-rapidapi-host', 'google-translate1.p.rapidapi.com');

    xhr.send(data);
    // 26850ac937msh1cca577d3dc2c6ap149fbfjsn3b905c6deee2
    // fc2047cfddmsh2387dec139bcaa1p1a65e0jsn57cc424e7b15
  };

  Voice.onSpeechStart = onSpeechStart;
  Voice.onSpeechRecognized = onSpeechRecognized;
  Voice.onSpeechResults = onSpeechResults;
  Voice.onSpeechError = _onSpeechError;
  Voice.onSpeechPartialResults = onSpeechPartialResults;

  const onVoiceStart = async () => {
    await Voice.start('en-US');
  };

  const onVoiceStop = async () => {
    await Voice.stop();
  };

  const onVoiceDestroy = async () => {
    await Voice.destroy();
    await Voice.removeAllListeners;
  };

  useEffect(() => {
    if (!isError) {
      onVoiceStart();
      _startRecognition();
    }
  }, [isError]);

  useEffect(() => {
    onVoiceStart();
    _startRecognition();
    return () => {
      onVoiceDestroy();
    };
  }, []);

  const toggleError = async startSpeech => {
    setisError(false);
  };

  const _startRecognition = e => {
    setisRecord(true);
    setSTT(true);
    if (animation && animation.current && animation.current.play) {
      animation.current.play();
    }
  };

  return (
    <Modal
      isVisible={props.isVisible}
      onBackButtonPress={props.closeModal}
      onBackdropPress={props.closeModal}
      style={{
        paddingRight: 0,
        paddingBottom: 0,
        paddingTop: 0,
        paddingLeft: 0,
        margin: 0,
      }}>
      <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            margin: Dimension.margin15,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: Dimension.padding30,
            borderWidth: 1,
            borderColor: Colors.ProductBorderColor,
          }}>
          <Text
            style={{
              fontSize: Dimension.font16,
              fontFamily: Dimension.CustomMediumFont,
              color: Colors.lightGrayText,
              marginBottom: Dimension.margin20,
            }}>
            What are you looking for?
          </Text>
          <TouchableOpacity
            onPress={() => (isError ? toggleError(true) : null)}>
            {isError ? (
              <LottieView
                ref={animation}
                style={{width: 105, height: 105}}
                source={require('../../assets/Lottie/voice_error.json')}
              />
            ) : results && results.length ? (
              <LottieView
                ref={animation}
                style={{width: 105, height: 105}}
                source={require('../../assets/Lottie/voice_success.json')}
              />
            ) : (
              <LottieView
                ref={animation}
                style={{width: 105, height: 105}}
                source={require('../../assets/Lottie/voice_animation.json')}
              />
            )}
          </TouchableOpacity>
          <Text
            numberOfLines={2}
            style={{
              fontSize: Dimension.font14,
              fontFamily: Dimension.CustomMediumFont,
              color: Colors.PrimaryTextColor,
              marginTop: Dimension.margin20,
              marginHorizontal: Dimension.margin20,
              textAlign: 'center',
              alignSelf: 'center',
            }}>
            {isError
              ? "Didn't catch that. \n Tap on mic to speak again"
              : analyzeText
              ? analyzeText + '\n '
              : ' \n '}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default VoiceSearch;
