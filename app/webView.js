/**
 * Created by ray on 16/2/5.
 */
'use strict';

import React from 'react-native';

let {
    View,
    WebView,
    StyleSheet
} = React;

var WebViewScene = React.createClass({
    render: function () {
        console.log('url', this.props.url);
        return (
            <View style={styles.container}>
                <WebView source={{uri: this.props.url}} style={styles.webview} />
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6EF',
        flexDirection: 'column',
        padding: 6
    },
    webview: {
        borderWidth: 1,
        borderColor: '#ddd'
    }
});

export default WebViewScene;
