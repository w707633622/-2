import React, {Fragment} from 'react';
import { Form, Row, Upload, Icon, Modal, message } from 'antd';
import OSS from "ali-oss";
import '../static/addcomponent/screenShotUpload.less'

class ScreenShotUpload extends React.Component {
    constructor() {
        super();
        this.state = {
            previewVisible: false,
            previewImage: '',
            imageList: [], // 图片下载地址
            fileList: [],
        };
    }

    /* 点击遮罩层或右上角叉或取消按钮的回调 */
    modalHandleCancel = () => {
        this.setState({
            previewVisible: false
        });
    }

    beforeUpload = (file) => {
        return false;
    }

    shouldComponentUpdate(nextProps, nextState) {
        var re = /^(.+\.aliyuncs.com\/)(.+\.(jpg|gif|png))$/;  // 截取姓名 -----.jgp
        if (nextProps.myProInfo !== this.props.myProInfo && "/work/edit" === nextProps.location.pathname ) {  // 编辑页面截图
            if (nextProps.myProInfo.demo ) {
                this.setState( ( ) => {
                    var newFileList = []
                    var newImageList = []
                    for ( var i = 0; i < nextProps.myProInfo.demo.imageList.length; i++ ) {
                        newFileList.push({
                            uid: -i,
                            name: nextProps.myProInfo.demo.imageList[i].replace(re, ($0, $1, $2) => { return $2 } ),
                            status: 'done',
                            response: 'Server Error 500', // custom error message to show
                            url: nextProps.myProInfo.demo.imageList[i],
                        });
                        newImageList.push(nextProps.myProInfo.demo.imageList[i])
                    }
                    return {
                        fileList: newFileList,
                        imageList: newImageList,
                    }
                }, () => { this.props.screenShoutUploadInfo(this.state) })
            }
        }
        if (nextProps.myProInfo !== this.props.myProInfo && "/work/add" === nextProps.location.pathname ) { // 从编辑切换到add时 清空
            this.setState({
                uploadPercent: 0,
                imageList: [],
                fileList: [],
            }, () => { this.props.screenShoutUploadInfo(this.state) })
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
        /* 截图上传信息 */
        const propsScreenshot = {
            name: "screenShout",
            listType: "picture-card",
            accept: ".png, .jpg, .gif",
            fileList: this.state.fileList,
            onPreview: (file) => { // 点击文件链接或预览图标时的回调
                this.setState({
                    previewImage: file.url || file.thumbUrl,
                    previewVisible: true,
                });
            },
            onRemove: (file) => {  // 点击移除文件时的回调
                this.setState((state) => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);

                    const newImageList = state.imageList.slice();
                    newImageList.splice(index, 1);
                    return {
                        fileList: newFileList,
                        imageList: newImageList,
                    };
                }, () => { this.props.screenShoutUploadInfo(this.state) } );
                this.state.client.cancel(); // 暂停上传,如果没有断点保存,重新上传
            },
            onChange: (info) => {
                const isJPG = info.file.type === 'image/jpeg';
                const isPNG = info.file.type === 'image/png';
                const isGIF = info.file.type === 'image/gif';
                const isLt5M = info.file.size / 1024 / 1024 < 5;
                if ((isJPG || isPNG || isGIF) && isLt5M ) {
                    this.setState({ fileList: info.fileList }, () => { this.props.screenShoutUploadInfo(this.state) } );
                /* 上传截图 */
                    const uploadFilename = info.file.name; // oss上传时 multipartUpload 参数 'object-key'
                    const uploadFile = info.file;  // oss上传时 multipartUpload 参数
                    this.state.client.multipartUpload(uploadFilename, uploadFile)
                    .then( (result) => {
                        const url = this.state.client.signatureUrl(uploadFilename, { expires: 3600}); // 获取下载地址
                        var reg = /(.+)(\?)/; // 获取返回下载url的?号之前的地址,因为返回的url带有token等信息
                        if (url) { message.success(uploadFilename + "上传成功！"); }
                        this.setState({ imageList: [...this.state.imageList, url.match(reg)[1]] }, () => { this.props.screenShoutUploadInfo(this.state) });
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
                /* 上传截图 */
                }
                else {
                    message.error('您只能上传jpg、png、gif图片 大小不能超过5M');
                }
            }
        }

    /* 截图上传变量 */
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus-circle" theme="twoTone" style={{ fontSize: 22 }} />
                <div className="ant-upload-text" >点击上传截图</div>
            </div>
        );
    /* 截图上传变量 */
        return(
            <Fragment>
                <Row style={{ margin: '5px 24px' }}>
                    <Form.Item
                        colon={false}
                        label={'上传截图(png、jpg、gif)'}
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                    >
                        <div className="clearfix">
                            <Upload
                                {...propsScreenshot}
                                beforeUpload={this.beforeUpload}
                            >
                                {fileList.length >= 4 ? null : uploadButton}
                            </Upload>
                            <Modal visible={previewVisible} footer={null} onCancel={this.modalHandleCancel}>
                                <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                        </div>
                    </Form.Item>
                </Row>
            </Fragment>
        )
    }
}

export default ScreenShotUpload;