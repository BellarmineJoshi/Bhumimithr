Rails.application.routes.draw do
  devise_for :customers
  namespace :api do
    namespace :v1 do
      get '/scope1', :to => 'results#get_result_scope1'
      get '/scope2', :to => 'results#get_result_scope2'
      get '/scope3', :to => 'results#get_result_scope3'
      get '/transport', :to => 'results#get_result_transport'
      post '/calculate_footprint', :to => 'results#calculate_footprint'
    end
  end

  namespace :customer do
    get '/dashboard', :to => 'dashboard#index'
    get '/my_profile', :to => 'dashboard#my_profile'
    patch '/update_profile', :to => 'dashboard#update_profile'
    patch '/update_new_password', :to => 'dashboard#update_new_password'

    get '/all_results', :to => 'results#index'
    get '/view_result/:id/:tab', to: 'results#show', as: 'view_result',
    constraints: ->(params, _req) {
      %w[general_info scope_1 scope_2 scope_3 transport].include?(params[:tab])
    }

    get '/show_report', :to => 'reports#show'
    get '/reports', :to => 'reports#index'
    get '/get_results', :to => 'results#get_results'
    get '/download_results', :to => 'results#download_results'
  end

  devise_for :users
  devise_scope :user do
    root to: "sessions#new"
    get '/login', :to => 'sessions#new'
    post '/create_session', :to => 'sessions#create'
    get '/logout', :to => 'sessions#logout'
    get '/register', :to => 'registrations#new'
    post '/create_user', :to => 'registrations#create'
  end

  get '/dashboard', :to => 'dashboard#index'
  get '/get_latest_results', :to => 'dashboard#get_latest_results'
  get '/my_profile', :to => 'dashboard#my_profile'
  patch '/update_profile', :to => 'dashboard#update_profile'
  patch '/update_new_password', :to => 'dashboard#update_new_password'

  get '/new_entry/:tab', to: 'results#new', as: 'add_new_entry',
    constraints: ->(params, _req) {
      %w[general_info scope_1 scope_2 scope_3 transport].include?(params[:tab])
    }
  get '/edit_entry/:id/:tab', to: 'results#edit', as: 'edit_entry',
    constraints: ->(params, _req) {
      %w[general_info scope_1 scope_2 scope_3 transport].include?(params[:tab])
    }
  get '/view_result/:id/:tab', to: 'results#show', as: 'view_result',
    constraints: ->(params, _req) {
      %w[general_info scope_1 scope_2 scope_3 transport].include?(params[:tab])
    }
  
  post '/save_result', :to => 'results#create'
  post '/update_result', :to => 'results#update'
  get '/all_results', :to => 'results#index'
  get '/download_results', :to => 'results#download_results'
  post '/download_checked_results', :to => 'results#download_checked_results'

  get 'reports/index', to:  'reports#index'
  get '/reports/display', to:  'reports#display'
  get '/reports/new', to: 'reports#new'
  get '/reports/show/:id', to: 'reports#show',as: :reports_show
  post '/reports', to:  'reports#create'
  # get 'reports/', to:  'reports#index'
  get 'reports/download_pdf/:id', to:  'reports#download_pdf',as: :download_pdf



  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
