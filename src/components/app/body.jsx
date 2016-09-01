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
               <ul className="sidebar-content">
                 <li>
                   <h2>What is this?</h2>
                   <p>Take five in is a photo project by</p>
                 </li>
                 <li>
                   <h2>About the author</h2>
                   <p>James is a software developer</p>
                 </li>
               </ul>
             </BurgerMenu.scaleRotate>
             <main id="wrap">
               <Header />
               <PlaceCollection />
               <Footer />
             </main>
           </div>
   },


})
