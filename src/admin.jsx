import React           from 'react'
import ReactDOM        from 'react-dom'
import domready        from 'domready'
import PlaceCollection from './components/admin/place-collection'

domready(() => {
  ReactDOM.render(<PlaceCollection />, document.getElementById('placeForms'))
})
