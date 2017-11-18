require 'json'
require 'httparty'

module Integrations
  class Facebook
    @@access_token = nil

    def self.store_token!(token = nil)
      # get long term token from short term one
      user_token = get("oauth/access_token", {
        grant_type:        'fb_exchange_token',
        client_id:         ENV['FACEBOOK_APP_ID'],
        client_secret:     ENV['FACEBOOK_APP_SECRET'],
        fb_exchange_token: token || ENV['FACEBOOK_TEST_TOKEN']
      }, 'access_token')

      page_token = get(ENV['FACEBOOK_PAGE_ID'], {
        fields: :access_token,
        access_token: user_token
      }, 'access_token')

      @@access_token = page_token if page_token
      page_token.present?
    end

    def self.post!(place)
      return if place.synced_with_facebook

      # create an album
      album_id = post("#{ENV['FACEBOOK_PAGE_ID']}/albums", {
        location: place.full_name,
        name:     place.full_name,
      }, 'id')

      # upload cover photo
      post "#{album_id}/photos", url: place.cover.url(:cover)

      # upload pictures
      (1..5).each do |index|
        post "#{album_id}/photos", {
          url:     place.send(:"photo_#{index}").url(:photo),
          message: place.send(:"story_#{index}")
        }
      end
      place.update(synced_with_facebook: true)
    end

    def self.get(path, params, field = nil)
      perform :get, path, params, field
    end

    def self.post(path, params, field = nil)
      perform :post, path, params, field
    end

    def self.perform(method, path, params, field)
      response = HTTParty.send(method, api_url_for(path), query: params.reverse_merge(access_token: @@access_token)).parsed_response
      field ? response[field] : response
    end

    def self.api_url_for(path, version: "v2.8")
      "https://graph.facebook.com/#{version}/#{path}"
    end
  end
end
