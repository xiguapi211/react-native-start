/**
 * Created by ray on 16/2/5.
 */
'use strict';

import React from 'react-native';

let {
    View,
    ListView,
    Text,
    PixelRatio,
    StyleSheet
} = React;

import NewsCell from './newsCell';
import WebViewScene from './webView';
import {NEWS_API} from './def';
import {MSG_STR} from '../libs/Utils/localization';

// 没有数据的时候的展示页面
let NoNewsView = React.createClass({
    render: function () {
        return (
            <View style={[styles.container, styles.centerText]}>
                <Text style={styles.noMessage}>{MSG_STR.NO_NEWS}</Text>
            </View>
        );
    }
});

let NewsScene = React.createClass({
    getInitialState: function () {
        return {
            isLoading: false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            })
        }
    },
    componentWillMount: function () {
        this.doFetchData();
    },
    doFetchData: function () {
        this.setState({
            isLoading: true
        });
        fetch(this._urlForQuery(), { headers: { 'apikey': NEWS_API.KEY } })
            .then((response) => response.json())
            .then((response) => {
                let list = [];
                if (response.code === 200) {
                    list = this._reviseData(response);
                }
                this.setState({
                    isLoading: false,
                    dataSource: this.state.dataSource.cloneWithRows(list)
                });
            })
            .done();
    },
    renderSeparator: function (sectionId, rowId) {
        return (
            <View style={styles.rowSeparator} key={`${sectionId},${rowId}`} />
        );
    },
    renderRow: function (news, sectionId, rowId) {
        return (
            <NewsCell
                key={`news_cell_${news.key}`}
                obj={news}
                onSelectRow={this.handler.onSelectNews.bind(this, news)}
            />
        );
    },
    render: function () {
        var contentView = this.state.dataSource.getRowCount() === 0 ?
            <NoNewsView />
            :
            <ListView
                key='news_list'
                dataSource={this.state.dataSource}
                renderSeparator={this.renderSeparator}
                renderRow={this.renderRow}
                />;
        return (
            <View style={styles.container}>
                {contentView}
            </View>
        );
    },
    _urlForQuery: function (num = 10, page = 1) {
        return NEWS_API.URL + '?num=' + num + '&page' + page;
    },
    _reviseData: function (data) {
        let list = [];
        for (var key in data) {
            if (!isNaN(parseInt(key))) {
                data[key].key = key;
                list.push(data[key]);
            }
        }
        return list;
    },
    // 事件处理函数
    handler: {
        onSelectNews: function (newsObj, event) {
            this.props.navigator.push({
                title: newsObj.title,
                component: WebViewScene,
                passProps: {url: newsObj.url},
            });
        }
    }
});

var styles = StyleSheet.create({
    container: {
        marginTop: 66,
        flex: 1,
        backgroundColor: 'white',
        padding: 4
    },
    centerText: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    noMessage: {
        fontSize: 16,
        color: '#888888'
    },
    rowSeparator: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        height: 1 / PixelRatio.get(),
        marginLeft: 4
    }
});

export default NewsScene;