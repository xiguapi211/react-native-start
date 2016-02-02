/**
 * Created by ray on 15/12/13.
 * @flow
 */
'use strict';

import React from 'react-native';

let {
    Platform,
    Navigator,
    View,
    Text,
    StyleSheet
} = React;

import LoginScene from './login';
import MainScene from './main';

import CalendarScene from './calendar';

var Index = React.createClass({
    getInitialState: function () {
        return {
            user: {
                bIsLogin: false
            },
            current_route: null,
            themeColor: 'paperPink'
        }
    },
    componentWillMount: function () {
        this.setState({user: {bIsLogin: false}});
        this.setState({current_route: 'login'});
    },
    handler: {
        _loginFinished: function (obj) {
            if (obj.code === 0) {
                this.setState({user: {login: true}});
                this.setState({current_route: 'main'});
            }
        }
    },
    renderScene: function (route, nav) {
        let current = this.state.current_route;
        let themeColor = this.state.themeColor;
        // 登录,主页,引导页
        switch (current) {
            case 'login':
                return <LoginScene themeColor={themeColor} navigator={nav} onFinished={this.handler._loginFinished.bind(this)}/>;
            case 'main':
                return <MainScene themeColor={themeColor}></MainScene>;
            default:
                return <View><Text>OKOK</Text></View>;
        }
    },
    render: function () {
        return (
            <Navigator
                initialRoute={{ id: this.state.current_route }}
                renderScene={this.renderScene}
                configureScene={() => {
                    return Navigator.SceneConfigs.FloatFromBottom;
                }}
                />
        );
    }
});

export default Index;
