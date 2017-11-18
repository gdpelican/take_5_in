import React     from 'react'
import { Input, Textarea, Button, Space } from 'rebass'

export default React.createClass({
  getInitialState() {
    return { visible: false }
  },

  render() {
    let place = this.props.place || { photos: [] }
    let style = place.id ? { backgroundImage: `url(${place.coverUrl})` } : {}
    var contents

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
                     <Button onClick={this.postToFacebook} theme="secondary" rounded disabled={place.synced.facebook}>Post to Facebook</Button>
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

  postToFacebook() {
    xhr.post(`${window.location.origin}/admin/facebook/places/${this.props.place.id}`, (err, res, body) => {
      if (err) { console.log(err); return }
      this.props.place.synced.facebook = true
    })
  },

  toggleForm(e) {
    e.preventDefault()
    this.setState({ visible: !this.state.visible })
  }
})
