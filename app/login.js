/**
 * Created by ray on 15/12/13.
 * @flow
 */
'use strict';

import React from 'react-native';
import dismissKeyboard from 'dismissKeyboard';

let {
    Image,
    View,
    Text,
    TextInput,
    TouchableHighlight,
    TouchableWithoutFeedback,
    StyleSheet
} = React;

import {COLOR_NAME, COLOR} from './def';
import {BASE_LABEL_STR} from '../libs/Utils/localization';

var LoginScene = React.createClass({
    // 定义初始状态
    getInitialState: function () {
        return {};
    },
    handler: {
        _dismiss: function () {
            dismissKeyboard();
        },
        _submit: function () {
            this.props.onFinished({code: 0, username: 'ray', display: '西瓜皮'});
        }
    },
    render: function () {
        let { themeColor } = this.props;
        return (
            <TouchableWithoutFeedback onPress={this.handler._dismiss.bind(this)}>
            <View style={styles.container}>
                <View style={styles.logo}>
                    <Image source={require('../resources/images/logo.png')} style={styles.logoImg} />
                </View>
                <View style={styles.form}>
                    <TextInput
                        placeholder={BASE_LABEL_STR.USERNAME}
                        placeholderTextColor="#dcdcdc"
                        style={styles.input}/>
                    <TextInput
                        placeholder={BASE_LABEL_STR.PASSWORD}
                        placeholderTextColor="#dcdcdc"
                        password={true}
                        keyboardType="numeric"
                        style={styles.input}/>
                </View>
                <TouchableHighlight
                    onPress={this.handler._submit.bind(this)}
                    underlayColor="#eee">
                    <View style={[styles.button, {backgroundColor: COLOR[`${themeColor}500`].color}]}>
                        <Text style={styles.buttonText}>{BASE_LABEL_STR.LOGIN}</Text>
                    </View>
                </TouchableHighlight>
            </View>
            </TouchableWithoutFeedback>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch'
    },
    logo: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 90
    },
    logoImg: {
        width: 80,
        height: 75
    },
    form: {
        marginTop: 60,
        marginBottom: 40,
        marginLeft: 30,
        marginRight: 30
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        fontSize: 20,
        color: '#333',
        marginBottom: 20,
        paddingLeft: 10
    },
    button: {
        height: 40,
        marginLeft: 30,
        marginRight: 30,
        borderColor: '#46afe4',
        borderRadius: 3,
        justifyContent: 'center'
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold'
    }
});

export default LoginScene;
