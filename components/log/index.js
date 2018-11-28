import React, { Component } from 'react';
import { Modal, Table, Button } from 'antd';
import PropTypes from 'prop-types';
import request from '../request';

// 初始state获取函数
const getIntialState = () => ({
  visible: false,
  list: [],
  pagination: {
    pageNum: 1,
    total: 0,
  },
});

class Log extends Component {
  constructor(props) {
    super(props);

    this.state = getIntialState();
  }

  triggerQueryLog = () => {
    this.queryData();
    this.openModal();
  }

  queryData = (pageNum = 1) => {
    const {
      url, query = {}, afterRequest, beforeRequest, needPagination, requestOption,
    } = this.props;
    const options = { pageNum, pageSize: 10 };// 当前页码、每页条数暴露给beforeRequest的第二个参数
    const param = beforeRequest(query, options);

    request({
      ...requestOption,
      ...url,
      data: {
        pageSize: options.pageSize,
        pageNum: options.pageNum,
        ...param,
      },
      showLoading: true,
    }).then((data) => {
      const result = afterRequest(data);
      const stateData = needPagination ? {
        list: result.list,
        pagination: {
          pageNum: result.pageNum || 1,
          total: result.total || 0,
        },
      } : { list: result };

      this.setState(stateData);
    });
  }

  openModal = () => {
    this.setState({ visible: true });
  }

  closeModal = () => {
    this.setState({
      visible: false,
      ...getIntialState(),
    });
  }

  render() {
    const {
      text, title, columns, rowKey, children, query = {}, needPagination,
    } = this.props;
    const { pageSize = 10 } = query === null ? {} : query;
    const { list, pagination, visible } = this.state;

    const paginationConfig = needPagination ? {
      showTotal: total => `共计 ${total} 条`,
      pageSize,
      onChange: this.queryData,
      current: pagination.pageNum,
      total: pagination.total,
      showSizeChanger: false,
      showQuickJumper: false,
    } : false;

    return (
      <div style={{ display: 'inline-block' }}>
        {
          text ? <Button onClick={this.triggerQueryLog}>{text}</Button>
            : <span onClick={this.triggerQueryLog}>{children}</span>
        }
        {
          visible && (
            <Modal
              title={title}
              footer={null}
              visible
              width={800}
              onCancel={this.closeModal}
            >
              <Table
                bordered
                columns={columns}
                dataSource={list}
                rowKey={rowKey}
                style={{ marginBottom: 20 }}
                pagination={paginationConfig}
              />
            </Modal>
          )
        }
      </div>
    );
  }
}

Log.propTypes = {
  children: PropTypes.element,
  text: PropTypes.string,
  title: PropTypes.string,
  url: PropTypes.object.isRequired,
  query: PropTypes.object,
  columns: PropTypes.array,
  rowKey: PropTypes.string,
  needPagination: PropTypes.bool,
  afterRequest: PropTypes.func,
  beforeRequest: PropTypes.func,
  requestOption: PropTypes.object,
};

Log.defaultProps = {
  children: null,
  text: '日志',
  title: '操作日志',
  rowKey: 'id',
  query: null,
  columns: [],
  needPagination: true,
  afterRequest: val => (val),
  beforeRequest: val => (val),
  requestOption: {},
};

export default Log;
