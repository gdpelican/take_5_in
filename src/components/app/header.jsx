import React               from 'react'
import BackgroundNavigator from './background-navigator'
import HeaderBadge         from './header-badge'
import xhr                 from 'xhr'
import Scroll              from 'react-scroll'
import FontAwesome         from 'react-fontawesome'

export default React.createClass({
  getInitialState() {
    return {
      config: {},
      status: 'initialLoad',
      selected: null
    }
  },

  backgrounds() {
    return this.state.config.backgrounds || []
  },

  componentDidMount(data) {
    xhr.get(`${window.location.origin}/config`, (err, res, body) => {
      if (err) { console.log(err); return }
      this.setState({config: JSON.parse(body), status: 'imageLoad', imagesLoaded: 0 })
    })
  },

  imageLoaded(index) {
    return () => {
      if (index != 1) { return }
      this.setState({ selected: 1, status: 'ready' })
    }
  },

  render() {
    var content   = null
    var navigator = null

    switch(this.state.status) {
      case 'imageLoad': content = this.backgroundImages(); break
      case 'ready':     content = this.backgroundDivs(); break
    }

    if (this.selectedBackground()) {
      navigator = <BackgroundNavigator className={this.state.status + ' header-over-image background-navigator'}
                                       backgrounds={this.backgrounds()}
                                       selected={this.selectedBackground()}
                                       select={this.selectBackground} />
    }

    return <div className="header">
             <HeaderBadge className={this.state.status + ' header-over-image header-badge'} />
             {content}
             <a onClick={this.scroll} className="header-see-more">
               <span>Let&#39;s go!</span>
               <FontAwesome className={this.state.status + ' header-scroll-indicator'} name="angle-down" />
             </a>
             {navigator}
           </div>
  },

  scroll() {
    Scroll.animateScroll.scrollTo(document.querySelector('#places').offsetTop)
  },

  selectBackground(selected) {
    this.setState({ selected: selected })
  },

  backgroundImages() {
    return this.backgrounds().map((b) => {
      return <img onLoad={this.imageLoaded(b.index)} src={b.url} key={b.index} style={{display: 'none'}} />
    })
  },

  backgroundDivs() {
    return this.backgrounds().map((b) => {
      let className = 'header-background-image'
      if (b.index != this.state.selected) { className += ' hidden' }
      return <div className={className} key={b.index} style={{ backgroundImage: `url(${b.url})` }} />
    })
  },

  navigator() {
    return <BackgroundNavigator status={this.state.status}
                                backgrounds={this.backgrounds()}
                                selected={this.state.selected}
                                select={this.selectBackground} />
  },

  selectedBackground() {
    return this.backgrounds().find((b) => {
      return b.index == this.state.selected
    })
  },

  toggleSidebar() {
    document.body.classList.toggle('sidebar-open')
  }
})
