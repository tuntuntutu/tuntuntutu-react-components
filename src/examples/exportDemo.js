import React, { Component } from 'react';

import { Export } from '../../components/index';

export default class ExportDemo extends Component {
  // NOTE: 假如使用了antd中的this.props.form.validateFields((err, values) => {}),那么就将values抛出
  getForm = () => ({
    pageNum: 1,
    pageSize: 10,
  })

  getFormByReturnFlase = () => false;

  render() {
    return (
      <div>
        <Export
          url="https://www.baidu.com" // 导出请求地址
          params={{ name: 'xxx' }}
          btnText="导出 params"
        />

        <Export
          url="https://www.baidu.com" // 导出请求地址
          getForm={this.getForm}
          btnText="导出 getForm"
        />

        <Export
          url="https://www.baidu.com" // 导出请求地址
          getForm={this.getFormByReturnFlase}
          btnText="getForm返回false来阻止导出请求"
        />

        <Export
          url="https://www.baidu.com" // 导出请求地址
          params={{ extra: 1 }}
          btnText="导出历史明细"
          btnType="primary"
        />
        <Export
          url="https://www.baidu.com" // 导出请求地址
          params={{ extra: 1 }}
          btnText="二次确认的导出"
          btnType="primary"
          needConfirm
          confirmMap={{ title: '只能导出已归档的缴费明细' }}
        />

        <Export
          url="https://www.baidu.com" // 导出请求地址
          params={{ extra: 1 }}
          btnText="二次确认的导出"
          btnType="primary"
          needConfirm
          confirmMap={{ title: '只能导出已归档的缴费明细' }}
        ><a>自定义导出触发</a></Export>
        {/* 自定义模态框的确定文案和内容提示 */}
        <Export
          url="https://www.baidu.com" // 导出请求地址
          params={{ labId: 46 }}
          btnText="打印"
          btnType="primary"
          okText="确定"
          modalContent="确定是否前往电子简历下载"
        />
      </div>
    );
  }
}
