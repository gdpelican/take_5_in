# Load DSL and set up stages
require "capistrano/setup"

# Include default deployment tasks
require "capistrano/deploy"

# Include tasks from other gems included in your Gemfile
# For documentation on these, see for example:
require 'capistrano/rvm'
require 'capistrano/bundler'
require 'capistrano/npm'
require 'capistrano/nginx'

namespace :deploy do
  desc 'Build clientside app'
  task :build_clientside_app do
    on roles(:app) do
      within current_path do
        execute :mkdir, '-p dist/js'
        execute :npm, "run app"
        execute :npm, "run admin"
        execute :pwd
        execute :which, 'rackup'
      end
    end
  end

  task :run_server do
    on roles(:app) do
      within(current_path) do
        execute :pwd
        execute :which, 'rackup'
        # execute :rackup
      end
    end
  end
end
after "deploy:published", "build_clientside_app"
after "deploy:finished", "run_server"
