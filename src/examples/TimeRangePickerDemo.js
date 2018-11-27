import React, { Component } from 'react';
import { Form, Button } from 'antd';
import { TimeRangePicker } from '../../components/index';

@Form.create()
class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  reset = () => {
    this.props.form.resetFields();
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div>
     非受控： <TimeRangePicker defaultValue={['12:12:12']} splitContent="+" />
        <br />
        <Form layout="inline">
          <Form.Item label="受控">
            {getFieldDecorator('type', {
              initialValue: ['12:12:12', '12:23:23'],
            })(<TimeRangePicker allowEmpty />)}
          </Form.Item>
          <Form.Item>
            <Button onClick={this.reset}>重置</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Demo;
