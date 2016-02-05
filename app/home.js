/**
 * Created by ray on 15/12/13.
 */
'use strict';

import React from 'react-native';

let {
    View,
    Image,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    StyleSheet
} = React;

import Header from './header';
import Swiper from '../libs/Swiper';
import NewsScene from './news';
import CalendarScene from './calendar';


var MODULE_LIST = [
    {
        group: [
            {key: '001', mid: 'news', title: '新闻', icon: require('../resources/images/icon_books.png')},
            {key: '002', mid: 'calendar', title: '日历', icon: require('../resources/images/icon_calendar.png')},
            {key: '003', mid: 'anima', title: '动画', icon: require('../resources/images/icon_camera.png')},
            {key: '004', mid: 'news3', title: '社团汇', icon: require('../resources/images/icon_label.png')}
        ]
    },
    {
        group: [
            {key: '005', mid: 'news4', title: '功能5', icon: require('../resources/images/icon_message.png')},
            {key: '006', mid: 'news5', title: '功能6', icon: require('../resources/images/icon_note.png')},
            {key: '007', mid: 'news6', title: '功能7', icon: require('../resources/images/icon_setting.png')},
            {key: '008', mid: 'news7', title: '功能59', icon: require('../resources/images/icon_weather.png')}
        ]
    }
];

// 测试用空页
var EmptyPage = React.createClass({
    render: function () {
        return (
            <View style={styles.emptyPage}>
                <Text>{this.props.text}</Text>
            </View>
        );
    }
});


var HomeScene = React.createClass({
    getPage: function (module) {
        switch (module.mid) {
            case 'news':
                return NewsScene;
            case 'calendar':
                return CalendarScene;
            default:
                return EmptyPage;
        }
    },
    _renderRow: function (title: string, icon: number, key, onPress: Function) {
        return (
            <TouchableHighlight key={key} onPress={onPress} underlayColor="#eee">
                <View style={styles.item}>
                    <Image source={icon}
                           style={styles.icon}>
                    </Image>
                    <Text>{title}</Text>
                </View>
            </TouchableHighlight>
        );
    },
    render: function () {
        return (
            <View style={styles.container}>
                <Header />
                <Swiper style={styles.swiper}>
                    <View style={styles.slide1}>
                        <Text style={styles.text}>Hello Swiper</Text>
                    </View>

                    <View style={styles.slide2}>
                        <Text style={styles.text}>Beautiful</Text>
                    </View>

                    <View style={styles.slide3}>
                        <Text style={styles.text}>And simple</Text>
                    </View>
                </Swiper>
                <View style={styles.wrapper}>
                    {MODULE_LIST.map((groupObj, keygroup) =>
                            <View style={styles.rowCenter} key={keygroup}>
                                <View style={styles.row}>
                                    {groupObj.group.map((obj) => {
                                        return this._renderRow(obj.title, obj.icon, obj.key, () => {
                                            this.props.navigator.push({
                                                title: obj.title,
                                                component: this.getPage(obj)
                                            });
                                        });
                                    })}
                                </View>
                            </View>
                    )}
                    <View style={styles.mainContain}>
                        <Text></Text>
                    </View>
                </View>
            </View>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        marginTop: 44,
        flex: 1,
        flexDirection: 'column'
    },
    swiper: {
        height: 200
    },
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5',
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9'
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    },
    wrapper: {
        backgroundColor: 'transparent',
        marginTop: 20,
        paddingTop: 10,
        flex: 1
    },
    rowCenter: {
        height: 90,
        marginTop: 10,
        justifyContent: 'space-around'
    },
    row: {
        flexDirection: 'row',
        height: 90,
        justifyContent: 'center'
    },
    item: {
        width: 80,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        width: 58,
        height: 58,
        marginBottom: 8
    },
    mainContain: {
        flex: 1
    }
});

export default HomeScene;