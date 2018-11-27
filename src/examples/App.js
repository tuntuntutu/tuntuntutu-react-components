import React from 'react';
import { Divider } from 'antd';
import LogDemo from './LogDemo';
import ExportDemo from './exportDemo';
import TableToggleColDemo from './tableToggleColDemo';
import RequestDemo from './RequestDemo';
import PageTemplateDemo from './pageTemplateDemo';
import SelectMaxDemo from './SelectMaxDemo';
import TimeRangePickerDemo from './TimeRangePickerDemo';
import '@/styles/index.less';


class App extends React.Component {
  constructor(props) {
    super(props);

    window.sessionStorage.setItem('permissions', 'ok,true,can,mockjs/139/socialSecurity/export');
  }

  render() {
    return (
      <div id="com-app" style={{ padding: 20 }}>
        <Divider>日志组件</Divider>
        <LogDemo />
        <Divider>导出</Divider>
        <ExportDemo />
        <Divider>请求组件</Divider>
        <RequestDemo />
        <Divider>切换表格的列</Divider>
        <TableToggleColDemo />
        <Divider>页面模板</Divider>
        <PageTemplateDemo />
        <Divider>Select封装版</Divider>
        <SelectMaxDemo />
        <Divider>时间区间选择器</Divider>
        <TimeRangePickerDemo />
      </div>
    );
  }
}

export default App;
