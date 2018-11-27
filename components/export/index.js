import React, { Component } from 'react';
import {
  Modal, message, Popconfirm, Button,
} from 'antd';
import PropTypes from 'prop-types';
import request from '../request';

class Export extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      downloadUrl: '',
    };
  }

  /**
   * getForm() 可以return false;来阻止导出请求
   * */
  doExport = () => {
    const { url, params = {}, beforeRequest } = this.props;
    const result = beforeRequest(params);

    if (!result) {
      return false;
    }

    request({
      method: 'post',
      url,
      data: result,
      showLoading: true,
    }).then((data) => {
      if (data) {
        this.setState({
          visible: true,
          downloadUrl: data,
        });
      } else {
        message.error('返回的下载页面链接无效！');
      }
    });
  }

  openDownloadPage = () => {
    const { downloadUrl } = this.state;

    this.closeModal();
    window.open(downloadUrl, '_blank');
  }

  closeModal = () => {
    this.setState({
      visible: false,
    });
  }

  render() {
    const {
      btnText, children, className, needConfirm, confirmMap = {}, okText, modalContent,
    } = this.props;
    const { title = '确定导出吗？' } = confirmMap;
    const trigger = children || <Button>{btnText}</Button>;

    return (
      <div className={className} style={{ display: 'inline-block' }}>
        {
          needConfirm ? (
            <Popconfirm
              title={title}
              onConfirm={this.doExport}
              okText="确定"
              cancelText="取消"
            >{trigger}
            </Popconfirm>
          ) : <span onClick={this.doExport}>{trigger}</span>
        }
        <Modal
          title="提示"
          visible={this.state.visible}
          onOk={this.openDownloadPage}
          onCancel={this.closeModal}
          okText={okText}
          cancelText="取消"
        >
          <p>{modalContent}</p>
        </Modal>
      </div>
    );
  }
}

Export.propTypes = {
  url: PropTypes.string.isRequired,
  params: PropTypes.object,
  beforeRequest: PropTypes.func,
  className: PropTypes.string,
  btnText: PropTypes.string,
  needConfirm: PropTypes.bool,
  confirmMap: PropTypes.shape({
    title: PropTypes.string,
  }),
  children: PropTypes.element,
  okText: PropTypes.string,
  modalContent: PropTypes.string,
};

Export.defaultProps = {
  params: {},
  beforeRequest: () => true,
  className: '',
  btnText: '导出',
  needConfirm: false,
  confirmMap: undefined,
  children: null,
  okText: '跳转到下载页',
  modalContent: '导出任务提交成功!',
};

export default Export;
