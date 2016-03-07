/**
 * Created by ray on 16/3/7.
 */
'use strict';

import React from 'react-native';

let {
    ScrollView,
    PixelRatio,
    StyleSheet,
    Text,
    View
} = React;

import QScrollTabBarView from './../libs/QScrollTabBar';

let LifeScene = React.createClass({
    render: function () {
        return (
            <View style={styles.container}>
                <QScrollTabBarView>
                    <ScrollView tabLabel="活动" style={styles.tabView}>
                        <View style={styles.card}>
                            <Text>Activity</Text>
                        </View>
                    </ScrollView>
                    <ScrollView tabLabel="文章" style={styles.tabView}>
                        <View style={styles.card}>
                            <Text>Artical</Text>
                        </View>
                    </ScrollView>
                    <ScrollView tabLabel="图片" style={styles.tabView}>
                        <View style={styles.card}>
                            <Text>Picture</Text>
                        </View>
                    </ScrollView>
                    <ScrollView tabLabel="卡片" style={styles.tabView}>
                        <View style={styles.card}>
                            <Text>Something</Text>
                        </View>
                    </ScrollView>
                    <ScrollView tabLabel="其他" style={styles.tabView}>
                        <View style={styles.card}>
                            <Text>Other</Text>
                        </View>
                    </ScrollView>
                </QScrollTabBarView>
            </View>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        marginTop: 64
    },
    tabView: {
        flex: 1,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.01)',
    },
    card: {
        borderWidth: 1 / PixelRatio.get(),
        backgroundColor: '#fff',
        borderColor: 'rgba(0,0,0,0.1)',
        margin: 4,
        height: 300,
        padding: 15,
        shadowColor: '#ccc',
        shadowOffset: { width: 1, height: 1, },
        shadowOpacity: 0.5,
        shadowRadius: 5
    }
});
export default LifeScene;
