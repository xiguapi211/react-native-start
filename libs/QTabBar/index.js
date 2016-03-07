/*
 * custom tabbar
 * 2016-03-05 Ray
 */
'use strict';

import React from 'react-native';

let {
    View,
    Text,
    TouchableOpacity,
    Animated,
    PropTypes,
    PixelRatio,
    StyleSheet
} = React;

const PIX = PixelRatio.get();

export default class QTabBar extends React.Component {
    static propTypes = {
        underlineColor: PropTypes.string,
        textColor: PropTypes.string,
        selectedColor: PropTypes.string,
        tabs: PropTypes.array,
        selectedTabIndex: PropTypes.number,
        goToPage: PropTypes.func,
        onTabChanged: PropTypes.func
    };

    static defaultProps = {
        underlineColor: 'navy',
        textColor: 'black',
        selectedColor: 'navy',
        tabs: [],
        selectedTabIndex: 0,
        goToPage: () => {},
        onTabChanged: () => {}
    };

    renderTabOption (name, tabIndex) {
        let bIsSelectedTab = this.props.selectedTabIndex === tabIndex;
        let selectedColor = this.props.selectedColor;
        let textColor = this.props.textColor;
        return (
            <TouchableOpacity style={[styles.tab]} key={name + '_' + 'tab'} onPress={() => this.props.goToPage(tabIndex)}>
                <View>
                    <Text style={{color: bIsSelectedTab ? selectedColor : textColor,
            fontWeight: bIsSelectedTab ? 'bold' : 'normal'}}>{name}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    render () {
        let containerWidth = this.props.containerWidth;

        let tabsCount = this.props.tabs.length;
        let underLineLeft = this.props.scrollValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, containerWidth / tabsCount]
        });
        let underLineWidth = containerWidth / tabsCount;
        let underLineBGColor = this.props.underlineColor;

        return (
            <View style={[styles.tabs]}>
            {this.props.tabs.map((tab, indx) => this.renderTabOption(tab, indx))}
            <Animated.View style={[styles.underline, {width: underLineWidth, backgroundColor: underLineBGColor, left: underLineLeft}]} />
            </View>
        );
    };
}

let styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tabs: {
        height: 36,
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderWidth: 1 / PIX,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomColor: '#ccc'
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10
    },
    underline: {
        position: 'absolute',
        height: 2,
        bottom: 0
    }
});
