const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('Could not connect to MongoDB...', err));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
  const course = new Course({
    name: 'Angular Course',
    author: 'Mislav',
    tags: ['angular', 'frontend'],
    isPublished: true,
  });

  const result = await course.save();
  console.log(result);
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
    .find({ author: 'Mislav', isPublished: true })
    .skip((pageNumber - 1) * pageSize) //pagination - skip together with limit gives us the documents at the given page
    .limit(pageSize)
    // .limit(10)
    .sort({ name: 1 })
    // .select({ name: 1, tags: 1 });
    .count(); // Returns the number of documents
  console.log(courses);
}

getCourses();

// createCourse();
