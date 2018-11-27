import React from 'react';
import {
  Form, Icon, Input, Button, Timeline, message, Tooltip,
} from 'antd';
import { request } from '../../components/index';

const FormItem = Form.Item;

const getData = async (filter) => {
  await request({
    url: 'https://api.github.com/emojis',
    data: { ...filter },
    method: 'post',
  });
};

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
function T(hisTime, nowTime) {
  const { parseInt } = window;
  const now = nowTime || new Date().getTime();
  const diffValue = now - hisTime;
  let result = '';
  const minute = 1000 * 60;
  const hour = minute * 60;
  const Lhour = diffValue / hour;
  const Lmin = diffValue / minute;
  const Ls = diffValue / 1000;

  if (Lhour >= 1) result = `${parseInt(Lhour)}个小时前`;
  else if (Lmin >= 1) result = `${parseInt(Lmin)}分钟前`;
  else if (Ls >= 3) result = `${parseInt(Ls)}秒前`;
  else result = '刚刚';

  return result;
}
class HorizontalLoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
    };
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    }

    render() {
      const {
        getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
      } = this.props.form;

      const { result } = this.state;
      const userNameError = isFieldTouched('userName') && getFieldError('userName');

      console.log('result:', result);

      return (
        <Form layout="inline" onSubmit={this.handleSubmit}>
          <FormItem
            validateStatus={userNameError ? 'error' : ''}
            help={userNameError || ''}
          >
            {getFieldDecorator('userName', {
              rules: [{ required: true, message: '请输入用户名' }],
            })(<Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="userName"
            />)}
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              disabled={hasErrors(getFieldsError())}
              onClick={() => {
                const { form } = this.props;

                form.validateFields(['userName'], async (err, values) => {
                  if (!err) {
                    result.unshift({ data: JSON.stringify(values), time: new Date().getTime() });
                    this.setState({
                      result: [...result],
                    });
                    getData(values);
                  }
                });
              }}
            >
                        开始请求
            </Button>
            <Tooltip title="请大家把重心放在参数转化上，千万不要关心接口响应。实际转换结果请大家查看具体网络请求报文。">
              <Button className="ml10"
                onClick={() => {
                  const { prompt } = window;
                  const enter = prompt('请输入自定义参数，会校验您的格式，必须为标准json，属性名必须用双引号，如{"a":1}');

                  try {
                    const obj = JSON.parse(enter);

                    if (typeof obj !== 'object') {
                      throw new Error();
                    }
                  } catch (e) {
                    return message.error('请仔细检查JSON字符串拼写格式！');
                  }
                  if (enter) {
                    result.unshift({ data: enter, time: new Date().getTime() });
                    this.setState({
                      result: [...result],
                    });
                    getData(JSON.parse(enter));
                  }
                }}
              >
              自定义入参请求
              </Button>
            </Tooltip>
            <a className="p10"
              target="_blank" // eslint-disable-line
              href="https://www.baidu.com"
            >组件原地址</a>
          </FormItem>
          <p className="f12 pt5">规则1）：入参空格删除(如果不是单层结构，将会递归删除每一个value为string类型的前后空格，注意，此处仅仅删除前后空格).</p>
          <p className="f12 pb5">规则2）：默认删除入参中value为 undefined 或者空字符串</p>
          {
               result.length !== 0 && <h3>原始请求参数记录(共{result.length}条):</h3>
            }
          <Timeline>
            {
                result.length !== 0 && result.map(i => (
                  <Timeline.Item
                    color={['green', 'red', 'blue'][Math.floor(Math.random() * 3)]}
                  >{i.data} <span className="f12 cc">{T(i.time)}</span></Timeline.Item>
                ))
              }
          </Timeline>
        </Form>
      );
    }
}

const WrappedHorizontalLoginForm = Form.create()(HorizontalLoginForm);

export default WrappedHorizontalLoginForm;
