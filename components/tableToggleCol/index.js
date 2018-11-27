import React, { Component } from 'react';
import PropTypes from 'prop-types';
import localforage from 'localforage';

import {
  Row, Col, Icon, Menu, Button, Checkbox, Tooltip, Popconfirm,
} from 'antd';
import './index.less';

const { location } = window;
const { pathname } = location;

export default class ListTool extends Component {
    static defaultProps = {
      columns: [],
      columnsChange: result => result,
      fixedColSize: 7,
    }

    static propTypes = {
      columns: PropTypes.array,
      columnsChange: PropTypes.func,
      fixedColSize: PropTypes.number,
    }

    constructor(props) {
      super(props);

      const listTitles = []; // 所有key
      const checkedList = []; // 所有选中列表
      const listColumns = []; // 所有列表

      props.columns.forEach((item, index) => {
        if (item.columnDefaultHide && item.columnDisableToggle) {
          return;
        }
        if (!item.dataIndex) { // 表头分组在ant官方示例中没有对父元素声明dataIndex
          item.dataIndex = `tableToggleCol${index}`;
        }
        if (!item.fixed) {
          listTitles.push(item.dataIndex);
        }
        if (!item.columnDefaultHide && !item.fixed) {
          checkedList.push(item.dataIndex);
        }
        listColumns.push({
          ...item,
          index,
          fixedInit: item.fixed,
        });
      });
      this.state = {
        listColumns,
        listTitles,
        visible: false,
        checkedList,
        indeterminate: !!checkedList.length && (checkedList.length < listTitles.length),
        checkAll: checkedList.length === listTitles.length,
        listTitlesName: listTitles.slice(0, 3).join(''),
        hasLocal: false,
      };
    }

    componentDidMount() {
      const { columnsChange, columns, fixedColSize } = this.props;
      const { listTitlesName, listTitles } = this.state;
      const setShow = (checkedList) => {
        let columnsInner;

        if (checkedList) {
          this.setState({
            hasLocal: true,
          });
          columnsInner = columns.filter((item, index) => {
            if (!item.dataIndex) { // 表头分组在ant官方示例中没有对父元素声明dataIndex
              item.dataIndex = `tableToggleCol${index}`;
            }

            return (checkedList.indexOf(item.dataIndex) > -1 || item.fixed);
          });
        } else {
          columnsInner = columns.filter(item => (!item.columnDefaultHide || item.fixed));
        }
        if (columnsInner.length < fixedColSize) {
          columnsInner.forEach((item) => { item.fixed = ''; });
        }
        columnsChange(columnsInner);
      };

      localforage.getItem(pathname).then((checkedList) => {
        const timeStamp = new Date().getTime();
        const compare = data => (timeStamp - data.timeStamp) < 15 * 24 * 60 * 60 * 1000;
        const item = checkedList[listTitlesName];

        if (item && compare(item)) {
          this.setState({
            checkedList: item.checkedList,
            checkAll: item.checkedList.length === listTitles.length,
            indeterminate: !!item.checkedList.length && (item.checkedList.length < listTitles.length),
          }, () => {
            setShow(item.checkedList);
          });
        }
      }).catch(() => {
        setShow();
      });
      window.addEventListener('resize', () => {
        this.setState({
          visible: false,
        });
      });
    }

    fixFixedTableBug(table, fixed, fixedColumn) {
      if (fixed && fixedColumn) {
        if (fixedColumn.fixed) {
          // console.log(table.scrollWidth,table.clientWidth,table.querySelector('table').clientWidth);
          // console.log(table.querySelector('table'));
          if (table.scrollWidth <= table.clientWidth) {
            fixed.style.display = 'none';
          } else {
            fixed.style.display = '';
          }
        }
      }
    }

    setLocal = (checkedList) => {
      const { listTitlesName } = this.state;
      const timeStamp = new Date().getTime();

      this.setState({
        hasLocal: true,
      });
      localforage.getItem(pathname).then((item) => {
        item[listTitlesName] = {
          timeStamp,
          checkedList: [...checkedList],
        };
        localforage.setItem(pathname, item);
      }).catch(() => {
        const item = {};

        item[listTitlesName] = {
          timeStamp,
          checkedList: [...checkedList],
        };
        localforage.setItem(pathname, item);
      });
    }

    handleColumnsChange = (column) => {
      const { columnsChange, columns, fixedColSize } = this.props;
      // 修复：增删列数据之后，固定在左右侧的action出现重复渲染  begin  by  xudihui
      // 父节点约束，限定在当前table的父节点，在业务使用时，要把组件和table放在平级，外层用div包裹
      const parentNode = (this.tableWrap || {}).parentNode || document;
      const table = parentNode.querySelector('.ant-table-body') || {};

      this.fixFixedTableBug(table, parentNode.querySelector('.ant-table-fixed-right'), columns[columns.length - 1]);
      this.fixFixedTableBug(table, parentNode.querySelector('.ant-table-fixed-left'), columns[0]);
      // 修复：增删列数据之后，固定在右侧的action出现重复渲染  end

      return (e) => {
        const {
          checkedList, listTitles, listColumns,
        } = this.state;

        if (!e.target.checked) {
          const index = checkedList.indexOf(column.dataIndex);

          if (index > -1) {
            checkedList.splice(index, 1);
          }
        } else {
          checkedList.push(column.dataIndex);
        }
        this.setState({
          checkedList: [...checkedList],
          indeterminate: !!checkedList.length && (checkedList.length < listTitles.length),
          checkAll: checkedList.length === listTitles.length,
        });
        this.setLocal(checkedList);
        const result = listColumns.filter(i => (checkedList.indexOf(i.dataIndex) > -1
          || i.fixedInit)).sort((a, b) => (a.index - b.index));

        if (result.length < fixedColSize) {
          result.forEach((item) => { item.fixed = ''; });
        } else {
          result.forEach((item) => { item.fixed = item.fixedInit; });
        }
        columnsChange(result);
      };
    }

    onClearLocal = () => {
      const { listColumns, listTitles } = this.state;
      const { columnsChange } = this.props;
      const checkedList = [];
      const renderColumns = [];

      listColumns.forEach((item) => {
        if (!item.columnDefaultHide || item.fixed) {
          checkedList.push(item.dataIndex);
          renderColumns.push(item);
        }
      });
      localforage.removeItem(pathname).then(() => {
        columnsChange((renderColumns).sort((a, b) => (a.index - b.index)));
        this.setState({
          visible: false,
          hasLocal: false,
          checkedList,
          checkAll: true,
          indeterminate: !!checkedList.length && (checkedList.length < listTitles.length),
        });
      });
    }

    onCheckAllChange = (e) => {
      const { listTitles, listColumns } = this.state;
      const listCheckAll = [];

      listColumns.forEach((item) => {
        if (item.columnDisableToggle) {
          listCheckAll.push(item.dataIndex);
        }
      });
      if (listCheckAll.length === 0) {
        listCheckAll.push(listTitles[0]);
      }
      console.log('listCheckAll:', listCheckAll, listTitles);
      const { columnsChange } = this.props;
      const checkedList = e.target.checked ? [...listTitles] : listCheckAll;

      this.setState({
        checkedList,
        indeterminate: checkedList.length === 1,
        checkAll: e.target.checked,
      });
      this.setLocal(checkedList);
      const resultArr = listColumns.filter(i => (checkedList.indexOf(i.dataIndex) > -1 || i.fixedInit));

      columnsChange(resultArr.sort((a, b) => (a.index - b.index)));
    }

    showDrawer = () => {
      this.setState({
        visible: true,
      });
    };

    onClose = () => {
      this.setState({
        visible: false,
      });
    };

    render() {
      const {
        listColumns, checkedList, visible, hasLocal,
      } = this.state;
      const menu = (
        <Menu>
          <Menu.Item style={{ padding: 0 }}>
            <Checkbox
              style={{ borderBottom: '1px solid #ccc' }}
              indeterminate={this.state.indeterminate}
              onChange={this.onCheckAllChange}
              checked={this.state.checkAll}
            >
                    全选
            </Checkbox>
            {
                    hasLocal && (
                    <Popconfirm placement="bottomRight"
                      title="您将清除该页面中的所有表格列缓存?"
                      onConfirm={this.onClearLocal}
                      okText="确认"
                      cancelText="取消"
                    >
                      <span className="clear">清除缓存</span>
                    </Popconfirm>
                    )
                }
          </Menu.Item>
          {
                listColumns.map(item => (!item.fixedInit
                  ? (
                    <Menu.Item key={`${item.dataIndex}-${item.title}`} className="ant-dropdown-menu-item">
                      <Checkbox
                      disabled={item.columnDisableToggle || (checkedList.length === 1 && (item.dataIndex === checkedList[0]))} // eslint-disable-line
                        onChange={this.handleColumnsChange(item)}
                        checked={checkedList.indexOf(item.dataIndex) > -1}
                      >{item.title}</Checkbox>
                    </Menu.Item>
                  ) : null))
            }
        </Menu>
      );


      return (
        <div className="tableToggleCol" ref={(el) => { this.tableWrap = el; }}>
          <Row type="flex" justify="end" gutter={16} style={{ marginTop: -32 }}>
            <Col>
              <Tooltip title="控制表格列显示">
                <Button onClick={this.showDrawer}><Icon type={hasLocal ? 'appstore' : 'appstore-o'} /></Button>
              </Tooltip>
              {
                            visible && (
                            <div>
                              <div
                                onClick={this.onClose}
                                className="toggleColWrap"
                                style={{ height: `${window.innerHeight}px` }}
                              />
                              <div className="toggleCol" style={{ height: `${window.innerHeight}px` }}>
                                {menu}
                              </div>
                            </div>
                            )
                        }
            </Col>
          </Row>
        </div>

      );
    }
}
