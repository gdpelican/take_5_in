import React    from 'react'
import ReactDOM from 'react-dom'
import domready from 'domready'
import request  from 'request'
import Spinner  from 'react-spinkit'
import { Card, CardImage, Heading, Text } from 'rebass'

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
    return { loading: true }
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
      contents = <Card rounded>
                   <CardImage src={place.coverUrl} />
                   <div className="place-overlay" />
                   <div className="place-text">
                     <Heading>{place.name}</Heading>
                     <Text>{place.subname}</Text>
                   </div>
                 </Card>
    }

    return <li className="place" data-place={place.id}>{contents}</li>
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

domready(() => {
  ReactDOM.render(<Header />,          document.getElementById('header'))
  ReactDOM.render(<Bio/>,              document.getElementById('bio'))
  ReactDOM.render(<Footer/>,           document.getElementById('footer'))
  ReactDOM.render(<PlaceCollection />, document.getElementById('places'))
})
