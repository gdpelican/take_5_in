import React    from 'react'
import ReactDOM from 'react-dom'
import domready from 'domready'
import request  from 'request'
import { Input, Space, Button } from 'rebass'

const PlaceCollection = React.createClass({
  getInitialState() {
    return { places: [], loading: true }
  },

  componentDidMount(data) {
    request.get(`http://localhost:9292/places`, (err, res, body) => {
      if (err) { console.log(err); return }
      this.setState({places: JSON.parse(body), loading: false })
    })
  },

  render() {
    if (this.state.loading) { return <div className="loading">Loading...</div> }

    let places = this.state.places.map(function(place) {
      return <Place key={place.id} place={place}></Place>
    }).concat(<Place key="new" />) // For creating a new Place
    return <ul className="place-forms">{places}</ul>
  }
})

const Place = React.createClass({
  getInitialState() {
    return { visible: false }
  },

  render() {
    let place = this.props.place || {}
    let style = place.id ? { backgroundImage: `url(${place.coverUrl})` } : {}
    var contents

    if (this.state.visible) {
      contents = <form method="post" encType="multipart/form-data" action={"/admin/places/" + (place.id || "")} className="place-form">
                   <div className="place-form-field">
                     <Input label="Name:" name="name" defaultValue={place.name} rounded placeholder="Grosse Pointe" />
                   </div>
                   <div className="place-form-field">
                     <Input label="Location:" name="subname" defaultValue={place.subname} rounded placeholder="Michigan" />
                   </div>
                   <div className="place-form-field">
                     <Input label="Cover photo:" name="cover" type="file" />
                   </div>
                   <div className="place-form-field">
                     <Input label="Photo 1:" name="photo_1" type="file" />
                   </div>
                   <div className="place-form-field">
                     <Input label="Photo 2:" name="photo_2" type="file" />
                   </div>
                   <div className="place-form-field">
                     <Input label="Photo 3:" name="photo_3" type="file" />
                   </div>
                   <div className="place-form-field">
                     <Input label="Photo 4:" name="photo_4" type="file" />
                   </div>
                   <div className="place-form-field">
                     <Input label="Photo 5:" name="photo_5" type="file" />
                   </div>
                   <div className="place-form-field">
                     <Button theme="primary" rounded type="submit" className="place-submit">Save</Button>
                     <Space x={1} />
                     <Button onClick={this.toggleForm} theme="secondary" rounded>Cancel</Button>
                   </div>
                 </form>
    } else {
      contents = <button className="place-button" onClick={this.toggleForm}>{place.id ? place.name : "+ Add new place"}</button>
    }

    return <li className="place">
             <div className="place-cover" style={style} />
             {contents}
           </li>
  },

  toggleForm(e) {
    e.preventDefault()
    this.setState({ visible: !this.state.visible })
  }
})

domready(() => {
  ReactDOM.render(<PlaceCollection />, document.getElementById('placeForms'))
})
