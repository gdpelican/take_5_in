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
require 'capistrano/puma'

namespace :deploy do
  desc 'Build clientside app'
  task :build_clientside_app do
    on roles(:app) do
      within current_path do
        execute :mkdir, '-p dist/js'
        execute :npm, "run app:production"
        execute :npm, "run admin:production"
      end
    end
  end

  task :run_server do
    on roles(:app) do
      within(current_path) do
        execute :bundle, 'exec kill -s SIGUSR2 `jobs -p`'
      end
    end
  end

  desc "Recreate symlink"
  task :resymlink do
    on roles(:app) do
      puts "symlinking..."
      execute :rm, "-f #{current_path} && ln -s #{release_path} #{current_path}"
    end
  end
end

after "deploy:published", "build_clientside_app"
after "deploy:finished", "run_server"
after "deploy:finished", "deploy:resymlink"
