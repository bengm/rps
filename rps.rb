require 'sinatra'

get '/' do
  my_html = File.read('index.html')
end