/**
 * Created by ray on 15/12/11.
 */
'use strict';

import React from 'react-native';

// android us system
import { DrawerLayoutAndroid } from 'react-native';
// ios
import DrawerLayoutIOS from './DrawerLayout.ios';

var { Platform } = React;
if (Platform.OS === 'android') {
    module.exports = DrawerLayoutAndroid;
} else if (Platform.OS === 'ios') {
    module.exports = DrawerLayoutIOS;
}