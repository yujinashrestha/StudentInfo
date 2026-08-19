module Api
  module V1
    class StudentsController < ApplicationController
      # Runs before show/update/destroy so we don't repeat the
      # "find or 404" lookup in three separate methods (DRY).
      before_action :set_student, only: [ :update, :destroy]

      # GET /api/v1/students
      # Supports optional ?department=CS and ?q=searchterm so the table
      # can later grow filter/search inputs without a new endpoint.
      def index
        students = Student.all
                           .then { |scope| Student.by_course(params[:course]).presence || scope }
                           .then { |scope| params[:q].present? ? scope.search(params[:q]) : scope }
                           .order(created_at: :desc)

        render json: StudentSerializer.collection(students), status: :ok
      end

      # POST /api/v1/students
      # Body: { "student": { "name": "...", "email": "...", ... } }
      def create
        student = Student.new(student_params)

        if student.save
          render json: StudentSerializer.new(student).as_json, status: :created
        else
          render json: { errors: student.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/students/:id
      # PATCH (partial update) is what the frontend uses for inline edits —
      # it only sends the field(s) that changed, not the whole record.
      def update
        if @student.update(student_params)
          render json: StudentSerializer.new(@student).as_json, status: :ok
        else
          render json: { errors: @student.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/students/:id
      def destroy
        @student.destroy
        head :no_content # 204 — success, nothing to return
      end

      private

      def set_student
        @student = Student.find(params[:id]) # raises ActiveRecord::RecordNotFound -> handled in ApplicationController
      end

      # Strong parameters: whitelist exactly which fields a client is
      # allowed to mass-assign. Without this, a client could POST
      # { "student": { "id": 1, "admin": true } } and overwrite columns
      # you never intended to expose.
      def student_params
        params.require(:student).permit(:name, :email, :roll_number, :course, :phone, :birthdate)
      end
    end
  end
end