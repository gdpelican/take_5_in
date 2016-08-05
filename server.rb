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
      session[:is_admin] = password == ENV.fetch('ADMIN_PASSWORD', 'devpass'))
      res.redirect '/admin'
    end

    # UPDATE place
    on post, 'places/:id' do |id|
      redirect { Place.get(id).update(place_params(req)) }
    end

    # CREATE place
    on post, 'places' do
      redirect { Place.create(place_params(req)) }
    end

    # DESTROY place
    on delete, 'places/:id' do |id|
      redirect { Place.get(id).destroy }
    end
  end

  def place_params(req)
    resource_params(req, [:name, :subname, :cover,
                          :caption_1, :caption_2, :caption_3, :caption_4, :caption_5,
                          :photo_1, :photo_2, :photo_3, :photo_4, :photo_5])
  end

  def resource_params(req, normal = [], upload = [])
    upload.map(&:to_s).each do |k|
      next unless req.params[k]
      req.params[k][:content_type] = req.params[k][:type]
      req.params[k][:size]         = req.params[k][:tempfile].size
    end
    req.params.select { |k,v| (normal|upload).include?(k.to_sym) }
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
