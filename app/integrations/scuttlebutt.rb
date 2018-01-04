require 'json'
require 'httparty'

module Integrations
  class Scuttlebutt
    def self.post!(place)
      return if place.synced_to_scuttlebutt || !system("which sbot")
      system("sbot publish --type post --text \"#{text_for(place)}\"")

      place.update(synced_to_scuttlebutt: true)
    end

    def self.text_for(place)
      name = "### #{[place.name, place.subname].join(', ')}"
      content = (1..5).map do |index|
        "![](#{place.send(:"photo_#{index}").url(:photo)})\n#{place.send(:"story_#{index}")}"
      end.join("\n\n")
      [name, content].join("\n")
    end
  end
end
