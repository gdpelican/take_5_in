# Load DSL and set up stages
require "capistrano/setup"

# Include default deployment tasks
require "capistrano/deploy"

# Include tasks from other gems included in your Gemfile
# For documentation on these, see for example:
require 'capistrano/rvm'
require 'capistrano/bundler'
require 'capistrano/npm'

namespace :deploy do
  desc 'Build clientside app'
  task :build_clientside_app do
    on roles(:app) do
      within current_path do
        execute :mkdir, '-p dist/js'
        execute :npm, "run app"
        execute :npm, "run admin"
      end
    end
  end
end
after "deploy:updated", "build_clientside_app"
