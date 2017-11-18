require './app/server'

class Scenarios
  def self.facebook
    Integrations::Facebook.store_token!
    Integrations::Facebook.post!(Place.last)
  end
end
