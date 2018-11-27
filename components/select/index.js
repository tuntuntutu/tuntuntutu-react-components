import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import request from '../request/index.js';

const { Option } = Select;

class SelectMax extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      asyncOptions: [],
    };
  }

  componentWillMount() {
    const { url, afterRequest } = this.props;

    if (url) {
      request({ ...url }).then((res = []) => {
        const asyncOptions = afterRequest(res);

        this.setState({
          asyncOptions,
        });
      });
    }
  }

  render() {
    const {
      options = [], optionMap = {}, url, ...others
    } = this.props;
    let items = options;

    if (!options || !options.length) {
      items = this.state.asyncOptions;
    }
    const { key = 'key', value = 'value' } = optionMap;

    return (
      <Select allowClear {...others}>
        {items.map(item => <Option {...item} value={item[key]} key={item[key]}>{item[value]}</Option>)}
      </Select>
    );
  }
}

SelectMax.defaultProps = {
  optionMap: {},
  url: null,
  options: [],
  afterRequest: val => val,
};
SelectMax.propTypes = {
  options: PropTypes.array,
  optionMap: PropTypes.object,
  url: PropTypes.object,
  afterRequest: PropTypes.func,
};

export default SelectMax;
