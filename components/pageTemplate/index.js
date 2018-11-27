import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Form, Table, Input, DatePicker,
} from 'antd';
import Export from '../export';
import request from '../request';
import TableTool from '../tableToggleCol';
import './index.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
let PAGE_SIZE = 10;

@Form.create()
export default class PageTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      total: 0,
      current: 1,
      columns: props.columns || [],
    };
    props.connect && props.connect({
      onSearch: (param = {}) => {
        const { searchByCurrentPage = false } = param;

        this.onSearch(searchByCurrentPage ? this.state.current : 1);
      },
      form: props.form,
    });
  }

  componentDidMount = () => {
    const { config = {} } = this.props;
    const { searchOnLoad = true } = config;

    PAGE_SIZE = config.pageSize || 10;
    if (searchOnLoad) {
      this.onSearch(1);
    }
  }

  onSearch = (current = 1) => {
    if (Number.isNaN(Number(current))) current = 1;

    const { config = {}, form, requestOption } = this.props;
    const {
      url = '',
      beforeRequest = val => val,
      afterRequest = val => val,
      afterRequestError = () => {
      },
    } = config;

    form.validateFields((errors, values = {}) => {
      if (errors) return;
      const options = { pageNum: current, pageSize: PAGE_SIZE };// 当前页码、每页条数暴露给beforeRequest的第二个参数
      const param = beforeRequest(values, options);

      if (!param) return; // 用来判断在某些条件下阻断搜索

      request({
        method: 'get',
        showLoading: true,
        ...requestOption, // 覆盖所有属性，但不覆盖data和url，后续可以酌情淘汰method、successCode等配置
        ...url,
        data: {
          pageSize: PAGE_SIZE,
          pageNum: current,
          ...param,
        },
      }).then((data) => {
        const result = afterRequest(data);
        const { total, list } = result;

        this.setState({
          dataSource: list || [],
          total,
          current,
        });
      }).catch((e) => {
        try {
          const intactData = JSON.parse(e.message);// 如果e.message不可序列化将会报错

          afterRequestError && afterRequestError(intactData);
        } catch (err) {
          console.log(err);
        }
      });
    });
  }

  onReset = () => {
    this.props.form.resetFields();
  }

  onShowSizeChange = (current, size) => {
    PAGE_SIZE = size;
    this.onSearch(1, PAGE_SIZE);
  }

  handleColumnsChange = (columns) => {
    this.setState({
      columns,
    });
  }


  render() {
    const {
      dataSource, total, current, columns,
    } = this.state;
    const {
      toolbar, rowKey, disableTableToggleCol, ...restProps
    } = this.props;

    return (
      <div className="page-template">
        <div className="page-template__filter">
          {this.renderFilter()}
        </div>
        <div className="page-template__content">
          <div className="page-template__toolbar">
            {toolbar}
          </div>
          {!disableTableToggleCol && (<TableTool columns={columns} columnsChange={this.handleColumnsChange} />)}
          <Table
            pagination={{
              showTotal: total => `共计 ${total} 条`,
              pageSize: PAGE_SIZE,
              onChange: this.onSearch,
              current,
              total,
              showSizeChanger: true,
              showQuickJumper: true,
              onShowSizeChange: this.onShowSizeChange,
            }}
            rowKey={rowKey}
            style={{ marginTop: 20 }}
            scroll={{ x: 1200, y: false }}
            bordered
            dataSource={dataSource}
            {...restProps}
            columns={columns}
          />
        </div>
      </div>
    );
  }

  renderFilter() {
    const {
      filter, form, needExport, config, eleAfterSearchBtn,
    } = this.props;

    const { exportParams = val => val } = config;

    return (
      <Form layout="inline">
        {
          filter.map((item) => {
            const { key, label, fieldOptions = {} } = item;

            return (
              <FormItem key={key} label={label}>
                {form.getFieldDecorator(key, fieldOptions)(this.renderNormalComponent(item))}
              </FormItem>
            );
          })
        }
        <FormItem>
          {
            filter && filter.length
              ? (
                <span>
                  <Button onClick={this.onSearch} type="primary">查询</Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.onReset}>重置</Button>
                </span>
              )
              : null
          }
          {
            needExport && (
              <Export
                url={needExport}
                params={exportParams(form.getFieldsValue())}
              />
            )
          }
          {eleAfterSearchBtn}
        </FormItem>
      </Form>);
  }

  renderNormalComponent = (item) => {
    const {
      component,
    } = item;

    switch (component) {
      case 'RangePicker':
        return (<RangePicker />);
      case 'Input':
        return (<Input />);
      default:
        return component;
    }
  }
}
PageTemplate.defaultProps = {
  filter: [],
  eleAfterSearchBtn: null,
  rowKey: 'id',
  disableTableToggleCol: false,
  requestOption: {},
  config: {
    pageSize: 10,
    searchOnLoad: true,
    beforeRequest: val => val,
    afterRequest: val => val,
    exportParams: val => val,
    afterRequestError: () => {
    },
  },
};
PageTemplate.propTypes = {
  eleAfterSearchBtn: PropTypes.element,
  filter: PropTypes.array,
  columns: PropTypes.array.isRequired,
  disableTableToggleCol: PropTypes.bool,
  rowKey: PropTypes.string,
  requestOption: PropTypes.object,
  config: PropTypes.shape({
    url: PropTypes.object.isRequired,
    method: PropTypes.string,
    pageSize: PropTypes.number,
    searchOnLoad: PropTypes.bool,
    beforeRequest: PropTypes.func,
    afterRequest: PropTypes.func,
    exportParams: PropTypes.func,
    afterRequestError: PropTypes.func,
  }),
};
