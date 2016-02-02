/**
 * Created by ray on 15/12/16.
 * 日历选择组建
 */
'use strict';

import React from 'react-native';

let {
    Dimensions,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    PropTypes,
    StyleSheet
    } = React;

import moment from 'moment';
import _ from 'lodash';

const MAX_COLUMNS = 7;
const MAX_ROWS = 7;
const DEVICE_WIDTH = parseInt(Dimensions.get('window').width);

let Day = React.createClass({
    propTypes: {
        currentDay: PropTypes.number,
        filler: PropTypes.bool,
        customStyle: PropTypes.object
    },
    getDefaultProps () {
        return {
            customStyle: {},
        }
    },
    render: function () {
        let { currentDay, filler } = this.props;
        if (filler) {
            return (
                <View style={[styles.dayButtonFiller, this.props.customStyle.dayButtonFiller]}>
                    <Text style={[styles.day, this.props.customStyle.day]}></Text>
                </View>
            );
        } else {
            return (
                <TouchableOpacity>
                    <View style={[styles.dayButton, this.props.customStyle.dayButton]}>
                        <Text>{currentDay + 1}</Text>
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
        customStyle: PropTypes.object,
        onTouchPrev: PropTypes.func,
        onTouchNext: PropTypes.func
    };

    static defaultProps = {
        scrollEnabled: false,
        showControls: true,
        prevButtonText: 'Prev',
        nextButtonText: 'Next',
        titleFormat: 'YYYY MM',
        weekHeadings: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        startDate: moment().format('YYYY-MM-DD'),
        customStyle: {}
    };

    constructor (props, context) {
        super(props, context);
        this.state = {
            calendarDates: this._getInitStack(),
            currentMonth: moment(this.props.startDate).format()
        }
    }

    componentWillMount () {
        this.renderedMonths = [];
    }

    componentDidMount () {

    }

    renderTopBar () {
        let title = moment(this.state.currentMonth).format(this.props.titleFormat);
        if (this.props.showControls) {
            return (
                <View style={[styles.calendarControls, this.props.customStyle.calendarControls]}>
                    <TouchableOpacity style={[styles.controlButton, this.props.customStyle.controlButton]} onPress={this._onPrev}>
                        <Text style={[styles.controlButtonText, this.props.customStyle.controlButtonText]}>{this.props.prevButtonText}</Text>
                    </TouchableOpacity>
                    <Text style={[styles.title, this.props.customStyle.title]}>
                        {title}
                    </Text>
                    <TouchableOpacity style={[styles.controlButton, this.props.customStyle.controlButton]} onPress={this._onNext}>
                        <Text style={[styles.controlButtonText, this.props.customStyle.controlButtonText]}>{this.props.nextButtonText}</Text>
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
                    if (currentDay < daysInMonth) {
                        days.push(
                            <Day
                                key={`${i},${j}`}
                                style={styles.dayButton}
                                currentDay={currentDay}
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
                    <ScrollView>
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
            _stack.push(moment(startDate).subtract(2, 'month').format());
            _stack.push(moment(startDate).subtract(1, 'month').format());
            _stack.push(moment(startDate).format());
            _stack.push(moment(startDate).add(1, 'month').format());
            _stack.push(moment(startDate).add(2, 'month').format());
        } else {
            _stack.push(moment(startDate).format())
        }
        console.log('_stack', _stack);
        return _stack;
    }
}

let styles = StyleSheet.create({
    calendarContainer: {
        flex: 1,
        backgroundColor: '#f7f7f7'
    },
    calendarControls: {
        height: 40,
        flexDirection: 'row'
    },
    controlButton: {
    },
    controlButtonText: {
        fontSize: 15
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 15
    },
    heading: {
        height: 40,
        flexDirection: 'row',
        borderTopWidth: 1,
        borderBottomWidth: 1,
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
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    dayButtonFiller: {
        padding: 5,
        width: DEVICE_WIDTH / 7
    },
    day: {
        fontSize: 16,
        alignSelf: 'center',
    }
});