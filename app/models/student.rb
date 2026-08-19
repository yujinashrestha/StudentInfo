class Student < ApplicationRecord
  validates :name, presence: true, length: { maximum: 100 }
  validates :roll_number, presence: true, uniqueness: { case_sensitive: false }
  validates :email, presence: true, uniqueness: { case_sensitive: false },
            format: { with: URI::MailTo::EMAIL_REGEXP, message: "must be a valid email" }

  validates :birthdate, comparison: { less_than_or_equal_to: Date.current }, allow_nil: true
  validates :course, presence: true

  validates :phone,
            format: {
              with: /\A\d{10}\z/,
              message: "must be 10 digits"
            },
            allow_blank: true

  before_validation :normalize_fields

  scope :by_course, ->(course) {
    where(course: course) if course.present?
  }

  scope :search, ->(q) {
    where("name ILIKE :q OR email ILIKE :q OR roll_number ILIKE :q", q: "%#{q}%") if q.present?
  }

  private

  def normalize_fields
    self.email = email.to_s.strip.downcase
    self.name = name.to_s.strip
    self.roll_number = roll_number.to_s.strip.upcase
  end
end
