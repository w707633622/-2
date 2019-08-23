import React from "react";
import { Upload, Icon, message, Row, Col, Progress } from 'antd';
import AppInfoParser from "app-info-parser";
import "../static/addcomponent/apkUpload.less";
import OSS from "ali-oss";

class ApkUpload extends React.Component {
    constructor() { // 避免将 props 的值复制给 state！这是一个常见的错误
        super();
        this.state = {
            uploadUrl: "",
            isShow: null,
            isDisabled: null,
            previewVisible: false,
            previewImage: '',
            defaultFileList: [],
            fileList: [],

            demoIcon: "",
            packageName: "",
            versionName: "",
            versionCode: 0,
            apkLength: 0,
            apkUrl: "",

            uploadPercent: 0,
        };
    }

    beforeUpload = (file) => { // 参数只能是上传的文件
        const fileName = file.name;
        const re = /^.+\.apk$/;   // 判断文件类型是否为..apk
        if ( re.test(fileName) ) {
            // console.log("这是apk");
            this.setState(state => ({
              fileList: [...state.fileList, file],
              isShow: true,
            }));
        }else {
            message.error(`${file.name} 不是apk.`);
            this.setState(state => ({
                fileList: [],
                isShow: false,
            }))
        }
        return false;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.myProInfo !== this.props.myProInfo && "/work/edit" === nextProps.location.pathname ) {
            if (nextProps.myProInfo.demo ) {
                this.setState({
                    isShow: true,
                    demoIcon: nextProps.myProInfo.demo.demoIcon,
                    packageName: nextProps.myProInfo.demo.packageName,
                    versionName: nextProps.myProInfo.demo.versionName,
                    versionCode: nextProps.myProInfo.demo.versionCode,
                    apkLength: nextProps.myProInfo.demo.apkLength,
                    apkUrl: nextProps.myProInfo.demo.apkUrl,
                    uploadPercent: 100,
                    fileList: [{
                        uid: nextProps.myProInfo.demo.demoId,
                        name: nextProps.myProInfo.demo.packageName,
                        status: 'done',
                        response: 'Server Error 500', // custom error message to show
                        url: nextProps.myProInfo.demo.apkUrl,
                    },],
                }, () => { this.props.apkUploadInfo(this.state) })
            }
        }
        if (nextProps.myProInfo !== this.props.myProInfo && "/work/add" === nextProps.location.pathname ) { // 从编辑切换到add时 清空
            this.setState({
                isShow: true,
                demoIcon: "",
                packageName: "",
                versionName: "",
                versionCode: 0,
                apkLength: 0,
                apkUrl: "",
                uploadPercent: 0,
                fileList: [],
            }, () => { this.props.apkUploadInfo(this.state) })
        }
        return true
    }


/* 更新后会被立即调用。首次渲染不会执行此方法。 */
    componentDidUpdate(prevProps) {
        // accessKeyId不同说明sts跟新了,重新建立client
        if (this.props.sts.accessKeyId !== prevProps.sts.accessKeyId && this.props.sts.accessKeyId !== "") {
            this.setState({
                client: new OSS({  // 实例化上传oss对象
                    region: 'oss-cn-beijing',
                    accessKeyId: this.props.sts.accessKeyId,
                    accessKeySecret: this.props.sts.accessKeySecret,
                    stsToken: this.props.sts.stsToken,
                    endpoint: 'oss-cn-beijing.aliyuncs.com',
                    bucket: 'ymw-resource'
                }),
            });
        }
    }

/* base64图转二进制 */
    dataURLtoBlob = (dataurl) => {
        var arr = dataurl.split(',');   //注意base64的最后面中括号和引号是不转译的                    
        var _arr = arr[1].substring(0,arr[1].length-2);
        var mime = arr[0].match(/:(.*?);/)[1],
        bstr =atob(_arr),
        n = bstr.length,
        u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {
            type: mime
        });
    }


render() {
    /* 上传apk信息 */
    const propsApk = {
        name: 'apkFile',
        accept: ".apk", // 点击文件链接时只显示.apk文件
        multiple: false, // 是否支持多选文件
        disabled: this.state.isDisabled,  // 是否禁用
        showUploadList: this.state.isShow,
        defaultFileList: this.state.defaultFileList, // 默认已经上传的文件列表
        fileList: this.state.fileList,
        onRemove: (file) => {  // 点击移除文件时的回调
            this.setState((state) => {
                const index = state.fileList.indexOf(file);
                const newFileList = state.fileList.slice();
                newFileList.splice(index, 1);
                return {
                    isDisabled: false,  // 可用,可以点击链接
                    fileList: newFileList,
                    demoIcon: "",
                    packageName: "",
                    versionName: "",
                    versionCode: 0,
                    apkLength: 0,
                    apkUrl: "",

                    uploadPercent: 0,
                };
            }, () => { this.props.apkUploadInfo(this.state) } );
            this.state.client.cancel(); // 暂停上传,如果没有断点保存,重新上传
        },
        onChange: (info) => {  // upload上传文件改变时的状态
            const fileName = info.file.name;
            const re = /^.+\.apk$/;   // 判断文件类型是否为.apk

            if (info.fileList.length <= 1) { // 防止拖拽两个以上
                if (re.test(fileName)) {
                    if (1 === info.fileList.length) { // 只能上传一个apk文件
                        this.setState({
                            isDisabled: true  // 禁用
                        })
                    } else {
                        this.setState({
                            isDisabled: false
                        })
                    }
                /* 读取apk信息上传icon图标 */
                    const parser = new AppInfoParser(info.file)
                    parser.parse()
                    .then(result => {
                        // console.log('app info ----> ', result)
                        var reg = /(data:image\/)(.+)(;)/; // 截取data:image/png中的png

                        const uploadFilename = result.package + "." + result.icon.match(reg)[2]; 
                        const uploadFile = this.dataURLtoBlob(result.icon);  // 将图标base64转为Blob
                        try {
                            this.state.client.multipartUpload(uploadFilename, uploadFile)
                            .then(() => {
                                const url = this.state.client.signatureUrl(uploadFilename); 
                                console.log(url)
                                var reg = /(.+)(\?)/; // 获取返回下载url的?号之前的地址,因为返回的url带有token等信息
                                this.setState({  // 第二个参数，在设置完信息后将信息传给父组件
                                    demoIcon: url.match(reg)[1],
                                    packageName: info.file.name,
                                    versionName: result.versionName,
                                    versionCode: result.versionCode,
                                    apkLength: info.file.size,
                                }, () => { this.props.apkUploadInfo(this.state)});
                            })
                            .catch(function (err) {
                                console.log(err);
                            });
                        } catch (e) {
                            console.log(e);
                        }
                    }).catch(err => {
                        console.log('err ----> ', err)
                    });
                /* 读取apk信息上传icon图标 */

                /* 上传apk文件 */
                    const uploadFilename = info.file.name; // oss上传时 multipartUpload 参数 'object-key'
                    const uploadFile = info.file;  // oss上传时 multipartUpload 参数
                    this.state.client.multipartUpload(uploadFilename, uploadFile, {
                        progress: (p) => {
                            this.setState({ uploadPercent: Math.round(p * 100) })
                        },
                    })
                    .then( (result) => {
                        const url = this.state.client.signatureUrl(uploadFilename); // 获取下载地址
                        var reg = /(.+)(\?)/; // 获取返回下载url的?号之前的地址,因为返回的url带有token等信息
                        this.setState({ apkUrl: url.match(reg)[1] }, () => { this.props.apkUploadInfo(this.state) })
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
                /* 上传apk文件 */
                }
            } else if (info.fileList.length === 2 && "/work/edit" === this.props.location.pathname) {  // edit页面再走一遍读取上传
                const newFileList = info.fileList;
                newFileList.splice(0, 1);
                this.setState((state) => {
                    return {
                        isDisabled: false,  // 可用,可以点击链接
                        fileList: newFileList,

                        uploadPercent: 0,
                    };
                }, () => { this.props.apkUploadInfo(this.state) });

                /* 读取apk信息上传icon图标 */
                const parser = new AppInfoParser(info.file)
                parser.parse()
                .then(result => {
                    // console.log('app info ----> ', result)
                    var reg = /(data:image\/)(.+)(;)/; // 截取data:image/png中的png

                    const uploadFilename = result.package + "." + result.icon.match(reg)[2]; 
                    const uploadFile = this.dataURLtoBlob(result.icon);  // 将图标base64转为Blob
                    try {
                        this.state.client.multipartUpload(uploadFilename, uploadFile)
                        .then(() => {
                            const url = this.state.client.signatureUrl(uploadFilename); 
                            var reg = /(.+)(\?)/; // 获取返回下载url的?号之前的地址,因为返回的url带有token等信息
                            this.setState({  // 第二个参数，在设置完信息后将信息传给父组件
                                demoIcon: url.match(reg)[1],
                                packageName: info.file.name,
                                versionName: result.versionName,
                                versionCode: result.versionCode,
                                apkLength: info.file.size,
                            }, () => { this.props.apkUploadInfo(this.state)});
                        })
                        .catch(function (err) {
                            console.log(err);
                        });
                    } catch (e) {
                        console.log(e);
                    }
                }).catch(err => {
                    console.log('err ----> ', err)
                });
               /* 读取apk信息上传icon图标 */

                /* 上传apk文件 */
                const uploadFilename = info.file.name; // oss上传时 multipartUpload 参数 'object-key'
                const uploadFile = info.file;  // oss上传时 multipartUpload 参数
                this.state.client.multipartUpload(uploadFilename, uploadFile, {
                    progress: (p) => {
                        this.setState({ uploadPercent: Math.round(p * 100) })
                    },
                })
                .then( (result) => {
                    const url = this.state.client.signatureUrl(uploadFilename); // 获取下载地址
                    var reg = /(.+)(\?)/; // 获取返回下载url的?号之前的地址,因为返回的url带有token等信息
                    this.setState({ apkUrl: url.match(reg)[1] }, () => { this.props.apkUploadInfo(this.state) })
                })
                .catch(function (err) {
                    console.log(err);
                });
                /* 上传apk文件 */

            } else {
                this.setState({
                    showUploadList: false,
                    fileList: [],
                })
                message.error("只能拖拽上传一个apk");
            }
        },
    };
/* 上传apk信息 */

    return (
        <Upload.Dragger {...propsApk} beforeUpload={this.beforeUpload} >
            <Row>
                <Col span={4}>
                    <p className="ant-upload-drag-icon">
                        { this.state.demoIcon !=="" ? <img src={this.state.demoIcon} alt="图标" /> : <Icon type="plus-square" /> }
                    </p>
                </Col>
                <Col span={16} id="apkInfo">
                    <Row>
                        <Col className="ant-upload-drag-label" span={6}><span>项目名称:  </span></Col> <Col span={6}> {this.props.demoName} </Col>
                    </Row>
                    <Row>
                        <Col className="ant-upload-drag-label" span={6}><span>包名:</span></Col> <Col span={6}> {this.state.packageName} </Col>
                    </Row>
                    <Row>
                        <Col className="ant-upload-drag-label" span={6}><span>大小: </span></Col><Col span={6}>{(this.state.apkLength / 1024 / 1024).toFixed(2) + "M"}</Col>
                        <Col className="ant-upload-drag-label" span={6}><span>版本: </span></Col><Col span={6}>{this.state.versionName}</Col>
                    </Row>
                </Col>
                <Col apan={4}>
                    <Progress type="circle" percent={this.state.uploadPercent} width={80} />
                </Col>
            </Row>
            <p className="ant-upload-text" style={{ color: "#40a9ff"}}>上传apk(点击或拖拽上传)</p>
        </Upload.Dragger>
    )
}

}

export default ApkUpload