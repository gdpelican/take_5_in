import React           from 'react'
import ReactDOM        from 'react-dom'
import domready        from 'domready'
import Header          from './components/app/header'
import Bio             from './components/app/bio'
import Footer          from './components/app/footer'
import PlaceCollection from './components/app/place-collection'

domready(() => {
  ReactDOM.render(<Header />,          document.getElementById('header'))
  ReactDOM.render(<Bio/>,              document.getElementById('bio'))
  ReactDOM.render(<Footer/>,           document.getElementById('footer'))
  ReactDOM.render(<PlaceCollection />, document.getElementById('places'))
})
