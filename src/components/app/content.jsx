import React           from 'react'
import Header          from './header'
import PlaceCollection from './place-collection'
import Footer          from './footer'

export default React.createClass({

  render() {
    return <main id="content">
             <Header />
             <PlaceCollection />
             <Footer />
           </main>
  }
})
