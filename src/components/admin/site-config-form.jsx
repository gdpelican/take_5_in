import React     from 'react'
import request   from 'request'
import Loading   from '../common/loading'
import { Textarea, Input, Button } from 'rebass'

export default React.createClass({
  getInitialState() {
    return { config: {}, loading: true }
  },

  componentDidMount(data) {
    request.get(`${window.location.origin}/config`, (err, res, body) => {
      if (err) { console.log(err); return }
      this.setState({config: JSON.parse(body), loading: false })
    })
  },

  render() {
    if (this.state.loading) { return <Loading /> }

    let config = this.state.config
    let background_fields = [1,2,3,4,5].map(function(index) {
      return <div key={`background_${index}`} className="nested-field">
               <Input label={`Background ${index}:`} name={`background_${index}`} type="file" />
               <Input label={`Background name ${index}:`} defaultValue={(config.backgrounds[index-1] || {}).title} name={`background_title_${index}`} />
               <Input label={`Background subtitle ${index}:`} defaultValue={(config.backgrounds[index-1] || {}).subtitle} name={`background_subtitle_${index}`} />
             </div>
    })

    return <form method="post" encType="multipart/form-data" action={"/admin/config"} className="config-form">
             <div className="place-form-field">
               <Textarea label="Description:" name="description" defaultValue={config.description} />
             </div>
             <div className="place-form-field">
               <Input label="Avatar:" name="avatar" type="file" />
             </div>
             <div className="nested-field-container">{background_fields}</div>
             <Button theme="primary" rounded type="submit" className="config-submit">Save</Button>
           </form>
  }
})