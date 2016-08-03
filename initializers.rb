require 'dotenv'

Dotenv.load!

CarrierWave.configuration do |config|
  storage :file
  root ENV['UPLOAD_DIRECTORY'] || './'
end

class Array
  undef_method :to_hash if new.respond_to?(:to_hash) # woof.
end
