import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TimePicker, Col } from 'antd';
import './index.less';

class TimeRange extends Component {
  constructor(props) {
    super(props);
    let startTime = null;
    let endTime = null;

    if (props.value && props.value.length) { // 支持form item中的initialValue属性
      [startTime, endTime] = props.value;
    } else if (props.defaultValue && props.defaultValue.length) { // 支持非受控默认属性
      [startTime, endTime] = props.defaultValue;
    }

    this.state = {
      startTime,
      endTime,
    };
  }

  static defaultProps = {
    onChange: null,
    format: 'HH:mm:ss',
    splitContent: '-',
  }

  static propTypes = {
    onChange: PropTypes.func,
    format: PropTypes.string,
    splitContent: PropTypes.any,
  }

  componentWillReceiveProps(next) {
    if (JSON.stringify(next.value) !== JSON.stringify(this.props.value)) {
      if (next.value && next.value.length) {
        const [startTime, endTime] = next.value;

        this.setState({
          startTime,
          endTime,
        });
      } else {
        this.setState({
          startTime: null,
          endTime: null,
        });
      }
    }
  }

  changeStart = (time, timeStr) => {
    const { endTime } = this.state;
    const { onChange } = this.props;

    if (onChange) {
      this.props.onChange([timeStr, endTime]);
    } else {
      this.setState({
        startTime: timeStr,
      });
    }
  }

  changeEnd = (time, timeStr) => {
    const { startTime } = this.state;
    const { onChange } = this.props;

    if (onChange) {
      this.props.onChange([startTime, timeStr]);
    } else {
      this.setState({
        endTime: timeStr,
      });
    }
  }

  render() {
    let { startTime, endTime } = this.state;
    const {
      format, defaultValue, splitContent, ...others
    } = this.props; // 为了怕defaultValue污染，所以多余解构处理

    startTime = startTime ? moment(startTime, format) : null;
    endTime = endTime ? moment(endTime, format) : null;


    return (<div className="timeRangePicker">
      <Col span={11}>
        <TimePicker
          {...others}
          value={startTime}
          onChange={this.changeStart}
          format={format}
        />
      </Col>
      <Col span={2}>
        <span className="splitContent">
          {splitContent}
        </span>
      </Col>
      <Col span={11}>
        <TimePicker
          {...others}
          value={endTime}
          onChange={this.changeEnd}
          format={format}
        />
      </Col>
    </div>
    );
  }
}

export default TimeRange;
