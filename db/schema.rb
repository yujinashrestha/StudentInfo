# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_08_18_070258) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "columns", force: :cascade do |t|
    t.string "color", default: "#6b6f76"
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.integer "position", null: false
    t.datetime "updated_at", null: false
    t.index ["position"], name: "index_columns_on_position", unique: true
  end

  create_table "students", force: :cascade do |t|
    t.date "birthdate"
    t.string "course"
    t.datetime "created_at", null: false
    t.string "email"
    t.string "name"
    t.string "phone"
    t.string "roll_number"
    t.datetime "updated_at", null: false
  end

  create_table "tasks", force: :cascade do |t|
    t.bigint "column_id", null: false
    t.datetime "created_at", null: false
    t.text "description"
    t.integer "position", null: false
    t.string "tag"
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.index ["column_id", "position"], name: "index_tasks_on_column_id_and_position"
    t.index ["column_id"], name: "index_tasks_on_column_id"
  end

  add_foreign_key "tasks", "columns"
end
