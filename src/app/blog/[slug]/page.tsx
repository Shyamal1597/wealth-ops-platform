"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, Tag, ArrowLeft, Clock, Share2 } from "lucide-react";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image: string;
  publishedAt: string;
  featured: boolean;
  tags: string[];
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      fetchBlog(params.slug as string);
      fetchRelatedBlogs();
    }
  }, [params.slug]);

  const fetchBlog = async (slug: string) => {
    try {
      const response = await fetch(`/api/blogs/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setBlog(data.blog);
      } else {
        router.push("/blog");
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      router.push("/blog");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async () => {
    try {
      const response = await fetch("/api/blogs");
      const data = await response.json();
      // Get random 3 blogs for related articles
      const shuffled = data.blogs.sort(() => 0.5 - Math.random());
      setRelatedBlogs(shuffled.slice(0, 3));
    } catch (error) {
      console.error("Error fetching related blogs:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        text: blog?.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading article...</p>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-12">
        <Container>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary-300 hover:text-primary-200 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <div className="max-w-4xl">
            <span className="inline-block px-3 py-1 bg-primary-600 text-white rounded-full text-sm font-medium mb-4">
              {blog.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{blog.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-300">
              <span className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {blog.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {formatDate(blog.publishedAt)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                5 min read
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            <div className="relative h-96 rounded-lg overflow-hidden mb-8">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
              />
            </div>

            {/* Content */}
            <article className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-6">{blog.excerpt}</p>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">{blog.content}</div>
            </article>

            {/* Tags */}
            <div className="mt-8 pt-8 border-t">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-gray-900">Tags:</span>
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="mt-8 pt-8 border-t flex items-center justify-between">
              <p className="font-medium text-gray-900">Share this article:</p>
              <Button onClick={handleShare} variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
        <section className="py-12 bg-gray-50">
          <Container>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedBlogs
                .filter((b) => b.id !== blog.id)
                .slice(0, 3)
                .map((relatedBlog) => (
                  <Link key={relatedBlog.id} href={`/blog/${relatedBlog.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={relatedBlog.image}
                          alt={relatedBlog.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <CardContent className="p-6">
                        <span className="text-xs font-medium text-primary-600 mb-2 inline-block">
                          {relatedBlog.category}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {relatedBlog.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{relatedBlog.excerpt}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
