import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

var validateEmail = function (email: string): boolean {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 32,
    },

    // email or username
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
      validate: [validateEmail, "Please fill a valid email address"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 64,
    },

    description: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 300,
    },

    // avatar
    avatar: {
      type: String,
      minlength: 4,
      required: true,
      validate: {
        validator(link: string): boolean {
          return validator.isURL(link);
        },
        message: "Must be a Valid URL",
      },
    },

    // Roles:
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

// Match passwords function...
userSchema.methods.matchPasswords = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Crypt passwords before save to the database...
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
