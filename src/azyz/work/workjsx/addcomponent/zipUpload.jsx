import React from "react";
import { Upload, Icon, message, Row, Col, Progress } from 'antd';
import OSS from "ali-oss";

class ZipUpload extends React.Component {
    constructor() {
        super();
        this.state = {
            isZip: null, // 是否为rar或者zip
            isShow: null,
            isDisabled: null,
            previewVisible: false,
            previewImage: '',
            fileList: [],

            codeLength: 0,	// 源码大小
            codeUrl: "",	 // 源码下载地址

            uploadPercent: 0,
        };
    }

    beforeUpload = (file) => {
        // console.log(file)
        const fileName = file.name;
        const re = /^.+\.rar|.+\.zip$/;   // 判断文件类型是否为.rar .zip
        if( re.test(fileName) ) {
            console.log( "是rar或zip" );
            this.setState({
                fileList: [...this.state.fileList, file],
                isZip: true,
                isShow: true,
              });
        } else {
            message.error(`${file.name} 不是是rar或zip.`);
            this.setState({
                fileList: [],
                isZip: false,
                isShow: false,
            });
        }
        return false;
    }

    shouldComponentUpdate(nextProps, nextState) {
        var re = /^(.+\.aliyuncs.com\/)(.+\.(rar|zip))$/;  // 截取姓名 -----.rar
        if (nextProps.myProInfo !== this.props.myProInfo && "/work/edit" === nextProps.location.pathname ) {
            if (nextProps.myProInfo.demo ) {
                this.setState({
                    isShow: true,
                    uploadPercent: 100,
                    codeLength: nextProps.myProInfo.demo.codeLength,
                    codeUrl: nextProps.myProInfo.demo.codeUrl,
                    fileList: [{
                        uid: nextProps.myProInfo.demo.demoId,
                        name: nextProps.myProInfo.demo.codeUrl.replace(re, ($0, $1, $2) => { return $2 } ),
                        status: 'done',
                        response: 'Server Error 500', // custom error message to show
                        url: nextProps.myProInfo.demo.codeUrl,
                    },],
                }, () => { this.props.zipUploadInfo(this.state) })
            }
        }
        if (nextProps.myProInfo !== this.props.myProInfo && "/work/add" === nextProps.location.pathname ) { // 从编辑切换到add时 清空
            this.setState({
                isShow: true,
                codeLength: 0,
                codeUrl: "",
                uploadPercent: 0,
                fileList: [],
            }, () => { this.props.zipUploadInfo(this.state) })
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

    render() {
 /*  拖拽上传资源信息 */
    const propsZip = {
        name: 'zipFile',
        accept: ".rar, .zip", // 点击文件链接时只显示.rar .zip文件
        multiple: false, // 不允许多文件上传
        disabled: this.state.isDisabled,  // 是否禁用
        showUploadList: this.state.isShow,
        fileList: this.state.fileList,
        onRemove: (file) => {
            this.setState((state) => {
                const index = state.fileList.indexOf(file);
                const newFileList = state.fileList.slice();
                newFileList.splice(index, 1);
                return {
                    isDisabled: false,  // 可用,可以点击链接
                    fileList: newFileList,
                    codeLength: 0,
                    codeUrl: "",

                    uploadPercent: 0,
                };
            }, () => { this.props.zipUploadInfo(this.state) });
            this.state.client.cancel(); // 暂停上传,如果没有断点保存,重新上传
        },
        onChange: (info) => {
            const fileName = info.file.name;
            const re = /^.+\.rar|.+\.zip$/;   // 判断文件类型是否为.rar .zip
            if (info.fileList.length <= 1) { // 防止拖拽两个以上
                if ( re.test(fileName) ) {
                    if (1 === info.fileList.length) { // 只能上传一个
                        this.setState({  // 第二个参数，在设置完信息后将信息传给父组件
                            codeLength: info.file.size,	// 源码大小
                            isDisabled: true  // 禁用
                        }, () => { this.props.zipUploadInfo(this.state) } );
                    } else {
                        this.setState({
                            codeLength: 0,
                            isDisabled: false
                        })
                    }

                /* 上传zip文件 */
                    const uploadFilename = info.file.name;
                    const uploadFile = info.file;
                    this.state.client.multipartUpload(uploadFilename, uploadFile, {
                        progress: (p) => {
                            this.setState({ uploadPercent: Math.round(p * 100) })
                        },
                    })
                        .then((result) => {
                            console.log(result);
                            const url = this.state.client.signatureUrl(uploadFilename); // 获取下载地址
                            var reg = /(.+)(\?)/; // 获取返回下载url的?号之前的地址,因为返回的url带有token等信息
                            this.setState({ codeUrl: url.match(reg)[1] }, () => { this.props.zipUploadInfo(this.state) })
                        })
                        .catch(function (err) {
                            console.log(err);
                        });
                /* 上传zip文件 */      
                }
            } else if (info.fileList.length === 2 && "/work/edit" === this.props.location.pathname) {  // edit页面再走一遍上传
                const newFileList = info.fileList;
                newFileList.splice(0, 1);
                this.setState((state) => {
                    return {
                        isDisabled: false,  // 可用,可以点击链接
                        fileList: newFileList,

                        uploadPercent: 0,
                    };
                }, () => { this.props.zipUploadInfo(this.state) });

                /* 上传zip文件 */
                const uploadFilename = info.file.name;
                const uploadFile = info.file;
                this.state.client.multipartUpload(uploadFilename, uploadFile, {
                    progress: (p) => {
                        this.setState({ uploadPercent: Math.round(p * 100) })
                    },
                })
                    .then((result) => {
                        console.log(result);
                        const url = this.state.client.signatureUrl(uploadFilename); // 获取下载地址
                        var reg = /(.+)(\?)/; // 获取返回下载url的?号之前的地址,因为返回的url带有token等信息
                        this.setState({ codeUrl: url.match(reg)[1] }, () => { this.props.zipUploadInfo(this.state) })
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
                /* 上传zip文件 */ 
            } else {
                this.setState({ 
                    showUploadList: false,
                    fileList: [],
                })
                message.error("只能拖拽上传一个压缩包");
            }
        },
    };
/*  拖拽上传资源信息 */

        return(
            /* 拖拽上传源码资源 */
            <Upload.Dragger {...propsZip} beforeUpload={this.beforeUpload}>
                <Row>
                    <Col span={12}>
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">上传源码压缩包(只能上传一个源码压缩包)</p>
                    </Col>
                    <Col span={4} offset={8}>
                        <Progress type="circle" percent={this.state.uploadPercent} width={80} />
                    </Col>
                </Row>
                <p className="ant-upload-hint" style={{ color: "#40a9ff" }}>拖拽或点击上传</p>
            </Upload.Dragger>
        )
    }
}

export default ZipUpload;