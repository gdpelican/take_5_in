import React           from 'react'
import xhr             from 'xhr'
import FacebookLogin   from 'react-facebook-login'
import { Input, Textarea, Button, Space } from 'rebass'

export default React.createClass({
  getInitialState() {
    return { visible: false }
  },

  render() {
    let place = this.props.place || { photos: [] }
    let config = this.props.config
    let style = place.id ? { backgroundImage: `url(${place.coverUrl})` } : {}
    var contents
    var sync

    if (this.state.visible) {
      let photo_fields = [1,2,3,4,5].map(function(index) {
        let photo = place.photos[index-1] || {}
        return <div key={`photo_${index}`} className="nested-field">
                 <img src={photo.thumb} />
                 <div className="nested-field-inputs">
                   <Input label={`Photo ${index}:`} name={`photo_${index}`} type="file" />
                   <Textarea label={`Story ${index}:`} defaultValue={photo.story} name={`story_${index}`} rows="6" />
                 </div>
               </div>
      })

      if (!place.facebook.synced) {
        sync = <FacebookLogin
                 textButton="Sync with facebook"
                 appId={place.facebook.app_id}
                 scope={place.facebook.scopes}
                 callback={this.syncToFacebook} />
      }

      contents = <form method="post" encType="multipart/form-data" action={"/admin/places/" + (place.id || "")} className="place-form">
                   <div className="place-form-field">
                     <Input label="Name:" name="name" defaultValue={place.name} rounded placeholder="Grosse Pointe" />
                   </div>
                   <div className="place-form-field">
                     <Input label="Location:" name="subname" defaultValue={place.subname} rounded placeholder="Michigan" />
                   </div>
                   <div className="place-cover-field">
                     <Input label="Cover:" name="cover" type="file" />
                   </div>
                   <div className="place-photo-fields">{photo_fields}</div>
                   <div className="place-form-field">
                     <Button theme="primary" rounded type="submit" className="place-submit">Save</Button>
                     <Space x={1} />
                     {sync}
                     <Space x={1} />
                     <Button onClick={this.toggleForm} theme="secondary" rounded>Cancel</Button>
                   </div>
                 </form>
    } else {
      contents = <button className="place-button" onClick={this.toggleForm}>{place.id ? place.name : "+ Add new place"}</button>
    }

    return <li className="place">
             <div className="place-cover" style={style} />
             {contents}
           </li>
  },

  syncToFacebook(response) {
    if (response.accessToken) {
      xhr.post(`${window.location.origin}/admin/facebook/places/${this.props.place.id}/${response.accessToken}`, console.log)
      this.setState({ syncedToFacebook: true })
    } else {
      console.log('facebook login failed!')
    }
  },

  toggleForm(e) {
    e.preventDefault()
    this.setState({ visible: !this.state.visible })
  }
})
