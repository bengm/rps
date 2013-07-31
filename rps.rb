require 'sinatra'
require 'sinatra/activerecord'
require './config/environments' #database configuration

get '/' do
  my_html = File.read('index.html')
end

get '/games' do 
  content_type "json"
  Game.all.to_json
end



class Game < ActiveRecord::Base
end