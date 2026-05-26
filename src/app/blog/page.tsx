"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, Tag, ArrowRight, Search } from "lucide-react";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  image: string;
  publishedAt: string;
  featured: boolean;
  tags: string[];
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [blogs, selectedCategory, searchQuery]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blogs");
      const data = await response.json();
      setBlogs(data.blogs || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterBlogs = () => {
    let filtered = blogs;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((blog) => blog.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredBlogs(filtered);
  };

  const categories = ["All", ...Array.from(new Set(blogs.map((blog) => blog.category)))];
  const featuredBlogs = blogs.filter((blog) => blog.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-black text-white py-16">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sunidhi Blog</h1>
            <p className="text-xl text-white">
              Insights, analysis, and expert advice on investing and financial markets
            </p>
          </div>
        </Container>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-gray-50 border-b">
        <Container>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-primary-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Blogs */}
      {featuredBlogs.length > 0 && selectedCategory === "All" && !searchQuery && (
        <section className="py-12 bg-gray-50">
          <Container>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredBlogs.slice(0, 2).map((blog) => (
                <Link key={blog.id} href={`/blog/${blog.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                    <div className="relative h-64">
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Featured
                        </span>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(blog.publishedAt)}
                        </span>
                        <span className="text-primary-600">{blog.category}</span>
                      </div>
                      <CardTitle className="text-2xl hover:text-primary-600 transition-colors">
                        {blog.title}
                      </CardTitle>
                      <CardDescription className="text-base">{blog.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="h-4 w-4" />
                          {blog.author}
                        </span>
                        <span className="text-primary-600 font-medium flex items-center gap-1">
                          Read More
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* All Blogs */}
      <section className="py-12">
        <Container>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {selectedCategory !== "All" ? selectedCategory : "All Articles"}
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading articles...</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No articles found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog) => (
                <Link key={blog.id} href={`/blog/${blog.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(blog.publishedAt)}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-primary-600 mb-2 inline-block">
                        {blog.category}
                      </span>
                      <CardTitle className="text-xl group-hover:text-primary-600 transition-colors line-clamp-2">
                        {blog.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3">{blog.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        {blog.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full flex items-center gap-1"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{blog.author}</span>
                        <span className="text-primary-600 font-medium flex items-center gap-1 text-sm">
                          Read More
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
