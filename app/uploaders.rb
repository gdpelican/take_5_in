require 'carrierwave/datamapper'

class Uploader < CarrierWave::Uploader::Base
  include CarrierWave::MiniMagick

  def store_dir
    [:dist, :img, :uploads, upload_directory, mounted_as].join('/')
  end

  def upload_directory
    model.id
  end

  version(:thumb) { process resize_to_fill: [125, 125] }
end

class PhotoUploader < Uploader
  version(:photo) { process resize_to_limit: [1250, 1250] }
end

class BackgroundUploader < Uploader
  def upload_directory
    :config
  end

  version(:background) { process resize_to_limit: [1750, 1750] }
end

class CoverUploader < Uploader
  version(:cover) { process resize_to_fill: [700, 300] }
end
