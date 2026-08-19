class StudentSerializer
  def initialize(student)
    @student = student
  end

  def as_json(*)
    {
      id: @student.id,
      name: @student.name,
      email: @student.email,
      roll_number: @student.roll_number,
      course: @student.course,
      phone: @student.phone,
      birthdate: @student.birthdate
    }
  end

  # serialize a collection: StudentSerializer.collection(Student.all)
  def self.collection(students)
    students.map do |student|
      new(student).as_json
    end
  end
end
