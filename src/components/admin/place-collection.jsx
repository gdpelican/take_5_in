import React   from 'react'
import request from 'request'
import Place   from './place'
import Loading from '../common/loading'

export default React.createClass({
  getInitialState() {
    return { places: [], loading: true }
  },

  componentDidMount(data) {
    request.get(`${window.location.origin}/places`, (err, res, body) => {
      if (err) { console.log(err); return }
      this.setState({places: JSON.parse(body), loading: false })
    })
  },

  render() {
    if (this.state.loading) { return <Loading /> }

    let places = this.state.places.map(function(place) {
      return <Place key={place.id} place={place}></Place>
    }).concat(<Place key="new" />) // For creating a new Place
    console.log(places)
    return <ul className="place-forms">{places}</ul>
  }
})
