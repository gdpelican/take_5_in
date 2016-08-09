import React       from 'react'
import FontAwesome from 'react-fontawesome'

export default React.createClass({
  getInitialState() {
    return { selected: this.props.selected.index }
  },

  render() {
    let backgrounds = this.props.backgrounds.map((background) => {
      if(background.index == this.state.selected) {
        return <FontAwesome key={background.index} name="circle" />
      } else {
        return <FontAwesome className="faded" onClick={this.select(background.index)} key={background.index} name="circle" />
      }
    })

    return <div className={this.props.className}>
             <div className="currently-in">
               <p>Currently in</p>
               <h2>{this.props.selected.title}, {this.props.selected.subtitle}</h2>
             </div>
             <div>
               {this.prev()}
               {backgrounds}
               {this.next()}
             </div>
           </div>
  },

  selectedIndices() {
    return this.props.backgrounds.map(function(background) { return background.index })
  },

  prev() {
    if (this.state.selected == Math.min(...this.selectedIndices())) { return null }
    return <FontAwesome className="adjacent faded" onClick={this.select(this.state.selected-1)} name="caret-left" />
  },

  next() {
    if (this.state.selected == Math.max(...this.selectedIndices())) { return null }
    return <FontAwesome className="adjacent faded" onClick={this.select(this.state.selected+1)} name="caret-right" />
  },

  select(index) {
    return () => {
      this.props.select(index)
      this.setState({ selected: index })
    }
  }

})
