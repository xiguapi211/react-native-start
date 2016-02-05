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
                <Calendar
                    scrollEnabled={true}
                    onDateSelected={ (date) => console.log('selected date', date) }>
                </Calendar>
            </View>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 68
    }
});

export default CalendarScene;
