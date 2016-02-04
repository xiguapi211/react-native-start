/**
 * Created by ray on 15/12/16.
 * 日历选择组建
 */
'use strict';

import React from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

let {
    Dimensions,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    PropTypes,
    PixelRatio,
    StyleSheet
} = React;

import {BASE_LABEL_STR} from '../Utils/localization';

import moment from 'moment';
import _ from 'lodash';

const MAX_COLUMNS = 7;
const MAX_ROWS = 7;
const DEVICE_WIDTH = parseInt(Dimensions.get('window').width);
const VIEW_INDEX = 1;

let Day = React.createClass({
    propTypes: {
        newDay: PropTypes.object,
        isToday: PropTypes.bool,
        isSelected: PropTypes.bool,
        currentDay: PropTypes.number,
        filler: PropTypes.bool,
        customStyle: PropTypes.object,
        onPress: PropTypes.func
    },
    getDefaultProps () {
        return {
            customStyle: {},
        }
    },
    _getDayFillerStyle (isToday, isSelected) {
        var dayStyle = [styles.dayCircleFiller];
        if (isToday) {
            dayStyle.push(styles.currentDayCircle);
            if (this.props.customStyle.currentDayCircle) {
                dayStyle.push(this.props.customStyle.currentDayCircle);
            }
        }
        if (isSelected) {
            dayStyle.push(styles.selectedDayCircle);
            if (this.props.customStyle.selectedDayCircle) {
                dayStyle.push(this.props.customStyle.selectedDayCircle);
            }
        }
        return dayStyle;
    },
    _getDayTextStyle (isToday, isSelected) {
        var dayTextStyle = [styles.day, this.props.customStyle.day];
        if (isToday) {
            dayTextStyle.push(styles.currentDayText);
            if (this.props.customStyle.currentDayText) {
                dayTextStyle.push(this.props.customStyle.currentDayText);
            }
        }
        if (isSelected) {
            dayTextStyle.push(styles.selectedDayText);
            if (this.props.customStyle.selectedDayText) {
                dayTextStyle.push(this.props.customStyle.selectedDayText);
            }
        }
        return dayTextStyle;
    },
    render: function () {
        let { newDay, currentDay, isToday, isSelected, filler } = this.props;
        if (filler) {
            return (
                <View style={[styles.dayButtonFiller, this.props.customStyle.dayButtonFiller]}>
                    <Text style={[styles.day, this.props.customStyle.day]}></Text>
                </View>
            );
        } else {
            return (
                <TouchableOpacity onPress={() => this.props.onPress(newDay)}>
                    <View style={[styles.dayButton, this.props.customStyle.dayButton]}>
                        <View style={this._getDayFillerStyle(isToday, isSelected)}>
                            <Text style={this._getDayTextStyle(isToday, isSelected)}>{currentDay + 1}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }
    }
});

export default class Calendar extends React.Component {
    static propTypes = {
        scrollEnabled: PropTypes.bool,
        showControls: PropTypes.bool,
        prevButtonText: PropTypes.string,
        nextButtonText: PropTypes.string,
        titleFormat: PropTypes.string,
        weekHeadings: PropTypes.array,
        startDate: PropTypes.string,
        selectedDate: PropTypes.string,
        customStyle: PropTypes.object,
        onTouchPrev: PropTypes.func,
        onTouchNext: PropTypes.func,
        onDateSelected: PropTypes.func
    };

    static defaultProps = {
        scrollEnabled: false,
        showControls: true,
        prevButtonText: 'Prev',
        nextButtonText: 'Next',
        titleFormat: 'YYYY MM',
        weekHeadings: BASE_LABEL_STR.WEEK_HEADINGS,
        startDate: moment().format('YYYY-MM-DD'),
        customStyle: {}
    };

    constructor (props, context) {
        super(props, context);
        this.state = {
            calendarDates: this._getInitStack(),    // 堆栈中存在的月
            selectedDate: moment(this.props.selectedDate).format(),
            currentMonth: moment(this.props.startDate).format()
        }
    }

    componentWillMount () {
        this.renderedMonths = [];
    }

    componentDidMount () {
        this._scrollToCalendar(VIEW_INDEX);
    }

    _onPrev () {
        this._prependMonth();
        this._scrollToCalendar(VIEW_INDEX);
    }

    _onNext () {
        this._appendMonth();
        this._scrollToCalendar(VIEW_INDEX);
    }

    _onPressDate (date) {
        this.setState({
            selectedDate: date,
        });
    }

    _onScrollEnd (event) {
        var position = event.nativeEvent.contentOffset.x;
        var currItem = position / DEVICE_WIDTH;

        if (currItem < VIEW_INDEX) {
            this._prependMonth();
            this._scrollToCalendar(VIEW_INDEX);
        } else {
            this._appendMonth();
            this._scrollToCalendar(VIEW_INDEX);
        }
    }

    _scrollToCalendar (itemIndex) {
        let scrollX = itemIndex * DEVICE_WIDTH;
        if (this.props.scrollEnabled) {
            this.refs.calendar.scrollWithoutAnimationTo(0, scrollX);
        }
    }

    // 向前添加一月
    _prependMonth () {
        var calendarDates = this.state.calendarDates;
        calendarDates.unshift(moment(calendarDates[0]).subtract(1, 'month').format());
        calendarDates.pop();
        this.setState({
            calendarDates: calendarDates,
            currentMonth: calendarDates[this.props.scrollEnabled ? VIEW_INDEX : 0]
        });
    }

    // 向后添加一月
    _appendMonth () {
        var calendarDates = this.state.calendarDates;
        calendarDates.push(moment(calendarDates[calendarDates.length - 1]).add(1, 'month').format());
        calendarDates.shift();  // 去掉最前一月
        this.setState({
            calendarDates: calendarDates,
            currentMonth: calendarDates[this.props.scrollEnabled ? VIEW_INDEX : 0]
        });
    }

    renderTopBar () {
        let title = moment(this.state.currentMonth).format(this.props.titleFormat);
        if (this.props.showControls) {
            return (
                <View style={[styles.calendarControls, this.props.customStyle.calendarControls]}>
                    <TouchableOpacity style={[styles.controlButton, this.props.customStyle.controlButton]} onPress={this._onPrev.bind(this)}>
                        <Icon name="chevron-left" size={30} style={[styles.controlButtonIcon, this.props.customStyle.controlButtonIcon]} />
                    </TouchableOpacity>
                    <Text style={[styles.title, this.props.customStyle.title]}>
                        {title}
                    </Text>
                    <TouchableOpacity style={[styles.controlButton, this.props.customStyle.controlButton]} onPress={this._onNext.bind(this)}>
                        <Icon name="chevron-right" size={30} style={[styles.controlButtonIcon, this.props.customStyle.controlButtonIcon]} />
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <View style={[styles.calendarControls, this.props.customStyle.calendarControls]}>
                    <Text>{title}</Text>
                </View>
            );
        }
    }

    renderHeading () {
        let { weekHeadings } = this.props;
        return (
            <View style={[styles.heading, this.props.customStyle.heading]}>
                { weekHeadings.map((w, i) => {
                    return <Text key={i} style={ i > 4 ? [styles.weekendHeading, this.props.customStyle.weekendHeading] : [styles.dayHeading, this.props.customStyle.dayHeading]}>{w}</Text>
                })}
            </View>
        );
    }

    renderMonthView (date) {
        // 当月第一日期
        let dayStart = moment(date).startOf('month').format();
        // 当月总天数
        let daysInMonth = moment(dayStart).daysInMonth();
        // 表格展示\周日第一列的时候,第一天左侧需要的补白数（如果周一是第一列,减一）
        let offset = moment(dayStart).get('day') - 1;
        //
        let currentDay = 0, preFiller = 0;
        let renderedMonthView = null;
        //
        let weekRows = [];
        for (var i = 0; i < MAX_ROWS; i++) {
            var days = [];
            for (var j = 0; j < MAX_COLUMNS; j++) {
                if (preFiller < offset) {
                    // 前补白
                    days.push(<Day key={`${i},${j}`} filler={true} style={styles.dayButton} />);
                } else {
                    var newDay = moment(dayStart).set('date', currentDay + 1);
                    var isToday = (moment().isSame(newDay, 'month') && moment().isSame(newDay, 'day'));
                    var isSelected = (moment(this.state.selectedDate).isSame(newDay, 'month') && moment(this.state.selectedDate).isSame(newDay, 'day'));
                    if (currentDay < daysInMonth) {
                        days.push(
                            <Day
                                key={`${i},${j}`}
                                onPress={this._onPressDate.bind(this)}
                                newDay={newDay}
                                currentDay={currentDay}
                                isToday={isToday}
                                isSelected={isSelected}
                                filler={false}
                                customStyle={this.props.customStyle}
                            />
                        );
                    }
                    currentDay++;
                }
                preFiller++;
            }
            if (days.length > 0 && days.length < 7) {
                // 后补白
                for (var x = days.length; x < 7; x++) {
                    days.push(<Day key={x} filler={true} style={styles.dayButton} />);
                }
            }
            weekRows.push(<View key={weekRows.length} style={[styles.weekRow, this.props.customStyle.weekRow]}>{days}</View>);
        }
        renderedMonthView = <View key={moment(newDay).month()} style={styles.monthContainer}>{weekRows}</View>;
        this.renderedMonths.push([date, renderedMonthView]);
        return renderedMonthView;
    }

    renderMonth (date) {
        let renderedMonth = null;
        renderedMonth = this.renderMonthView(date);
        return renderedMonth;
    }

    render () {
        return (
            <View style={[styles.calendarContainer, this.props.customStyle.calendarContainer]}>
                {this.renderTopBar()}
                {this.renderHeading()}
                {this.props.scrollEnabled ?
                    <ScrollView
                        ref='calendar'
                        horizontal={true}
                        scrollEnabled={true}
                        pagingEnabled={true}
                        removeClippedSubviews={true}
                        scrollEventThrottle={600}
                        showsHorizontalScrollIndicator={false}
                        automaticallyAdjustContentInsets={false}
                        onMomentumScrollEnd={(event) => this._onScrollEnd(event)}
                    >
                        {this.state.calendarDates.map((date) => { return this.renderMonth(date) })}
                    </ScrollView>
                    :
                    <View ref="calendar">
                        {this.state.calendarDates.map((date) => { return this.renderMonth(date) })}
                    </View>
                }
            </View>
        );
    }

    _getInitStack () {
        let _stack = [];
        let { startDate } = this.props;
        if (this.props.scrollEnabled) {
            _stack.push(moment(startDate).subtract(1, 'month').format());
            _stack.push(moment(startDate).format());
            _stack.push(moment(startDate).add(1, 'month').format());
        } else {
            _stack.push(moment(startDate).format())
        }
        return _stack;
    }
}

let styles = StyleSheet.create({
    calendarContainer: {
        flex: 1,
        backgroundColor: '#f7f7f7'
    },
    calendarControls: {
        height: 36,
        flexDirection: 'row'
    },
    controlButton: {
    },
    controlButtonText: {
        fontSize: 15,
        color: '#333'
    },
    controlButtonIcon: {
        fontSize: 30,
        color: '#333'
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16
    },
    heading: {
        height: 36,
        flexDirection: 'row',
        borderTopWidth: 1 / PixelRatio.get(),
        borderBottomWidth: 1 / PixelRatio.get(),
        borderTopColor: '#dcdcdc',
        borderBottomColor: '#dcdcdc',
        justifyContent: 'space-around'
    },
    dayHeading: {
        fontSize: 15,
        textAlign: 'center',
        paddingVertical: 5
    },
    weekendHeading: {
        fontSize: 15,
        textAlign: 'center',
        paddingVertical: 5,
        color: 'red'
    },
    monthContainer: {
        width: DEVICE_WIDTH
    },
    weekRow: {
        flexDirection: 'row',
    },
    dayButton: {
        alignItems: 'center',
        padding: 5,
        width: DEVICE_WIDTH / 7,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#ccc'
    },
    dayButtonFiller: {
        padding: 5,
        width: DEVICE_WIDTH / 7
    },
    dayCircleFiller: {
        justifyContent: 'center',
        backgroundColor: 'transparent',
        width: 28,
        height: 28,
        borderRadius: 14
    },
    currentDayCircle: {
        backgroundColor: '#343434'
    },
    currentDayText: {
        color: 'white'
    },
    selectedDayCircle: {
        backgroundColor: 'red'
    },
    selectedDayText: {
        color: 'white',
        fontWeight: 'bold'
    },
    day: {
        fontSize: 16,
        alignSelf: 'center'
    }
});