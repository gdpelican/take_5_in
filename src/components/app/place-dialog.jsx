import React           from 'react'
import Spinner         from 'react-spinkit'
import FontAwesome     from 'react-fontawesome'
import { Space, Text } from 'rebass'


export default React.createClass({
  getInitialState() {
    return { selected: 0, loading: true }
  },

  render() {
    if (!this.props.open) { return null }
    return <div className="preview-overlay">
      <div className="preview-header">
        <div className="preview-title">
          <span>Take 5 in</span>
          <span>{this.props.place.name}, {this.props.place.subname}</span>
        </div>
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
    let url = this.selectedImage().view
    if (this.state.loading) {
      return <img className="hidden" onLoad={this.imageLoaded} key={url} src={url} />
    } else {
      return <div className="photo-preview">
               <img key={url} src={url} />
               {this.selectedCaption()}
             </div>
    }
  },

  select(index) {
    return () => { this.setState({selected: index, loading: true}) }
  },

  selectedImage() {
    return this.props.place.photos[this.state.selected] || {}
  },

  selectedCaption() {
    let caption = (this.selectedImage() || {}).caption
    if (!caption) { return null }
    return <Text>{caption}</Text>
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

  imageLoaded() {
    this.setState({key: Math.random(), loading: false})
  }
})
