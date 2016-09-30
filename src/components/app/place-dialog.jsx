import React           from 'react'
import ReactMarkdown   from 'react-markdown'
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
             <div className="hidden">
               {this.previews()}
               {this.thumbs()}
             </div>
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
             {this.selectedStory()}
           </div>
  },

  select(index) {
    return () => { this.setState({selected: index}) }
  },

  selectedImage() {
    return this.props.place.photos[this.state.selected] || {}
  },

  selectedStory() {
    let story = (this.selectedImage() || {}).story
    if (!story) { return null }
    return <ReactMarkdown className="photo-preview-wrapper" source={story} />
  },

  previews() {
    return this.props.place.photos.map((urls, index) => {
      if (index == 0) {
        return <img onLoad={this.imageLoaded} src={urls.view} key={urls.view} />
      } else {
        return <img src={urls.view} key={urls.view} />
      }
    })
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
