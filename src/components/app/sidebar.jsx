import React       from 'react'
import BurgerMenu  from 'react-burger-menu'

export default React.createClass({

  render() {
    return <BurgerMenu.scaleRotate pageWrapId={"content"} outerContainerId={"app"}>
             <div className="sidebar-content">
               <h2>What is this?</h2>
               <p>
                 Take Five In is a photo project, in which I take 5 pictures for every place that I go.
                 Short, long, exciting, boring, tragic; doesn&#39;t matter, it&#39;s a small slice of life
                 from someone living on the road, 100% of the time.
               </p>
               <hr />
               <h2>Who made it?</h2>
               <p>
                 My name&#39;s James; I&#39;m an open source software developer who&#39;s
                 currently travelling the world while hacking on human interaction with <a href="https://www.loomio.org">Loomio</a>.
               </p>
               <hr />
               <h2>Want to hear more?</h2>
               <p>
                 Like something you see, want to hear more about a particular story or place, or use one of these pictures for something?
                 Come say hi! You can reach me <a href="http://www.twitter.com/gdpelican">on twitter</a> or at <a href="mailto:james@take-five.in">james@take-five.in</a>
               </p>
             </div>
           </BurgerMenu.scaleRotate>
  }
})
