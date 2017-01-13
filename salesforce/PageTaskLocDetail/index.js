// Import dependencies
import React, { Component } from 'react';
import { View, Text, StyleSheet, Picker, AppState, Platform, TouchableHighlight } from 'react-native';
import { Container, Content, Footer, FooterTab, Button, Icon, Badge, Spinner } from 'native-base';
import ComGeolocation from '../ComGeolocation';
import ComAssignment from './ComAssignment';
import RNIsDeviceRooted from 'react-native-is-device-rooted';
import BackgroundJob from 'react-native-background-job';
import ComSendCoord from '../ComSendCoord';

import firebase from 'firebase';


// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAi1BRDCMvnkpQNGErwooDndCBPB6Yol8o",
    authDomain: "salesforce-9c0b9.firebaseapp.com",
    databaseURL: "https://salesforce-9c0b9.firebaseio.com",
    storageBucket: "salesforce-9c0b9.appspot.com"
};
firebase.initializeApp(firebaseConfig);

// Create a reference with .ref() instead of new Firebase(url)
// Create a reference with .ref() instead of new Firebase(url)
itemsRef = firebase.database().ref('tasks');
itemsRef.on(
    'value',
    function(success){
        // alert(JSON.stringify(success.val()));
        console.log("success : ",success.val());
    },
    function(error) {
        alert("NO");
        console.log("error : "+error);
    }
);


const myJobKey = "Hej";

BackgroundJob.register({ jobKey: myJobKey, job:() => ComGeolocation.currentPosition((pos) => {
        console.log('currentPosition', pos);
        ComSendCoord.setMethod("POST");
        ComSendCoord.setSendData({ sales_id: 3, geolocation_lat: pos.coords.latitude, geolocation_lng: pos.coords.longitude });
        ComSendCoord.sendCoord(() => {
          // Nothing to do
        });
      })
    });

import { Actions } from 'react-native-router-flux';
// Declare Style
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    picker: {
        width: 100,
    },
    yourTask: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        borderWidth: 2,
        width: 150,
        height: 150,
        marginTop: 20,
        marginBottom: 30,
    },
    yourTaskText: {
        fontSize: 20,
        textAlign: 'center',
    },
    yourTaskTextStat: {
        fontSize: 40,
        textAlign: 'center',
    },
    viewTask: {
        marginTop: 15,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const isRooted = RNIsDeviceRooted.isDeviceRooted();
const isLocked = RNIsDeviceRooted.isDeviceLocked();
console.log("di Lock", isLocked);
console.log("di Root", isRooted);
export default class PageTaskLocDetail extends Component {



    state = {
        currLat: 'loading',
        currLong: 'loading',
        totalAssignment: false,
    };

    constructor(props) {
        super(props);
        this.salesID = 3;
        this.name = "Dani";
        this.state = { jobs: [] };
        ComAssignment.setResource("/sales/" + this.salesID);
    }



    componentDidMount() {
        this.getAll();
        BackgroundJob.schedule({ jobKey: myJobKey, period: 5000, timeout: 5000 });

        ComGeolocation.watchCurrentPosition((pos) => {
            console.log('watchCurrentPosition', pos);
            this.setState({ currLat: typeof pos.coords == 'undefined' ? 'error' : pos.coords.latitude });
            this.setState({ currLong: typeof pos.coords == 'undefined' ? 'error' : pos.coords.longitude });

        });

        ComAssignment.getAssignment((response) => {
            this.setState({ totalAssignment: response.data.length });
        });
    }
    getAll() {
        BackgroundJob.getAll({
            callback: (jobs) => {
                this.setState({ jobs });
                console.log("Jobs:", jobs);
            }
        });
         ComGeolocation.watchCurrentPosition((pos) => {
            console.log('watchCurrentPosition', pos);
            this.setState({ currLat: typeof pos.coords == 'undefined' ? 'error' : pos.coords.latitude });
            this.setState({ currLong: typeof pos.coords == 'undefined' ? 'error' : pos.coords.longitude });

        });

        ComAssignment.getAssignment((response) => {
            this.setState({ totalAssignment: response.data.length });
        });
    }

    componentWillUnmount() {
        ComGeolocation.clearWatchCurrentPosition();
    }

    _renderAssignment() {
        if (this.state.totalAssignment === false) {
            return (
                <Spinner />
            );
        }
        else {
            return (
                <Text style={styles.yourTaskTextStat}>
                    {this.state.totalAssignment}
                </Text>
            );
        }
    }

    render() {
        return (
            <Container style={styles.container}>
                <Content>
                    <View style={styles.yourTask}>
                        <Text style={styles.yourTaskText}>
                            Your Task
                        </Text>
                        {this._renderAssignment()}
                    </View>
                   
                    <View style={styles.viewTask}>
                        <Button block>
                            View Task
                        </Button>
                    </View>
                </Content>
            </Container>
        )
    }
}
