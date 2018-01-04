import React           from 'react'
import xhr             from 'xhr'
import Loading         from '../common/loading'
import FacebookLogin   from 'react-facebook-login'
import { Input, Textarea, Button, Space } from 'rebass'

export default React.createClass({
  getInitialState() {
    return { visible: false, deleted: false, facebookSyncState: 'ready', scuttlebuttSyncState: 'ready' }
  },

  render() {
    if (this.state.deleted) { return <div className="destroyed" /> }

    let place = this.props.place || { photos: [], facebook: {} }
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

      var fbSync
      if (place.facebook.synced || this.state.facebookSyncState == 'complete') {
        fbSync = <Button theme="secondary" disabled="disabled">Synced to Facebook!</Button>
      } else if (this.state.facebookSyncState == 'loading') {
        fbSync = <Loading />
      } else if (this.state.facebookSyncState == 'ready'){
        fbSync = <FacebookLogin
          textButton="Sync to facebook"
          appId={place.facebook.app_id}
          scope={place.facebook.scopes}
          callback={this.syncToFacebook} />
      }

      var sbSync
      if (place.scuttlebutt.synced || this.state.scuttlebuttSyncState == 'complete') {
        sbSync = <Button theme="secondary" disabled="disabled">Synced to Scuttlebutt!</Button>
      } else if (this.state.scuttlebuttSyncState == 'loading') {
        sbSync = <Loading />
      } else if (this.state.scuttlebuttSyncState == 'ready') {
        sbSync = <Button theme="primary" type="button" onClick={this.syncToScuttlebutt}>Sync to Scuttlebutt</Button>
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
                     {fbSync}
                     <Space x={1} />
                     {sbSync}
                     <Space x={1} />
                     <Button type="button" onClick={this.deletePlace} theme="warning" rounded>Destroy</Button>
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

  deletePlace(response) {
    if (!confirm("Are you sure?")) { return }
    xhr.del(`${window.location.origin}/admin/places/${this.props.place.id}`, (err) => {
      if (err) {
        console.log(err)
      } else {
        this.setState({ deleted: true })
      }
    })
  },

  syncToFacebook(response) {
    if (response.accessToken) {
      this.setState({ facebookSyncState: 'loading' })
      xhr.post(`${window.location.origin}/admin/facebook/places/${this.props.place.id}/${response.accessToken}`, (err) => {
        if (err) { console.log(err) }
        this.setState({ facebookSyncState: 'complete' })
      })
    } else {
      console.log('facebook login failed!')
    }
  },

  syncToScuttlebutt() {
    this.setState({ scuttlebuttSyncState: 'loading' })
    xhr.post(`${window.location.origin}/admin/scuttlebutt/places/${this.props.place.id}`, (err) => {
      if (err) {
        console.log(err)
      } else {
        this.setState({ scuttlebuttSyncState: 'complete' })
      }
    })
  },

  toggleForm(e) {
    e.preventDefault()
    this.setState({ visible: !this.state.visible })
  }
})
