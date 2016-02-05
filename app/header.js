/**
 * Created by ray on 16/1/21.
 */
'use strict';

import React from 'react-native';

let {
    View,
    Image,
    Text,
    TextInput,
    Platform,
    StyleSheet
} = React;

import {BASE_LABEL_STR} from '../libs/Utils/localization';

var Header = React.createClass({
    render: function () {
        return(
            <View style={styles.container}>
                <View style={styles.searchBox}>
                    <Image source={require('../resources/images/icon_search.png')} style={styles.searchIcon}/>
                    <TextInput
                        keyboardType="web-search"
                        placeholder={BASE_LABEL_STR.SEARCH_HOLD}
                        style={styles.inputText}/>
                    <Image source={require('../resources/images/icon_voice.png')} style={styles.voiceIcon}/>
                </View>
                <Image source={require('../resources/images/icon_qr.png')} style={styles.scanIcon}/>
            </View>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: Platform.OS === 'ios' ? 20 : 0, // 处理iOS状态栏
        height: Platform.OS === 'ios' ? 68 : 48,    // 处理iOS状态栏
        backgroundColor: '#d74047',
        alignItems: 'center'                        // 元素垂直居中
    },
    searchBox: {
        height: 30,
        flexDirection: 'row',
        flex: 1,
        borderRadius: 5,  // 设置圆角边
        backgroundColor: 'white',
        alignItems: 'center',
        marginLeft: 8,
        marginRight: 12
    },
    scanIcon: {
        height: 26.7,
        width: 26.7,
        resizeMode: 'stretch'
    },
    searchIcon: {
        marginLeft: 6,
        marginRight: 6,
        width: 16.7,
        height: 16.7,
        resizeMode: 'stretch'
    },
    voiceIcon: {
        marginLeft: 5,
        marginRight: 8,
        width: 15,
        height: 20,
        resizeMode: 'stretch'
    },
    inputText: {
        flex: 1,
        backgroundColor: 'transparent',
        fontSize: 14
    }
});

export default Header;