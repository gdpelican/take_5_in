import React from 'react'
import Loading from '../common/loading'

export default React.createClass({
  render() {
    return <div className={this.props.className}>
             <h1 className="header-title">
               <span>Take</span>
               <span className="five">5</span>
               <span>In...</span>
             </h1>
             <h2 className="header-subtitle">Dozens of places. Five pictures each.</h2>
             <Loading className="loading" />
           </div>
  }
})
