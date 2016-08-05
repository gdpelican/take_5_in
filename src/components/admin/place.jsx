import React     from 'react'
import { Input, Textarea, Button, Space } from 'rebass'

export default React.createClass({
  getInitialState() {
    return { visible: false }
  },

  render() {
    let place = this.props.place || {}
    let style = place.id ? { backgroundImage: `url(${place.coverUrl})` } : {}
    var contents

    if (this.state.visible) {
      let photo_fields = [1,2,3,4,5].map(function(index) {
        return <div key={`photo_${index}`} className="photo-form-field">
                 <Input label={`Photo ${index}:`} name={`photo_${index}`} type="file" />
                 <Textarea label={`Caption ${index}:`} defaultValue={(place.photos[index] || {}).caption} name={`caption_${index}`} />
               </div>
      })

      contents = <form method="post" encType="multipart/form-data" action={"/admin/places/" + (place.id || "")} className="place-form">
                   <div className="place-form-field">
                     <Input label="Name:" name="name" defaultValue={place.name} rounded placeholder="Grosse Pointe" />
                   </div>
                   <div className="place-form-field">
                     <Input label="Location:" name="subname" defaultValue={place.subname} rounded placeholder="Michigan" />
                   </div>
                   <div className="place-photo-fields">{photo_fields}</div>
                   <div className="place-form-field">
                     <Button theme="primary" rounded type="submit" className="place-submit">Save</Button>
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

  toggleForm(e) {
    e.preventDefault()
    this.setState({ visible: !this.state.visible })
  }
})
