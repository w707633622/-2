import React, { Component } from 'react';
import ScrollElement from 'rc-scroll-anim/lib/ScrollElement';
import QueueAnim from 'rc-queue-anim';
import "./static/home.less"

function typeFunc(a) {
  if (a.key === 'line') {
    return 'right';
  } else if (a.key === 'button') {
    return 'bottom';
  }
  return 'left';
}

class Banner extends Component {
  constructor() {
    super();
    this.state = {
      SwiperOptions: {
        autoplay: {
          disableOnInteraction: false,
        },
        loop: true, // 环路
        grabCursor: true, // 拖动时指针会变成抓手形状
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: { // 分页器。如果放置在swiper-container外面，需要自定义样式
          el: '.swiper-pagination',
        },
      }
    }
  }

  componentDidMount() {
    var mySwiper = new window.Swiper('.swiper-container', this.state.SwiperOptions)
  }
  shouldComponentUpdate(nextProps, nextState) {
    var mySwiper = new window.Swiper('.swiper-container', this.state.SwiperOptions)
  }
  render() {
    return (
      <section className="page banner-wrapper">
        <ScrollElement
          className="page"
          id="banner"
          playScale={0.9}
        >
          <QueueAnim className="banner-text-wrapper" type={typeFunc} delay={300} key="banner">
            <h2 key="h2">安卓驿站</h2>
            <p key="content">一个 源码 展示交易的平台</p>
            <span className="line" key="line" />
            {/* <div key="button1" className="start-button clearfix">
              <a>
                设计规范
              </a>
              <a>
                开发指引
              </a>
            </div> */}
          </QueueAnim>
  
          <div id="swiper" className="swiper-container">
            <div className="swiper-wrapper">
              <div className="swiper-slide">
                <img className="swiper-wrapper" src={require("./static/img/market.png")} alt=""/>
              </div>
              <div className="swiper-slide">
                <img className="swiper-wrapper" src={require("./static/img/upload1.png")} alt="" />
              </div>
              <div className="swiper-slide">
                <img className="swiper-wrapper" src={require("./static/img/upload2.png")} alt="" />
              </div>
              <div className="swiper-slide">
                <img className="swiper-wrapper" src={require("./static/img/mywallet.png")} alt="" />
              </div>
              <div className="swiper-slide">
                <img className="swiper-wrapper" src={require("./static/img/tixian.png")} alt="" />
              </div>
            </div>
            <div className="swiper-button-prev"></div> {/* 左箭头。如果放置在swiper-container外面，需要自定义样式。 */}
            <div className="swiper-button-next"></div> {/* 右箭头。如果放置在swiper-container外面，需要自定义样式。 */}
            <div className="swiper-pagination"></div> {/* 分页器。如果放置在swiper-container外面，需要自定义样式。 */}
          </div>
        </ScrollElement>
      </section>
    )
  }
}

export default Banner

