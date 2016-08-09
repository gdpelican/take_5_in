import React               from 'react'
import BackgroundNavigator from './background-navigator'
import HeaderBadge         from './header-badge'
import request             from 'request'
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
    request.get(`${window.location.origin}/config`, (err, res, body) => {
      if (err) { console.log(err); return }
      this.setState({config: JSON.parse(body), status: 'imageLoad', imagesLoaded: 0 })
    })
  },

  imageLoaded() {
    if (this.state.imagesLoaded+1 >= this.backgrounds().length) {
      this.setState({ imagesLoaded: null, selected: 1, status: 'ready' })
    } else {
      this.setState({ imagesLoaded: this.state.imagesLoaded+1, status: 'imageLoad' })
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
             <a href="#places" className="header-see-more">
               <span>See more</span>
               <FontAwesome className={this.state.status + ' header-scroll-indicator'} name="angle-down" />
             </a>
             {navigator}
           </div>
  },

  selectBackground(selected) {
    this.setState({ selected: selected })
  },

  backgroundImages() {
    return this.backgrounds().map((b) => {
      return <img onLoad={this.imageLoaded} src={b.url} key={b.index} style={{display: 'none'}} />
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
