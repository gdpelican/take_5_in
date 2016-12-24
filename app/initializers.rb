require 'dotenv'
require 'carrierwave/datamapper'
require 'fog/aws'

Dotenv.load!

class Array
  undef_method :to_hash if new.respond_to?(:to_hash) # woof.
end

CarrierWave.configure do |config|
  case ENV.fetch("UPLOAD_STORAGE_METHOD", :file).to_sym
  when :file
    config.storage = :file
    config.root = './'
  when :aws
    config.fog_credentials = {
      provider:              'AWS',
      access_key_id:         ENV.fetch('S3_KEY'),
      secret_access_key:     ENV.fetch('S3_SECRET'),
      region:                ENV.fetch('S3_REGION')
    }
    config.fog_directory   = ENV.fetch('S3_BUCKET')
    config.fog_attributes  = {'Cache-Control' => 'max-age=315576000'}
    config.fog_public      = true
  end
end
