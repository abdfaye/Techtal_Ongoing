0;95;c// Pulls Mongoose dependency for creating schemas
var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var ValidationError = mongoose.Error.ValidationError;
var ValidatorError  = mongoose.Error.ValidatorError;

// Creates a User Schema. This will be the basis of how user data is stored in the db
var UserSchema = new Schema({
    // firstname
    // lastname
    // email
    // telephone
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    gender: {type: String, required: true},
    birthdate: {type: Date, required: true},
    email: {type: String, required: true},
    telephone: {type: Number, required: true},
    location: {type: [Number], required: true}, // [Long, Lat]
    htmlverified: String,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

// Sets the created_at parameter equal to the current time
UserSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }

    // check if email is valid
    if (/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/i.test(this.email)) {
	var error = new ValidationError(this);
	error.errors.email = new ValidatorError('email', 'Email is not valid', 'notvalid', this.email);
	return next(error);
    }

    next();
});

// Indexes this schema in geoJSON format (critical for running proximity searches)
UserSchema.index({location: '2dsphere'});

// Exports the UserSchema for use elsewhere. Sets the MongoDB collection to be used as: "scotch-user"
module.exports = mongoose.model('scotch-user', UserSchema);
