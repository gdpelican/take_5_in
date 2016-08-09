import React           from 'react'
import BurgerMenu      from 'react-burger-menu'
import FontAwesome     from 'react-fontawesome'
import Header          from './header'
import PlaceCollection from './place-collection'
import Footer          from './footer'

export default React.createClass({

  render() {
    return <div id="container">
             <BurgerMenu.scaleRotate pageWrapId={"wrap"} outerContainerId={"container"}>
               <a>Hello world!</a>
             </BurgerMenu.scaleRotate>
             <main id="wrap">
               <Header />
               <PlaceCollection />
               <Footer />
             </main>
           </div>
   },


})
