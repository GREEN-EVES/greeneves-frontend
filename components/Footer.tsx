import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
	return (
		<footer className="bg-[#0D1117] text-gray-300 py-12 mt-20">
			<div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-5 gap-10">
				{/* Brand & Compliance */}
				<div className="col-span-2">
					<div className="flex items-center space-x-2">
						<Image src="/logo.png" alt="Greeneves" width={40} height={40} />
						<h2 className="text-xl font-bold text-white">Greeneves</h2>
					</div>
					<p className="mt-4 text-sm text-gray-400 leading-relaxed">
						Greeneves is authorised and regulated to provide digital financial services. Your deposits are safe
						and secured with our trusted partners and protected under global standards.
					</p>

					{/* App Store Buttons */}
					<div className="flex gap-4 mt-6">
						<Image src="/appstore.png" alt="App Store" width={140} height={44} className="cursor-pointer" />
						<Image src="/googleplay.png" alt="Google Play" width={140} height={44} className="cursor-pointer" />
					</div>
				</div>

				{/* For Business */}
				<div>
					<h3 className="text-sm font-semibold text-white mb-4">For Business</h3>
					<ul className="space-y-2 text-sm">
						<li>
							<Link href="#">Business Account</Link>
						</li>
						<li>
							<Link href="#">Point of Sale Terminal</Link>
						</li>
						<li>
							<Link href="#">Loan</Link>
						</li>
						<li>
							<Link href="#">Expense Card</Link>
						</li>
					</ul>
				</div>

				{/* For Personal */}
				<div>
					<h3 className="text-sm font-semibold text-white mb-4">For Personal</h3>
					<ul className="space-y-2 text-sm">
						<li>
							<Link href="#">Instant Debit Card</Link>
						</li>
						<li>
							<Link href="#">Personal Account</Link>
						</li>
						<li>
							<Link href="#">Payment</Link>
						</li>
						<li>
							<Link href="#">Personal Banking</Link>
						</li>
					</ul>
				</div>

				{/* Company & Resources */}
				<div>
					<h3 className="text-sm font-semibold text-white mb-4">Company</h3>
					<ul className="space-y-2 text-sm mb-6">
						<li>
							<Link href="#">About Us</Link>
						</li>
						<li>
							<Link href="#">Culture</Link>
						</li>
						<li>
							<Link href="#">Join Our Team</Link>
						</li>
						<li>
							<Link href="#">Press & Media</Link>
						</li>
						<li>
							<Link href="#">Contact Us</Link>
						</li>
					</ul>
					<h3 className="text-sm font-semibold text-white mb-4">Resources</h3>
					<ul className="space-y-2 text-sm">
						<li>
							<Link href="#">Blog</Link>
						</li>
						<li>
							<Link href="#">Help Centre</Link>
						</li>
						<li>
							<Link href="#">Learning Centre</Link>
						</li>
						<li>
							<Link href="#">Report a Vulnerability</Link>
						</li>
						<li>
							<Link href="#">Security Trust Center</Link>
						</li>
					</ul>
				</div>
			</div>

			{/* Contact & Social */}
			<div className="max-w-7xl mx-auto px-6 mt-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-t border-gray-700 pt-8">
				<div className="text-sm text-gray-400">
					<p>Plot 7A, Block 4, Admiralty Road,</p>
					<p>Lekki Phase 1, Lagos State.</p>
					<p className="mt-2">support@greeneves.com</p>
					<p>+234 201 888 9990</p>
				</div>

				<div className="flex flex-col items-start lg:items-end gap-4">
					<div className="flex space-x-4">
						<Link href="#">
							<Linkedin className="w-5 h-5 hover:text-blue-400" />
						</Link>
						<Link href="#">
							<Twitter className="w-5 h-5 hover:text-sky-400" />
						</Link>
						<Link href="#">
							<Facebook className="w-5 h-5 hover:text-blue-500" />
						</Link>
						<Link href="#">
							<Instagram className="w-5 h-5 hover:text-pink-500" />
						</Link>
						<Link href="#">
							<Youtube className="w-5 h-5 hover:text-red-500" />
						</Link>
					</div>
					<div className="text-sm text-gray-400">🌍 Nigeria</div>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className="max-w-7xl mx-auto px-6 mt-10 pt-6 border-t border-gray-800 text-xs text-gray-500 flex flex-col md:flex-row justify-between">
				<p>Copyright © {new Date().getFullYear()} Greeneves</p>
				<div className="flex gap-6 mt-2 md:mt-0">
					<Link href="#">Privacy Policy</Link>
					<Link href="#">Cookie Policy</Link>
				</div>
			</div>
		</footer>
	);
}
