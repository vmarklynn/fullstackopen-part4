const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const helper = require("./test_helper");
const Blog = require("../models/blog");

beforeEach(async () => {
  // Clear existing data in MongoDB
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

describe("tests where MongoDB contains previous values", () => {
  test("MongoDB returns JSON data", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("Test all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("Test id is defined", async () => {
    const blogs = await Blog.find({});
    blogs.forEach((blog) => {
      expect(blog.id).toBeDefined();
    });
  });
});

describe("POST requests", () => {
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
    expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAfterPost.map((blog) => blog.title);
    expect(titles).toContain("Software Developers are working too much.");
  });
});

describe("Verify validations and default values", () => {
  test("Test post without likes will default to 0", async () => {
    const newBlog = {
      title: "Software Developers are working too much.",
      author: "J. Blake",
      url: "www.jblock.com",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAfterPost = await helper.blogsFromDb();
    const likes = blogsAfterPost.map((blog) => blog.likes);

    expect(likes).toContain(0);
  });

  test("Test blog without title will return 400", async () => {
    const newBlogWoutTitle = {
      author: "Jack Bean",
      url: "www.beanstalk.com",
    };

    await api.post("/api/blogs").send(newBlogWoutTitle).expect(400);
  });

  test("Test blog without url will return 400", async () => {
    const newBlogWoutUrl = {
      title: "How to win friends and alienate people",
      author: "Jack Bean",
    };

    await api.post("/api/blogs").send(newBlogWoutUrl).expect(400);
  });
});

describe("DELETE tests", () => {
  test("Test delete with valid id", async () => {
    const validId = "5a422a851b54a676234d17f7";

    await api.delete(`/api/blogs/${validId}`).expect(204);

    const blogsAtEnd = await helper.blogsFromDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
