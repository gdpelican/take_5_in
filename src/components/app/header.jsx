import React               from 'react'
import Loading             from '../common/loading'
import BackgroundNavigator from './background-navigator'
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
    this.setState({ imagesLoaded: this.state.imagesLoaded+1 })
    if (this.state.imagesLoaded+1 >= this.backgrounds().length) {
      this.setState({ imagesLoaded: null, selected: 1, status: 'ready' })
    } else {
      this.setState({ imagesLoaded: this.state.imagesLoaded+1, status: 'imageLoad' })
    }
  },

  render() {
    switch(this.state.status) {
      case 'initialLoad':
        return <div><Loading /></div>
      case 'imageLoad':
        return <div>
                 <Loading />
                 {this.backgroundImages()}
               </div>
      case 'ready':
        let config = this.state.config
        return <div>
                 {this.backgroundDivs()}
                 <div className="header-over-image header-badge">
                   <h1>Take 5 in</h1>
                   <h2>{this.selectedBackground().title}</h2>
                   <p>{this.selectedBackground().subtitle}</p>
                 </div>
                 <div className="header-over-image header-see-more">See More</div>
                 <FontAwesome className="header-scroll-indicator" name="angle-down" />
                 <BackgroundNavigator backgrounds={this.backgrounds()} selected={this.state.selected} select={this.selectBackground} />
               </div>
    }
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

  selectedBackground() {
    return this.backgrounds().find((b) => {
      return b.index == this.state.selected
    })
  }
})
