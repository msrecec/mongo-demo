const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('Could not connect to MongoDB...', err));

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    //  match: /pattern/
  },
  category: {
    type: String,
    required: true,
    enum: ['web', 'mobile', 'network'],
    lowercase: true,
    // uppercase: true,
    trim: true,
  },
  author: String,
  tags: {
    type: Array,
    validate: {
      isAsync: true,
      validator: function (v, callback) {
        setTimeout(() => {
          // Do some async work
          const result = v && v.length > 0;
          callback(result);
        }, 4000);
      },
      message: 'A course should have at least one tag',
    },
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function () {
      return this.isPublished;
    },
    min: 10,
    max: 200,
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
  },
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
  const course = new Course({
    name: 'Angular Course',
    category: 'Web',
    author: 'Mislav',
    tags: ['frontend'],
    isPublished: true,
    price: 15.8,
  });
  try {
    const result = await course.save();
    console.log(result);
  } catch (ex) {
    for (field in ex.errors) console.log(ex.errors[field].message);
  }
}

async function getCourses() {
  const pageNumber = 2;
  const pageSize = 10;

  // eq (equal)
  // ne (not equal)
  // gt (greater than)
  // gte (greater than or equal)
  // lt (less than)
  // lte (less than or equal to)
  // in
  // nin (not in)

  // or
  // and

  const courses = await Course.find({ author: 'Mislav', isPublished: true })
    // .find({ price: { $gte: 10, $lte: 20 } })
    // .find({ price: { $in: [10, 15, 20] } })
    // .find()
    // .or([{ author: 'Mislav' }, { isPublished: true }])
    // .and([{ author: 'Mislav' }, { isPublished: true }])
    // Starts with Mislav
    // .find({ author: /^Mislav/ })
    // Ends with Srečec
    // .find({ author: /Srečec$/i }) // i is for case insensitivity
    // Contains Mislav
    // .find({ author: /.*Mislav.*/i }) // i is for case insensitivity
    // .find({ author: 'Mislav', isPublished: true })
    .find({ _id: '5f74e9e21337da17681a5abc' })
    // .skip((pageNumber - 1) * pageSize) //pagination - skip together with limit gives us the documents at the given page
    // .limit(pageSize)
    // .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1, price: 1 });
  // .count(); // Returns the number of documents
  console.log(courses[0].price);
}

getCourses();

// createCourse();

// // Query first approach
// async function updateCourse(id) {
//   const course = await Course.findById(id);
//   if (!course) return;

//   // First approach
//   course.isPublished = true;
//   course.author = 'Another Author';

//   const result = await course.save();
//   console.log(result);

//   // Second approach
//   // course.set({
//   //   isPublished: true,
//   //   author: 'Another Author',
//   // });
// }

// Update first approach
async function updateCourse(id) {
  const result = await Course.update(
    { _id: id },
    {
      $set: {
        author: 'Mosh',
        isPublished: false,
      },
    }
  );

  console.log(result);
}

// updateCourse('5f721e5de4bb42127c79ee7c');

async function findByIdAndUpdateCourse(id) {
  const course = await Course.findByIdAndUpdate(
    id,
    {
      $set: {
        author: 'Jason',
        isPublished: false,
      },
    },
    { new: true } // To return the updated document instead of an old document
  );
  console.log(course);
}

// findByIdAndUpdateCourse('5f721e5de4bb42127c79ee7c');

// Delete one document
// Delete more than one document

async function removeCourse(id) {
  // const result = await Course.deleteOne({ _id: id });
  // const result = await Course.deleteMany({ _id: id });
  const course = await Course.findByIdAndRemove(id);
  // console.log(result);
  console.log(course);
}

// removeCourse('5f721e5de4bb42127c79ee7c');

// createCourse();
