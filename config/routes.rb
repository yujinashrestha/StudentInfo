Rails.application.routes.draw do
 namespace :api do
  namespace :v1 do
    resources :students, only: [:index, :create, :update, :destroy]
  end
end
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
