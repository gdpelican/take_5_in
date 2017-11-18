require 'json'
require 'httparty'

module Integrations
  class Facebook
    @@access_token = nil

    def self.store_token!(token = nil)

      # get page token
      page_token = get(ENV['FACEBOOK_PAGE_ID'], {
        fields: :access_token,
        access_token: token
      }, 'access_token')

      @@access_token = page_token if page_token
      page_token.present?
    end

    def self.post!(place, token)
      return if place.synced_with_facebook

      page_token = get(ENV['FACEBOOK_PAGE_ID'], {
        fields: :access_token,
        access_token: token
      }, 'access_token')

      # create an album
      album_id = post("#{ENV['FACEBOOK_PAGE_ID']}/albums", {
        location:     place.full_name,
        name:         place.full_name,
        access_token: page_token
      }, 'id')

      # upload cover photo
      post("#{album_id}/photos", {
        url: place.cover.url(:cover),
        access_token: page_token
      })

      # upload pictures
      (1..5).each do |index|
        post("#{album_id}/photos", {
          url:          place.send(:"photo_#{index}").url(:photo),
          message:      place.send(:"story_#{index}"),
          access_token: page_token
        })
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
