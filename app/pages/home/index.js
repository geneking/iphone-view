import React from 'react'
import ReactDOM from 'react-dom'
import { toast, ToastContainer } from 'react-toastify'

import './index.css'
import iphoneWhiteImg from '../../assets/iphone_white.png'
import iphoneBlackImg from '../../assets/iphone_black.png'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      canvas: null,
      context: null,
      height: 1761,
      width: 854,
      whiteTheme: true,
      theme: iphoneWhiteImg,
      combineSuccess: false,
    }
  }

  /**
   * [initCanvas 初始画布]
   */
  initCanvas = () => {
    const canvas = document.createElement('canvas')
    canvas.width = this.state.width
    canvas.height = this.state.height
    const context = canvas.getContext('2d')
    this.setState({
      context,
      canvas,
    })
  }

  /**
   * [draw description]
   * @param  {[type]}   url      [图片url]
   * @param  {[type]}   x        [相对x偏移]
   * @param  {[type]}   y        [相对y偏移]
   * @param  {Function} callback [合成后回调]
   */
  draw = (url, x, y, callback) => {
    const image = new Image();
    image.onload = () => {
      this.state.context.drawImage(image, x, y)
      callback && callback(this.state.canvas.toDataURL('image/png'))
    }
    image.src = url;
  }

  /**
   * [handleSwitchType 黑白模板切换]
   */
  handleSwitchType = () => {
    this.reset()
    this.setState({
      theme: this.state.whiteTheme ? iphoneBlackImg : iphoneWhiteImg,
      whiteTheme: !this.state.whiteTheme,
    }, () => {
      this.draw(this.state.theme, 0, 0)
    })
  }

  /**
   * [combine 合成图片]
   * @param  {[type]}   url      [图片url]
   * @param  {Function} callback [合成后回调]
   */
  combine = (url, callback) => {
    this.draw(url, 58, 215, callback)
  }

  /**
   * [downloadImage 下载图片]
   * @param  {[type]} event [description]
   */
  downloadImage = (event) => {
    if (this.state.combineSuccess) return
    toast.warn("图片暂未合成，请上传合成后下载", {
      position: toast.POSITION.BOTTOM_RIGHT,
    })
    event.preventDefault()
  }

  /**
   * [reset 重置画布]
   */
  reset = () => {
    this.state.context.clearRect(0, 0, this.state.height, this.state.width)
    this.setState({
      combineSuccess: false,
      theme: this.state.whiteTheme ? iphoneWhiteImg : iphoneBlackImg,
    })
  }

  /**
   * [uploadImage 上传图片回调]
   * @param  {[type]} event [description]
   */
  uploadImage = (event) => {
    const reader = new FileReader()
    const file = event.target.files[0] || event.dataTransfer.files[0]
    reader.onload = (e) => {
      const base64 = e.target.result;
      if (base64.length > 1024 * 1536) {
        toast.warn("图片大小不能超过1.5M", {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
        return
      }
      this.combine(base64,  (url) => {
        this.setState({
          theme: url,
          combineSuccess: true,
        })
      })
    }
    reader.readAsDataURL(file)
  }

  componentDidMount() {
    this.initCanvas()
    this.draw(this.state.theme, 0, 0)
    document.getElementById('upload').addEventListener('change', this.uploadImage)
  }

  componentWillUnmount() {
    document.getElementById('upload').removeEventListener('change', this.uploadImage)
  }

  render () {
    return (
      <div className="content">
        <div className="left">
          <img src={this.state.theme} />
        </div>
        <div className="right">
          <div className="right-inner">
            <div className="type-wrap">
              <button
                className={`type-button ${this.state.whiteTheme ? 'active' : ''}`}
                onClick={this.handleSwitchType}
              >白色</button>
              <button
                className={`type-button ${!this.state.whiteTheme ? 'active' : ''}`}
                onClick={this.handleSwitchType}
              >黑色</button>
            </div>
            <div className="upload-wrap">
              <input type="file" id="upload" accept="image/*" />
              <button className="button">上传图片</button>
            </div>
            <a className="button" download href={this.state.theme} onClick={this.downloadImage}>下载图片</a>
            <button className="button" onClick={this.reset}>重置</button>
          </div>
        </div>
        <ToastContainer autoClose={3000} />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
