import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import { Spin, message } from 'antd';
import PropTypes from 'prop-types';
import request from '../request';
import CustomToolbar from './toolbar';

export default class Editor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageIsUploading: false,
      modules: {
        toolbar: {
          container: '#toolbar',
          handlers: {
            image: this.imageHandler,
          },
        },
      },
      formats: [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote', 'color', 'background',
        'list', 'bullet', 'indent',
        'link', 'image',
      ],
    };
  }

  pictureChange = async () => {
    const {
      picConfig = {},
    } = this.props;
    const {
      url, name, params, size: maxSize, domain,
    } = picConfig;
    const property = name || 'file';
    const images = this.fileInput.files;
    const image = images[0];
    const arr = image.name.split('.');
    const ext = arr[arr.length - 1];
    const { size } = image;

    params[property] = images;

    if (['bmp', 'jpg', 'jpeg', 'png', 'tiff', 'gif', 'tga', 'eps'].indexOf(ext) === -1) {
      message.error('图片格式只能是jpg,jpeg,png,bmp,gif,tiff,tga,eps');
      this.fileInput.value = '';
      return;
    }

    if (size > maxSize * 1024 * 1024) {
      message.error(`上传图片不能大于${maxSize}MB`);
      this.fileInput.value = '';
      return;
    }

    // this.setState({ imageIsUploading: true });
    try {
      const data = await request({
        ...url,
        dataType: 'FormData',
        data: params,
        showLoading: true,
      });

      if (data) {
        const urls = `${domain}${data}` || '';
        const { index } = this.quillRef.getEditor().getSelection();

        this.quillRef.getEditor().insertEmbed(index, 'image', `${urls}`);
        this.quillRef.getEditor().setSelection(index + 1);
      }
    } catch (e) {
      message.error(e.message);
    } finally {
      this.fileInput.value = '';
    }
  }

  imageHandler = () => {
    this.fileInput.click();
  }

  render() {
    const {
      value, onChange, disabled, className, height, style,
    } = this.props;

    return (
      <div className={`cc-editor ${className}`} style={style}>
        <CustomToolbar key="toolbar" />
        <ReactQuill
          id="editorContainer"
          readOnly={disabled}
          key="editor"
          value={value}
          onChange={onChange}
          modules={this.state.modules}
          formats={this.state.formats}
          bounds="#editorContainer"
          ref={(el) => { this.quillRef = el; }}
          style={{ height }}
        />
        <div key="loading">
          {this.state.imageIsUploading &&
            <div className="editor-loading"><Spin tip="图片上传中..." /></div>
          }
        </div>
        <input
          key="file"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={(input) => { this.fileInput = input; }}
          onChange={this.pictureChange}
        />
      </div>
    );
  }
}
Editor.defaultProps = {
  picConfig: {
    size: 5,
    domain: '',
    name: 'file',
    params: {},
  },
  style: {},
  className: '',
  disabled: false,
  value: '',
  height: 500,
  onChange: () => {},
};
Editor.propTypes = {
  picConfig: PropTypes.shape({
    url: PropTypes.object.isRequired,
    name: PropTypes.string,
    size: PropTypes.number,
    domain: PropTypes.string,
    params: PropTypes.object,
  }),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  height: PropTypes.number,
  onChange: PropTypes.func,
  value: PropTypes.string,
};
