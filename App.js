// App.js

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  AppRegistry,
} from 'react-native';

import { ListItem } from 'react-native-elements'

// this is native code lib
import Voice from 'react-native-voice';
console.log('Voice', Voice)

export default class VoiceNative extends React.Component {
  constructor(props) {
    super(props);
    console.log('Component constructed')
    this.state = {
      recognized: '',
      started: '',
      results: [],
      actions: {
        "check in": this.checkin,
        "checkin": this.checkin,
        "checking": this.checkin,
        "checkout": this.checkout, 
        "check out": this.checkout,
        "contact reception" :this.contact,
      },
      action: "Unknown"
    };

    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
  }
  findAction() {
    console.log('findAction', this.state.results)
    // take each result and search in actions until found
    let found = false
    for(const action of this.state.results) { 
      console.log('action', action, this.state.actions[action])
      if(this.state.actions[action]) {
        found = true
        const method = this.state.actions[action]
        // const method = this[method]  // dynamic call
        method.call(this)
        break
      }
    }
    if(!found) this.state.action = "Unknown"
  }

  checkout () {
    this.setState({
      action: "Checking you out baby"
    })
  }
  checkin () {
    this.setState({
      action: "Checking you in, please wait"
    })
  }
  contact () {
    this.setState({
      action: "Connecting you with Reception, please bear with me"
    })
  }
  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }
  onSpeechStart(e) {
    console.log('Speech started')
    this.setState({
      started: '√',
    });
  };
  onSpeechRecognized(e) {
    console.log('Speech recognised')
    this.setState({
      recognized: '√',
    });
  };

  onSpeechResults(e) {
    console.log('Speech results', e.value)
    const results = e.value;  // Array.isArray(e.value) ? e.value[0] : e.value;
    this.setState({
      recognized: '√',
    });
    this.setState({
      results
    });
    
    this.findAction()

  }
  async _startRecognition(e) {
    console.log('Start recognition')
    this.setState({
      recognized: '',
      started: '',
      results: [],
    });
    try {
      console.log('Awaiting Speech.start')
      await Voice.start('en-US');
      console.log('Speech.start finished')
    } catch (e) {
      console.error(e);
    }
  }
  render () {
    return (
      <View>
        <Text style={styles.header}>
          This is a quick demo of Voice
          Press start, and try Check In, Check out, or Contact Reception
        </Text>

        <Text style={styles.body}>
          Started : {this.state.started}
        </Text>
        <Text style={styles.body}>
          Recognised: {this.state.recognized}
        </Text>

        <Button style={styles.transcript}
          onPress={this._startRecognition.bind(this)}
          title="Press Start">
        </Button>
        <Text style={styles.transcript}>
            Results
        </Text>
        {
          this.state.results.map((result, index) => {
            return <Text key={index} style={styles.transcript}> {result} </Text>
          })
        }
        <Text style={styles.body}>
            Action: {this.state.action}
        </Text>

        

      </View>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    fontSize:20,
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 10,
  },
  body: {
    fontSize:15,
    textAlign: 'center',
    color: 'blue',
    marginBottom: 10,
  },
  transcript: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
    // top: '400%',
  },
});
AppRegistry.registerComponent('VoiceNative', () => VoiceNative);