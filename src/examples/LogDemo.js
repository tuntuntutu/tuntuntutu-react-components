import React, { Component } from 'react';
import { Table } from 'antd';

import { Log } from '../../components/index';

const LogColumns = [{
  title: '操作类型',
  dataIndex: 'operateContent',
}, {
  title: '操作时间',
  dataIndex: 'operateDate',
}];

const LogColumns2 = [{
  title: '操作类型',
  dataIndex: 'sealName',
}, {
  title: '操作时间',
  dataIndex: 'submitTime',
}];

const columns = [{
  title: 'Name',
  dataIndex: 'name',
  render: text => <a>{text}</a>,
}, {
  title: 'Age',
  dataIndex: 'age',
}, {
  title: 'Address',
  dataIndex: 'address',
}, {
  title: '不分页log',
  render: () => (
    <Log
      url="https://www.baidu.com"
      needPagination={false}
      afterRequest={val => val}
      query={{ model: 'FLEET_OP_DELETE', objId: 10216 }}
      columns={LogColumns}
    />
  ),
}, {
  title: '分页log',
  render: () => (
    <Log
      url="https://www.baidu.com"
      query={{ model: 'FLEET_OP_DELETE', objId: 10216 }}
      columns={LogColumns2}
    />
  ),
}];

const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}];

export default class LogDemo extends Component {
  render() {
    return (
      <div>
        <Table columns={columns} dataSource={data} />
      </div>
    );
  }
}
