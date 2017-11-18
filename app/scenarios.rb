require './app/server'

class Scenarios
  def self.facebook
    Integrations::Facebook.store_token!(ENV['FACEBOOK_TEST_TOKEN'])
    Integrations::Facebook.post!(Place.last)
  end
end
