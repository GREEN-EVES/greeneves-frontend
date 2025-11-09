
import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "./data";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function BlogList() {
  return (
    <>
      <Header />
      <section className="max-w-6xl mx-auto py-16 px-6 pt-24">
        <h1 className="text-4xl font-bold text-[#7c8925] mb-10 text-center">
          Greeneves Wedding Planning
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <div className="relative w-full h-56 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 group-hover:text-[#7c8925]">
                  {post.title}
                </h2>
                <p className="text-gray-600 mt-2 text-sm">{post.excerpt}</p>
                <div className="mt-4 text-[#7c8925] font-medium text-sm">
                  Read more →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </>

  );
}
