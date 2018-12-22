import React, { Component } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import request from '../request/index.js';

const { Option } = Select;

export default class DoubleSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstList: [],
      secondList: [],
      secondValue: undefined,
      firstValue: undefined,
    };
  }

  componentWillMount() {
    this.getFirstList();
    const { value = {}, defaultValue = {}, format } = this.props;
    const first = value[format.first];
    const second = value[format.second];
    const defaultFirst = defaultValue[format.first];
    const defaultSecond = defaultValue[format.second];

    if (first) {
      this.getSecondList(first);
      this.setState({
        firstValue: first,
        secondValue: second,
      });

      return;
    }
    // 普通用法赋默认值
    if (defaultFirst) {
      this.getSecondList(defaultFirst);
      this.setState({ firstValue: defaultFirst, secondValue: defaultSecond });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.value) !== JSON.stringify(nextProps.value)) {
      const { value } = nextProps;

      if (value === undefined) { // 重置的时候 Form返回的value是undefined
        this.setState({ firstValue: undefined, secondValue: undefined });
      } else {
        const { format } = this.props;
        const first = value[format.first];
        const second = value[format.second];

        if (value[format.first]) this.getSecondList(first);
        this.setState({ firstValue: first, secondValue: second });
      }
    }
  }

  getFirstList() {
    const { firstConfig } = this.props;
    const {
      afterRequest = val => val,
      beforeRequest = val => val,
      data = {},
      url,
      optionMap,
    } = firstConfig;
    const { key = 'key', value = 'value' } = optionMap;

    return request({
      ...url,
      data: beforeRequest(data),
      showLoading: false,
    }).then((data) => {
      this.setState({ firstList: afterRequest(data).map(item => ({ value: item[value], key: item[key] })) });
    });
  }

  getSecondList(firstValue) {
    const { secondConfig } = this.props;
    const {
      afterRequest = val => val,
      beforeRequest = val => val,
      data = {},
      queryKey = 'id',
      url,
      optionMap,
    } = secondConfig;
    const { key = 'key', value = 'value' } = optionMap;

    data[queryKey] = firstValue;

    return request({
      ...url,
      data: beforeRequest(data),
      showLoading: false,
    }).then((data) => {
      this.setState({
        secondList: afterRequest(data).map(item => ({ value: item[value], key: item[key] })),
      });
    });
  }

  changeFirstValue = (firstValue) => {
    // this.setState({ firstValue, secondValue: undefined });

    this.triggerChange({ firstValue });
  }

  changeSecondValue = (secondValue) => {
    const { firstValue } = this.state;

    // secondValue && this.setState({ firstValue, secondValue });

    this.triggerChange({ firstValue, secondValue });
  }

  triggerChange = (changedValue) => {
    const { onChange, format } = this.props;

    if (onChange) {
      onChange({
        [format.first]: changedValue.firstValue,
        [format.second]: changedValue.secondValue,
      });
    }
  }

  reset = () => { this.setState({ firstValue: undefined, secondValue: undefined }); }

  render() {
    const {
      firstList, secondList, firstValue, secondValue,
    } = this.state;
    const { width, className } = this.props;

    const provinceOpts = firstList.map(item => <Option key={item.key} value={item.key}>{item.value}</Option>);
    const cityOptions = secondList.map(item => <Option key={item.key} value={item.key}>{item.value}</Option>);

    return (
      <div className={className}>
        <Select
          allowClear
          showSearch
          placeholder="请选择"
          value={firstValue}
          optionFilterProp="children"
          style={{ width }}
          onChange={this.changeFirstValue}
        >
          {provinceOpts}
        </Select>
        <Select
          allowClear
          showSearch
          value={secondValue}
          placeholder="请选择"
          optionFilterProp="children"
          style={{ width }}
          onChange={this.changeSecondValue}
        >
          {cityOptions}
        </Select>
      </div>
    );
  }
}

DoubleSelect.propTypes = {
  width: PropTypes.number,
  className: PropTypes.string,
  firstConfig: PropTypes.shape({
    url: PropTypes.object.isRequired,
    data: PropTypes.object,
    afterRequest: PropTypes.func,
    beforeRequest: PropTypes.func,
    optionMap: PropTypes.object,
  }).isRequired,
  secondConfig: PropTypes.shape({
    url: PropTypes.object.isRequired,
    data: PropTypes.object,
    afterRequest: PropTypes.func,
    beforeRequest: PropTypes.func,
    queryKey: PropTypes.string,
    optionMap: PropTypes.object,
  }).isRequired,
  onChange: PropTypes.func,
  defaultValue: PropTypes.shape({
    first: PropTypes.string,
    second: PropTypes.string,
  }),
  value: PropTypes.shape({
    first: PropTypes.string,
    second: PropTypes.string,
  }),
  format: PropTypes.shape({
    first: PropTypes.string,
    second: PropTypes.string,
  }),
};

DoubleSelect.defaultProps = {
  width: 200,
  className: '',
  defaultValue: {},
  onChange: () => {},
  value: {},
  format: {
    first: 'first',
    second: 'second',
  },
};
