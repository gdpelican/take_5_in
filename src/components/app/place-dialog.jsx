import React           from 'react'
import Spinner         from 'react-spinkit'
import FontAwesome     from 'react-fontawesome'
import Loading         from '../common/loading'
import { Space, Text } from 'rebass'


export default React.createClass({
  getInitialState() {
    return { selected: 0, loading: true }
  },

  render() {
    if (!this.props.open) {
      return null
    } else if (this.state.loading) {
      return this.loadingContent()
    } else {
      return this.displayContent()
    }
  },

  loadingContent() {
    return <div className="preview-overlay">
             <Loading />
             {this.props.place.photos.map((urls, index) => {
               if (index == 0) {
                 return <img className="hidden" onLoad={this.imageLoaded} src={urls.view} key={urls.view} />
               } else {
                 return <img className="hidden" src={urls.view} key={urls.view} />
               }
             })}
             {this.props.place.photos.map((urls, index) => {
               return <img className="hidden" src={urls.thumb} key={urls.thumb} />
             })}
           </div>
  },

  displayContent() {
    return <div className="preview-overlay">
             <div className="preview-header">
               <div className="preview-title">{this.props.place.name}, {this.props.place.subname}</div>
               <FontAwesome onClick={this.props.close} name="times" />
             </div>
             <div className="preview-body">{[this.prev(),this.preview(),this.next()]}</div>
             <div className="preview-footer">{this.thumbs()}</div>
           </div>
  },

  imageLoaded() {
    this.setState({selected: 0, loading: false})
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
    return <div key={url} className="photo-preview">
             <img src={url} />
             {this.selectedCaption()}
           </div>
  },

  select(index) {
    return () => { this.setState({selected: index}) }
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
  }
})
