// backend/models/User.js
const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },

    /* NEW FIELDS */
    company: String,
    phone: String,
    website: String,
    bio: String,
    profilePicture: String,

    preferences: {
      timezone: { type: String, default: 'UTC' },
      language: { type: String, default: 'en' },
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false }
      }
    },

    accountStatus: { type: String, enum: ['active', 'pending', 'suspended'], default: 'active' }
  },
  { timestamps: true }
);

/* Virtual: profile completion % */
userSchema.virtual('profileCompletion').get(function () {
  let filled = 0;
  const total = 8; // name,email,company,phone,website,bio,profilePicture,preferences
  ['name', 'email', 'company', 'phone', 'website', 'bio', 'profilePicture'].forEach(k => {
    if (this[k]) filled++;
  });
  if (this.preferences) filled++;
  return Math.round((filled / total) * 100);
});

/* Ensure virtuals are serialized */
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

/* Hash & compare (kept from Week-2) */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = model('User', userSchema);