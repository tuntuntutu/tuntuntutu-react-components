import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox-rotate';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photoIndex: props.index,
      visible: props.visible,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      photoIndex: props.index,
      visible: props.visible,
    });
  }

  movePrev = () => {
    const { imgList = [] } = this.props;
    const { photoIndex } = this.state;
    this.setState({
      photoIndex: (photoIndex + imgList.length - 1) % imgList.length,
    });
  }
  moveNext = () => {
    const { imgList = [] } = this.props;
    const { photoIndex } = this.state;
    this.setState({
      photoIndex: (photoIndex + 1) % imgList.length,
    });
  }
  onClose = () => {
    this.setState({
      visible: false,
    });
    this.props.onClose();
  }

  render() {
    const { photoIndex, visible } = this.state;
    const { imgList } = this.props;

    let urlConfig = {};
    if (Array.isArray(imgList)) {
      urlConfig = {
        mainSrc: imgList[photoIndex],
        nextSrc: imgList[(photoIndex + 1) % imgList.length],
        prevSrc: imgList[(photoIndex + imgList.length - 1) % imgList.length],
      };
    } else {
      urlConfig = {
        mainSrc: imgList,
      };
    }

    return (
      <div>
        {visible &&
          <Lightbox
            imageTitle={<a href={imgList[photoIndex]} target="_blank" rel="noopener noreferrer" >查看原件</a>}
            imageLoadErrorMessage={<p>加载失败</p>}
            {...urlConfig}
            onCloseRequest={this.onClose}
            onMovePrevRequest={this.movePrev}
            onMoveNextRequest={this.moveNext}
            onPreMovePrevRequest={this.movePrev}
            onPreMoveNextRequest={this.moveNext}
            saveBeforeAfterState
          />}
      </div>
    );
  }
}

Gallery.open = (config) => {
  const div = document.createElement('div');
  div.className = 'cc-gallery';
  document.body.appendChild(div);
  const close = () => {
    document.body.removeChild(document.getElementsByClassName('ReactModalPortal')[0]);
    document.body.removeChild(document.getElementsByClassName('cc-gallery')[0]);
  };
  const currentConfig = { ...config, visible: true, close };

  ReactDOM.render(<Gallery {...currentConfig} />, div);

  return {
    close,
  };
};
Gallery.defaultProps = {
  index: 0,
  onClose: () => {},
};
Gallery.propTypes = {
  index: PropTypes.number,
  imgList: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]).isRequired,
  onClose: PropTypes.func,
};


export default Gallery;
