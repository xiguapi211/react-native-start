/**
 * Created by ray on 15/12/11.
 */
'use strict';

import React from 'react-native';

let {
    Animated,
    PanResponder,
    PropTypes,
    StyleSheet,
    View,
    Dimensions,
    TouchableWithoutFeedback
    } = React;

// 屏幕总宽度
const DEVICE_WIDTH = parseInt(Dimensions.get('window').width);
const THRESHOLD = DEVICE_WIDTH / 2;
// 最大速度
const VX_MAX = 0.1;

// 三种状态（就位, 滑动中, 开始）
const IDLE = 'Idle';
const DRAGGING = 'Dragging';
const SETTLING = 'Settling';

export default class DrawerLayout extends React.Component {
    static defaultProps = {
        drawerWidth: 0,
        drawerPosition: 'left'
    };

    static propTypes = {
        // 滑动宽度
        drawerWidth: PropTypes.number.isRequired,
        // 滑出位置（左,右）
        drawerPosition: PropTypes.oneOf(['left', 'right']).isRequired,
        // The navigation view
        renderNavigationView: PropTypes.func.isRequired,

        // Event
        onDrawerSlide: PropTypes.func,
        onDrawerStateChanged: PropTypes.func,
        onDrawerOpen: PropTypes.func,
        onDrawerClose: PropTypes.func,
    };

    constructor (props, context) {
        super(props, context);
        this.state = {
            animOpenValue: new Animated.Value(0)     // init
        }
    }

    componentWillMount () {
        let { animOpenValue } = this.state;
        //
        animOpenValue.addListener(({value}) => {
            this._currOpenValue = value;
            this.props.onDrawerSlide && this.props.onDrawerSlide();
        });
        // gesture
        this._panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder.bind(this),
            onPanResponderGrant: this._handlePanResponderGrant.bind(this),
            onPanResponderMove: this._handlePanResponderMove.bind(this),
            onPanResponderTerminationRequest: (event, gestureState) => true,
            onPanResponderRelease: this._handlePanResponderEnd.bind(this),
            onPanResponderTerminate: (event, gestureState) => { }
        });
    }

    render () {
        let { animOpenValue } = this.state;
        let { drawerPosition, drawerWidth } = this.props;
        let dynamicDrawerStyles = {};
        dynamicDrawerStyles[drawerPosition] = 0;
        dynamicDrawerStyles.width = drawerWidth;

        /* Drawer styles */
        let outputRange;

        if (drawerPosition === 'left') {
            outputRange = [-drawerWidth, 0];
        } else {
            outputRange = [drawerWidth, 0];
        }

        let drawerTranslateX = animOpenValue.interpolate({
            inputRange: [0, 1],
            outputRange,
            extrapolate: 'clamp',
        });
        let animatedDrawerStyles = {transform: [{translateX: drawerTranslateX}]};

        /* Overlay styles */
        let opacityOutputRange;

        let overlayOpacity = animOpenValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.7],
            extrapolate: 'clamp',
        });
        let animatedOverlayStyles = {opacity: overlayOpacity};

        return (
            <View style={styles.wrapper} {...this._panResponder.panHandlers}>
                <Animated.View style={styles.main}>
                    {this.props.children}
                </Animated.View>
                <TouchableWithoutFeedback onPress={this._onOverlayClick.bind(this)}>
                    <Animated.View style={[styles.overlay, animatedOverlayStyles]} pointerEvents="none">
                    </Animated.View>
                </TouchableWithoutFeedback>
                <Animated.View style={[styles.drawer, dynamicDrawerStyles, animatedDrawerStyles]}>
                    {this.props.renderNavigationView()}
                </Animated.View>
            </View>
        );
    }

    openDrawer (options = {}) {
        this._emitStateChanged(SETTLING);
        Animated.spring(this.state.animOpenValue, {toValue: 1, bounciness: 0, restSpeedThreshold: 0.1, ...options}).start(() => {
            this.props.onDrawerOpen && this.props.onDrawerOpen();
            this._emitStateChanged(IDLE);
        });
    }
    closeDrawer (options = {}) {
        this._emitStateChanged(SETTLING);
        Animated.spring(this.state.animOpenValue, {toValue: 0, bounciness: 0, restSpeedThreshold: 1, ...options}).start(() => {
            this.props.onDrawerClose && this.props.onDrawerClose();
            this._emitStateChanged(IDLE);
        });
    }

    _onOverlayClick () {
        this.closeDrawer();
    }

    _getOpenValueForX (x) {
        let { drawerPosition, drawerWidth } = this.props;
        if (drawerPosition === 'left') {
            return x / drawerWidth;
        } else {
            return (DEVICE_WIDTH - x) / drawerWidth;
        }
    }

    /**
     * 对外触发事件
     * @param newState
     * @private
     */
    _emitStateChanged (newState) {
        this.props.onDrawerStateChanged && this.props.onDrawerStateChanged(newState);
    }

    /**
     * handle event
     * gestureState 对象说明
     * stateID - 触摸状态的ID。在屏幕上有touch的情况下，这个ID会一直有效。
     * moveX - 最近一次移动时的屏幕坐标
     * moveY - 最近一次移动时的屏幕坐标
     * x0 - 当响应器产生的时候的屏幕坐标
     * y0 - 当响应器产生的时候的屏幕坐标
     * dx - 从触摸操作开始的总累计路程
     * dy - 从触摸操作开始的总累计路程
     * vx - 当前的移动速度
     * vy - 当前的移动速度
     */

    _handleMoveShouldSetPanResponder (event, {moveX, dx, dy}) {
        let { drawerPosition } = this.props;
        if (drawerPosition === 'left') {
            let overlayArea = DEVICE_WIDTH - (DEVICE_WIDTH - this.props.drawerWidth);
            if (this._currOpenValue === 1) {
                if ((dx < 0 && (Math.abs(dx) > (Math.abs(dy) * 3))) || (moveX > overlayArea)) {
                    this._isClosing = true;
                    this._closingAnchorValue = this._getOpenValueForX(moveX);
                    return true;
                }
            } else {
                if (moveX <= 35 && dx > 0) {
                    this._isClosing = false;
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            let overlayArea = DEVICE_WIDTH - this.props.drawerWidth;
            if (this._currOpenValue === 1) {
                if ((dx > 0 && (Math.abs(dx) > (Math.abs(dy) * 3))) || (moveX < overlayArea)) {
                    this._isClosing = true;
                    this._closingAnchorValue = this._getOpenValueForX(moveX);
                    return true;
                }
            } else {
                if (moveX >= DEVICE_WIDTH - 35 && dx < 0) {
                    this._isClosing = false;
                    return true;
                } else {
                    return false;
                }
            }
        }
    }

    _handlePanResponderGrant (event) {
        this._emitStateChanged(DRAGGING);
    }

    _handlePanResponderMove (event, {moveX}) {
        let openValue = this._getOpenValueForX(moveX);
        if (this._isClosing) {
            openValue = 1 - (this._closingAnchorValue - openValue);
        }

        if (openValue > 1) {
            openValue = 1;
        } else if (openValue < 0) {
            openValue = 0;
        }
        this.state.animOpenValue.setValue(openValue);
    }

    _handlePanResponderEnd (event, {moveX, vx}) {
        let { drawerPosition } = this.props;
        let { animOpenValue } = this.state;
        let previouslyOpen = this._isClosing;
        let isWithinVelocityThreshold = vx < VX_MAX && vx > -VX_MAX;
        if (drawerPosition === 'left') {
            if ((vx > 0 && moveX > THRESHOLD) || (vx >= VX_MAX)
                || isWithinVelocityThreshold && previouslyOpen && moveX < THRESHOLD) {
                this.openDrawer();
            } else if ((vx < 0 && moveX < THRESHOLD) || (vx < -VX_MAX) || isWithinVelocityThreshold && !previouslyOpen) {
                this.closeDrawer();
            } else if (previouslyOpen) {
                this.openDrawer();
            } else {
                this.closeDrawer();
            }
        } else {
            if ((vx < 0 && moveX < THRESHOLD) || (vx <= -VX_MAX)
                || isWithinVelocityThreshold && previouslyOpen && moveX < THRESHOLD) {
                this.openDrawer();
            } else if ((vx > 0 && moveX > THRESHOLD) || (vx > VX_MAX) || isWithinVelocityThreshold && !previouslyOpen) {
                this.closeDrawer();
            } else if (previouslyOpen) {
                this.openDrawer();
            } else {
                this.closeDrawer();
            }
        }
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    drawer: {
        position: 'absolute',
        top: 0,
        bottom: 0
    },
    main: {
        flex: 1
    },
    overlay: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    }
});