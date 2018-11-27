import React, { Component } from 'react';
import { Table } from 'antd';
import { TableToggleCol } from '../../components/index';

const list = [{
  width: 200,
  name: 'John Brown',
  age: 32,
  address: 'New York Park',
}, {
  width: 200,
  name: 'Jim Green',
  age: 40,
  address: 'London Park',
}];

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: 'Full Name', width: 100, dataIndex: 'name', key: 'name', fixed: 'left',
        },
        {
          title: 'Age', width: 100, dataIndex: 'age', key: 'age',
        },
        { title: 'Column 1', dataIndex: 'a', width: 200 },
        { title: 'Column 2', dataIndex: 'b', width: 200 },
        { title: 'Column 3', dataIndex: 'c', width: 200 },
        { title: 'Column 4', dataIndex: 'd', width: 200 },
        { title: 'Column 5', dataIndex: 'e', width: 200 },
        { title: 'Column 6', dataIndex: 'f', width: 200 },
        { title: 'Column 7', dataIndex: 'g', width: 200 },
        { title: 'Column 8', dataIndex: 'h', width: 200 },
        { title: 'Column 9', dataIndex: 'i', width: 200 },
        { title: 'Column 10', dataIndex: 'j', width: 200 },
        { title: 'Column 11', dataIndex: 'k', width: 200 },
        { title: 'Column 12', dataIndex: 'l', width: 200 },
        {
          title: 'Action',
          key: 'operation',
          fixed: 'right',
          width: 100,
          render: () => <a>action</a>,
        },
      ],
    };
  }

  render() {
    const { columns } = this.state;


    return (<div className="" style={{ padding: 20 }}>
      <TableToggleCol
        columns={columns}
        columnsChange={(result) => {
          this.setState({ columns: result });
        }}
      />
      <Table
        columns={columns}
        rowKey="title"
        dataSource={list}
        scroll={{ x: 1300 }}
      />
    </div>
    );
  }
}

export default Demo;
