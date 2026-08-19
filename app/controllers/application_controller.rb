class ApplicationController < ActionController::API

rescue_from ActiveRecord::RecordNotFound, with: :render_not_found

def render_not_found(exception)
    render json: { errors:[{status: "404", detail: exception.message }]}
end

end
