import React     from 'react'
import xhr       from 'xhr'
import Loading   from '../common/loading'
import { Textarea, Input, Button } from 'rebass'
import FacebookLogin   from 'react-facebook-login'

export default React.createClass({
  getInitialState() {
    return { config: {}, loading: true }
  },

  componentDidMount(data) {
    xhr.get(`${window.location.origin}/config`, (err, res, body) => {
      if (err) { console.log(err); return }
      this.setState({config: JSON.parse(body), loading: false })
    })
  },

  storeAccessToken(response) {
    if (response.accessToken) {
      xhr.post(`${window.location.origin}/admin/facebook/${response.accessToken}`, (err, res, body) => {
        if (err) { console.log(err); return }
        console.log(res)
      })
    } else {
      console.log('facebook login failed!')
    }
  },

  render() {
    if (this.state.loading) { return <Loading /> }

    let config = this.state.config
    let background_fields = [1,2,3,4,5].map(function(index) {
      return <div key={`background_${index}`} className="nested-field">
               <img src={(config.backgrounds[index-1] || {}).thumb} />
               <Input label={`Background ${index}:`} name={`background_${index}`} type="file" />
               <Input label={`Background name ${index}:`} defaultValue={(config.backgrounds[index-1] || {}).title} name={`background_title_${index}`} />
               <Input label={`Background subtitle ${index}:`} defaultValue={(config.backgrounds[index-1] || {}).subtitle} name={`background_subtitle_${index}`} />
             </div>
    })

    return <form method="post" encType="multipart/form-data" action={"/admin/config"} className="config-form">
             <div className="nested-field-container">{background_fields}</div>
             <Button theme="primary" rounded type="submit" className="config-submit">Save</Button>
             <FacebookLogin
               scope="publish_pages,manage_pages"
               appId={config.facebook_app_id}
               autoLoad={true}
               callback={this.storeAccessToken} />
           </form>
  }
})
