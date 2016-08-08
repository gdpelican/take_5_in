import React    from 'react'
import Spinner  from 'react-spinkit'

export default React.createClass({
  render() { return <Spinner noFadeIn className="loading" spinnerName="double-bounce" /> }
})
