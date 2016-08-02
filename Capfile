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
    within release_path do
      execute :npm, 'run build'
    end
  end
end
