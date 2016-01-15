/**
 * Created by ray on 15/12/13.
 * @flow
 */
'use strict';
import React from 'react-native';

let {
    TouchableHighlight,
    Text,
    Image,
    View,
    Navigator,
    NavigationBar,
    PixelRatio,
    StyleSheet
    } = React;

import HomeScene from './home';
import DrawerLayout from '../libs/DrawerLayout';

var NavigationBarRouteMapper = {
    LeftButton: function(route, navigator, index, navState) {
        return null;
    },
    RightButton: function(route, navigator, index, navState) {
        return null;
    },
    Title: function(route, navigator, index, navState) {
        return (
            <View style={styles.navBarTitleContainer}>
                <Text style={[styles.navBarText, styles.navBarTitleText]}>
                    {route.title}
                </Text>
            </View>
        );
    }
};

var MainScene = React.createClass({
    renderScene: function (route, navigator) {
        var Component = route.component;
        return (
            <View style={{flex: 1}}>
                <Component navigator={navigator} route={route}/>
            </View>
        );
    },
    render: function () {
        var navigationView = (
            <View style={styles.drawer}>
                <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I'm in the Drawer!</Text>
            </View>
        );
        return (
            <DrawerLayout
                drawerWidth={260}
                drawerPosition='left'
                renderNavigationView={() => navigationView}>
                <Navigator
                    style={styles.container}
                    ref="navi"
                    renderScene={this.renderScene}
                    initialRoute={{
                        title: 'Hello React',
                        component: HomeScene
                    }}
                    configureScene={() => {
                        return Navigator.SceneConfigs.FloatFromRight;
                    }}
                    tintColor="#008888"
                    navigationBar={
                        <Navigator.NavigationBar
                            routeMapper={NavigationBarRouteMapper}
                            style={styles.navBar}
                        />
                    }
                    />
            </DrawerLayout>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        marginTop: 18,
        flexDirection: 'column'
    },
    drawer: {
        flex: 1,
        backgroundColor: '#fff',
        borderRightColor: '#dcdcdc',
        borderRightWidth: 1 / PixelRatio.get()
    },
    navBar: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fafbfc',
        borderColor: '#cdcfd0',
        borderBottomWidth: 1 / PixelRatio.get()
    },
    navBarTitleContainer: {

    },
    navBarText: {
        fontSize: 16
    },
    navBarTitleText: {
        fontSize: 20
    }
});

export default MainScene;