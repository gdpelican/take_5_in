import React           from 'react'
import ReactDOM        from 'react-dom'
import domready        from 'domready'
import Sidebar         from './components/app/sidebar'
import Header          from './components/app/header'
import PlaceCollection from './components/app/place-collection'
import Footer          from './components/app/footer'

domready(function() {
  ReactDOM.render(<Sidebar />,         document.getElementById('sidebar'))
  ReactDOM.render(<Header />,          document.getElementById('header'))
  ReactDOM.render(<PlaceCollection />, document.getElementById('places'))
  ReactDOM.render(<Footer/>,           document.getElementById('footer'))
})
