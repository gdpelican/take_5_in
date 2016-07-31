require 'dm-paperclip'
require 'byebug'

Paperclip.config { |config| config.root = 'dist/img' }
Paperclip::Attachment.default_options.merge!({
  url:  '/dist/img/:class/:id/:attachment/:style/:basename.:extension',
  path: ':web_root:url'
})

class Array
  undef_method :to_hash if new.respond_to?(:to_hash) # woof.
end
