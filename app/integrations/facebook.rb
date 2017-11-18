require 'json'
require 'httparty'

module Integrations
  class Facebook

    def self.store_token!(token)
      # get long term token from short term one
      long_term_token = HTTParty.get("https://graph.facebook.com/oauth/access_token", query: {
        grant_type:        'fb_exchange_token',
        client_id:         ENV['FACEBOOK_APP_ID'],
        client_secret:     ENV['FACEBOOK_APP_SECRET'],
        fb_exchange_token: token
      }).parsed_response['access_token']
      @@access_token = long_term_token if long_term_token
      long_term_token.present?
    end

    def self.post!(place)
      # create an album
      perform_post("#{ENV['FACEBOOK_PAGE_ID']}/albums", {
        location: place.full_name,
        name:     place.full_name,
      }).parsed_response

      upload_path = "#{album_id}/photos"

      # upload cover photo
      perform_post upload_path, url: place.cover.url(:photo)

      # upload pictures
      [1..5].each do |index|
        perform_post upload_path, {
          url:     place.send(:"photo_#{index}").url(:photo),
          message: place.send(:"story_#{index}")
        }
      end
    end

    def self.perform_post(path, params = {})
      HTTParty.post("https://graph.facebook.com/v2.8/#{path}", query: params.merge(access_token: @@access_token))
    end
  end
end
