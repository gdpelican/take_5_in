require 'carrierwave/datamapper'

module TakeFiveUploader
  include CarrierWave::MiniMagick

  def auto_orient
    manipulate! { |img| img.auto_orient }
  end

  def store_dir
    [:dist, :img, :uploads, upload_directory, mounted_as].join('/')
  end
end

class BackgroundUploader < CarrierWave::Uploader::Base
  include TakeFiveUploader

  def upload_directory
    :config
  end

  storage :fog
  process :auto_orient
  version(:thumb) { process resize_to_fill: [125, 125] }
  version(:background) { process resize_to_limit: [1750, 1750] }
end

class PhotoUploader < CarrierWave::Uploader::Base
  include TakeFiveUploader

  def upload_directory
    model.id
  end

  storage :fog
  process :auto_orient
  version(:thumb) { process resize_to_fill: [125, 125] }
  version(:photo) { process resize_to_limit: [1250, 1250] }
end

class CoverUploader < CarrierWave::Uploader::Base
  include TakeFiveUploader

  def upload_directory
    model.id
  end

  storage :fog
  process :auto_orient
  version(:thumb) { process resize_to_fill: [125, 125] }
  version(:cover) { process resize_to_fill: [700, 300] }
end
