/**
 * Created by ray on 16/2/5.
 */
'use strict';

import React from 'react-native';

let {
    View,
    Text,
    Image,
    TouchableHighlight,
    StyleSheet
} = React;

let NewsCell = React.createClass({
    render () {
        let Img = this.props.obj.picUrl === '' ? null :
            <Image
                source={{uri: this.props.obj.picUrl}}
                style={styles.cellImage}
            />;
        return (
            <View>
                <TouchableHighlight
                    onPress={this.props.onSelectRow}>
                    <View style={styles.row}>
                        {Img}
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{this.props.obj.title}</Text>
                            <Text style={styles.description}>{this.props.obj.description}</Text>
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    row: {
        alignItems: 'center',
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: 5
    },
    textContainer: {
        flex: 1
    },
    cellImage: {
        backgroundColor: '#dcdcdc',
        height: 80,
        marginRight: 10,
        width: 110
    },
    title: {
        flex: 1,
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 1
    },
    description: {
        fontSize: 12,
        color: '#333333'
    }
});

export default NewsCell;