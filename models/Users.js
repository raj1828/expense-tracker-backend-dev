import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
       {
              name: {
                     type: String,
                     required: true,
              },
              email: {
                     type: String,
                     required: true,
                     unique: true,
                     match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
              },
              password: {
                     type: String,
                     required: true,
              },
       },
       {
              timestamps: true, // adds createdAt and updatedAt automatically
       }
);

// Hash password before save
userSchema.pre("save", async function (next) {
       if (!this.isModified("password")) return next();

       const salt = await bcrypt.genSalt(10);
       this.password = await bcrypt.hash(this.password, salt);

       next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
       return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
