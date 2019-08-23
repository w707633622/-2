// 使用失败,直接放到页面中使用,不进行引用
import axios from "axios";
import CryptoJS from "crypto-js";

export default class getAliyunSts {
    // 配置axios请求参数
    getAliyunSts(UserId, Token) {
        var requestdata = {
            userId: UserId,
            token: Token
        }

        // console.log(JSON.stringify(requestdata))
        // console.log(CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(requestdata) )))

        // axios.get('/azyz/system/getAliyunToken', { // 开发
        axios.get('http://106.15.196.78:8080/azyz/system/getAliyunToken', { // 上线
            params: {
                requestdata: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(requestdata)))
            }
        })
        .then(
            // (res) => { console.log(res) }
            (res) => {
                console.log(res)
                if ("获取成功" === res.data.message) {
                   return res.data;
                }
            }
        )
        .catch(e => e)
    }

}