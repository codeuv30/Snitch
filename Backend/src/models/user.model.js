import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    password: { type: String, required: function () { return this.provider !== "google" } },
    fullName: { type: String, required: true },
    role: { type: String, enum: ["buyer", "seller"], default: "buyer" },
    provider: { type: String, enum: ["local", "google"], default: "local" },
}, { timestamps: true });

userSchema.pre("save", async function() {
    if(!this.isModified("password")) return;

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
});

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

const userModel = mongoose.model("users", userSchema);

export default userModel;