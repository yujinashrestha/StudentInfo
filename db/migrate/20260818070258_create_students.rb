class CreateStudents < ActiveRecord::Migration[8.1]
  def change
    create_table :students do |t|
      t.string :name
      t.string :course
      t.string :phone
      t.string :email
      t.string :roll_number
      t.date :birthdate

      t.timestamps
    end
  end
end
