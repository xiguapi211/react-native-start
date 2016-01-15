/**
 * Created by ray on 15/12/16.
 */
'use strict'

import React from 'react-native';

let {
    Image,
    View,
    Text,
    StyleSheet
    } = React;

import Calendar from '../libs/Calendar';

var CalendarScene = React.createClass({
    render: function () {
        return (
            <View style={styles.container}>
                <Calendar>
                </Calendar>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30
    }
});

export default CalendarScene;