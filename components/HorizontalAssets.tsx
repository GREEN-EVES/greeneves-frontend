"use client";

import Image from "next/image";

type ImgItem = { src: string; circle?: boolean };

const images: ImgItem[] = [
	{ src: "/images/team-office-v2.jpg" },
	{ src: "/images/evan-steven.jpg", circle: true },
	{ src: "/images/demos.jpg" },
	{ src: "/images/mike.png", circle: true },
	{ src: "/images/africa.jpg" },
	{ src: "/images/world.jpg" },
	{ src: "/images/vr.jpg", circle: true },
	{ src: "/images/office.jpg" },
	{ src: "/images/evan-steven.jpg", circle: true },
	{ src: "/images/demos.jpg" },
	{ src: "/images/office.jpg" },
];

// 🔹 group images into vertical stacks (random heights)
function groupIntoStacks(arr: ImgItem[], size = 2) {
	const result: ImgItem[][] = [];
	let i = 0;
	const pattern = [1, 2, 3, 2]; // predictable sequence
	let p = 0;
	while (i < arr.length) {
		const groupSize = pattern[p % pattern.length];
		result.push(arr.slice(i, i + groupSize));
		i += groupSize;
		p++;
	}
	return result;
}

export default function HorizontalScroll() {
	const stacks = groupIntoStacks(images);

	return (
		<div className="w-full overflow-hidden bg-gray-50 py-8">
			<div className="flex animate-scroll gap-8">
				{[...stacks, ...stacks].map((stack, i) => (
					<div
						key={i}
						className="
              flex flex-col gap-4
              h-64 sm:h-72 md:h-96 lg:h-[500px]
              min-w-[160px] sm:min-w-[200px] md:min-w-[240px] lg:min-w-[280px]
            ">
						{stack.map((item, j) => (
							<div key={j} className={`relative w-full flex-1 ${item.circle ? "aspect-square" : ""}`}>
								<Image
									src={item.src}
									alt=""
									fill
									className={`object-cover shadow-md ${
										item.circle ? "rounded-full p-2 bg-white" : "rounded-xl"
									}`}
									sizes="(max-width: 640px) 150px, (max-width: 1024px) 200px, 280px"
								/>
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
}
