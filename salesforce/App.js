import React from 'react';
import {
  Platform,
} from 'react-native';

import { Router, Scene } from 'react-native-router-flux';
import PageTaskLoc from './PageTaskLocDetail';
import ComGeolocation from './ComGeolocation';
import ComSendCoord from './ComSendCoord';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    setInterval(() => {
      ComGeolocation.currentPosition((pos) => {
        console.log('currentPosition', pos);
        ComSendCoord.setMethod("POST");
        ComSendCoord.setSendData({ sales_id: 3, geolocation_lat: pos.coords.latitude, geolocation_lng: pos.coords.longitude });
        ComSendCoord.sendCoord(() => {
          // Nothing to do
        });
      });
    }, (10 * 60) * 5);
  }

  render() {
    return (
      <Router>
        <Scene key='root' style={{ paddingTop: Platform.OS === 'ios' ? 64 : 54 }}>
          <Scene key='PageTaskLoc' title='Home' component={PageTaskLoc} />
        </Scene>
      </Router>
    );
  }
}
