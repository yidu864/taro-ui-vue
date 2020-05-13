import Taro from '@tarojs/taro'
import classNames from 'classnames'

export default {
  name: 'Message',
  props: {
    customStyle: {
      type: [Object, String],
      default: '',
    },
    className: {
      type: [Array, String],
      default: '',
    },
  },
  data() {
    return {
      timer: null,
      state: {
        _isOpened: false,
        _message: '',
        _type: 'info',
        _duration: 3000,
      },
    }
  },
  mounted() {
    this.bindMessageListener()
  },
  beforeDestroy() {
    Taro.eventCenter.off('atMessage')
  },
  methods: {
    setState(newState, fn) {
      const ks = Object.keys(newState)
      if (Array.isArray(ks)) {
        ks.forEach((k) => {
          if (k in this.state) {
            this.state[k] = newState[k]
          }
        })
      }
      typeof fn === 'function' && fn.call(this)
    },
    bindMessageListener() {
      Taro.eventCenter.on('atMessage', (options = {}) => {
        const { message, type, duration } = options
        const newState = {
          _isOpened: true,
          _message: message,
          _type: type,
          _duration: duration || this.state._duration,
        }
        this.setState(newState, () => {
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.setState({
              _isOpened: false,
            })
          }, this.state._duration)
        })
      })
      // 绑定函数
      Taro.atMessage = Taro.eventCenter.trigger.bind(Taro.eventCenter, 'atMessage')
    },
  },
  render() {
    const { className, customStyle } = this
    const { _message, _isOpened, _type } = this.state
    const rootCls = classNames(
      {
        'at-message': true,
        'at-message--show': _isOpened,
        'at-message--hidden': !_isOpened,
      },
      `at-message--${_type}`,
      className
    )

    return (
      <view class={rootCls} style={customStyle}>
        {_message}
      </view>
    )
  },
}
