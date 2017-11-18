import React           from 'react'
import ReactMarkdown   from 'react-markdown'
import Spinner         from 'react-spinkit'
import FontAwesome     from 'react-fontawesome'
import Loading         from '../common/loading'
import { Text }        from 'rebass'


export default React.createClass({
  getInitialState() {
    return { selected: 0, loading: true, minified: false }
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
    if (this.state.selected == 0) { return <div className="angle-spacer" key="prev" /> }
    return <FontAwesome onClick={this.select(this.state.selected-1)} key="prev" name="angle-left" />
  },

  next() {
    if (this.state.selected == this.props.place.photos.length - 1) { return <div className="angle-spacer" key="next" /> }
    return <FontAwesome onClick={this.select(this.state.selected+1)} key="next" name="angle-right" />
  },

  preview() {
    let url = this.selectedImage().view
    return <div key={url} className="photo-preview">
             <img onClick={this.showImage} className={this.state.minified ? 'photo-preview-visible minified' : 'photo-preview-visible'} src={url} />
             <img className="photo-preview-hidden" src={url} />
             {this.selectedStoryIcon()}
             {this.selectedStory()}
           </div>
  },

  select(index) {
    return () => { this.setState({selected: index, minified: false}) }
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
