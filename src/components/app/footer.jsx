import React       from 'react'
import FontAwesome from 'react-fontawesome'

export default React.createClass({
  render() {
    return <footer className="footer">
             <div className="created-by">
              <span>Created on the </span>
                <img src="/dist/img/emojis/road.png" />
                <span> with </span>
                <img className="no-radius" src="/dist/img/emojis/love.png" />
                <span> by </span>
                <a href="https://www.github.com/gdpelican">
                  <img src="/dist/img/emojis/james.png" />
                </a>
              </div>
              <div className="get-in-touch">
                <a href="mailto:james.kiesel@gmail.com"><FontAwesome name="envelope" /></a>
                <a href="https://www.facebook.com/james.kiesel" target="_blank"><FontAwesome name="facebook" /></a>
                <a href="https://github.com/gdpelican" target="_blank"><FontAwesome name="github" /></a>
                <a href="https://twitter.com/gdpelican" target="_blank"><FontAwesome name="twitter" /></a>
              </div>
              <div className="copyright">
                <span>Copyright</span>
                <span className="copyright-symbol"> © </span>
                <span>{new Date().getFullYear()} James Kiesel</span>
              </div>
           </footer>
  }
})
