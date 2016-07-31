require 'data_mapper'
require 'dm-migrations'
require 'dm-paperclip'

class Place
  include DataMapper::Resource
  include Paperclip::Resource

  has n, :photos

  property :id, Serial
  property :name, String, required: true
  property :subname, String
  has_attached_file :cover, styles: { cover: "700x300#" }

  def json
    { id: self.id, name: self.name, subname: self.subname, coverUrl: self.cover.url(:cover) }
  end
end

class Photo
  include DataMapper::Resource
  include Paperclip::Resource

  belongs_to :place

  property :id, Serial
  has_attached_file :photo

  def json
    { id: self.id, place_id: self.place_id, url: self.photo.url }
  end
end

DataMapper.setup(:default, ENV['DATABASE_URL'] || 'postgres://localhost/take_5_in_development')
DataMapper.finalize
DataMapper.auto_upgrade!
