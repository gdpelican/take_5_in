directory ENV['RELEASE_DIRECTORY']

stdout_redirect 'log/puma.log', 'log/puma_error.log', true
