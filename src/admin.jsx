import ReactDOM        from 'react-dom'
import domready        from 'domready'
import PlaceCollection from './components/admin/place-collection'
import SiteConfigForm  from './components/admin/site-config-form'

domready(() => {
  ReactDOM.render(<SiteConfigForm />,  document.getElementById('siteConfig'))
  ReactDOM.render(<PlaceCollection />, document.getElementById('placeForms'))
})
