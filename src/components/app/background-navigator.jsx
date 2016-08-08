import React       from 'react'
import FontAwesome from 'react-fontawesome'

export default React.createClass({
  getInitialState() {
    return { selected: this.props.selected }
  },

  render() {
    let backgrounds = this.props.backgrounds.map((background) => {
      if(background.index == this.state.selected) {
        return <FontAwesome key={background.index} name="circle" />
      } else {
        return <FontAwesome className="faded" onClick={this.select(background.index)} key={background.index} name="circle" />
      }
    })

    return <div className="background-navigator">
             {this.prev()}
             {backgrounds}
             {this.next()}
           </div>
  },

  selectedIndices() {
    return this.props.backgrounds.map(function(background) { return background.index })
  },

  prev() {
    if (this.state.selected == Math.min(...this.selectedIndices())) { return null }
    return <FontAwesome className="adjacent" onClick={this.select(this.state.selected-1)} name="angle-up" />
  },

  next() {
    if (this.state.selected == Math.max(...this.selectedIndices())) { return null }
    return <FontAwesome className="adjacent" onClick={this.select(this.state.selected+1)} name="angle-down" />
  },

  select(index) {
    return () => {
      this.props.select(index)
      this.setState({ selected: index })
    }
  }

})
