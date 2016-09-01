import React   from 'react'
import xhr from 'xhr'
import Place   from './place'
import Loading from '../common/loading'

export default React.createClass({
  getInitialState() {
    return { places: [], loading: true }
  },

  componentDidMount(data) {
    xhr.get(`${window.location.origin}/places`, (err, res, body) => {
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
      return <ul id="places" className="place-collection">{places}</ul>
    } else {
      return <div className="no-places">No places stored!</div>
    }
  }
})
