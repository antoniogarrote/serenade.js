require "rubygems"
require "sinatra"

set :public, File.expand_path(File.dirname(__FILE__)+"/public")

get "/" do
  File.read(File.join(File.dirname(__FILE__), '/public/index.html'))
end

get "/js/index.js" do
  headers 'Content-Type' => 'application/javascript'
  index = File.read(File.join(File.dirname(__FILE__), '..', 'src','index.js'))
  index
end

get "/favicon.ico" do
  not_found
end

get "/:file" do
  File.read(File.join(File.dirname(__FILE__)+"/public", params[:file]))
end


run Sinatra::Application