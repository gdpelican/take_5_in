import React           from 'react'
import ReactDOM        from 'react-dom'
import domready        from 'domready'
import Body            from './components/app/body'

domready(function() {
  ReactDOM.render(<Body />, document.getElementById('app'))
})
