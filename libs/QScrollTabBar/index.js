/*
 * 2016-03-05
 * Ray
 */
'use strict';

import React from 'react-native';

let {
    Platform,
    Dimensions,
    PixelRatio,
    PropTypes,
    View,
    Text,
    ScrollView,
    Animated,
    InteractionManager,
    StyleSheet
} = React;

import QTabBar from '../QTabBar';

// 屏幕总宽度
const DEVICE_WIDTH = Dimensions.get('window').width;

export default class QScrollTabBar extends React.Component {
    static propTypes = {
        tabBarPosition: PropTypes.oneOf(['top', 'bottom']),
        initialPage: PropTypes.number,
        onPageChanged: PropTypes.func,
        contentProps: PropTypes.object
    };

    static defaultProps = {
        tabBarPosition: 'top',
        initialPage: 0,
        page: -1,
        onPageChanged: () => {},
        contentProps: {}
    };

    constructor (props, context) {
        super(props, context);
        this.state = {
            currentPage: this.props.initialPage,
            containerWidth: DEVICE_WIDTH,
            scrollValue: new Animated.Value(this.props.initialPage)
        }
    };

    componentWillReceiveProps (props) {
        console.log('componentWillReceiveProps');
        if (props.page >= 0 && props.page !== this.state.currentPage) {
            this.goToPage(props.page);
        }
    };

    goToPage (pageNumber) {
        const offset = pageNumber * this.state.containerWidth;
        this.scrollView.scrollTo({x: offset});
        this.setState({currentPage: pageNumber});
    };

    _updateScrollValue (value) {
        this.state.scrollValue.setValue(value);
    };

    _updateSelectedPage (currentPage) {
        let localCurrentPage = currentPage;
        if (typeof localCurrentPage === 'object') {
            localCurrentPage = currentPage.nativeEvent.position;
        }
        this.setState({currentPage: localCurrentPage}, () => {
            this.props.onPageChanged({ i: localCurrentPage });
        });
    };

    _handleLayout (event) {
        const { width } = event.nativeEvent.layout;
        if (width !== this.state.containerWidth) {
            this.setState({ containerWidth: width});
            InteractionManager.runAfterInteractions(() => {
                this.goToPage(this.state.currentPage);
            });
        }
    };

    renderTabBar (props) {
        return <QTabBar {...props} />;
    };
    renderContent () {
        let pageList = React.Children.map(this.props.children, (child, indx) => {
            return React.cloneElement(child, {style: [child.props.style, {width: DEVICE_WIDTH}]});
        });
        return (
            <ScrollView
                horizontal={true}               // 水平排列
                pagingEnabled={true}            // 滚动到整数位置
                directionalLockEnabled={true}   // 只垂直或者水平方向滚动 (iOS only)
                alwaysBounceVertical={false}
                showsHorizontalScrollIndicator={false}
                keyboardDismissMode="on-drag"   // 滑动时，隐藏 keyboard
                scrollEventThrottle={16}
                contentContainerStyle={styles.scrollableContentContainer}
                contentOffset={{x: this.props.initialPage * this.state.containerWidth}}
                ref={(scrollView) => { this.scrollView = scrollView; }}
                onScroll={(event) => {
                    const offsetX = event.nativeEvent.contentOffset.x;
                    this._updateScrollValue(offsetX / this.state.containerWidth);
                }}
                onMomentumScrollBegin={(event) => {
                    const offsetX = event.nativeEvent.contentOffset.x;
                    this._updateSelectedPage(parseInt(offsetX / this.state.containerWidth, 10));
                }}
                onMomentumScrollEnd={(event) => {
                    const offsetX = event.nativeEvent.contentOffset.x;
                    this._updateSelectedPage(parseInt(offsetX / this.state.containerWidth, 10));
                }}
                style={styles.scrollableContent}
                {...this.props.contentProps}
            >
            {pageList}
            </ScrollView>
        );
    };

    render () {
        let tabs = React.Children.map(this.props.children, (child, indx) => {
            return child.props.tabLabel;
        });
        let tabBarProps = {
            tabs: tabs,
            selectedTabIndex: this.state.currentPage,
            containerWidth: this.state.containerWidth,
            scrollValue: this.state.scrollValue,
            goToPage: this.goToPage.bind(this)
        };
        return (
            <View style={[styles.container, this.props.style, {width: DEVICE_WIDTH}]} onLayout={this._handleLayout.bind(this)}>
                {this.renderTabBar(tabBarProps)}
                {this.renderContent()}
            </View>
        );
    };
}

let styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollableContentContainer: {
        flex: 1
    },
    scrollableContent: {
        flexDirection: 'column'
    }
});
