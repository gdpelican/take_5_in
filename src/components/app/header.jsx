import React               from 'react'
import Loading             from '../common/loading'
import BackgroundNavigator from './background-navigator'
import request             from 'request'

export default React.createClass({
  getInitialState() {
    return { config: {}, loading: true, selected: 1 }
  },

  componentDidMount(data) {
    request.get(`${window.location.origin}/config`, (err, res, body) => {
      if (err) { console.log(err); return }
      this.setState({config: JSON.parse(body) })
    })
  },

  render() {
    if (this.state.loading) {
      return <header className="header">
               <div className="header-background-image hidden" />
               <Loading />
               <img onLoad={this.imageLoaded} className="hidden" src={(this.selectedBackground() || {}).url} />
             </header>
    } else {
      let config = this.state.config
      let selected = this.selectedBackground()
      let style = { backgroundImage: `url(${selected.url})` }
      return <header className="header">
               <div className="header-background-image" style={style} />
               <img src={config.avatar} />
               <div className="header-text">
                 <p>{selected.title}</p>
                 <p>{selected.subtitle}</p>
               </div>
               <div className="header-see-more">See More</div>
               <BackgroundNavigator backgrounds={config.backgrounds} selected={this.state.selected} select={this.selectBackground} />
             </header>
    }
  },

  imageLoaded() {
    window.requestAnimationFrame(() => {
      this.setState({ loading: false })
    })
  },

  selectBackground(index) {
    window.requestAnimationFrame(() => {
      this.setState({ selected: index, loading: true })
    })
  },

  selectedBackground() {
    if (!this.state.config.backgrounds) { return null }
    return this.state.config.backgrounds.find((b) => { return b.index == this.state.selected })
  }
})
