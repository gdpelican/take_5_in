require 'dotenv'
require 'carrierwave/datamapper'
require 'carrierwave-aws'

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
    config.storage = :aws
    config.aws_acl         = 'public-read'
    config.aws_bucket      = ENV.fetch('S3_BUCKET')
    config.aws_credentials = {
      access_key_id:         ENV.fetch('S3_KEY'),
      secret_access_key:     ENV.fetch('S3_SECRET'),
      region:                ENV.fetch('S3_REGION')
    }
  end
end
