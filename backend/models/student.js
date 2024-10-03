import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  date: { type: Date },
  tag: { type: String },
});

const studentSchema = new mongoose.Schema({
  student_id: {
    type: String,
    unique: true,
  },
  student_name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
  student_email: {
    type: String,
    required: true,
  },
  student_phone: {
    type: String,
    required: true,
  },
  college_name: {
    type: String,
  },
  skills: {
    type: Array,
  },
  location: {
    type: String,
  },
  employment: {
    type: String,
  },
  field: {
    type: String,
  },
  passout_year: {
    type: Number,
  },
  activitys: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
    },
  ],
});
studentSchema.pre("save", async function (next) {
  if (!this.isNew) return next();
  const lastStu = await mongoose
    .model("Student")
    .findOne()
    .sort({ student_id: -1 });
  if (!lastStu) {
    this.student_id = "CV00001";
  } else {
    const lastNumber = parseInt(lastStu.student_id.substring(2)) + 1;
    this.student_id = "CV" + lastNumber.toString().padStart(5, "0");
  }
  next();
});
const Student = mongoose.model("Student", studentSchema);
mongoose.model("Activity", activitySchema);
export default Student;
