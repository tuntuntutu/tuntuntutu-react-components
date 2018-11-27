import React, { Component } from 'react';
import { Checkbox, DatePicker } from 'antd';
import moment from 'moment';
import { PageTemplate } from '../../components/index';


export default class AuthButtonDemo extends Component {
  render() {
    const columns = [{
      title: '城市名称',
      dataIndex: 'cityName',
    }];

    const config = {
      searchOnLoad: true,
      pageSize: 2,
      url: { url: 'https://api.github.com/events' },
      beforeRequest: val => ({ ...val, date: val.date ? val.date.format('YYYY-MM-DD') : undefined }),
      afterRequest: val => val,
    };

    const rowKey = 'id';
    const toolbar = null;
    const filter = [
      {
        component: 'Input', key: 'input2', label: '测试输入2',
      },
      {
        component: <DatePicker />,
        key: 'date',
        label: '日期',
        fieldOptions: {
          initialValue: moment('2015-01-01'),
          rules: [{ required: true, message: '必须选择月份' }],
        },
      },
      {
        component: <Checkbox>只关于我的内容</Checkbox>, key: 'checkbox', label: '', fieldOptions: { valuePropName: 'checked' },
      },
    ];
    const needExport = false;

    return (
      <PageTemplate
        connect={null}
        columns={columns}
        rowKey={rowKey}
        toolbar={toolbar}
        config={config}
        filter={filter}
        needExport={needExport}
      />
    );
  }
}
