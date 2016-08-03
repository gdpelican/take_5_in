require 'dotenv'

Dotenv.load!

class Array
  undef_method :to_hash if new.respond_to?(:to_hash) # woof.
end
