require 'data_mapper'
require 'dm-migrations'
require 'carrierwave/datamapper'

class PhotoUploader < CarrierWave::Uploader::Base
  include CarrierWave::MiniMagick

  def store_dir
    [:dist, :img, :uploads, model.id, mounted_as].join('/')
  end

  process resize_to_limit: [1000, 1000]

  version(:cover) { process resize_to_fill: [700, 300] }
  version(:thumb) { process resize_to_fill: [125, 125] }
end

class ConfigUploader < CarrierWave::Uploader::Base
  include CarrierWave::MiniMagick

  def store_dir
    [:dist, :img, :uploads, :config, mounted_as].join('/')
  end

  version(:thumb) { process resize_to_fill: [125, 125] }
end

class Config
  include DataMapper::Resource

  property :id,               Serial
  property :description,      Text

  mount_uploader :background_1, ConfigUploader
  mount_uploader :background_2, ConfigUploader
  mount_uploader :background_3, ConfigUploader
  mount_uploader :background_4, ConfigUploader
  mount_uploader :background_5, ConfigUploader
  mount_uploader :avatar,       ConfigUploader

  property :background_title_1, String
  property :background_title_2, String
  property :background_title_3, String
  property :background_title_4, String
  property :background_title_5, String

  property :background_subtitle_1, String
  property :background_subtitle_2, String
  property :background_subtitle_3, String
  property :background_subtitle_4, String
  property :background_subtitle_5, String

  def self.upsert(params)
    puts params
    instance.update(params)
  end

  def self.json
    {
      backgrounds: instance.backgrounds,
    }
  end

  def self.instance
    first || create
  end

  def backgrounds
    (1..5).map { |i| background_json_for(i) }.compact
  end

  def background_json_for(index)
    return if send(:"background_#{index}").file.nil?
    {
      index:    index,
      url:      send(:"background_#{index}").url,
      title:    send(:"background_title_#{index}"),
      subtitle: send(:"background_subtitle_#{index}")
    }
  end
end

class Place
  include DataMapper::Resource

  property :id, Serial
  property :name, String, required: true
  property :subname, String

  # sorry mom.
  mount_uploader :cover,   PhotoUploader
  mount_uploader :photo_1, PhotoUploader
  mount_uploader :photo_2, PhotoUploader
  mount_uploader :photo_3, PhotoUploader
  mount_uploader :photo_4, PhotoUploader
  mount_uploader :photo_5, PhotoUploader

  property :caption_1, String
  property :caption_2, String
  property :caption_3, String
  property :caption_4, String
  property :caption_5, String

  def json_for_photo(index)
    photo = send(:"photo_#{index}")
    return if photo.file.nil?
    { view: photo.url, thumb: photo.url(:thumb), caption: send(:"caption_#{index}")  }
  end

  def photos
    (1..5).map { |i| json_for_photo(i) }.compact
  end

  def json
    {
      id:       self.id,
      name:     self.name,
      subname:  self.subname,
      coverUrl: self.cover.url(:cover),
      photos:   self.photos
    }
  end
end

DataMapper::Property::String.length(255)
DataMapper.setup(:default, ENV.fetch('DATABASE_URL', 'postgres://localhost/take_5_in_development'))
DataMapper.finalize
DataMapper.auto_upgrade!
