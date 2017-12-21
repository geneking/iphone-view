import React from 'react'
import ReactDOM from 'react-dom'
import { toast, ToastContainer } from 'react-toastify'

import mockup from 'config/mockup'
import flex from 'config/flex'
import './index.css'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      canvas: null,
      context: null,
      x: flex.iphone_4_7.x,
      y: flex.iphone_4_7.y,
      height: flex.iphone_4_7.height,
      width: flex.iphone_4_7.width,
      canvasHeight: flex.iphone_4_7.canvasHeight,
      canvasWidth: flex.iphone_4_7.canvasWidth,
      size: '4_7',
      themeType: 'white',
      theme: mockup.white_4_7,
      combineSuccess: false,
    }
  }

  /**
   * [initCanvas 初始画布]
   */
  initCanvas = () => {
    const canvas = document.createElement('canvas')
    canvas.width = this.state.canvasWidth
    canvas.height = this.state.canvasHeight
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
      if (!callback) {
        // 模板
        this.state.context.drawImage(image, x, y)
      } else {
        // 截图
        this.state.context.drawImage(image, x, y, this.state.width, this.state.height)
        callback(this.state.canvas.toDataURL('image/png'))      }
    }
    image.src = url;
  }

  /**
   * [handleSwitchSize 尺寸切换]
   */
  handleSwitchSize = (e) => {
    this.reset(e.target.name, this.state.themeType)
  }

  /**
   * [handleSwitchType 黑白模板切换]
   */
  handleSwitchTheme = (e) => {
    this.reset(this.state.size, e.target.name)
  }

  /**
   * [combine 合成图片]
   * @param  {[type]}   url      [图片url]
   * @param  {Function} callback [合成后回调]
   */
  combine = (url, callback) => {
    this.draw(url, this.state.x, this.state.y, callback)
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
  reset = (size, themeType) => {
    const iphone = `iphone_${size}`
    document.getElementById('upload').value = ''
    this.state.context.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight)
    this.setState({
      x: flex[iphone].x,
      y: flex[iphone].y,
      height: flex[iphone].height,
      width: flex[iphone].width,
      canvasHeight: flex[iphone].canvasHeight,
      canvasWidth: flex[iphone].canvasWidth,
      combineSuccess: false,
      theme: mockup[`${themeType}_${size}`],
      size,
      themeType,
    }, ()=> {
      this.state.canvas.width = this.state.canvasWidth
      this.state.canvas.height = this.state.canvasHeight
      this.draw(this.state.theme, 0, 0)
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
                className={`type-button ${this.state.size === '4_7' ? 'active' : ''}`}
                name="4_7"
                onClick={this.handleSwitchSize}
              >4.7"</button>
              <button
                className={`type-button ${this.state.size === '5_5' ? 'active' : ''}`}
                name="5_5"
                onClick={this.handleSwitchSize}
              >5.5"</button>
            </div>
            <div className="type-wrap">
              <button
                className={`type-button ${this.state.themeType === 'white' ? 'active' : ''}`}
                name="white"
                onClick={this.handleSwitchTheme}
              >白色</button>
              <button
                className={`type-button ${!this.state.themeType === 'black' ? 'active' : ''}`}
                name="black"
                onClick={this.handleSwitchTheme}
              >黑色</button>
            </div>
            <div className="upload-wrap">
              <input type="file" id="upload" accept="image/*" />
              <button className="button">上传图片</button>
            </div>
            <a className="button" download href={this.state.theme} onClick={this.downloadImage}>下载图片</a>
            <button className="button" onClick={() => {
              this.reset(this.state.size, this.state.themeType)
            }}>重置</button>
          </div>
        </div>
        <ToastContainer autoClose={3000} />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
