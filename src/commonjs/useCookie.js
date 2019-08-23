export default class useCookie {

    // 设置cookie expires为过期时间,这里为天
    setCookie(uname, uvalue, times) {
        var date = new Date();
        date.setDate( date.getDate() + times );
        document.cookie = uname + '=' + uvalue + '; expires=' + date;
    }

    // 获取cookie的name和value
    getCookie( uname ) {
        // 用分号空格来分隔cookie
        var cookies = document.cookie.split('; ')
        for(var i = 0; i < cookies.length; i++) {
            var uncookies = cookies[i].split('=');
            if( uname === uncookies[0] )
                return uncookies[1];
        }
        return 'undifeind'
    }

    // 删除cookie  就是将时间设置为过去
    delCookie( uname ) {
        this.setCookie( uname, '', -1 )
    }

}