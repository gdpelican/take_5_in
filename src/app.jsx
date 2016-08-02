import React    from 'react'
import ReactDOM from 'react-dom'
import domready from 'domready'
import request  from 'request'
import Spinner  from 'react-spinkit'
import FontAwesome             from 'react-fontawesome'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Card, CardImage, Heading, Text, Overlay, PanelHeader, PanelFooter, Panel, Space } from 'rebass'

const Header = React.createClass({
  render() {
    return <header>
             <h1>Take 5 in...</h1>
             <h2>A subtitle!</h2>
           </header>
  }
})

const PlaceCollection = React.createClass({
  getInitialState() {
    return { places: [], loading: true }
  },

  componentDidMount(data) {
    request.get(`http://localhost:9292/places`, (err, res, body) => {
      if (err) { console.log(err); return }

      this.setState({ key: Math.random(), loading: false, places: JSON.parse(body) })
    })
  },

  render() {
    if (this.state.loading) { return <Loading /> }

    let places = this.state.places.map(function(place) {
      return <Place key={place.id} place={place}></Place>
    })

    if (places.length) {
      return <ul className="place-collection">{places}</ul>
    } else {
      return <div className="no-places">No places stored!</div>
    }
  }
})

const Place = React.createClass({
  getInitialState() {
    return { loading: true, open: false }
  },

  render() {
    let place = this.props.place
    var contents

    if (this.state.loading) {
      contents = <Card rounded>
                   <img className="hidden" onLoad={this.imageLoaded} src={place.coverUrl} />
                   <Loading />
                 </Card>
    } else {
      let style = { backgroundImage: `url(${place.coverUrl})` }
      contents = <Card onClick={this.toggleOpen} style={style} rounded>
                   <div className="place-overlay" />
                   <div className="place-text">
                     <Heading>{place.name}</Heading>
                     <Text>{place.subname}</Text>
                   </div>
                 </Card>
    }

    return <li className="place" data-place={place.id}>
             {contents}
             <PlaceDialog open={this.state.open} close={this.toggleOpen} place={place} />
           </li>
  },

  toggleOpen() {
    this.setState({key: Math.random(), open: !this.state.open})
  },

  imageLoaded() {
    this.setState({key: Math.random(), loading: false})
  }
})

const Bio = React.createClass({
  render() {
    return <h2>My bio!</h2>
  }
})

const Footer = React.createClass({
  render() {
    return <footer>A footer!</footer>
  }
})

const Loading = React.createClass({
  render() { return <Spinner noFadeIn spinnerName="double-bounce" /> }
})

const PlaceDialog = React.createClass({
  getInitialState() {
    return { selected: 2, loading: true }
  },

  render() {
    if (!this.props.open) { return null }
    return <div className="preview-overlay">
      <div className="preview-header">
        <span>Take Five in</span>
        <FontAwesome onClick={this.props.close} name="times" />
      </div>
      <div className="preview-body">{[this.prev(),this.preview(),this.next()]}</div>
      <div className="preview-footer">{this.thumbs()}</div>
    </div>
  },

  prev() {
    if (this.state.selected == 0) { return <Space key="prev" x={4} /> }
    return <FontAwesome onClick={this.select(this.state.selected-1)} key="prev" name="angle-left" />
  },

  next() {
    if (this.state.selected == this.props.place.photos.length - 1) { return <Space key="next" x={4} /> }
    return <FontAwesome onClick={this.select(this.state.selected+1)} key="next" name="angle-right" />
  },

  preview() {
    let url = this.selectedImageUrl()
    if (this.state.loading) {
      return <img className="hidden" onLoad={this.imageLoaded} key={url} src={url} />
    } else {
      return <img key={url} src={url} />
    }
  },

  select(index) {
    return () => { this.setState({selected: index, loading: true}) }
  },

  thumbs() {
    return this.props.place.photos.map((urls, index) => {
      if (index == this.state.selected) {
        return <img className="selected" key={urls.view} src={urls.thumb} />
      } else {
        return <img onClick={this.select(index)} key={urls.view} src={urls.thumb} />
      }
    })
  },

  selectedImageUrl() {
    return (this.props.place.photos[this.state.selected] || {}).view
  },

  imageLoaded() {
    this.setState({key: Math.random(), loading: false})
  }
})

domready(() => {
  ReactDOM.render(<Header />,          document.getElementById('header'))
  ReactDOM.render(<Bio/>,              document.getElementById('bio'))
  ReactDOM.render(<Footer/>,           document.getElementById('footer'))
  ReactDOM.render(<PlaceCollection />, document.getElementById('places'))
})
