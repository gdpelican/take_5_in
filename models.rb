require 'data_mapper'
require 'dm-migrations'
require 'dm-paperclip'

class Place
  include DataMapper::Resource
  include Paperclip::Resource

  property :id, Serial
  property :name, String, required: true
  property :subname, String

  def self.styles
    { thumb: "125x125#", view: "1000x" }
  end

  has_attached_file :cover,   styles: { cover: "700x300#" }
  has_attached_file :photo_1, styles: styles
  has_attached_file :photo_2, styles: styles
  has_attached_file :photo_3, styles: styles
  has_attached_file :photo_4, styles: styles
  has_attached_file :photo_5, styles: styles

  def photos
    [photo_1, photo_2, photo_3, photo_4, photo_5].select(&:exists?)
  end

  def json
    {
      id:       self.id,
      name:     self.name,
      subname:  self.subname,
      coverUrl: self.cover.url(:cover),
      photos:   self.photos.map { |p| { view: p.url(:view), thumb: p.url(:thumb) } }
    }
  end
end

DataMapper.setup(:default, ENV.fetch('DATABASE_URL', 'postgres://localhost/take_5_in_development'))
DataMapper.finalize
DataMapper.auto_upgrade!
