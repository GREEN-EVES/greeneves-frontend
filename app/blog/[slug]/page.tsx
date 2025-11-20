import { notFound } from "next/navigation";
import Image from "next/image";
import { blogPosts } from "../data";

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return notFound();

  return (
    <article className="max-w-4xl mx-auto py-16 px-6">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-[#7c8925] mb-4">
          {post.title}
        </h1>
        <p className="text-gray-500">{new Date(post.date).toDateString()}</p>
      </div>

      {post.image && (
        <div className="relative w-full h-80 mb-10 rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div
        className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
