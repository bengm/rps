require 'sinatra'
require 'sinatra/activerecord'
require './config/environments' #database configuration
require 'json'

use Rack::Logger # to be able to write logs
helpers do
  def logger
    request.logger
  end
  def accept_params(params, *fields)
    h = { }
    fields.each do |name|
      name = name.to_s
      h[name] = params[name] if params[name]
    end
    h
  end
end

get '/' do
  my_html = File.read('index.html')
end

get '/games' do 
  content_type "json"
  Game.all.to_json
end

post '/games' do
  content_type "json"
  orig_params = JSON.parse(request.body.read)
  
  logger.info "ORIG|#{orig_params}|"
  new_params = accept_params(orig_params, :playerMove, :opponentMove, :time, :result)
  logger.info "NEW|#{new_params}|"
  game = Game.new(new_params)
  if game.save
    headers["Location"] = "/games/#{game.id}"
    status 201 # Created
    game.to_json
  else
    json_status 400, game.errors.to_hash
  end
end

class Game < ActiveRecord::Base
end