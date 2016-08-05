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
      this.setState({config: JSON.parse(body), loading: false })
    })
  },

  render() {
    if (this.state.loading) { return <Loading /> }

    let config = this.state.config
    let selected = this.selectedBackground()
    let style = { backgroundImage: `url(${selected.url})` }
    return <header className="header" style={style}>
             <img src={config.avatar} />
             <div className="header-text">
               <p>{selected.title}</p>
               <p>{selected.subtitle}</p>
             </div>
             <BackgroundNavigator backgrounds={config.backgrounds} selected={this.state.selected} select={this.selectBackground} />
           </header>
  },

  selectBackground(index) {
    this.setState({ selected: index })
  },

  selectedBackground() {
    return this.state.config.backgrounds.find((b) => { return b.index == this.state.selected })
  }
})
