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
      ensure_admin(res) { res.write partial('admin') }
    end

    on get, 'logout' do
      ensure_admin(res) { session.delete(:is_admin) && res.redirect('/') }
    end

    on get, 'login' do
      session[:is_admin] ? res.redirect('/admin') : res.write(partial('login'))
    end

    on post, 'login', param('password') do |password|
      session[:is_admin] = password && (password == ENV['ADMIN_PASSWORD'] || 'devpass')
      res.redirect '/admin'
    end

    # UPDATE place
    on post, 'places/:id' do |id|
      ensure_admin(res) do
        if Place.get(id).update(place_params(req))
          res.redirect '/admin'
        else
          res.write 'notok', status: 422
        end
      end
    end

    # CREATE place
    on post, 'places' do
      ensure_admin(res) do
        if Place.create(place_params(req))
          res.redirect '/admin'
        else
          res.write 'notok', status: 422
        end
      end
    end

    # DESTROY place
    on delete, 'places/:id' do |id|
      ensure_admin(res) do
        Place.get(id).destroy
        res.redirect '/admin'
      end
    end

    # CREATE photo
    on post, 'photo' do
      ensure_admin(res) do
        if Photo.create(photo_params(req))
          res.redirect '/admin'
        else
          res.write 'notok', status: 422
        end
      end
    end

    # DESTROY photo
    on delete, 'photo/:id' do |id|
      ensure_admin(res) do
        Photo.get(id).destroy
        res.redirect '/admin'
      end
    end
  end

  def place_params(req)
    resource_params(req, [:name, :subname], [:cover, :photo_1, :photo_2, :photo_3, :photo_4, :photo_5])
  end

  def photo_params(req)
    resource_params(req, [:place_id], [:photo])
  end

  def resource_params(req, normal = [], upload = [])
    upload.map(&:to_s).each do |k|
      next unless req.params[k]
      req.params[k][:content_type] = req.params[k][:type]
      req.params[k][:size]         = req.params[k][:tempfile].size
    end
    req.params.select { |k,v| (normal|upload).include?(k.to_sym) }
  end

  def ensure_admin(res)
    session[:is_admin] ? yield : res.redirect('/admin/login')
  end

  def respond(res)
    ensure_admin(res) { yield ? res.write('ok') : res.write('notok', status: 422) }
  end
end
