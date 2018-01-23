import React                   from 'react'
import Spinner                 from 'react-spinkit'
import { Card, Heading, Text } from 'rebass'
import PlaceDialog             from './place-dialog'
import Loading                 from '../common/loading'

export default React.createClass({
  getInitialState() {
    return { loading: true, open: this.props.initialPlaceId == this.props.place.id }
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
