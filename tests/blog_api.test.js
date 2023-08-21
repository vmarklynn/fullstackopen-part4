const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const helper = require("./test_helper");
const Blog = require("../models/blog");

beforeEach(async () => {
  // Clear existing data in MongoDB
  await Blog.deleteMany({});
  console.log("Cleared collections in MongoDB");

  const blogs = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogs.map((blog) => blog.save());

  await Promise.all(promiseArray);
});

test("MongoDB returns JSON data", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("Test all notes are returned", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("Test id is defined", async () => {
  const blogs = await Blog.find({});
  blogs.forEach((blog) => {
    expect(blog.id).toBeDefined();
  });
});

test("Test post", async () => {
  const newBlog = {
    title: "Software Developers are working too much.",
    author: "J. Blake",
    url: "www.jblock.com",
    likes: 200,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAfterPost = await helper.blogsFromDb();
  console.log(typeof blogsAfterPost);
  expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length + 1);

  const titles = blogsAfterPost.map((blog) => blog.title);
  expect(titles).toContain("Software Developers are working too much.");
});

afterAll(async () => {
  await mongoose.connection.close();
});
