require 'data_mapper'
require 'dm-migrations'
require 'carrierwave/datamapper'

class PhotoUploader < CarrierWave::Uploader::Base
  include CarrierWave::MiniMagick
  storage :file
  root ENV['UPLOAD_DIRECTORY'] || './'

  def store_dir
    [:dist, :img, :uploads, model.id, mounted_as].join('/')
  end

  process resize_to_limit: [1000, 1000]

  version(:cover) { process resize_to_fill: [700, 300] }
  version(:thumb) { process resize_to_fill: [125, 125] }
end

class Place
  include DataMapper::Resource

  property :id, Serial
  property :name, String, required: true
  property :subname, String

  mount_uploader :cover, PhotoUploader
  mount_uploader :photo_1, PhotoUploader
  mount_uploader :photo_2, PhotoUploader
  mount_uploader :photo_3, PhotoUploader
  mount_uploader :photo_4, PhotoUploader
  mount_uploader :photo_5, PhotoUploader

  def photos
    [photo_1, photo_2, photo_3, photo_4, photo_5].reject { |p| p.file.nil? }
  end

  def json
    {
      id:       self.id,
      name:     self.name,
      subname:  self.subname,
      coverUrl: self.cover.url(:cover),
      photos:   self.photos.map { |p| { view: p.url, thumb: p.url(:thumb) } }
    }
  end
end

DataMapper.setup(:default, ENV.fetch('DATABASE_URL', 'postgres://localhost/take_5_in_development'))
DataMapper.finalize
DataMapper.auto_upgrade!
