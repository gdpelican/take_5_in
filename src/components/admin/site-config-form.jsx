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
    return <form method="post" encType="multipart/form-data" action={"/admin/config"} className="config-form">
             <div className="place-form-field">
               <Textarea label="Description:" name="description" defaultValue={config.description} />
             </div>
             <div className="place-form-field">
               <Input label="Avatar:" name="avatar" type="file" />
             </div>
             <div className="place-form-field">
               <Input label="Background:" name="background" type="file" />
             </div>
             <Button theme="primary" rounded type="submit" className="config-submit">Save</Button>
           </form>
  }
})
