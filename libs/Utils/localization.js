/**
 * Created by ray on 16/2/4.
 */
'use strict';
import LocalizedStrings from 'react-native-localization';

//
export const BASE_LABEL_STR = new LocalizedStrings({
    en: {
        WEEK_HEADINGS: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        USERNAME: 'Username',
        PASSWORD: 'Password',
        LOGIN: 'Login',
        SEARCH_HOLD: 'search'
    },
    zh: {
        WEEK_HEADINGS: ['一', '二', '三', '四', '五', '六', '日'],
        USERNAME: '用户名',
        PASSWORD: '密码',
        LOGIN: '登录',
        SEARCH_HOLD: '内容搜索'
    }
});

export const MSG_STR = new LocalizedStrings({
    en: {
        NO_NEWS: 'No news'
    },
    zh: {
        NO_NEWS: '没有新闻'
    }
});