# config valid only for current version of Capistrano
lock '3.6.0'

set :application, 'take_5_in'
set :repo_url, 'https://github.com/gdpelican/take_5_in.git'
set :user, 'take_five'
set :npm_flags, ''
set :app_server_port, 9292
