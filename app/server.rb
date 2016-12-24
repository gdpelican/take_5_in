require './app/initializers'
require './app/models'

require 'cuba'
require 'cuba/render'
require 'cuba/safe'
require 'tilt/plain'

Cuba.use Rack::Session::Cookie, secret: ENV['SECRET_TOKEN'] || 'notthatsecret'
Cuba.use Rack::Static, urls: ['/dist/js', '/dist/css', '/dist/img']
Cuba.plugin Cuba::Safe
Cuba.plugin Cuba::Render
Cuba.settings[:render][:template_engine] = "html"
Cuba.settings[:render][:views] = "./dist/html"

Cuba.define do
  on('admin') { run Admin }

  on get, root do
    res.write partial('index')
  end

  on get, 'config' do
    res.headers[Rack::CONTENT_TYPE] = 'application/json'
    res.write Config.json.to_json
  end

  on get, 'places' do
    res.headers[Rack::CONTENT_TYPE] = 'application/json'
    res.write Place.all.map(&:json).to_json
  end

  on get, 'places/:id/photos' do |id|
    res.headers[Rack::CONTENT_TYPE] = 'application/json'
    res.write Place.get(id).photos.map(&:json).to_json
  end
end

class Admin < Cuba
  define do

    on get, root do
      ensure_admin { res.write partial('admin') }
    end

    on get, 'logout' do
      ensure_admin { session.delete(:is_admin) && res.redirect('/') }
    end

    on get, 'login' do
      session[:is_admin] ? res.redirect('/admin') : res.write(partial('login'))
    end

    on post, 'login', param('password') do |password|
      session[:is_admin] = password == ENV.fetch('ADMIN_PASSWORD', 'devpass')
      res.redirect '/admin'
    end

    # UPSERT config
    on post, 'config' do
      redirect { Config.upsert(config_params) }
    end

    # UPDATE place
    on post, 'places/:id' do |id|
      redirect { Place.get(id).update(place_params) }
    end

    # CREATE place
    on post, 'places' do
      redirect { Place.create(place_params) }
    end

    # DESTROY place
    on delete, 'places/:id' do |id|
      redirect { Place.get(id).destroy }
    end
  end

  def config_params
    resource_params([:description, :avatar,
                     :background_1, :background_2, :background_3, :background_4, :background_5,
                     :background_title_1, :background_title_2, :background_title_3, :background_title_4, :background_title_5,
                     :background_subtitle_1, :background_subtitle_2, :background_subtitle_3, :background_subtitle_4, :background_subtitle_5])
  end

  def place_params
    resource_params([:name, :subname, :cover,
                     :story_1, :story_2, :story_3, :story_4, :story_5,
                     :photo_1, :photo_2, :photo_3, :photo_4, :photo_5])
  end

  def resource_params(fields = [])
    req.params.select { |k,v| fields.include?(k.to_sym) }
  end

  def ensure_admin
    session[:is_admin] ? yield : res.redirect('/admin/login')
  end

  def redirect(location = '/admin')
    ensure_admin { yield ? res.redirect(location) : respond { false } }
  end

  def respond
    ensure_admin { yield ? res.write('ok') : res.status = 422; res.write('notok') }
  end
end
