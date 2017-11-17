import ReactDOM from 'react-dom'
import domready from 'domready'
import Sidebar  from './components/app/sidebar'
import Content  from './components/app/content'

domready(() => {
  ReactDOM.render(
    <div>
      <Sidebar />
      <Content />
    </div>, document.getElementById('app'))
})
