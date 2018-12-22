import React, { Component } from 'react';
import 'react-quill/dist/quill.snow.css';
import './editor.less';


export default class CustomToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const COLORS = [
      '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff',
      '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff',
      '#888888', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff',
      '#444444', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2',
      '#000000', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466',
    ];

    return (
      <div id="toolbar">
        <span className="ql-formats">
          <select className="ql-header" defaultValue="4">
            <option key="1" value="1">标题1</option>
            <option key="2" value="2">标题2</option>
            <option key="3" value="3">标题3</option>
            <option key="4" value="4">正文</option>
          </select>
        </span>
        <span className="ql-formats">
          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
          <button className="ql-strike" />
        </span>
        <span className="ql-formats">
          <button className="ql-list" value="ordered" />
          <button className="ql-list" value="bullet" />
          <button className="ql-indent" value="-1" />
          <button className="ql-indent" value="+1" />
        </span>
        <span className="ql-formats">
          <select className="ql-color" defaultValue="#000000">
            {
              COLORS.map(color => <option key={color} value={color} />)
            }
          </select>
          <select className="ql-background" defaultValue="#ffffff">
            {
              COLORS.map(color => <option key={color} value={color === '#ffffff' ? false : color} />)
            }
          </select>
        </span>
        <span className="ql-formats">
          <button className="ql-link" />
          <button className="ql-image" />
        </span>
      </div>
    );
  }
}
