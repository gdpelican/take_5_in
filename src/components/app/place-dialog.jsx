import React           from 'react'
import ReactMarkdown   from 'react-markdown'
import Spinner         from 'react-spinkit'
import FontAwesome     from 'react-fontawesome'
import Loading         from '../common/loading'
import { Text }        from 'rebass'


export default React.createClass({
  getInitialState() {
    return {
      selected: 0,
      previous: null,
      minified: false,
      loaded: []
    }
  },

  render() {
    if (!this.props.open) {
      return null
    } else if (this.state.loaded.indexOf(this.state.selected) == -1) {
      return this.loadingContent()
    } else {
      return this.displayContent()
    }
  },

  componentDidUpdate() {
    const $body    = document.querySelector('body')
    if (this.props.open) {
      const $html    = document.querySelector('html')
      const $app     = document.querySelector('#app')
      const $content = document.querySelector('#content')

      $body.style = { overflow: 'hidden' }
      $html.style = $app.style = $content.style = {}
    } else {
      $body.style = {}
    }
  },

  loadingContent() {
    return <div className="preview-overlay loading">
              <div className="preview-header">
                <div className="preview-title">{this.props.place.name}, {this.props.place.subname}</div>
                <FontAwesome onClick={this.props.close} name="times" />
              </div>
              <div className="preview-body">{[
                <div className="angle-spacer" key="prev" />,
                this.loadingPreview(),
                <div className="angle-spacer" key="next" />
              ]}</div>
             <div className="preview-footer">{this.thumbs()}</div>
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

  prev() {
    if (this.state.selected == 0) { return <div className="angle-spacer" key="prev" /> }
    return <FontAwesome onClick={this.select(this.state.selected-1)} key="prev" name="angle-left" />
  },

  next() {
    if (this.state.selected == this.props.place.photos.length - 1) { return <div className="angle-spacer" key="next" /> }
    return <FontAwesome onClick={this.select(this.state.selected+1)} key="next" name="angle-right" />
  },

  loadingPreview() {
    let previous = this.previousImage().view
    let loading  = this.selectedImage().view
    return <div key={loading} className="photo-preview">
             <img className="photo-preview-hidden" src={loading} onLoad={this.imageLoaded} />
             <img className="photo-preview-visible previous" src={previous} />
             <Loading className="photo-preview--loading" />
           </div>
  },

  preview() {
    let url = this.selectedImage().view
    return <div key={url} className={this.state.minified ? 'photo-preview minified' : 'photo-preview'}>
             <img onClick={this.showImage} className="photo-preview-visible" src={url} />
             <img className="photo-preview-hidden" src={url} />
             {this.selectedStoryIcon()}
             {this.selectedStory()}
           </div>
  },

  select(index) {
    return () => { this.setState({ minified: false, previous: this.state.selected, selected: index }) }
  },

  imageLoaded() {
    this.setState({ loaded: this.state.loaded.concat(this.state.selected) })
  },

  previousImage() {
    return this.props.place.photos[this.state.previous] || {}
  },

  selectedImage() {
    return this.props.place.photos[this.state.selected] || {}
  },

  selectedStoryIcon() {
    if (!this.selectedStory() || this.state.minified) { return }
    return <FontAwesome key="info" onClick={this.showStory} name="question-circle" />
  },

  selectedStory() {
    let story = (this.selectedImage() || {}).story
    if (!story) { return null }
    return <div className="photo-preview-wrapper">
             <ReactMarkdown className="photo-preview-markdown" source={story} />
           </div>
  },

  showStory() {
    this.setState({ minified: true })
  },

  showImage() {
    this.setState({ minified: false })
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
