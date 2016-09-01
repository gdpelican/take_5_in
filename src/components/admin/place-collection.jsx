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
      this.setState({places: JSON.parse(body), loading: false })
    })
  },

  render() {
    if (this.state.loading) { return <Loading /> }

    let places = this.state.places.map(function(place) {
      return <Place key={place.id} place={place}></Place>
    }).concat(<Place key="new" />) // For creating a new Place
    return <ul className="nested-field-container">{places}</ul>
  }
})
