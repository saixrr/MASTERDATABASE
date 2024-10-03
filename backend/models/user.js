const userSchema = new mongoose.Schema({
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
    required: true,
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
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  employment: {
    type: String,
    required: true,
  },
  passout_year: {
    type: Number,
    required: true,
  },
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event", // Set the reference to the Event model
    },
  ],
});
userSchema.pre("save", async function (next) {
  if (!this.isNew) return next();
  const lastUser = await mongoose
    .model("User")
    .findOne()
    .sort({ student_id: -1 });
  if (!lastUser) {
    this.student_id = "CV00001";
  } else {
    const lastNumber = parseInt(lastUser.student_id.substring(2)) + 1;
    this.student_id = "CV" + lastNumber.toString().padStart(5, "0");
  }
  next();
});
const User = mongoose.model("User", userSchema);
mongoose.model("Event", eventSchema);
export default User;









