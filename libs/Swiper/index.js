/**
 * Created by ray on 15/12/14.
 */
'use strict';

import React from 'react-native';

let {
    Animated,
    Component,
    Dimensions,
    PropTypes,
    PanResponder,
    View
} = React;

// 屏幕总宽度
const DEVICE_WIDTH = parseInt(Dimensions.get('window').width);

export default class Swiper extends Component {
    static defaultProps = {
        index: 0,
        onPageChanged: () => {}
    };

    static propTypes = {
        children: PropTypes.node.isRequired,
        index: PropTypes.number,
        onPageChanged: PropTypes.func
    };

    constructor (props, context) {
        super(props, context);
        this.state = {
            index: props.index,
            scrollValue: new Animated.Value(0),
            viewWidth: DEVICE_WIDTH
        }
    }

    componentWillMount () {
        // gesture
        this._panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder.bind(this),
            onPanResponderMove: this._handlePanResponderMove.bind(this),
            onPanResponderTerminationRequest: (event, gestureState) => true,
            onPanResponderRelease: this._handlePanResponderEnd.bind(this),
            onPanResponderTerminate: (event, gestureState) => { }
        });
    }

    render () {
        let scenes = React.Children.map(this.props.children, (child) => {
            return React.cloneElement(child, {style: [child.props.style]});
        });
        let translateX = this.state.scrollValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -this.state.viewWidth]
        });
        let sceneContainerStyle = {
            width: this.state.viewWidth * this.props.children.length,
            flex: 1,
            height: 100,
            flexDirection: 'row'
        };
        return (
            <View style={[this.props.style]} onLayout={this._handleLayout.bind(this)} >
                <Animated.View
                    {...this._panResponder.panHandlers}
                    style={[sceneContainerStyle, {transform: [{translateX}]}]}
                    >
                    {scenes}
                </Animated.View>
            </View>
        );
    }

    /**
     * 跳转
     * @param index 位置索引
     * @private
     */
    _gotoScene (index) {
        // console.log(index);
        // Don't scroll outside
        index = Math.max(0, Math.min(index, this.props.children.length -1));
        this.setState({
            index: index
        });
        Animated.spring(this.state.scrollValue, {toValue: index, friction: this.props.springFriction, tension: this.props.springTension}).start(() => {

        });
    }

    _handleLayout (event) {
        let { width } = event.nativeEvent.layout;
        if (width) {
            this.setState({ viewWidth: width});
        }
    }

    /**
     * Handle event
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
        if (Math.abs(dx) > Math.abs(dy)) {
            return true;
        }
    }

    _handlePanResponderMove (event, {dx}) {
        let offsetX = -dx / this.state.viewWidth + this.state.index;
        this.state.scrollValue.setValue(offsetX);
    }

    _handlePanResponderEnd (event, {dx, dy, vx, vy}) {
        let relativeGestureDistance = dx / this.state.viewWidth;
        let newIndex = this.state.index;
        if (relativeGestureDistance < -0.5 || (relativeGestureDistance < 0 && vx <= -0.5)) {
            newIndex++;
        } else if (relativeGestureDistance > 0.5 || (relativeGestureDistance > 0 && vx >= 0.5)) {
            newIndex--;
        }
        this._gotoScene(newIndex);
    }
}