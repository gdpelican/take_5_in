directory(ENV['RELEASE_DIRECTORY']) if ENV['RELEASE_DIRECTORY']

preload_app!

stdout_redirect 'log/puma.log', 'log/puma_error.log', true
